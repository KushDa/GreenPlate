import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Plus, ArrowLeft, ShoppingBag, Clock, MapPin, Tag } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface CreatePostProps {
  onBack: () => void;
}

export const CreatePost = ({ onBack }: CreatePostProps) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(20);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="pt-24 pb-24 px-6 max-w-md mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            triggerHaptic(10);
            onBack();
          }}
          className={`p-3 rounded-2xl transition-all duration-300 ${
            theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white card-shadow hover:shadow-md'
          }`}
        >
          <ArrowLeft size={20} className="text-vibrant-green" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Create Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Placeholder */}
        <div className={`w-full aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all ${
          theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
        }`}>
          <div className="w-16 h-16 bg-forest-green dark:bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Camera size={32} />
          </div>
          <p className="text-xs font-bold text-tertiary uppercase tracking-widest">Upload Product Image</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <ShoppingBag size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="text"
              placeholder="Product Name"
              required
              className="input-field pl-14"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Tag size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary" />
              <input
                type="number"
                placeholder="Price (₹)"
                required
                className="input-field pl-14"
              />
            </div>
            <div className="relative flex-1">
              <Tag size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary opacity-50" />
              <input
                type="number"
                placeholder="Old Price (₹)"
                required
                className="input-field pl-14"
              />
            </div>
          </div>

          <div className="relative">
            <Clock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="text"
              placeholder="Available Until (e.g., 2h)"
              required
              className="input-field pl-14"
            />
          </div>

          <div className="relative">
            <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="text"
              placeholder="Store Location"
              required
              className="input-field pl-14"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              Publish Surplus Item
              <Plus size={18} />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};
