import { motion } from 'motion/react';
import { User, Settings, Bell, Shield, LogOut, ChevronRight, Heart, History, Store, Package, BarChart3 } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';

interface ProfileScreenProps {
  role?: 'user' | 'staff' | null;
}

const USER_MENU_ITEMS = [
  { id: '1', title: 'My Favorites', icon: Heart, color: 'text-rose-500' },
  { id: '2', title: 'Order History', icon: History, color: 'text-blue-500' },
  { id: '3', title: 'Notifications', icon: Bell, color: 'text-amber-500' },
  { id: '4', title: 'Privacy & Security', icon: Shield, color: 'text-emerald-500' },
  { id: '5', title: 'Settings', icon: Settings, color: 'text-gray-500' },
];

const STAFF_MENU_ITEMS = [
  { id: '1', title: 'Store Management', icon: Store, color: 'text-forest-green' },
  { id: '2', title: 'Inventory Control', icon: Package, color: 'text-amber-500' },
  { id: '3', title: 'Analytics Dashboard', icon: BarChart3, color: 'text-blue-500' },
  { id: '4', title: 'Staff Notifications', icon: Bell, color: 'text-rose-500' },
  { id: '5', title: 'Settings', icon: Settings, color: 'text-gray-500' },
];

export const ProfileScreen = ({ role = 'user' }: ProfileScreenProps) => {
  const { theme } = useTheme();
  const menuItems = role === 'staff' ? STAFF_MENU_ITEMS : USER_MENU_ITEMS;
  
  return (
    <div className="pt-20 pb-24 px-6 max-w-md mx-auto min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-4"
        >
          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white dark:border-white/10 shadow-xl">
            <img 
              src={role === 'staff' 
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" 
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"} 
              alt="User Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-forest-green dark:bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-2 border-white dark:border-charcoal shadow-lg">
            {role === 'staff' ? <Shield size={14} /> : <Settings size={14} />}
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-bold tracking-tight">
          {role === 'staff' ? 'Staff Member #42' : 'Susovan Chatterjee'}
        </h2>
        <p className="text-tertiary text-xs font-medium mt-1 uppercase tracking-widest">
          {role === 'staff' ? 'Store Administrator' : 'Eco-Warrior Level 4'}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {(role === 'staff' ? [
          { label: 'Sales', value: '₹1.2k', desc: 'Today' },
          { label: 'Rescued', value: '45kg', desc: 'This Week' },
          { label: 'Rating', value: '4.9', desc: 'Store' },
        ] : [
          { label: 'Saved', value: '12kg', desc: 'Food Waste' },
          { label: 'Impact', value: '34kg', desc: 'CO2 Offset' },
          { label: 'Orders', value: '28', desc: 'Total' },
        ]).map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3 rounded-[24px] text-center transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-white/5' 
                : 'bg-white card-shadow hover:shadow-lg hover:shadow-slate-200/50'
            }`}
          >
            <span className="block text-[8px] font-bold text-tertiary uppercase tracking-widest">{stat.label}</span>
            <span className="block text-lg font-bold text-forest-green dark:text-emerald-400 my-1">{stat.value}</span>
            <span className="block text-[8px] font-medium text-tertiary">{stat.desc}</span>
          </motion.div>
        ))}
      </div>

      {/* Menu List */}
      <div className={`rounded-[32px] overflow-hidden transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-white/5 border border-white/5' 
          : 'bg-white card-shadow'
      }`}>
        {menuItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            onClick={() => triggerHaptic(10)}
            className={`w-full flex items-center justify-between p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              i !== menuItems.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl bg-gray-50 dark:bg-white/5 ${item.color}`}>
                <item.icon size={18} />
              </div>
              <span className="text-sm font-bold">{item.title}</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </motion.button>
        ))}
      </div>

      {/* Logout */}
      <button 
        onClick={() => {
          triggerHaptic(20);
          window.location.reload();
        }}
        className="w-full mt-8 flex items-center justify-center gap-2 p-4 rounded-[24px] text-rose-500 font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};
