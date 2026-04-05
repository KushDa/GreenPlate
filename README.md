# 🌱 GreenPlate

**A Full-Stack Sustainable Food Waste Reduction Platform**

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

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

👉 Frontend will run at:

```
http://localhost:5173
```

---

### 4️⃣ Admin Dashboard (Optional)

```bash
cd admin-dashboard
npm install
npm run dev
```

---

## 🌐 Environment Configuration

Create a `.env` file inside the **frontend** directory:

```env
VITE_API_URL=http://localhost:8000

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

This project is licensed under the terms specified in the LICENSE file.

---

## 🌍 Vision

GreenPlate aims to reduce food waste and promote sustainability by leveraging technology to connect surplus food with people who need it.

---

**Built with 💚 for a more sustainable future**


