import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Clock, MapPin, Star, Heart, Share2, ShieldCheck, Leaf } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface DealDetailsProps {
  item: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    distance: string;
    rating: number;
    timeRemaining: string;
  };
  onBack: () => void;
}

export const DealDetails = ({ item, onBack }: DealDetailsProps) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FFFA] dark:bg-charcoal flex flex-col overflow-y-auto no-scrollbar">
      {/* Hero Image Section */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Top Controls */}
        <div className="absolute top-10 left-0 right-0 px-6 flex items-center justify-between">
          <button
            onClick={() => {
              triggerHaptic(10);
              onBack();
            }}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-900 shadow-xl"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-3">
            <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
              <Heart size={24} />
            </button>
            <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        {/* Discount Badge */}
        <div className="absolute bottom-6 left-6 bg-vibrant-green text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl shadow-vibrant-green/20">
          Save {Math.round((1 - item.price / item.originalPrice) * 100)}%
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 -mt-10 bg-[#F8FFFA] dark:bg-charcoal rounded-t-[48px] relative z-10 shadow-2xl shadow-black/20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{item.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-tertiary text-sm">
              <MapPin size={14} />
              <span>{item.distance} away • The Daily Bread</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-bold">{item.rating}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-[24px] text-center transition-all duration-300 ${theme === 'dark' ? 'bg-white/5' : 'bg-white card-shadow'}`}>
            <Clock size={16} className="mx-auto mb-2 text-vibrant-green" />
            <span className="block text-[10px] font-bold text-tertiary uppercase tracking-widest">Ends In</span>
            <span className="block text-sm font-bold mt-1">{item.timeRemaining}</span>
          </div>
          <div className={`p-4 rounded-[24px] text-center transition-all duration-300 ${theme === 'dark' ? 'bg-white/5' : 'bg-white card-shadow'}`}>
            <ShieldCheck size={16} className="mx-auto mb-2 text-blue-500" />
            <span className="block text-[10px] font-bold text-tertiary uppercase tracking-widest">Quality</span>
            <span className="block text-sm font-bold mt-1">Verified</span>
          </div>
          <div className={`p-4 rounded-[24px] text-center transition-all duration-300 ${theme === 'dark' ? 'bg-white/5' : 'bg-white card-shadow'}`}>
            <Leaf size={16} className="mx-auto mb-2 text-vibrant-green" />
            <span className="block text-[10px] font-bold text-tertiary uppercase tracking-widest">Impact</span>
            <span className="block text-sm font-bold mt-1">Eco-Friendly</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold tracking-tight mb-3">Description</h3>
          <p className="text-secondary text-sm leading-relaxed">
            Freshly baked artisan sourdough bread made with organic ingredients. Perfect for sandwiches or as a side for your favorite soup. Rescuing this item saves approximately 0.5kg of CO2 emissions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-tertiary line-through">₹{item.originalPrice.toFixed(2)}</span>
            <span className="text-2xl font-bold text-vibrant-green">₹{item.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => triggerHaptic(20)}
            className="btn-primary px-10"
          >
            Add to Bag
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
