import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ChevronRight, Sparkles, TrendingDown, Zap } from 'lucide-react';
// Make sure this path matches your folder name (assests vs assets)
import logoPng from '../assests/GreenPlate.png'; 

const Splash: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [stage, setStage] = useState<'branding' | 'ecosystem'>('branding');

  useEffect(() => {
    // 3 seconds total duration for splash
    const timer = setTimeout(() => setStage('ecosystem'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        {stage === 'branding' ? (
          <motion.div 
            key="branding"
            // 1. Simple Fade In
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // 2. Simple Fade Out when transitioning to app
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} 
            className="flex-1 flex flex-col items-center justify-center z-10"
          >
            {/* Logo Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-44 h-44 flex items-center justify-center mb-6 relative"
            >
              {/* Gentle Floating Animation (Optional - keep for polish) */}
              <motion.img 
                src={logoPng} 
                alt="GreenPlate Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>

            {/* App Name - Synced with Logo */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // Small delay (0.1) so it feels natural, but basically simultaneous
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl font-black text-gray-900 tracking-tighter"
            >
              GreenPlate
            </motion.h1>
            
            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-3 mt-6 bg-green-50 px-4 py-1.5 rounded-full border border-green-100"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-green-600 font-black uppercase tracking-[0.4em] text-[9px]">
                Syncing Environment
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="ecosystem"
            // Simple fade in for the main app screen
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col p-10 pt-16 z-10 bg-[#FDFDFD]"
          >
            <header className="flex items-center justify-between mb-16">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(22,163,74,0.2)]">
                    <Leaf className="text-white fill-current" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Terminal</h2>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1 block">Surplus Marketplace</span>
                  </div>
               </div>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-10">
               <RevealCard delay={0.1} icon={<Sparkles size={22} className="text-blue-500" />} title="AI Nutrition" color="bg-white" />
               <RevealCard delay={0.2} icon={<TrendingDown size={22} className="text-green-600" />} title="70% Surplus" color="bg-white" />
               <RevealCard delay={0.3} icon={<Zap size={22} className="text-orange-500" />} title="Instant Claim" color="bg-green-600" isFull />
            </div>

            <div className="mt-auto">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={onFinish}
                className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-[0_25px_60px_rgba(0,0,0,0.15)] group transition-all"
              >
                Access Hub
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mt-10">
                Secure • Verified • Green
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RevealCard: React.FC<{ delay: number; icon: React.ReactNode; title: string; color: string; isFull?: boolean }> = ({ delay, icon, title, color, isFull }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className={`${isFull ? 'col-span-2 h-32' : 'col-span-1 h-36'} ${color} p-7 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between shadow-sm`}
  >
    <div className={`w-12 h-12 ${color === 'bg-green-600' ? 'bg-white/10' : 'bg-gray-50'} rounded-2xl flex items-center justify-center`}>
      {icon}
    </div>
    <h4 className={`text-xl font-black tracking-tighter leading-none ${color === 'bg-green-600' ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
  </motion.div>
);

export default Splash;