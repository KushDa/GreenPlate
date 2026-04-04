
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import Splash from './Pages/Splash';
import Auth from './Pages/Auth';
import UserLayout from './Layouts/UserLayout';
import StaffLayout from './Layouts/StaffLayout';
import { AnimatePresence, motion } from 'framer-motion';

const SmoothBackground: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#FDFDFD]">
    {/* Optimized Light Orbs */}
    <motion.div 
      animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-20%] left-[-10%] w-[150%] aspect-square bg-green-200/40 rounded-full blur-[100px]" 
    />
    <motion.div 
      animate={{ opacity: [0.1, 0.15, 0.1], scale: [1.1, 1, 1.1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-20%] right-[-10%] w-[120%] aspect-square bg-emerald-100/30 rounded-full blur-[80px]" 
    />
  </div>
);

const NavigationHandler: React.FC = () => {
  const { userRole, isVerified, setOnboarded } = useApp();
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <Splash onFinish={() => {
      setShowIntro(false);
      setOnboarded(true);
    }} />;
  }

  return (
    <AnimatePresence mode="wait">
      {!userRole ? (
        <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full">
          <Auth />
        </motion.div>
      ) : !isVerified ? (
        <motion.div key="verify" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="h-full">
          <Auth verifyOnly />
        </motion.div>
      ) : userRole === UserRole.USER ? (
        <motion.div key="user" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
          <UserLayout />
        </motion.div>
      ) : (
        <motion.div key="staff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
          <StaffLayout />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="max-w-md mx-auto h-screen bg-white overflow-hidden relative flex flex-col border-x border-gray-100 shadow-2xl">
        <SmoothBackground />
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          <NavigationHandler />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
