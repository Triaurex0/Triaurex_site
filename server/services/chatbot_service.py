"""
TRIAUREX Production-Ready AI Chatbot Service.
Features:
- Multi-provider support (Gemini, OpenAI, Groq, OpenRouter)
- Fallback intelligent knowledge response engine when no API key is provided
- Rate limiting per IP address
- Input sanitization & prompt injection mitigation
- Dynamic synchronization with live website data models
- Token & message history length management
"""

import os
import re
import time
import json
import logging
from collections import defaultdict
import requests

from .knowledge_base import (
    STUDIO_PROFILE,
    SUGGESTED_QUESTIONS,
    build_knowledge_context,
    get_system_prompt
)

logger = logging.getLogger("ChatbotService")
logging.basicConfig(level=logging.INFO)

# Rate Limiter Configuration: 25 requests per minute per IP
RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_REQUESTS = 25
_ip_request_timestamps = defaultdict(list)

MAX_USER_MESSAGE_CHARS = 1000
MAX_HISTORY_MESSAGES = 12

class ChatbotService:
    def __init__(self, data_sources=None):
        """
        data_sources: Optional dictionary containing live data models
        (company_data, services_data, case_studies_data, process_data, tech_data, faqs_data)
        """
        self.data_sources = data_sources or {}
        self._cached_system_prompt = None
        self._prompt_last_built = 0
        self.cache_ttl = 300  # Rebuild prompt every 5 minutes if data changes

    def update_data_sources(self, data_sources):
        self.data_sources = data_sources or {}
        self._cached_system_prompt = None

    def get_knowledge_text(self):
        return build_knowledge_context(
            company_data=self.data_sources.get('company_data'),
            services_data=self.data_sources.get('services_data'),
            case_studies_data=self.data_sources.get('case_studies_data'),
            process_data=self.data_sources.get('process_data'),
            tech_data=self.data_sources.get('tech_data'),
            faqs_data=self.data_sources.get('faqs_data')
        )

    def get_system_prompt(self):
        now = time.time()
        if not self._cached_system_prompt or (now - self._prompt_last_built > self.cache_ttl):
            knowledge = self.get_knowledge_text()
            self._cached_system_prompt = get_system_prompt(knowledge)
            self._prompt_last_built = now
        return self._cached_system_prompt

    def check_rate_limit(self, client_ip):
        """Returns True if within rate limit, False if exceeded."""
        if not client_ip:
            return True
        now = time.time()
        timestamps = _ip_request_timestamps[client_ip]
        # Prune old timestamps
        _ip_request_timestamps[client_ip] = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
        if len(_ip_request_timestamps[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
            return False
        _ip_request_timestamps[client_ip].append(now)
        return True

    def sanitize_input(self, text):
        """Sanitizes incoming message string and checks for length."""
        if not isinstance(text, str):
            return ""
        # Remove null bytes and excessive whitespace
        clean = text.replace('\x00', '').strip()
        if len(clean) > MAX_USER_MESSAGE_CHARS:
            clean = clean[:MAX_USER_MESSAGE_CHARS]
        return clean

    def sanitize_history(self, history):
        """Normalizes and truncates conversation history to recent turns."""
        if not isinstance(history, list):
            return []
        sanitized = []
        for msg in history[-MAX_HISTORY_MESSAGES:]:
            if not isinstance(msg, dict):
                continue
            role = msg.get('role', '')
            content = msg.get('content', '')
            if not isinstance(content, str) or not content.strip():
                continue
            # Normalize role
            if role in ['user', 'human']:
                norm_role = 'user'
            elif role in ['assistant', 'bot', 'model']:
                norm_role = 'assistant'
            else:
                continue
            sanitized.append({
                'role': norm_role,
                'content': content.strip()[:1500]
            })
        return sanitized

    def process_chat(self, user_message, raw_history=None, client_ip=None):
        """
        Main entry point for processing a chat request.
        Returns a dict: {"success": bool, "reply": str, "suggestedQuestions": list, "error": str}
        """
        # 1. Rate limiting
        if not self.check_rate_limit(client_ip):
            return {
                "success": False,
                "error": "rate_limited",
                "reply": "You're sending messages a bit too quickly. Please pause for a few seconds before trying again.",
                "suggestedQuestions": SUGGESTED_QUESTIONS[:3]
            }

        # 2. Input validation
        clean_msg = self.sanitize_input(user_message)
        if not clean_msg:
            return {
                "success": False,
                "error": "empty_message",
                "reply": "Please enter a question or topic you would like assistance with.",
                "suggestedQuestions": SUGGESTED_QUESTIONS[:3]
            }

        conversation = self.sanitize_history(raw_history)

        # 3. Detect Provider & API Key
        # Prioritize AI_API_KEY from project configuration
        api_key = os.environ.get("AI_API_KEY", "").strip()
        if not api_key:
            # Fall back to provider-specific keys only if explicitly valid
            possible_key = os.environ.get("OPENAI_API_KEY", "").strip()
            if possible_key.startswith("sk-"):
                api_key = possible_key
            else:
                possible_gemini = os.environ.get("GEMINI_API_KEY", "").strip()
                if possible_gemini.startswith("AIza"):
                    api_key = possible_gemini

        provider = os.environ.get("AI_PROVIDER", "").strip().lower()

        # Check for placeholder or invalid keys
        is_valid_key = bool(
            api_key and 
            api_key not in ["your_secret_key", "your_ai_api_key_here", "your_key_here", "none"] and 
            len(api_key) > 10 and
            (api_key.startswith("AIza") or api_key.startswith("sk-") or api_key.startswith("nvapi-") or provider in ["groq", "openrouter", "nvidia"])
        )

        if not is_valid_key:
            provider = "knowledge_engine"
            api_key = ""
        elif not provider:
            if api_key.startswith("nvapi-"):
                provider = "nvidia"
            elif api_key.startswith("AIza"):
                provider = "gemini"
            elif api_key.startswith("sk-"):
                provider = "openai"
            else:
                provider = "nvidia" if "nvidia" in os.environ.get("AI_BASE_URL", "") else "gemini"

        # 4. Dispatch to provider
        reply = None
        if provider == "gemini" and api_key:
            reply = self._call_gemini(clean_msg, conversation, api_key)
        elif provider in ["openai", "groq", "openrouter", "nvidia"] and api_key:
            reply = self._call_openai_compatible(clean_msg, conversation, api_key, provider)
        
        # 5. Graceful fallback if no key or API failed
        if not reply:
            reply = self._knowledge_engine_fallback(clean_msg, conversation)

        # Generate contextual suggested questions based on reply
        follow_ups = self._generate_follow_up_suggestions(clean_msg, reply)

        return {
            "success": True,
            "reply": reply,
            "suggestedQuestions": follow_ups
        }

    def _call_gemini(self, message, history, api_key):
        """Calls Google Gemini API via official REST endpoint."""
        model = os.environ.get("AI_MODEL", "gemini-1.5-flash").strip()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

        system_instruction = self.get_system_prompt()

        # Format Gemini contents
        contents = []
        for h in history:
            role = "user" if h["role"] == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": h["content"]}]
            })
        
        # Append current user message
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        payload = {
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": contents,
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 600,
                "topP": 0.8
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
            ]
        }

        try:
            response = requests.post(
                url,
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=12
            )
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
            else:
                logger.warning(f"Gemini API returned status {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
        return None

    def _call_openai_compatible(self, message, history, api_key, provider):
        """Calls OpenAI, Groq, OpenRouter, NVIDIA NIM, or other OpenAI-compatible endpoints."""
        base_url = os.environ.get("AI_BASE_URL", "").strip()
        model = os.environ.get("AI_MODEL", "").strip()

        if provider == "nvidia":
            base_url = base_url or "https://integrate.api.nvidia.com/v1"
            model = model or "meta/llama-3.2-11b-vision-instruct"
        elif provider == "groq":
            base_url = base_url or "https://api.groq.com/openai/v1"
            model = model or "llama-3.3-70b-versatile"
        elif provider == "openrouter":
            base_url = base_url or "https://openrouter.ai/api/v1"
            model = model or "meta-llama/llama-3.1-8b-instruct:free"
        else: # openai
            base_url = base_url or "https://api.openai.com/v1"
            model = model or "gpt-4o-mini"

        url = f"{base_url.rstrip('/')}/chat/completions"

        messages = [{"role": "system", "content": self.get_system_prompt()}]
        for h in history:
            messages.append({"role": h["role"], "content": h["content"]})
        messages.append({"role": "user", "content": message})

        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": 500
        }

        try:
            response = requests.post(
                url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json=payload,
                timeout=12
            )
            if response.status_code == 200:
                data = response.json()
                choices = data.get("choices", [])
                if choices:
                    return choices[0].get("message", {}).get("content", "").strip()
            else:
                logger.warning(f"{provider} API returned status {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.error(f"Error calling {provider} API: {e}")
        return None

    def _knowledge_engine_fallback(self, query, history):
        """
        Intelligent Knowledge Engine fallback.
        Provides accurate, friendly, domain-specific answers directly from
        the verified TRIAUREX knowledge base when an external API key is absent or offline.
        """
        q_lower = query.lower()

        # Check for prompt injection attempts
        if any(term in q_lower for term in ['ignore previous', 'system prompt', 'you are now', 'dan mode', 'bypass']):
            return (
                "I am Aurora, the dedicated TRIAUREX digital assistant. "
                "I'm here to provide accurate information regarding our engineering services, "
                "pricing, and project kickoffs. How can I assist with your next web or mobile build?"
            )

        # 1. Greetings
        if re.search(r'\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b', q_lower):
            return (
                "Hello! 👋 I'm **Aurora**, your TRIAUREX digital assistant. "
                "I can answer questions about our design and development services, past case studies, "
                "tech stack (React, Flask, Android, Django), pricing estimates, and project timelines. "
                "What can I help you explore today?"
            )

        # 2. Services
        if any(w in q_lower for w in ['service', 'offer', 'what do you do', 'what can you build', 'capabilities']):
            services = self.data_sources.get('services_data', [])
            if services:
                list_str = "\n".join([f"• **{s['title']}**: {s['description']}" for s in services])
                return (
                    f"**TRIAUREX provides end-to-end digital craftsmanship across four core disciplines:**\n\n"
                    f"{list_str}\n\n"
                    f"Would you like details on our development deliverables or a quote for an upcoming project?"
                )
            return (
                "**TRIAUREX specializes in:**\n"
                "• **UI/UX Design**: Wireframes, design systems, and clickable prototypes\n"
                "• **Web Development**: Blazing-fast apps with React, Vite, and Flask APIs\n"
                "• **Android App Development**: Native Kotlin and Jetpack Compose mobile apps\n"
                "• **Branding & Identity**: Strategic brand positioning, typography, and logos\n\n"
                "Which service aligns best with your goals?"
            )

        # 3. Android / Mobile
        if any(w in q_lower for w in ['android', 'mobile', 'ios', 'phone app', 'play store', 'kotlin']):
            return (
                "Yes! We build high-performance **Native Android Applications** using modern **Kotlin** "
                "and **Jetpack Compose**. \n\n"
                "**Our mobile capabilities include:**\n"
                "• Fluid reactive UI and custom micro-interactions\n"
                "• Offline persistence (Room DB) and secure background sync\n"
                "• Google Play Store deployment & optimization\n"
                "• REST API integration with real-time push notifications\n\n"
                "Are you planning a new Android app or modernizing an existing mobile product?"
            )

        # 4. Web Development & Tech Stack
        if any(w in q_lower for w in ['tech', 'technology', 'stack', 'framework', 'react', 'flask', 'django', 'python', 'database']):
            return (
                "Our core engineering stack combines modern frontend speed with robust Python backends:\n\n"
                "• **Frontend**: React, Next.js, Vite, TypeScript, and TailwindCSS\n"
                "• **Backend**: Python (Flask WSGI micro-services, Django for enterprise data handling)\n"
                "• **Mobile**: Native Android (Kotlin, Jetpack Compose)\n"
                "• **Databases**: PostgreSQL, MySQL, Supabase, and SQLite\n"
                "• **Design**: Figma, design tokens, and interactive component libraries\n\n"
                "Would you like to know how we architect our full-stack solutions?"
            )

        # 5. Pricing & Budget
        if any(w in q_lower for w in ['price', 'pricing', 'cost', 'rate', 'how much', 'budget', 'quote', 'fee']):
            return (
                "TRIAUREX offers transparent, milestone-based fixed pricing and dedicated agile sprint retainers:\n\n"
                "• **Starter MVP**: ₹50,000 - ₹1,50,000 ($700 - $2,000 USD) • Ideal for initial market validation (4-6 weeks)\n"
                "• **Custom Product**: ₹1,50,000 - ₹3,50,000 ($2,000 - $4,500 USD) • Full-featured web or mobile app (6-10 weeks)\n"
                "• **Enterprise Platform**: ₹3,50,000+ ($4,500+ USD) • Bespoke architecture, high-concurrency systems, and custom integrations\n\n"
                "You only pay upon sign-off of each milestone. Would you like a detailed proposal tailored to your product scope?"
            )

        # 6. Timeline & Process
        if any(w in q_lower for w in ['timeline', 'how long', 'duration', 'weeks', 'process', 'methodology', 'step']):
            return (
                "Engagements typically range from **4 to 12 weeks** depending on complexity:\n\n"
                "**Our 7-Step Methodology:**\n"
                "1. **Discovery** (Target market & business KPIs)\n"
                "2. **Research** (Architecture blueprints & user journeys)\n"
                "3. **Design** (Figma interactive prototypes & design tokens)\n"
                "4. **Development** (Clean React frontend & scalable Flask APIs)\n"
                "5. **Testing** (Cross-browser, accessibility & security QA)\n"
                "6. **Launch** (Zero-downtime deployment & SEO indexing)\n"
                "7. **Growth** (Continuous feature sprints & performance monitoring)\n\n"
                "Every launch also comes with a complimentary 30-day warranty!"
            )

        # 7. Case Studies / Portfolio
        if any(w in q_lower for w in ['case study', 'portfolio', 'work', 'project', 'pranara', 'visitmax', 'example']):
            return (
                "Here are two of our spotlight case studies:\n\n"
                "1. **PRANARA (Fintech SaaS)**: High-velocity analytics platform processing 25k transactions/sec with real-time multi-currency tracking. Results: **+180% User Growth**, 4.9 App Store rating, 12-week delivery.\n"
                "2. **VisitMax (Travel & Hospitality)**: Intuitive booking engine with bespoke itineraries and sub-1.2s load speeds. Results: **2.5x Conversion Rate** and -40% bounce rate.\n\n"
                "Would you like to discuss how we could build something similar for your company?"
            )

        # 8. Contact, Booking & Location
        if any(w in q_lower for w in ['contact', 'email', 'phone', 'call', 'book', 'hire', 'location', 'address', 'where are you', 'reach']):
            c = STUDIO_PROFILE['contact']
            return (
                "**Here is how you can connect directly with the TRIAUREX team:**\n\n"
                f"• **Email**: [{c['email']}](mailto:{c['email']})\n"
                f"• **Direct Line**: [{c['phone']}](tel:{c['phone'].replace(' ', '')})\n"
                f"• **Location**: {c['location']}\n"
                f"• **Hours**: {c['business_hours']}\n"
                f"• **Response Time**: {c['response_time']}\n\n"
                "You can also fill out the contact form right on this page for an immediate project consultation!"
            )

        # 9. Support & Warranty
        if any(w in q_lower for w in ['warranty', 'support', 'maintenance', 'bug', 'sla', 'after launch']):
            return (
                "Yes! Every project we ship includes a **complimentary 30-day post-launch warranty** covering "
                "any bug fixes or regressions in the delivered scope. \n\n"
                "Following warranty, we provide optional **Growth & Maintenance SLAs** covering 24/7 uptime monitoring, "
                "continuous dependency updates, security patches, and feature iteration sprints."
            )

        # 10. General Studio / About
        if any(w in q_lower for w in ['who are you', 'about', 'triaurex', 'company', 'team']):
            return (
                "**TRIAUREX** is a modern digital design and full-stack engineering studio based in Tiruchirappalli, Tamil Nadu, India. "
                "We craft high-performance digital products for ambitious brands worldwide, with 100% on-time delivery and client retention. "
                "Whether you're starting from a napkin sketch or scaling an established platform, we turn complex challenges into elegant software."
            )

        # Fallback default
        return (
            "I'm here to assist with any questions about TRIAUREX's engineering services, "
            "web & Android app development, design systems, pricing, or project kickoffs. \n\n"
            "If you have a custom requirement or need an exact quote, our engineering team is available directly at "
            f"**{STUDIO_PROFILE['contact']['email']}** or via phone at **{STUDIO_PROFILE['contact']['phone']}**."
        )

    def _generate_follow_up_suggestions(self, query, reply):
        """Generates 3 quick follow-up question chips based on context."""
        q_lower = query.lower()
        if 'service' in q_lower or 'offer' in q_lower:
            return ["What is your pricing model?", "Do you build Android mobile apps?", "How do I schedule a kickoff call?"]
        elif 'price' in q_lower or 'cost' in q_lower or 'budget' in q_lower:
            return ["What is the typical project timeline?", "What is included in the 30-day warranty?", "How do we get started?"]
        elif 'tech' in q_lower or 'stack' in q_lower:
            return ["Can you collaborate with our in-house team?", "Do you build native Android apps?", "Show me recent case studies."]
        elif 'android' in q_lower or 'mobile' in q_lower:
            return ["What backend do you use with mobile apps?", "How much does an Android MVP cost?", "What is your QA testing process?"]
        elif 'contact' in q_lower or 'reach' in q_lower or 'call' in q_lower:
            return ["What services does TRIAUREX offer?", "What is your typical project timeline?", "Inspect past case studies."]
        else:
            return SUGGESTED_QUESTIONS[:3]
