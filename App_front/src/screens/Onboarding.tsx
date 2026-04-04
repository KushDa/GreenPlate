import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Leaf, ShoppingBag, Heart, Check } from 'lucide-react';
import { Logo } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface OnboardingProps {
  onComplete: () => void;
  key?: string;
}

const SLIDES = [
  {
    title: "Rescue Surplus Food",
    description: "Save high-quality food from local stores that would otherwise go to waste.",
    icon: Leaf,
    color: "bg-emerald-500"
  },
  {
    title: "Save Big Every Day",
    description: "Get your favorite meals and groceries at a fraction of the original price.",
    icon: ShoppingBag,
    color: "bg-forest-green"
  },
  {
    title: "Make an Impact",
    description: "Join a community of eco-warriors reducing CO2 emissions one plate at a time.",
    icon: Heart,
    color: "bg-rose-500"
  }
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    triggerHaptic(15);
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    triggerHaptic(10);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FFFA] dark:bg-charcoal flex flex-col overflow-hidden">
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center"
          >
            <div className={`w-28 h-28 ${SLIDES[currentSlide].color} rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-black/10 mb-10`}>
              {React.createElement(SLIDES[currentSlide].icon, { size: 48 })}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="text-secondary text-sm leading-relaxed max-w-[280px]">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex gap-2.5 mt-14">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-10 bg-vibrant-green shadow-lg shadow-vibrant-green/30' : 'w-2 bg-gray-200 dark:bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-10 flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="text-tertiary text-xs font-bold uppercase tracking-[0.2em]"
        >
          Skip
        </button>
        <button
          onClick={handleNext}
          className="btn-primary px-10"
        >
          {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          {currentSlide === SLIDES.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>

      <div className="absolute top-10 left-0 right-0 flex justify-center opacity-20">
        <Logo size={32} />
      </div>
    </div>
  );
};
