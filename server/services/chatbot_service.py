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
                "temperature": 0.7,
                "maxOutputTokens": 600,
                "topP": 0.9
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
                timeout=30
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
            "temperature": 0.7,
            "max_tokens": 600
        }

        try:
            response = requests.post(
                url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json=payload,
                timeout=30
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
        Provide fixed answers for the four suggested topics when AI is unavailable.
        """
        q_lower = query.lower()
        contact = STUDIO_PROFILE['contact']
        contact_reply = (
            "I can only answer the four suggested topics while the AI service is unavailable. "
            f"For help with this question, please contact the owner at "
            f"[{contact['email']}](mailto:{contact['email']}) or "
            f"[{contact['phone']}](tel:{contact['phone'].replace(' ', '')})."
        )

        # Check for prompt injection attempts
        if any(term in q_lower for term in ['ignore previous', 'system prompt', 'you are now', 'dan mode', 'bypass']):
            return contact_reply

        if re.search(r'\b(start|begin|kickoff|hire|book)\b', q_lower):
            return (
                "To start a project, share your goals and requirements through the contact form, "
                f"or contact the owner at [{contact['email']}](mailto:{contact['email']}) or "
                f"[{contact['phone']}](tel:{contact['phone'].replace(' ', '')}). "
                "The team will arrange a discovery call and prepare a scope and estimate."
            )

        is_pricing_or_timeline = bool(re.search(
            r'\b(timeline|pricing|price|cost|budget|duration|how long|how much)\b', q_lower
        ))
        is_android = bool(re.search(r'\b(android|kotlin|jetpack compose|native mobile)\b', q_lower))
        is_services = bool(re.search(r'\b(services?|offer|offerings|what can you build)\b', q_lower))

        if not (is_pricing_or_timeline or is_android or is_services):
            return contact_reply

        # 1. Greetings & Casual Chit-Chat
        if re.search(r'\b(hi|hello|hey|good morning|good afternoon|good evening|greetings|howdy)\b', q_lower):
            return (
                "Hello! 👋 I'm **Aurora**, your digital assistant at **TRIAUREX**.\n\n"
                "I can help you explore our design & full-stack development services, review past case studies, "
                "estimate pricing & timelines, or schedule a discovery call with our team. "
                "What would you like to build or learn about today?"
            )

        if re.search(r'\b(how are you|how do you do|how is it going|what\'s up|whats up)\b', q_lower):
            return (
                "I'm doing great, thank you! 😊 Ready to help you bring your next digital product to life. "
                "Are you looking into web development, a native mobile app, or UI/UX design?"
            )

        # 2. Thank you & Goodbye
        if re.search(r'\b(thank you|thanks|thx|appreciate it)\b', q_lower):
            return (
                "You're very welcome! 😊 Feel free to ask if you have more questions about our services, tech stack, or upcoming projects."
            )

        if re.search(r'\b(bye|goodbye|see you|cya)\b', q_lower):
            return (
                "Have a wonderful day! Whenever you're ready to explore a digital build, I'll be here. Take care!"
            )

        # 3. Dynamic FAQs check: match against known questions
        faqs = self.data_sources.get('faqs_data', [])
        for f in faqs:
            q_words = set(re.findall(r'\b\w{4,}\b', f['question'].lower()))
            user_words = set(re.findall(r'\b\w{4,}\b', q_lower))
            overlap = q_words.intersection(user_words)
            if len(overlap) >= 2:
                return f"**{f['question']}**\n\n{f['answer']}"

        # 4. Web Development & Websites
        if any(w in q_lower for w in ['website', 'web dev', 'web application', 'landing page', 'frontend', 'backend', 'full stack', 'web app']):
            return (
                "**Web Development at TRIAUREX:**\n\n"
                "We engineer lightning-fast, high-converting web applications tailored to your business needs:\n\n"
                "• **Architecture**: React, Next.js, Vite on the frontend with high-performance Python (Flask & Django) micro-services\n"
                "• **Capabilities**: Single-page apps, SaaS dashboards, headless CMS, e-commerce, and real-time APIs\n"
                "• **Performance**: Sub-1.5s load times, responsive mobile-first layouts, and Core Web Vitals optimization\n"
                "• **Timeline**: 4 to 8 weeks for standard builds\n\n"
                "Would you like to discuss the scope of your website or get a milestone-based estimate?"
            )

        # 5. Mobile & Android Apps
        if any(w in q_lower for w in ['android', 'mobile', 'ios', 'phone app', 'play store', 'kotlin', 'app dev', 'build an app']):
            return (
                "**Mobile App Development at TRIAUREX:**\n\n"
                "We craft high-performance **Native Android Applications** using modern **Kotlin** and **Jetpack Compose**:\n\n"
                "• **Fluid UI**: Reactive, tactile micro-interactions and obsidian dark/light themes\n"
                "• **Offline-First**: Room DB local caching and secure background synchronization\n"
                "• **Integration**: Real-time push notifications, payment gateways, and hardware sensor APIs\n"
                "• **Store Launch**: Complete Google Play Store deployment and store listing optimization\n\n"
                "Are you planning an MVP from scratch or modernizing an existing mobile product?"
            )

        # 6. UI/UX Design & Branding
        if any(w in q_lower for w in ['design', 'ui/ux', 'ui', 'ux', 'wireframe', 'figma', 'prototype', 'branding', 'logo', 'identity']):
            return (
                "**UI/UX Design & Branding at TRIAUREX:**\n\n"
                "We create user-first digital experiences engineered for maximum conversion and delight:\n\n"
                "• **User Research**: Persona mapping, user journey blueprints, and usability audits\n"
                "• **Prototyping**: Interactive Figma prototypes with click-through testing\n"
                "• **Design Systems**: Reusable component libraries, tokens, and style guides\n"
                "• **Brand Identity**: Cohesive logos, color palettes, typography, and marketing assets\n\n"
                "Would you like to review our design case studies or discuss a redesign?"
            )

        # 7. Services (General)
        if any(w in q_lower for w in ['service', 'offer', 'what do you do', 'what can you build', 'capabilities', 'what can you do']):
            services = self.data_sources.get('services_data', [])
            if services:
                list_str = "\n".join([f"• **{s['title']}**: {s['description']}" for s in services])
                return (
                    f"**TRIAUREX provides end-to-end digital craftsmanship across four core disciplines:**\n\n"
                    f"{list_str}\n\n"
                    f"Which service best aligns with what you're looking to achieve?"
                )
            return (
                "**TRIAUREX specializes in:**\n"
                "• **UI/UX Design**: Wireframes, design systems, and clickable prototypes\n"
                "• **Web Development**: Blazing-fast apps with React, Vite, and Flask APIs\n"
                "• **Android App Development**: Native Kotlin and Jetpack Compose mobile apps\n"
                "• **Branding & Identity**: Strategic brand positioning, typography, and logos\n\n"
                "Which service aligns best with your goals?"
            )

        # 8. Pricing, Cost & Budget
        if any(w in q_lower for w in ['price', 'pricing', 'cost', 'rate', 'how much', 'budget', 'quote', 'fee', 'expense', 'cheap', 'discount']):
            return (
                "**TRIAUREX Pricing & Engagement Guidelines:**\n\n"
                "We provide transparent, milestone-based fixed pricing so there are zero surprises:\n\n"
                "• **Starter MVP**: ₹50,000 - ₹1,50,000 ($700 - $2,000 USD) • Focused MVP launch (4-6 weeks)\n"
                "• **Custom Product**: ₹1,50,000 - ₹3,50,000 ($2,000 - $4,500 USD) • Full-featured web or mobile app (6-10 weeks)\n"
                "• **Enterprise Platform**: ₹3,50,000+ ($4,500+ USD) • Bespoke architecture, high-concurrency systems & custom SLAs\n\n"
                "**Terms**: You only approve and pay per completed milestone. Every project also includes a complimentary 30-day post-launch warranty."
            )

        # 9. Timeline, Duration & Schedule
        if any(w in q_lower for w in ['timeline', 'how long', 'duration', 'weeks', 'days', 'months', 'deadline', 'when', 'schedule', 'fast']):
            return (
                "**Project Timelines at TRIAUREX:**\n\n"
                "Our engagements typically range from **4 to 12 weeks**:\n\n"
                "• **MVPs & Landing Applications**: 4 to 6 weeks\n"
                "• **Full-Scale Web & Mobile Products**: 6 to 10 weeks\n"
                "• **Enterprise Platforms**: 8 to 12+ weeks\n\n"
                "We deliver weekly demos and milestones so you can see live progress every single sprint!"
            )

        # 10. Process & Methodology
        if any(w in q_lower for w in ['process', 'methodology', 'step', 'how do you work', 'phases', 'workflow', 'how it works']):
            return (
                "**Our 7-Step Development Methodology:**\n\n"
                "1. **Discovery**: Target market, user personas & business KPIs\n"
                "2. **Research**: Architecture blueprints and technical feasibility audits\n"
                "3. **Design**: Interactive Figma prototypes and motion tokens\n"
                "4. **Development**: Clean React frontend with scalable Python (Flask/Django) APIs\n"
                "5. **Testing**: Automated end-to-end testing, cross-browser & accessibility QA\n"
                "6. **Launch**: Zero-downtime deployment, CDN caching, and SEO indexing\n"
                "7. **Growth**: Post-launch warranty, uptime monitoring, and iteration sprints"
            )

        # 11. Technology Stack
        if any(w in q_lower for w in ['tech', 'technology', 'stack', 'framework', 'react', 'flask', 'django', 'python', 'node', 'database', 'sql', 'supabase', 'mysql']):
            return (
                "**Our Engineering & Design Stack:**\n\n"
                "• **Frontend**: React, Next.js, Vite, TypeScript, TailwindCSS\n"
                "• **Backend**: Python (Flask WSGI micro-services, Django for enterprise data handling), Node.js\n"
                "• **Mobile**: Native Android (Kotlin, Jetpack Compose)\n"
                "• **Databases**: PostgreSQL, MySQL, Supabase, Redis\n"
                "• **Design**: Figma, design tokens, responsive component libraries\n\n"
                "Would you like to know how we integrate with your existing codebase or APIs?"
            )

        # 12. Case Studies & Portfolio
        if any(w in q_lower for w in ['case study', 'portfolio', 'work', 'project', 'pranara', 'visitmax', 'example', 'client', 'past work']):
            return (
                "**Featured TRIAUREX Case Studies:**\n\n"
                "1. **PRANARA (Fintech SaaS)**:\n"
                "   • Real-time analytics platform handling 25k transactions/sec with multi-currency tracking\n"
                "   • **Results**: +180% user growth, 4.9 App Store rating, delivered in 12 weeks\n"
                "   • **Stack**: React, Flask, TypeScript, PostgreSQL\n\n"
                "2. **VisitMax (Travel & Hospitality)**:\n"
                "   • High-speed booking engine with personalized itineraries across 1.4M hotel inventories\n"
                "   • **Results**: 2.5x conversion rate, -40% bounce rate, sub-1.2s load speeds\n"
                "   • **Stack**: React, Python, Vite, Redis\n\n"
                "Would you like to discuss a custom build with similar performance standards?"
            )

        # 13. Contact, Location & Hiring
        if any(w in q_lower for w in ['contact', 'email', 'phone', 'call', 'book', 'hire', 'location', 'address', 'where are you', 'reach', 'talk', 'office', 'where are']):
            c = STUDIO_PROFILE['contact']
            return (
                "**Connect with TRIAUREX:**\n\n"
                f"• **Email**: [{c['email']}](mailto:{c['email']})\n"
                f"• **Phone**: [{c['phone']}](tel:{c['phone'].replace(' ', '')})\n"
                f"• **Studio Location**: {c['location']}\n"
                f"• **Business Hours**: {c['business_hours']}\n"
                f"• **Response Time**: {c['response_time']}\n\n"
                "You can also submit your inquiry through the contact form on this page for a rapid response within 2 hours!"
            )

        # 14. Warranty & Support
        if any(w in q_lower for w in ['warranty', 'support', 'maintenance', 'bug', 'sla', 'after launch', 'guarantee']):
            return (
                "**Warranty & Ongoing Support:**\n\n"
                "• **Complimentary 30-Day Warranty**: Every shipped project includes 30 days of free bug-fixing and regression support.\n"
                "• **Growth & Maintenance SLAs**: Optional monthly maintenance retainers covering 24/7 uptime monitoring, security patches, library updates, and agile feature iterations.\n"
                "• **Milestone Sign-Offs**: You only pay for deliverables that you have reviewed and approved."
            )

        # 15. About TRIAUREX / Company
        if any(w in q_lower for w in ['who are you', 'about', 'triaurex', 'company', 'team', 'who made you', 'tell me about yourself']):
            return (
                "**About TRIAUREX:**\n\n"
                "TRIAUREX is a modern digital design and full-stack engineering studio based in Tiruchirappalli, Tamil Nadu, India. "
                "We partner with ambitious founders and established brands worldwide to create elegant, high-performance software.\n\n"
                "• **100% On-Time Delivery** across all milestones\n"
                "• **100% Client Retention**\n"
                "• Deep expertise spanning **React, Python/Flask, Native Android (Kotlin), and UI/UX design**\n\n"
                "How can we help your team succeed?"
            )

        # Fallback default: structured and helpful menu
        return (
            "I'd love to help you with that! At **TRIAUREX**, we specialize in designing and engineering high-impact digital products. "
            "Here are a few areas you can ask me about:\n\n"
            "• **Services**: Web development, Native Android apps, UI/UX design, or branding\n"
            "• **Pricing & Timeline**: Milestone estimates for MVPs and full-scale platforms\n"
            "• **Case Studies**: Real-world results from PRANARA (Fintech) and VisitMax (Hospitality)\n"
            "• **Tech Stack**: Modern React frontends and scalable Python backends\n\n"
            "What specific question or project idea can I assist you with?"
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
