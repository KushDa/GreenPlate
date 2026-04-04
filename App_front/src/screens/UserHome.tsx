import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Search, Filter, ShoppingBag, Clock, MapPin, Star, Loader2 } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  distance: string;
  rating: number;
  timeRemaining: string;
}

const MOCK_ITEMS: FoodItem[] = [
  { id: '1', name: 'Artisan Sourdough', price: 4.5, originalPrice: 9.0, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', distance: '0.8 km', rating: 4.8, timeRemaining: '45m' },
  { id: '2', name: 'Mixed Berry Tart', price: 3.2, originalPrice: 7.5, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', distance: '1.2 km', rating: 4.5, timeRemaining: '1h 20m' },
  { id: '3', name: 'Garden Salad Bowl', price: 5.0, originalPrice: 12.0, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', distance: '0.5 km', rating: 4.9, timeRemaining: '30m' },
  { id: '4', name: 'Gourmet Cupcakes', price: 6.5, originalPrice: 15.0, image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop', distance: '2.1 km', rating: 4.7, timeRemaining: '2h' },
  { id: '5', name: 'Sushi Platter', price: 12.0, originalPrice: 28.0, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop', distance: '1.5 km', rating: 4.6, timeRemaining: '15m' },
  { id: '6', name: 'Organic Fruit Box', price: 8.0, originalPrice: 18.0, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop', distance: '3.0 km', rating: 4.4, timeRemaining: '3h' },
];

const FoodCard = ({ item, index, onClick }: { item: FoodItem, index: number, onClick: (item: FoodItem) => void, key?: string }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        triggerHaptic(10);
        onClick(item);
      }}
      className={`p-3 rounded-[24px] flex items-center gap-4 cursor-pointer transition-all duration-300 ${
        theme === 'dark' 
          ? 'glass-dark bg-white/5 border-white/5' 
          : 'bg-white card-shadow hover:shadow-lg hover:shadow-slate-200/50'
      }`}
    >
      {/* Small Square Image */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-[16px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-1 right-1 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
          -50%
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm truncate pr-2">{item.name}</h3>
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold">{item.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-1 text-[10px] text-secondary">
          <div className="flex items-center gap-1">
            <MapPin size={10} />
            <span>{item.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} />
            <span>{item.timeRemaining}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-forest-green dark:text-emerald-400">₹{item.price.toFixed(2)}</span>
            <span className="text-[10px] text-tertiary line-through">₹{item.originalPrice.toFixed(2)}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic(15);
            }}
            className="bg-forest-green dark:bg-emerald-500 text-white p-1.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const UserHome = ({ onItemClick }: { onItemClick: (item: FoodItem) => void }) => {
  const [items] = useState<FoodItem[]>(MOCK_ITEMS);
  const { theme } = useTheme();
  
  return (
    <div className="pt-20 pb-24 px-4 max-w-md mx-auto">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6"
      >
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-tertiary" />
        <input
          type="text"
          placeholder="Search surplus food near you..."
          className="input-field pl-14 pr-14"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2">
          <Filter size={20} className="text-vibrant-green" />
        </div>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {['All', 'Bakery', 'Meals', 'Groceries', 'Desserts'].map((cat, i) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => triggerHaptic(10)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
              i === 0 
                ? 'bg-vibrant-green text-white shadow-lg shadow-vibrant-green/20' 
                : theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-white text-secondary card-shadow'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Food List */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold tracking-tight">Available Surplus Food</h2>
          <span className="text-xs font-bold text-forest-green dark:text-emerald-400">View All</span>
        </div>
        
        {items.map((item, index) => (
          <FoodCard key={item.id} item={item} index={index % 6} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
};
