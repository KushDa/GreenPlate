import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListChecks, Clock, CheckCircle2, AlertCircle, ArrowLeft, Search, Filter, User } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface Reservation {
  id: string;
  customerName: string;
  itemName: string;
  status: 'pending' | 'ready' | 'completed';
  time: string;
}

const MOCK_RESERVATIONS: Reservation[] = [
  { id: 'RES-001', customerName: 'Susovan Chatterjee', itemName: 'Artisan Sourdough', status: 'pending', time: '10:30 AM' },
  { id: 'RES-002', customerName: 'John Doe', itemName: 'Mixed Berry Tart', status: 'ready', time: '11:15 AM' },
  { id: 'RES-003', customerName: 'Jane Smith', itemName: 'Sushi Platter', status: 'pending', time: '12:00 PM' },
  { id: 'RES-004', customerName: 'Alice Brown', itemName: 'Garden Salad Bowl', status: 'completed', time: '09:45 AM' },
];

export const QueueManager = ({ onBack }: { onBack: () => void }) => {
  const { theme } = useTheme();
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);

  const updateStatus = (id: string, newStatus: 'pending' | 'ready' | 'completed') => {
    triggerHaptic(15);
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status: newStatus } : res));
  };

  return (
    <div className="pt-24 pb-24 px-6 max-w-md mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            triggerHaptic(10);
            onBack();
          }}
          className={`p-3 rounded-2xl transition-all ${
            theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-sm hover:shadow-md'
          }`}
        >
          <ArrowLeft size={20} className="text-forest-green dark:text-emerald-400" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Queue Manager</h1>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-8">
        <div className={`flex-1 flex items-center gap-3 p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
          <Search size={18} className="text-tertiary" />
          <input type="text" placeholder="Search customer..." className="bg-transparent border-none outline-none flex-1 text-xs font-medium" />
        </div>
        <button className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
          <Filter size={18} className="text-forest-green dark:text-emerald-400" />
        </button>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {reservations.map((res, i) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-[32px] flex flex-col gap-4 ${
              theme === 'dark' ? 'bg-white/5' : 'bg-white shadow-xl shadow-forest-green/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-forest-green dark:text-emerald-400">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">{res.customerName}</h3>
                  <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">{res.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">{res.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Item</span>
                <span className="text-xs font-bold text-forest-green dark:text-emerald-400">{res.itemName}</span>
              </div>
              
              <div className="flex gap-2">
                {res.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(res.id, 'ready')}
                    className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    Mark Ready
                  </button>
                )}
                {res.status === 'ready' && (
                  <button
                    onClick={() => updateStatus(res.id, 'completed')}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                  >
                    Complete
                  </button>
                )}
                {res.status === 'completed' && (
                  <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    Picked Up
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
