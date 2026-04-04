import React, { useState } from 'react';
import { LayoutDashboard, User, Plus, ChefHat, PackageCheck } from 'lucide-react';
import StaffDashboard from '../Pages/StaffDashboard';
import QueueManager from '../Pages/QueueManager';
import IncomingReservations from '../Pages/IncomingReservations';
import Profile from '../Pages/Profile';
import CreatePost from '../Pages/CreatePost';
import { motion, AnimatePresence } from 'framer-motion';
import GreenPlateLogo from '/assests/GreenPlate.png';

const StaffLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'pickup' | 'profile'>('dashboard');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <StaffDashboard />;
      case 'queue': return <QueueManager />;
      case 'pickup': return <IncomingReservations />;
      case 'profile': return <Profile />;
      default: return <StaffDashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={22} strokeWidth={2} /> },
    { id: 'queue', label: 'Kitchen', icon: <ChefHat size={22} strokeWidth={2} /> },
    { id: 'pickup', label: 'Pickup', icon: <PackageCheck size={22} strokeWidth={2} /> },
    { id: 'profile', label: 'Profile', icon: <User size={22} strokeWidth={2} /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">

      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white z-20">
        <div className="flex items-center gap-2"> 
          <img 
            src={GreenPlateLogo} 
            alt="GreenPlate Logo" 
            className="w-10 h-10 object-contain" 
          />

          <span style={{ fontFamily: 'Geom' }} className="font-bold text-xl text-gray-900 mt-1"> 
            GreenPlate
          </span>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* 2. Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}
      </AnimatePresence>

      {/* 3. Floating Action Button (Raised above navbar) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-300 z-40"
        aria-label="Create new post"
      >
        <Plus size={26} strokeWidth={2.5} />
      </motion.button>

      {/* 4. Minimalist Bottom "Box" Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-5 z-50 flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className="relative flex flex-col items-center justify-center w-16 h-14 group"
            >
              {/* Active Background Pill Animation */}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-emerald-50 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon */}
              <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>

              {/* Label (Optional: Remove this span if you want ONLY icons) */}
              <span 
                className={`relative z-10 text-[10px] font-bold mt-1 transition-all duration-300 ${
                  isActive ? 'text-emerald-700 translate-y-0 opacity-100' : 'text-gray-400 translate-y-1 opacity-0'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );
};

export default StaffLayout;