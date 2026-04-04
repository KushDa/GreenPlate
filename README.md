
# 🌱 GreenPlate

**Sustainable Food Waste Reduction Platform**

A React-based mobile application that connects students and staff with surplus cafeteria food, reducing waste and promoting sustainability.

## ✨ Features

- 🍽️ Browse available surplus food deals from campus cafeterias
- 🎯 Reserve meals at discounted prices
- 📍 Interactive cafeteria map view
- 👨‍🍳 Staff interface for posting food deals
- 🤖 AI-powered food analysis using Google Gemini
- 📊 Track carbon footprint savings
- 🎨 Beautiful animations with Framer Motion
- 📱 Mobile-first responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# App will open automatically at http://localhost:5000
```

## 🛠️ Tech Stack

- **React 18** - UI framework with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Google Generative AI** - AI-powered food analysis
- **Firebase** - Authentication and database
- **Axios** - HTTP client for API requests

## 📂 Project Structure

```
frontend/
├── Pages/              # Page components
│   ├── Auth.tsx        # User authentication & login
│   ├── UserHome.tsx    # User dashboard & food deals
│   ├── StaffDashboard.tsx # Staff interface
│   ├── CreatePost.tsx  # Create new food deal post
│   ├── DealDetails.tsx # View deal information
│   ├── MyOrder.tsx     # User's reservations
│   ├── IncomingReservations.tsx # Staff incoming orders
│   ├── MapView.tsx     # Cafeteria location map
│   ├── QueueManager.tsx # Queue management
│   ├── Profile.tsx     # User profile
│   ├── Onboarding.tsx  # App onboarding flow
│   └── Splash.tsx      # Splash screen
├── Layouts/            # Layout wrappers
│   ├── UserLayout.tsx  # User layout
│   ├── StaffLayout.tsx # Staff layout
│   └── StudentLayout.tsx # Student layout
├── context/            # React context (state)
│   └── AppContext.tsx  # Global app state
```

## 🎯 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_google_gemini_api_key
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🆘 Support

Having issues? Check:
- [DEPENDENCIES.md](./DEPENDENCIES.md) for dependency info
- Project issues on GitHub

---

**Built with 💚 for a sustainable future**

