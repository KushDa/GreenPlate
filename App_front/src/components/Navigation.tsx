import React, { useState, createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ClipboardList, Tag, User, Sun, Moon, ShoppingCart } from 'lucide-react';
import { triggerHaptic } from '../lib/utils';
import { useCart } from '../lib/CartContext';

// --- Theme Context ---
// ... (rest of theme context)
type Theme = 'light' | 'dark';
const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen transition-colors duration-500">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// --- Logo Component ---
export const Logo = ({ size = 32, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A7D129" />
        <stop offset="100%" stopColor="#61B33B" />
      </linearGradient>
    </defs>
    {/* Outer Plate Circle */}
    <circle cx="50" cy="55" r="38" stroke="#8BC34A" strokeWidth="3.5" />
    {/* Inner Plate Circle */}
    <circle cx="50" cy="55" r="28" stroke="#8BC34A" strokeWidth="2.5" />
    
    {/* Leaf */}
    <g transform="translate(45, 10) rotate(15)">
      <path 
        d="M0 35C0 35 15 5 45 0C45 0 55 25 35 45C20 60 0 35 0 35Z" 
        fill="url(#leafGradient)" 
      />
      <path 
        d="M2 34C15 25 30 15 44 1" 
        stroke="white" 
        strokeWidth="1" 
        strokeOpacity="0.4"
      />
    </g>
  </svg>
);

// --- Human Tab Bar ---
type Tab = 'home' | 'orders' | 'deals' | 'profile';

interface TabItemProps {
  id: Tab;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabItem = ({ id, icon: Icon, label, isActive, onClick }: TabItemProps) => {
  const handleClick = () => {
    triggerHaptic(15);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center transition-all duration-300 rounded-2xl px-4 py-2 ${
        isActive 
          ? 'bg-vibrant-green text-white shadow-lg shadow-vibrant-green/20' 
          : 'text-secondary hover:text-slate-900 dark:text-gray-500 dark:hover:text-gray-300'
      }`}
    >
      <motion.div
        animate={{ scale: isActive ? 1.05 : 1 }}
        className="flex items-center gap-2"
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        <AnimatePresence>
          {isActive && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="text-[10px] font-bold uppercase tracking-wider overflow-hidden whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};

export const TabBar = ({ activeTab, onTabChange }: { activeTab: Tab, onTabChange: (tab: Tab) => void }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`max-w-[360px] mx-auto h-16 rounded-[28px] flex items-center justify-between px-2 pointer-events-auto shadow-2xl ${
          theme === 'dark' 
            ? 'glass-dark bg-black/80 border-white/10' 
            : 'glass bg-white/90 border-slate-200/50'
        }`}
      >
        <TabItem id="home" icon={Home} label="Home" isActive={activeTab === 'home'} onClick={() => onTabChange('home')} />
        <TabItem id="orders" icon={ClipboardList} label="Orders" isActive={activeTab === 'orders'} onClick={() => onTabChange('orders')} />
        <TabItem id="deals" icon={Tag} label="Deals" isActive={activeTab === 'deals'} onClick={() => onTabChange('deals')} />
        <TabItem id="profile" icon={User} label="Profile" isActive={activeTab === 'profile'} onClick={() => onTabChange('profile')} />
      </motion.div>
    </div>
  );
};

// --- Header ---
export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  
  return (
    <header className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40 backdrop-blur-md transition-all duration-300 ${
      theme === 'dark' ? 'bg-black/20 border-b border-white/5' : 'bg-white/70 border-b border-slate-200/50'
    }`}>
      <div className="flex items-center gap-2">
        <Logo size={32} />
        <div className="flex flex-col -gap-1">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">GreenPlate</h1>
          <span className="text-[7px] font-bold uppercase tracking-widest text-tertiary dark:text-emerald-500/60">the time saver that you need</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => triggerHaptic(10)}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <ShoppingCart size={20} />
          </button>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-lg"
              >
                {cartCount}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => {
            triggerHaptic(10);
            toggleTheme();
          }}
          className={`p-2 rounded-full transition-colors ${
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};
