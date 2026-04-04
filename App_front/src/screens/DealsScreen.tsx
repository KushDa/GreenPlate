import { motion } from 'motion/react';
import { Tag, Gift, Zap, ArrowRight, ShoppingCart } from 'lucide-react';
import { useTheme } from '../components/Navigation';
import { triggerHaptic } from '../lib/utils';
import { useCart } from '../lib/CartContext';

const DEALS = [
  { id: '1', title: 'Buy 1 Get 1 Free', desc: 'On all bakery items after 6 PM', icon: Gift, color: 'bg-rose-500' },
  { id: '2', title: 'Flash Sale: 70% Off', desc: 'Selected organic fruit boxes', icon: Zap, color: 'bg-amber-500' },
  { id: '3', title: 'Zero Waste Hero', desc: 'Get 50 points for your next order', icon: Tag, color: 'bg-emerald-500' },
];

export const DealsScreen = () => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  
  return (
    <div className="pt-20 pb-24 px-6 max-w-md mx-auto min-h-screen">
      <h2 className="text-3xl font-bold tracking-tight mb-2">Flash Deals</h2>
      <p className="text-secondary text-sm mb-8">Exclusive offers on surplus food.</p>

      <div className="flex flex-col gap-6">
        {DEALS.map((deal, i) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-[32px] relative overflow-hidden flex flex-col gap-4 transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-white/5 border border-white/5' 
                : 'bg-white card-shadow hover:shadow-lg hover:shadow-slate-200/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className={`${deal.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <deal.icon size={24} />
              </div>
              <button
                onClick={() => {
                  triggerHaptic(15);
                  addToCart({ id: deal.id, title: deal.title });
                }}
                className="bg-forest-green dark:bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Rescue Deal</span>
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-bold">{deal.title}</h3>
              <p className="text-xs text-tertiary mt-1">{deal.desc}</p>
            </div>

            <button 
              onClick={() => triggerHaptic(15)}
              className="flex items-center gap-2 text-xs font-bold text-forest-green dark:text-emerald-400 mt-2 group"
            >
              Claim Now
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Decorative Circle */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${deal.color}`} />
          </motion.div>
        ))}
      </div>

    </div>
  );
};
