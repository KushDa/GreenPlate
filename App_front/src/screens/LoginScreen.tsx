import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ShieldCheck, ArrowRight, Mail, Lock } from 'lucide-react';
import { Logo, useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface LoginScreenProps {
  onLogin: (role: 'user' | 'staff') => void;
  key?: string;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [role, setRole] = useState<'user' | 'staff'>('user');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { theme } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate login delay
    setTimeout(() => {
      onLogin(role);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#F8FFFA]/80 dark:bg-charcoal/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 overflow-y-auto no-scrollbar"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Logo size={48} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-forest-green dark:text-emerald-400">GreenPlate</h1>
        <p className="text-forest-green dark:text-emerald-500/60 text-[8px] font-bold uppercase tracking-[0.2em] mt-1 mb-2">the time saver that you need</p>
        <p className="text-secondary text-sm">Join the movement to reduce food waste.</p>
      </motion.div>

      {/* Role Selector - Minimalist Segmented Style */}
      <div className="relative flex items-center justify-center mb-10 w-full max-w-[240px]">
        <div className={`flex items-center w-full p-1 rounded-full ${
          theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => {
              triggerHaptic(10);
              setRole('user');
            }}
            className={`flex-1 py-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${
              role === 'user'
                ? 'bg-white dark:bg-emerald-500 text-forest-green dark:text-white shadow-sm'
                : 'text-secondary'
            }`}
          >
            <User size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">User</span>
          </button>
          
          <div className="w-[1px] h-4 bg-gray-300 dark:bg-white/10 mx-1" />
          
          <button
            onClick={() => {
              triggerHaptic(10);
              setRole('staff');
            }}
            className={`flex-1 py-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${
              role === 'staff'
                ? 'bg-white dark:bg-emerald-500 text-forest-green dark:text-white shadow-sm'
                : 'text-secondary'
            }`}
          >
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Staff</span>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
        <div className="relative">
          <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary" />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="input-field pl-14"
          />
        </div>

        <div className="relative">
          <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary" />
          <input
            type="password"
            placeholder="Password"
            required
            className="input-field pl-14"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => triggerHaptic(20)}
          disabled={isLoggingIn}
          className="btn-primary w-full mt-2"
        >
          {isLoggingIn ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              Login as {role === 'user' ? 'User' : 'Staff'}
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-secondary text-xs">
          Don't have an account? <span className="text-forest-green dark:text-emerald-400 font-bold cursor-pointer">Sign Up</span>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary dark:text-white/10"
      >
        GreenPlate v1.0.4
      </motion.div>
    </motion.div>
  );
};
