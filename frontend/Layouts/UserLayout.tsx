import React, { useState } from 'react';
import { Home, Receipt, User as UserIcon } from 'lucide-react'; 
import MyOrders from '../Pages/MyOrder';
import Profile from '../Pages/Profile';
import { motion} from 'framer-motion'; 
import GreenPlateLogo from '../assets/GreenPlate.png'; 

// 1. Import Auth to get the current user// Optional: if you store user data here too
import UserHome from '../Pages/Userhome';
import { auth } from '../src/firebaseConfig';

const UserLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'profile'>('home');

  // 2. Get Current User
  const user = auth.currentUser;
  
  // 3. Generate the dynamic avatar URL based on email (fallback to 'User' if null)
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'User'}`;

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white z-20">
        <div className="flex items-center gap-2"> 
          <div 
            className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
          >
            GP
          </div>

          <span style={{ fontFamily: 'Geom' }} className="font-bold text-xl text-gray-900 mt-1"> 
            GreenPlate
          </span>
        </div>
        
        {/* 4. Use the dynamic 'avatarUrl' here */}
        <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative bg-gray-50">
        
        {/* 1. HOME: Keep using CSS toggle (hidden/block) to save its state/loading */}
        <div className={`h-full w-full ${activeTab === 'home' ? 'block' : 'hidden'}`}>
           <UserHome />
        </div>

        {/* 2. ORDERS: Use Conditional Rendering (&&) to force it to play the entry animation every time */}
        {activeTab === 'orders' && (
           <div className="h-full w-full">
              <MyOrders />
           </div>
        )}

        {/* 3. PROFILE: Keep using CSS toggle to save its state/loading */}
        <div className={`h-full w-full ${activeTab === 'profile' ? 'block' : 'hidden'}`}>
           <Profile />
        </div>

      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-gray-100 bg-white px-6 py-2 safe-area-bottom z-20">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <NavButton
            icon={<Home size={22} strokeWidth={2.5} />}
            label="Home"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavButton
            icon={<Receipt size={22} strokeWidth={2.5} />}
            label="Orders"
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
          />
          <NavButton
            icon={<UserIcon size={22} strokeWidth={2.5} />}
            label="Profile"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 py-2 px-4 relative"
  >
    <div className={`transition-colors duration-200 ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span
      style={{ fontFamily: 'Mona Sans' }}
      className={`text-[10px] font-medium transition-colors duration-200 ${
        active ? 'text-emerald-600' : 'text-gray-400'
      }`}
    >
      {label}
    </span>
    {active && (
      <motion.div
        layoutId="nav-indicator"
        className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"
      />
    )}
  </button>
);

export default UserLayout;