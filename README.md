# 🌱 GreenPlate

**A Full-Stack Sustainable Food Waste Reduction Platform**

GreenPlate is a scalable, full-stack platform designed to reduce food waste by connecting surplus cafeteria food with students and staff. It combines real-time food listing, intelligent reservation systems, and behavior-driven incentives to minimize waste and improve accessibility.

---

## 🎯 Problem Statement

Institutional cafeterias generate large amounts of food waste due to:

* Unpredictable demand
* Order cancellations & no-shows
* Lack of redistribution systems

GreenPlate solves this with a **real-time surplus food marketplace + behavioral incentive system**.

---

## 🏗️ System Architecture

GreenPlate follows a **modular, API-driven architecture**:


GreenPlate is a full-stack web application designed to minimize food waste by connecting users with surplus food from cafeterias. It enables users to discover, reserve, and manage discounted food deals while providing staff with tools to efficiently handle surplus inventory.

---

## 🧠 Architecture Overview

GreenPlate follows a modular full-stack architecture:

* **Frontend:** React + Vite + TypeScript
* **Backend:** Python-based API server
* **Database & Authentication:** Firebase
* **Containerization:** Docker support

---

## ✨ Core Features

### 👤 User Side

* Browse available surplus food deals
* Reserve meals at discounted prices
* View order history and status

### 👨‍🍳 Staff Side

* Create and manage food listings
* Track incoming reservations
* Manage food distribution workflow

### ⚙️ System Features

* REST API communication between frontend and backend
* Firebase integration for authentication and storage
* Responsive UI optimized for mobile devices

> ⚠️ Note: Some advanced features (AI analysis, map view, carbon tracking) may be incomplete or under development.

---

## 📂 Project Structure

```
GreenPlate/
├── backend/                 # Python backend
│   ├── app/                 # Core backend logic
│   ├── main.py              # Entry point
│   ├── requirements.txt     # Python dependencies
│   └── README.md
│
├── frontend/                # User-facing React app
│   ├── Pages/               # Page components
│   ├── Layouts/             # Layout wrappers
│   ├── context/             # Global state management
│   ├── assets/              # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── admin-dashboard/         # Admin/staff interface
│
├── Dockerfile               # Docker configuration
├── compose.yaml             # Multi-container setup
└── README.md
```

---

## ⚙️ Setup & Installation

### 🔹 Prerequisites

* Node.js (v18+ recommended)
* Python (v3.8+)
* npm or yarn
* Git

---

## 🚀 Running the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/GreenPlate.git
cd GreenPlate
```

---

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

👉 Backend will run at:

```
http://localhost:8000
```
Clients (Web + Mobile)
        │
        ▼
Frontend (React + Vite + TypeScript)
        │
        ▼
Backend API (Python)
        │
        ▼
Firebase (Auth + Firestore + Storage)
```

### Design Principles

* Separation of concerns (Frontend / Backend / Admin)
* Scalable authentication via Firebase
* Backend-controlled business logic
* Mobile-first UI design
* Extensible for AI & analytics

---

## 🧠 Core Modules

### 👤 User Application (Frontend)

Handles all user interactions.

**Features:**

* Browse surplus food deals
* Reserve discounted meals
* Track orders & history
* View cafeteria locations (Map view)
* Authentication & onboarding

---

### 👨‍💻 Admin Dashboard

Platform control layer for administrators.

**Features:**

* Manage food stalls
* Manage student/user data
* Domain-based access control
* Monitor platform activity
* Role-based authentication

---

### ⚙️ Backend Service

Central business logic layer.

**Responsibilities:**

* Handle food listings & reservations
* Process EcoPoints logic
* Detect waste & trigger resale
* Manage demand control system
* Communicate with Firebase

---

## 🎮 EcoPoints Gamification System (Buyer-Focused)

A behavior-based reward system designed to reduce food waste.

### ⚙️ Point Rules

| Action                               | EcoPoints            |
| ------------------------------------ | -------------------- |
| Order completed successfully         | ➕ +10                |
| Accepts “Rescue Meal” (delayed food) | ➕ +20                |
| Early cancellation                   | 0                    |
| Late cancellation / no-show          | ➖ -15                |
| Repeated no-shows                    | Additional penalties |

---

### 🎁 Rewards (High EcoPoints Users)

* Early access to high-demand items
* Exclusive discounts
* Priority in reservation queue

---

### 🚫 Penalties (Low EcoPoints Users)

* Lower reservation priority
* Limited access to premium deals
* Possible temporary restrictions

---

## ♻️ Waste Recovery System

Prevents food from being discarded.

### Flow:

1. Backend detects:

   * Delayed orders OR unclaimed food
2. Food is re-listed as:

   * 🔖 “Rescue Meal”
   * Discounted price
3. Buyers who purchase:

   * Receive bonus EcoPoints

---

## 🔥 Demand Control System

Handles high-demand scenarios for limited food items.

### System Behavior:

* Real-time demand tracking via backend
* Queue-based reservation system
* Priority based on:

  * EcoPoints score
  * User reliability (cancellation history)

👉 Ensures fair distribution and prevents system abuse.

---

## 🧠 Behavioral Intelligence Layer

System continuously analyzes:

* Order patterns
* Cancellation behavior
* Peak demand times
* Waste trends

### Output:

* Better recommendations
* Smart deal prioritization
* Future AI-based predictions

---

## ⚙️ Tech Stack

### Frontend

* React 18 / 19
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Axios

### Admin Dashboard

* React + Vite
* Tailwind CSS
* Firebase Authentication
* Context API

### Backend

* Python (REST API)

### Services

* Firebase (Auth, Firestore, Storage)
* Google Gemini (optional AI features)
* Razorpay (optional payments)

### DevOps

* Docker
* Docker Compose

---
---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

👉 Frontend will run at:

```
GreenPlate/
│
├── backend/                  # Python API server
│   ├── app/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/                 # User application
│   ├── Pages/
│   ├── Layouts/
│   ├── context/
│   ├── assets/
│   └── services/
│
├── admin-dashboard/          # Admin panel
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── context/
│
├── Dockerfile
├── compose.yaml
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-username/GreenPlate.git
cd GreenPlate
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Runs on:

```
http://localhost:8000
```

---

### 3. Frontend Setup

```bash
cd frontend
http://localhost:5173
```

---

### 4️⃣ Admin Dashboard (Optional)

```bash
cd admin-dashboard
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

### 4. Admin Dashboard Setup

```bash
cd admin-dashboard
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create `.env` file (frontend):
---

## 🌐 Environment Configuration

Create a `.env` file inside the **frontend** directory:

```env
VITE_API_URL=http://localhost:8000

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Optional
VITE_API_KEY=
VITE_RAZORPAY_KEY_ID=
```

---

## 📱 Mobile Support (Capacitor)

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npm run build
npx cap sync
npx cap open android
```

⚠️ Use local IP instead of `localhost` for mobile testing.

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

---

## 🔄 API Flow

```
User → Frontend → Backend API → Firebase
                         ↓
                    Response → UI
```

---

## 🔐 Security Considerations

* Firebase handles authentication securely
* Sensitive data via environment variables
* Role-based access control (admin)
* Backend validation required (partial)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit `.env` files to version control.

---

## 🐳 Docker Setup (Optional)

Run the entire project using Docker:

```bash
docker-compose up --build
```

---

## 📜 Available Scripts (Frontend)

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # TypeScript validation
```

---

## ⚠️ Known Issues

* Missing static assets (`vite.svg`, `react.svg`)
* Backend not fully production-ready
* Some features partially implemented:

  * AI analysis
  * Carbon tracking
* Admin student module incomplete

---

## 📈 Future Improvements

* AI-based food waste prediction
* Real-time notifications (WebSockets)
* Advanced queue optimization
* Full payment integration
* CI/CD deployment pipeline
* Some static assets (e.g., `react.svg`, `vite.svg`) may be missing
* Firebase setup is required manually
* Backend API endpoints may require additional configuration
* Certain features may be incomplete

---

## 🔒 Security Notes

* Do not expose API keys publicly
* Use environment variables for all sensitive configurations
* Validate all user inputs on backend

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "feat: add feature"
git push origin feature/your-feature
```

Open a Pull Request.
1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes
4. Push to your fork
5. Open a Pull Request

---

## 📄 License

MIT License

---


## 🌍 Vision

To build a **sustainable food ecosystem** where surplus food is efficiently redistributed using technology and behavioral incentives.

---

## 💡 Straight Talk

Now this is actually solid.

Before:

* Disconnected features
* No system thinking

Now:

* Clear architecture
* Real incentive model
* Scalable logic

Still missing (don’t ignore this):

* Deployment (this is BIG)
* API documentation
* Backend structure cleanup
This project is licensed under the terms specified in the LICENSE file.

---

## 🌍 Vision

GreenPlate aims to reduce food waste and promote sustainability by leveraging technology to connect surplus food with people who need it.

---

**Built with 💚 for a more sustainable future**


