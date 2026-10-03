# TRIAUREX — Next-Gen Digital Product Studio

<p align="center">
  <img src="client/public/triaurex-logo.png" alt="TRIAUREX Logo" width="120" />
</p>

<p align="center">
  <strong>High-performance digital products that scale businesses.</strong><br>
  From cutting-edge web applications to intuitive Android apps and bespoke design systems.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_18_%2B_Vite-00f0ff?style=flat-square" alt="React 18" />
  <img src="https://img.shields.io/badge/Backend-Python_%2B_Flask-3b82f6?style=flat-square" alt="Flask Backend" />
  <img src="https://img.shields.io/badge/Database-SQLite_%2B_MySQL_%2B_Supabase-10b981?style=flat-square" alt="Databases" />
  <img src="https://img.shields.io/badge/Location-Tiruchirappalli%2C_India-8b5cf6?style=flat-square" alt="Location" />
</p>

---

## 🚀 Overview

**TRIAUREX** is an elite digital product studio based in **Tiruchirappalli, Tamil Nadu, India**. We specialize in engineering modern web applications, high-performance Android mobile apps, robust backend APIs, and conversion-focused UI/UX design systems for ambitious global brands.

---

## ✨ Features

- **Interactive Work & Delivery Dashboard**: Dynamic glassmorphic chart highlighting delivered production projects, discipline proficiencies, and engineering milestones.
- **Core Services Showcase**:
  - **UI/UX Design**: User research, design systems, token libraries, and Figma prototypes.
  - **Web Development**: Single-page and full-stack web applications using React, Django, and Flask.
  - **Android App Development**: Native Android apps with Jetpack Compose, Kotlin, offline persistence, and Google Play Store optimization.
  - **Branding & Identity**: Visual brand language, Canva & Figma marketing collateral, and style guides.
- **Client Reviews & Testimonials System**:
  - Live testimonial cards with star ratings and service tags.
  - **"Add Your Review"** feature with interactive star rating picker, optimistic instant updates, and persistent SQLite storage.
- **Modern Tech Stack Directory**: Categorized and filterable stack:
  - **Frontend**: React, Django
  - **Backend**: Flask, Python, Node.js
  - **Database**: MySQL, Supabase
  - **Design**: Figma, Canva
- **Interactive Project Kickoff Form**:
  - Budget selector with localized Indian Rupee (₹) tiers (`₹25k` to `₹500k+`).
  - Automated celebratory confetti animations upon submission.
  - Built-in Leads Database Inspector for reviewing incoming client inquiries.
- **7-Stage Engineering Methodology**: Transparent interactive phase stepper from Discovery to Testing, Launch, and Growth.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom Token-based Design System, Glassmorphism, Responsive Grid)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Micro-Interactions**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

### Backend
- **Framework**: [Flask 3.1](https://flask.palletsprojects.com/) (Python)
- **CORS Support**: `flask-cors`
- **Database**: SQLite (`server/travix.db`) with tables for contacts, newsletter subscribers, and client reviews
- **Image Processing**: `Pillow` for asset optimization

---

## 📁 Repository Structure

```text
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets & favicons
│   │   ├── triaurex-logo.png   # Transparent studio logo
│   │   ├── favicon.ico         # Multi-res browser favicon
│   │   └── images/             # Case study assets
│   ├── src/
│   │   ├── components/         # Modular React components
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Hero.jsx        # Hero section & work dashboard
│   │   │   ├── About.jsx       # Studio story & pillars
│   │   │   ├── Services.jsx    # Service cards & modal details
│   │   │   ├── CaseStudies.jsx # Project showcase modals
│   │   │   ├── Process.jsx     # 7-step engineering timeline
│   │   │   ├── Technologies.jsx# Filterable tech stack
│   │   │   ├── Testimonials.jsx# Reviews & review submission modal
│   │   │   ├── FAQ.jsx         # Collapsible accordion FAQ
│   │   │   ├── Contact.jsx     # Lead inquiry form (INR currency)
│   │   │   └── Footer.jsx      # Studio footer & newsletter
│   │   ├── App.jsx             # Main application component & data hooks
│   │   ├── index.css           # Global design system & theme tokens
│   │   └── main.jsx            # Entry point
│   ├── index.html              # HTML shell & SEO meta tags
│   └── package.json            # Node scripts & dependencies
│
├── server/                     # Flask REST API Backend
│   ├── app.py                  # API endpoints, data models & SQLite database
│   ├── requirements.txt        # Python pip dependencies
│   └── venv/                   # Python virtual environment
└── README.md                   # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v18 or higher) & **npm**
- **Python** (v3.10 or higher)

---

### 1. Backend Setup (Flask API)

Open a terminal and navigate to the `server` directory:

```bash
cd server
```

Activate the virtual environment:

- **Windows PowerShell:**
  ```powershell
  . .\venv\Scripts\Activate.ps1
  ```
- **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the Flask development server:
```bash
python app.py
```

The Flask API will run at **`http://127.0.0.1:5000`**.

---

### 2. Frontend Setup (React + Vite)

Open a second terminal and navigate to the `client` directory:

```bash
cd client
```

Install npm dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`** to view the live studio application.

---

### 3. Production Build

To bundle the frontend for production deployment:
```bash
cd client
npm run build
```
The optimized bundle will be generated in `client/dist/`.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and uptime verification |
| `GET` | `/api/company-info`| Studio bio, metrics, and core pillars |
| `GET` | `/api/services` | Service catalog and capabilities |
| `GET` | `/api/case-studies`| Detailed project portfolio data |
| `GET` | `/api/process` | 7-step delivery methodology steps |
| `GET` | `/api/technologies`| Tech stack items grouped by category |
| `GET` | `/api/testimonials`| Testimonials & verified client reviews |
| `POST`| `/api/reviews` | Submit a new client review & star rating |
| `POST`| `/api/contact` | Submit a new project inquiry |
| `GET` | `/api/leads` | Retrieve logged project inquiries |
| `POST`| `/api/newsletter` | Subscribe email to studio newsletter |

---

## 📬 Contact & Studio Info

- **Studio**: TRIAUREX
- **Email**: [triaurex0@gmail.com](mailto:triaurex0@gmail.com)
- **Phone**: [+91 80157 12990](tel:+918015712990)
- **Location**: Tiruchirappalli, Tamil Nadu, India
- **LinkedIn**: [linkedin.com/company/triaurex](https://www.linkedin.com/company/triaurex/)
- **GitHub**: [github.com](https://github.com)

---

<p align="center">
  © 2026 <strong>TRIAUREX Studio</strong>. All rights reserved.
</p>
