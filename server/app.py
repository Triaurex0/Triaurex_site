import os
import sqlite3
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from services.chatbot_service import ChatbotService
from services.knowledge_base import SUGGESTED_QUESTIONS

app = Flask(__name__)
# Enable CORS for frontend requests
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_PATH = os.path.join(os.path.dirname(__file__), 'travix.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            project_type TEXT,
            budget TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS newsletter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT,
            company TEXT,
            rating INTEGER DEFAULT 5,
            quote TEXT NOT NULL,
            service TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Data models matching client specifications
COMPANY_DATA = {
    "name": "TRIAUREX",
    "tagline": "We build digital experiences that move brands forward",
    "description": "We build high-performance digital products that scale businesses. From cutting-edge websites to intuitive apps and design systems, we craft solutions that elevate your brand.",
    "stats": [
        {"value": "5", "label": "Projects Completed", "numeric": 5, "suffix": ""},
        {"value": "2", "label": "Global Clients", "numeric": 2, "suffix": ""},
        {"value": "3", "label": "Years Experience", "numeric": 3, "suffix": ""},
        {"value": "100%", "label": "Client Retention", "numeric": 100, "suffix": "%"},
        {"value": "100%", "label": "On-Time Delivery", "numeric": 100, "suffix": "%"}
    ],
    "about": {
        "title": "A studio built for ambitious brands",
        "description": "We combine strategic thinking, user-centered design, and robust engineering to deliver digital solutions that transform businesses and accelerate sustainable growth.",
        "pillars": [
            {
                "title": "Our Mission",
                "text": "Empower forward-thinking companies with world-class digital platforms that outperform competition and delight users globally."
            },
            {
                "title": "Our Vision",
                "text": "To redefine digital product craftsmanship by seamlessly unifying artistic elegance with resilient, modern engineering."
            },
            {
                "title": "Our Values",
                "text": "Relentless curiosity, uncompromising code quality, transparent collaboration, and measurable real-world business impact."
            }
        ]
    }
}

SERVICES_DATA = [
    {
        "id": "ui-ux",
        "title": "UI/UX Design",
        "icon": "Palette",
        "description": "User-first digital experiences engineered for maximum conversion, visual delight, and effortless human interaction.",
        "deliverables": ["User Research & Personas", "Wireframing & Interactive Prototypes", "Design Systems & Token Libraries", "Micro-interactions & UX Audits"]
    },
    {
        "id": "web-dev",
        "title": "Web Development",
        "icon": "Code",
        "description": "Blazing-fast modern web applications built on scalable React, Next.js, and rock-solid Python backend architectures.",
        "deliverables": ["High-Performance Single Page Apps", "Full-Stack API Integration", "Headless CMS & E-Commerce", "Core Web Vitals & SEO Optimization"]
    },
    {
        "id": "mobile-dev",
        "title": "Android App Development",
        "icon": "Smartphone",
        "description": "Native and high-performance Android mobile apps with fluid UI, offline persistence, and seamless push ecosystem integration.",
        "deliverables": ["Native Android Architecture", "Jetpack Compose & Kotlin Engineering", "Google Play Store Optimization", "Realtime Sync & Device Hardware APIs"]
    },
    {
        "id": "branding",
        "title": "Branding & Identity",
        "icon": "Sparkles",
        "description": "Strategic brand positioning, cohesive visual identities, typography, and guidelines that make your company unforgettable.",
        "deliverables": ["Brand Strategy & Voice", "Logo Design & Visual Language", "Brand Style Guides & Assets", "Pitch Decks & Marketing Collateral"]
    },
    {
        "id": "data-analysis",
        "title": "Data Analysis",
        "icon": "Cpu",
        "description": "Turn raw business data into clear insights with reliable analysis, interactive dashboards, and practical recommendations.",
        "deliverables": ["Data Cleaning & Preparation", "Exploratory Data Analysis", "Power BI Dashboards & Reporting", "Trend Analysis & Business Insights"]
    }
]

CASE_STUDIES_DATA = [
    {
        "id": "pranara",
        "title": "PRANARA",
        "tag": "Travel & Tourism",
        "client": "PRANARA",
        "year": "2026",
        "image": "/images/casestudy/paranara.png",
        "category": "Frontend",
        "description": "A responsive travel and tourism website that helps visitors discover Munnar destinations, experiences, and tour packages.",
        "stats": [],
        "techStack": ["Figma", "HTML", "CSS", "JavaScript", "Vercel", "Hostinger"],
        "challenge": "Travelers need one clear place to explore Munnar destinations, compare experiences, find tour packages, and enquire about trips.",
        "process": "Designed a mobile-responsive experience around spacious layouts, nature-inspired visuals, clear navigation, destination storytelling, and a simple enquiry flow.",
        "solution": "A travel platform organized into destination, tour package, experience, gallery, and contact sections, with trip planning information easy to find.",
        "outcome": "PRANARA gives the travel brand a modern digital presence and makes it easier for visitors to discover and enquire about travel offerings.",
        "features": ["Munnar destination discovery", "Tour packages and travel experiences", "Destination details and gallery", "Responsive layouts", "Trip enquiry flow"],
        "externalLinks": [{"label": "Visit Website", "url": "https://www.pranaramunnar.com/"}]
    },
    {
        "id": "visitmax",
        "title": "VisitMax",
        "tag": "Healthcare · Mobile Application",
        "client": "VisitMax",
        "year": "2025",
        "image": "/images/casestudy/Visitmax.png",
        "category": "Design",
        "description": "A mobile field-visit management app for healthcare executives to record visits, validate locations, upload evidence, and manage reports.",
        "stats": [],
        "techStack": ["Figma", "React Native", "Web API", "MySQL", "Android Studio"],
        "challenge": "Healthcare field executives need a structured way to manage daily visits and replace scattered manual tracking with reliable visit records.",
        "process": "Designed a mobile-first flow with quick actions, clear information hierarchy, OTP login, GPS validation, evidence capture, and minimal steps for recording a visit.",
        "solution": "A centralized app experience for visit tracking, visit reasons, photo evidence, visit history, reports, profiles, and settings.",
        "outcome": "VisitMax makes field-visit reporting more structured and brings visit management into one mobile application.",
        "features": ["Login and OTP authentication", "Daily dashboard and visit tracking", "GPS location validation", "Evidence photo upload", "Visit reasons, history, and reports", "Profile and settings"],
        "externalLinks": [{"label": "View Figma Design", "url": "https://www.figma.com/design/KOfwcWwrgEqqUZwfbwfHiq/visitmax?node-id=0-1&p=f&t=b5PNiqgyHCgXPBaQ-0"}]
    },
    {
        "id": "yrc-xerox",
        "title": "YRC Xerox",
        "tag": "E-Commerce · Marketplace",
        "client": "YRC Xerox",
        "year": "2026",
        "image": "/images/casestudy/YRC.png",
        "category": "Design",
        "description": "A product-focused e-commerce marketplace design for browsing and purchasing Xerox and printing machines.",
        "stats": [],
        "techStack": ["Figma", "Adobe Photoshop", "Canva"],
        "challenge": "Customers need a straightforward way to discover printing machines, understand product details, compare options, and complete a purchase.",
        "process": "Designed a professional responsive shopping experience around clear product hierarchy, simple navigation, consistent UI, product discovery, and a structured checkout.",
        "solution": "A marketplace flow that connects product listings and categories to product details, cart, checkout, payment, accounts, and order management.",
        "outcome": "The design gives YRC Xerox a structured digital marketplace for showcasing machines and supporting a clearer purchasing journey.",
        "features": ["Product listing and categories", "Search and filtering", "Detailed product pages", "Shopping cart and checkout", "Payment flow", "User accounts and order management"],
        "externalLinks": [{"label": "View Figma Design", "url": "https://www.figma.com/design/dYvw5l0RVObm1x7BNiMsUc/Untitled?node-id=0-1&p=f&t=oWIpgip7a7YusCA9-0"}]
    }
]

PROCESS_DATA = [
    {
        "step": "01",
        "title": "Discovery",
        "subtitle": "Uncover the Vision",
        "description": "Deep-dive workshops to analyze your target demographic, competitive moat, business KPIs, and technical constraints."
    },
    {
        "step": "02",
        "title": "Research",
        "subtitle": "Data & Feasibility",
        "description": "Architectural blueprints, user journey mapping, and technical feasibility audits to de-risk the entire product roadmap."
    },
    {
        "step": "03",
        "title": "Design",
        "subtitle": "Visual Craftsmanship",
        "description": "High-fidelity wireframes, interactive Figma prototypes, and comprehensive design systems with responsive motion tokens."
    },
    {
        "step": "04",
        "title": "Development",
        "subtitle": "Modern Engineering",
        "description": "Clean, scalable frontend implementation in React coupled with high-throughput Flask APIs and secure database models."
    },
    {
        "step": "05",
        "title": "Testing",
        "subtitle": "Rigorous QA",
        "description": "Automated end-to-end testing, responsive cross-browser validation, accessibility audits, and security vulnerability scans."
    },
    {
        "step": "06",
        "title": "Launch",
        "subtitle": "Seamless Deployment",
        "description": "Zero-downtime production deployment, CDN caching, structured SEO indexing, and enterprise analytics configuration."
    },
    {
        "step": "07",
        "title": "Growth",
        "subtitle": "Continuous Evolution",
        "description": "Ongoing conversion optimization, user heatmaps, feature expansion sprints, and 24/7 reliability monitoring."
    }
]

TECH_DATA = [
    {"name": "React", "category": "Frontend", "icon": "Layers", "description": "Declarative UI component architecture with hooks & state management"},
    {"name": "Django", "category": "Frontend", "icon": "Layers", "description": "Dynamic web templates, forms, and responsive frontend views"},
    {"name": "Flask", "category": "Backend", "icon": "Server", "description": "Lightweight, robust Python WSGI micro-framework for high-speed APIs"},
    {"name": "Python", "category": "Backend", "icon": "Terminal", "description": "Core backend logic, data processing, and scalable server architectures"},
    {"name": "Node.js", "category": "Backend", "icon": "Cpu", "description": "Event-driven JavaScript runtime for lightning-fast build tooling and APIs"},
    {"name": "MySQL", "category": "Database", "icon": "Database", "description": "ACID-compliant relational database management system for structured data"},
    {"name": "Supabase", "category": "Database", "icon": "Database", "description": "Open-source Firebase alternative with instant Postgres, realtime subscriptions, and auth"},
    {"name": "Figma", "category": "Design", "icon": "PenTool", "description": "Collaborative design systems, auto-layout UI components, and prototypes"},
    {"name": "Mural", "category": "Design", "icon": "Layers", "description": "Collaborative visual workspace for workshops, mapping, and ideation"},
    {"name": "Balsamiq", "category": "Design", "icon": "PenTool", "description": "Low-fidelity wireframing for rapid interface planning"},
    {"name": "Whimsical", "category": "Design", "icon": "Layers", "description": "Visual collaboration for flowcharts, wireframes, and product planning"},
    {"name": "CorelDRAW", "category": "Design", "icon": "Palette", "description": "Vector illustration, page layout, and graphic design"},
    {"name": "Penpot", "category": "Design", "icon": "PenTool", "description": "Open-source interface design and interactive prototyping"},
    {"name": "Stitch", "category": "Design", "icon": "Layers", "description": "AI-assisted interface design and UI prototyping"},
    {"name": "Adobe XD", "category": "Design", "icon": "PenTool", "description": "UI/UX design and interactive prototyping"},
    {"name": "Framer", "category": "Design", "icon": "Layers", "description": "Interactive website design and visual prototyping"},
    {"name": "Canva", "category": "Design", "icon": "Palette", "description": "Visual graphics, brand identity collateral, and marketing assets"},
    {"name": "Power BI", "category": "Analytics", "icon": "Database", "description": "Business intelligence dashboards, reporting, and data visualization"}
]

TESTIMONIALS_DATA = [
    {
        "id": 1,
        "name": "Alexander Wright",
        "role": "Chief Technology Officer",
        "company": "FinScale Systems",
        "avatarIndex": 1,
        "quote": "The TRIAUREX team exceeded our expectations on every front. Their blend of sophisticated UI design and robust Flask backend architecture delivered a 180% surge in user engagement within three months of release.",
        "rating": 5
    },
    {
        "id": 2,
        "name": "Samantha Chen",
        "role": "Founder & CEO",
        "company": "VoyageLab Global",
        "avatarIndex": 0,
        "quote": "Their attention to design fidelity and performance is unmatched. They took our complex travel booking concept and converted it into a frictionless, elegant web app that loads in under 1.2 seconds.",
        "rating": 5
    },
    {
        "id": 3,
        "name": "Michael Torres",
        "role": "VP of Digital Product",
        "company": "HyperCore Media",
        "avatarIndex": 2,
        "quote": "From discovery to final deployment, TRIAUREX operated with incredible precision and speed. The communication was transparent and the resulting product has set a new benchmark in our industry.",
        "rating": 5
    }
]

FAQS_DATA = [
    {
        "question": "What is the typical project timeline?",
        "answer": "Our standard project engagements range from 4 to 12 weeks depending on scope complexity. Rapid MVP launches can be accomplished in 4 to 6 weeks, while enterprise-grade platforms with comprehensive design systems and custom backend integrations typically average 8 to 12 weeks."
    },
    {
        "question": "How do you handle pricing & project milestones?",
        "answer": "We offer transparent milestone-based fixed pricing as well as dedicated agile sprint retainers. Every project proposal includes detailed deliverables, defined acceptance criteria, and clear phase sign-offs so there are never any unexpected surprises."
    },
    {
        "question": "Do you provide ongoing support & maintenance?",
        "answer": "Yes, absolutely! Following launch, we provide complimentary 30-day warranty coverage. Afterwards, clients can select from our Growth & Maintenance SLAs covering security patches, feature iterations, uptime monitoring, and infrastructure scaling."
    },
    {
        "question": "Can you collaborate with our existing in-house team?",
        "answer": "Yes, we frequently co-create with internal engineering and design teams. Whether you need specialized UI/UX design leadership, frontend React development, or robust Flask API backends, we integrate cleanly into your GitHub workflows."
    },
    {
        "question": "Why do you recommend React frontend and Flask backend?",
        "answer": "React delivers a fluid, responsive client-side experience with rich animations and reusable components. Flask provides a clean, Python-powered REST API that is lightweight, highly maintainable, and easily extendable for AI/ML pipelines and data science features."
    }
]

# Initialize Chatbot Service with live synchronized data models
chatbot_service = ChatbotService(data_sources={
    "company_data": COMPANY_DATA,
    "services_data": SERVICES_DATA,
    "case_studies_data": CASE_STUDIES_DATA,
    "process_data": PROCESS_DATA,
    "tech_data": TECH_DATA,
    "faqs_data": FAQS_DATA
})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "backend": "Flask 3.1",
        "version": "1.0.0"
    })

@app.route('/api/company-info', methods=['GET'])
def get_company_info():
    return jsonify(COMPANY_DATA)

@app.route('/api/services', methods=['GET'])
def get_services():
    return jsonify(SERVICES_DATA)

@app.route('/api/case-studies', methods=['GET'])
def get_case_studies():
    return jsonify(CASE_STUDIES_DATA)

@app.route('/api/process', methods=['GET'])
def get_process():
    return jsonify(PROCESS_DATA)

@app.route('/api/technologies', methods=['GET'])
def get_technologies():
    return jsonify(TECH_DATA)

@app.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM reviews ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()

    db_reviews = []
    for r in rows:
        db_reviews.append({
            "id": f"rev-{r['id']}",
            "name": r['name'],
            "role": r['role'] or 'Client',
            "company": r['company'] or 'Partner',
            "rating": r['rating'] or 5,
            "quote": r['quote'],
            "service": r['service'] or '',
            "avatarPos": "50% 50%"
        })

    return jsonify(db_reviews + TESTIMONIALS_DATA)

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    role = data.get('role', '').strip() or 'Client'
    company = data.get('company', '').strip() or 'Partner'
    try:
        rating = int(data.get('rating', 5))
    except (ValueError, TypeError):
        rating = 5
    quote = data.get('quote', '').strip()
    service = data.get('service', '').strip()

    if not name or not quote:
        return jsonify({"error": "Name and review message are required."}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO reviews (name, role, company, rating, quote, service)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, role, company, rating, quote, service))
    conn.commit()
    rev_id = cursor.lastrowid
    conn.close()

    new_review = {
        "id": f"rev-{rev_id}",
        "name": name,
        "role": role,
        "company": company,
        "rating": rating,
        "quote": quote,
        "service": service,
        "avatarPos": "50% 50%"
    }
    return jsonify({"success": True, "message": "Thank you! Your review has been added.", "review": new_review})

@app.route('/api/faqs', methods=['GET'])
def get_faqs():
    return jsonify(FAQS_DATA)

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    project_type = data.get('project_type', 'Full-Stack Development').strip()
    budget = data.get('budget', '$10k - $25k').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({
            "success": False,
            "error": "Name, email, and project message are required fields."
        }), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO contacts (name, email, project_type, budget, message)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, email, project_type, budget, message))
    contact_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Thank you {name}! Your project inquiry has been received. Our team will review your requirements and reach out within 2 hours.",
        "inquiryId": contact_id,
        "estimatedResponse": "Under 2 hours"
    }), 201

@app.route('/api/newsletter', methods=['POST'])
def submit_newsletter():
    data = request.get_json() or {}
    email = data.get('email', '').strip()

    if not email or '@' not in email:
        return jsonify({"success": False, "error": "Please provide a valid email address."}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO newsletter (email) VALUES (?)', (email,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Successfully subscribed to TRIAUREX insights!"})
    except sqlite3.IntegrityError:
        return jsonify({"success": True, "message": "You are already subscribed to TRIAUREX insights!"})

@app.route('/api/leads', methods=['GET'])
def get_leads():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 20')
    rows = cursor.fetchall()
    leads = [dict(row) for row in rows]
    conn.close()
    return jsonify(leads)

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.get_json(silent=True) or {}
    message = data.get('message', '')
    conversation = data.get('conversation', [])

    # Get client IP address for rate limiting
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if client_ip and ',' in client_ip:
        client_ip = client_ip.split(',')[0].strip()

    result = chatbot_service.process_chat(
        user_message=message,
        raw_history=conversation,
        client_ip=client_ip
    )

    if not result.get('success'):
        status_code = 429 if result.get('error') == 'rate_limited' else 400
        return jsonify({
            "success": False,
            "error": result.get('error'),
            "reply": result.get('reply'),
            "suggestedQuestions": result.get('suggestedQuestions', [])
        }), status_code

    return jsonify({
        "success": True,
        "reply": result.get('reply'),
        "suggestedQuestions": result.get('suggestedQuestions', [])
    })

@app.route('/api/chat/suggested', methods=['GET'])
def get_chat_suggested():
    return jsonify({
        "welcomeMessage": "Hi! 👋 I'm Aurora, your TRIAUREX digital assistant. How can I help you today?",
        "suggestedQuestions": SUGGESTED_QUESTIONS
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f" TRIAUREX Flask API running on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=True)
