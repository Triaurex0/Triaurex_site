import os
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

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
    conn.commit()
    conn.close()

init_db()

# Data models matching client specifications
COMPANY_DATA = {
    "name": "TRAVIX",
    "tagline": "We build digital experiences that move brands forward",
    "description": "We build high-performance digital products that scale businesses. From cutting-edge websites to intuitive apps and design systems, we craft solutions that elevate your brand.",
    "stats": [
        {"value": "120+", "label": "Projects Completed", "numeric": 120, "suffix": "+"},
        {"value": "45", "label": "Global Clients", "numeric": 45, "suffix": ""},
        {"value": "8", "label": "Years Experience", "numeric": 8, "suffix": ""},
        {"value": "99%", "label": "Client Retention", "numeric": 99, "suffix": "%"},
        {"value": "32", "label": "Design Awards", "numeric": 32, "suffix": ""}
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
        "title": "Mobile App Development",
        "icon": "Smartphone",
        "description": "Cross-platform mobile apps with native fluid feel, offline persistence, and seamless push ecosystem integration.",
        "deliverables": ["iOS & Android Engineering", "React Native & Flutter Architecture", "App Store Optimization (ASO)", "Realtime Sync & Device Hardware APIs"]
    },
    {
        "id": "ai-solutions",
        "title": "AI & Automation",
        "icon": "Cpu",
        "description": "Next-generation generative AI workflows, intelligent chatbots, and automated pipelines that cut operational overhead.",
        "deliverables": ["Custom LLM Agent Pipelines", "Automated Business Workflows", "Predictive Analytics & Dashboards", "Intelligent Search & Vector RAG"]
    },
    {
        "id": "branding",
        "title": "Branding & Identity",
        "icon": "Sparkles",
        "description": "Strategic brand positioning, cohesive visual identities, typography, and guidelines that make your company unforgettable.",
        "deliverables": ["Brand Strategy & Voice", "Logo Design & Visual Language", "Brand Style Guides & Assets", "Pitch Decks & Marketing Collateral"]
    }
]

CASE_STUDIES_DATA = [
    {
        "id": "pranara",
        "title": "PRANARA",
        "tag": "Fintech SaaS",
        "client": "Pranara Global Financial Inc.",
        "year": "2025",
        "description": "A high-velocity financial analytics platform providing real-time multi-currency portfolio tracking, automated risk mitigation, and instant settlement flows.",
        "stats": [
            {"label": "User Growth", "value": "+180%"},
            {"label": "App Store Rating", "value": "4.9"},
            {"label": "Delivery Timeline", "value": "12wk"}
        ],
        "techStack": ["React", "Flask", "TypeScript", "PostgreSQL", "TailwindCSS", "Chart.js"],
        "challenge": "Pranara needed to transition from legacy spreadsheets to a zero-latency web dashboard capable of processing 25,000 live market transactions per second.",
        "solution": "We designed an obsidian glassmorphic UI paired with optimized WebSockets and cached Python endpoints, decreasing user onboarding drop-off by 62%."
    },
    {
        "id": "visitmax",
        "title": "VisitMax",
        "tag": "Travel & Hospitality",
        "client": "VisitMax International",
        "year": "2024",
        "description": "An intuitive booking and travel recommendation engine delivering bespoke itineraries, immersive destination previews, and lightning-fast checkout.",
        "stats": [
            {"label": "Conversion Rate", "value": "2.5x"},
            {"label": "Bounce Rate", "value": "-40%"},
            {"label": "Avg Load Time", "value": "1.2s"}
        ],
        "techStack": ["React", "Python", "Vite", "Redis", "Figma", "Stripe API"],
        "challenge": "VisitMax faced severe mobile cart abandonment due to cluttered layouts and slow search queries across 1.4 million hotel inventories.",
        "solution": "We restructured the discovery funnel with tactile micro-interactions, responsive modular filters, and a unified 2-step booking flow."
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
    {"name": "Flask", "category": "Backend", "icon": "Server", "description": "Lightweight, robust Python WSGI micro-framework for high-speed APIs"},
    {"name": "Python", "category": "Backend / AI", "icon": "Terminal", "description": "Core backend logic, data processing, and machine learning pipelines"},
    {"name": "Node.js", "category": "Runtime", "icon": "Cpu", "description": "Event-driven JavaScript runtime for lightning-fast build tooling"},
    {"name": "Docker", "category": "DevOps", "icon": "Box", "description": "Reproducible containerized environments for effortless staging & deploy"},
    {"name": "Figma", "category": "Design", "icon": "PenTool", "description": "Collaborative design systems, auto-layout UI components, and prototypes"},
    {"name": "AWS / Cloud", "category": "Infrastructure", "icon": "Cloud", "description": "Elastic serverless architecture, S3 storage, and global CDN delivery"},
    {"name": "AI / LLM", "category": "Intelligence", "icon": "Sparkles", "description": "Custom agentic workflows and intelligent semantic indexing"}
]

TESTIMONIALS_DATA = [
    {
        "id": 1,
        "name": "Alexander Wright",
        "role": "Chief Technology Officer",
        "company": "FinScale Systems",
        "avatarIndex": 1,
        "quote": "The TRAVIX team exceeded our expectations on every front. Their blend of sophisticated UI design and robust Flask backend architecture delivered a 180% surge in user engagement within three months of release.",
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
        "quote": "From discovery to final deployment, TRAVIX operated with incredible precision and speed. The communication was transparent and the resulting product has set a new benchmark in our industry.",
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
        "answer": "Yes, we frequently co-create with internal engineering and design teams. Whether you need specialized UI/UX design leadership, frontend React development, or robust Flask API backends, we integrate cleanly into your GitHub workflows and Slack channels."
    },
    {
        "question": "Why do you recommend React frontend and Flask backend?",
        "answer": "React delivers a fluid, responsive client-side experience with rich animations and reusable components. Flask provides a clean, Python-powered REST API that is lightweight, highly maintainable, and easily extendable for AI/ML pipelines and data science features."
    }
]

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
    return jsonify(TESTIMONIALS_DATA)

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
        return jsonify({"success": True, "message": "Successfully subscribed to TRAVIX insights!"})
    except sqlite3.IntegrityError:
        return jsonify({"success": True, "message": "You are already subscribed to TRAVIX insights!"})

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f" TRAVIX Flask API running on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=True)
