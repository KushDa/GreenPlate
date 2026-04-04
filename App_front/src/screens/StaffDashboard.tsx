import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Package, Users, TrendingUp, Plus, ListChecks, Settings, Bell } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';
import { CreatePost } from './CreatePost';
import { QueueManager } from './QueueManager';

const STATS = [
  { label: 'Total Sales', value: '₹4,250', change: '+12%', icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'Rescued', value: '128kg', change: '+5%', icon: Package, color: 'text-amber-500' },
  { label: 'Active Users', value: '842', change: '+18%', icon: Users, color: 'text-blue-500' },
];

const QUICK_ACTIONS = [
  { id: 'add', label: 'Add Item', icon: Plus, color: 'bg-emerald-500' },
  { id: 'queue', label: 'Manage Queue', icon: ListChecks, color: 'bg-forest-green' },
  { id: 'alerts', label: 'Alerts', icon: Bell, color: 'bg-rose-500' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500' },
];

export const StaffDashboard = () => {
  const { theme } = useTheme();
  const [view, setView] = useState<'dashboard' | 'add' | 'queue'>('dashboard');

  if (view === 'add') return <CreatePost onBack={() => setView('dashboard')} />;
  if (view === 'queue') return <QueueManager onBack={() => setView('dashboard')} />;

  return (
    <div className="pt-24 pb-24 px-6 max-w-md mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-forest-green dark:text-white">Staff Dashboard</h1>
        <p className="text-secondary text-sm mt-1">Manage food rescues and orders.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-[32px] flex items-center justify-between transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-white/5 border border-white/5' 
                : 'bg-white card-shadow hover:shadow-lg hover:shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">{stat.label}</span>
                <span className="block text-2xl font-bold mt-1">{stat.value}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-500">{stat.change}</span>
              <span className="block text-[8px] text-tertiary uppercase tracking-widest mt-1">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold tracking-tight mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic(15);
              if (action.id === 'add') setView('add');
              if (action.id === 'queue') setView('queue');
            }}
            className={`p-6 rounded-[32px] flex flex-col items-center gap-3 text-center transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-white/5 hover:bg-white/10 border border-white/5' 
                : 'bg-white card-shadow hover:shadow-lg hover:shadow-slate-200/50'
            }`}
          >
            <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <action.icon size={24} />
            </div>
            <span className="text-xs font-bold tracking-tight">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className={`p-6 rounded-[32px] ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold tracking-tight">Recent Activity</h3>
          <BarChart3 size={16} className="text-tertiary" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <p className="text-[11px] font-medium">New order #ORD-00{i+4} received</p>
                <p className="text-[9px] text-tertiary">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
