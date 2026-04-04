import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, Clock, MapPin, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface Order {
  id: string;
  itemName: string;
  storeName: string;
  price: number;
  status: 'pending' | 'ready' | 'completed' | 'cancelled';
  time: string;
  image: string;
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', itemName: 'Artisan Sourdough', storeName: 'The Daily Bread', price: 4.5, status: 'ready', time: 'Today, 10:30 AM', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=400&fit=crop' },
  { id: 'ORD-002', itemName: 'Mixed Berry Tart', storeName: 'Sweet Delights', price: 3.2, status: 'completed', time: 'Yesterday, 4:15 PM', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop' },
  { id: 'ORD-003', itemName: 'Sushi Platter', storeName: 'Zen Garden', price: 12.0, status: 'pending', time: 'Today, 12:00 PM', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop' },
];

const OrderCard = ({ order, index }: { order: Order, index: number, key?: string }) => {
  const { theme } = useTheme();
  
  const statusColors = {
    pending: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
    ready: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
    completed: 'text-secondary bg-gray-50 dark:bg-white/5',
    cancelled: 'text-red-500 bg-red-50 dark:bg-red-500/10',
  };

  const statusIcons = {
    pending: <Clock size={12} />,
    ready: <AlertCircle size={12} />,
    completed: <CheckCircle2 size={12} />,
    cancelled: <AlertCircle size={12} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-[28px] flex flex-col gap-4 transition-all duration-300 ${
        theme === 'dark' 
          ? 'glass-dark bg-white/5' 
          : 'bg-white card-shadow hover:shadow-lg hover:shadow-slate-200/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
          <img src={order.image} alt={order.itemName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm truncate">{order.itemName}</h3>
            <span className="text-[10px] font-bold text-tertiary">{order.id}</span>
          </div>
          <p className="text-[11px] text-secondary mt-0.5">{order.storeName}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
              {statusIcons[order.status]}
              {order.status}
            </div>
            <span className="text-[10px] text-tertiary">{order.time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-tertiary">Total:</span>
          <span className="text-sm font-bold text-forest-green dark:text-emerald-400">₹{order.price.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => triggerHaptic(10)}
          className="flex items-center gap-1 text-[10px] font-bold text-forest-green dark:text-emerald-400 hover:opacity-80 transition-opacity"
        >
          View Details
          <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
};

export const OrdersScreen = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

  return (
    <div className="pt-24 pb-24 px-4 max-w-md mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-forest-green dark:text-white">Your Orders</h1>
        <p className="text-secondary text-sm mt-1">Track your sustainable food rescues.</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'active', 'past'].map((f) => (
          <button
            key={f}
            onClick={() => {
              triggerHaptic(10);
              setFilter(f as any);
            }}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              filter === f
                ? 'bg-vibrant-green text-white shadow-lg shadow-vibrant-green/20'
                : theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-white text-secondary card-shadow'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_ORDERS.map((order, index) => (
          <OrderCard key={order.id} order={order} index={index} />
        ))}
      </div>

      {/* Empty State Illustration Placeholder */}
      {MOCK_ORDERS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <ShoppingBag size={64} className="text-tertiary mb-4" />
          <p className="text-sm font-bold text-secondary">No orders yet</p>
          <p className="text-xs text-tertiary mt-1">Start saving food to see them here!</p>
        </div>
      )}
    </div>
  );
};
