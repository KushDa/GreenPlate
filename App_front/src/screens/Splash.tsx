import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Navigation';

export const SplashScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#F8FFFA] dark:bg-charcoal flex flex-col items-center justify-center overflow-hidden"
    >
      {/* App Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative mb-12"
      >
        <div className="w-44 h-44 bg-white dark:bg-emerald-900/20 rounded-[48px] flex items-center justify-center shadow-xl card-shadow">
          <Logo size={120} />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 border-2 border-dashed border-vibrant-green/20 rounded-[60px]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <h1 className="text-slate-900 dark:text-emerald-400 text-5xl font-bold tracking-tighter">GreenPlate</h1>
        <p className="text-vibrant-green text-[10px] font-bold uppercase tracking-[0.3em] mt-1 mb-4">the time saver that you need</p>
        <p className="text-secondary text-sm font-medium max-w-[240px] mx-auto">Reducing food waste, one delicious plate at a time.</p>
      </motion.div>

      {/* Buffer Line (Progress Bar) */}
      <div className="absolute bottom-32 w-64 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-vibrant-green shadow-[0_0_15px_rgba(0,200,83,0.4)]"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-24 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary"
      >
        Initializing... {progress}%
      </motion.p>
    </motion.div>
  );
};
