
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Zap, 
  Target, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  TrendingDown, 
  Globe, 
  Clock,
  Apple
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Onboarding: React.FC = () => {
  const { setOnboarded } = useApp();

  return (
    <div className="h-full flex flex-col bg-[#FDFDFD] overflow-y-auto hide-scrollbar relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-5%] right-[-10%] w-72 h-72 bg-green-200/30 rounded-full blur-[80px]" />
      <div className="absolute bottom-[20%] left-[-10%] w-60 h-60 bg-blue-100/30 rounded-full blur-[80px]" />

      <div className="p-8 pt-16 flex flex-col relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="w-24 h-24 bg-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_25px_50px_rgba(22,163,74,0.3)]">
            <Leaf className="text-white fill-current" size={48} />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
            GreenPlate<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Ecosystem</span>
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-4">Zero Waste • High Impact • AI Driven</p>
        </motion.div>

        {/* The Bento Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* AI Vision Card (Double Height) */}
          <OnboardingCard 
            delay={0.2}
            className="col-span-1 row-span-2 bg-blue-600 text-white"
            icon={<Sparkles size={24} />}
            title="Gemini AI"
            desc="Vision-based nutrition & ingredient extraction."
          />
          
          {/* Price Card */}
          <OnboardingCard 
            delay={0.3}
            className="bg-white border border-gray-100 shadow-sm"
            icon={<TrendingDown size={24} className="text-green-600" />}
            title="70% Off"
            desc="Surplus deals."
            titleColor="text-gray-900"
          />

          {/* Speed Card */}
          <OnboardingCard 
            delay={0.4}
            className="bg-orange-500 text-white"
            icon={<Zap size={24} />}
            title="1-Tap"
            desc="Instant claim."
          />

          {/* Mission Card (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-2 bg-gray-900 p-8 rounded-[3rem] text-white overflow-hidden relative"
          >
            <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
                <Globe size={160} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                        <Target size={20} className="text-green-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Our Global Mission</span>
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-2">Rescuing 500kg+<br/> Monthly Surplus</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[240px]">
                  Connecting campus kitchens with students to turn waste into nutrition in real-time.
                </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Ticker / Data Points */}
        <div className="flex justify-between px-2 mb-12">
            <DataBadge icon={<Clock size={12} />} label="Live Feed" />
            <DataBadge icon={<ShieldCheck size={12} />} label="Verified" />
            <DataBadge icon={<Apple size={12} />} label="Nutrition" />
        </div>
      </div>

      {/* Persistent CTA Footer */}
      <div className="mt-auto p-8 pb-12 bg-white/80 backdrop-blur-xl border-t border-gray-100 sticky bottom-0">
        <motion.button 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => setOnboarded(true)}
          className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-gray-200 group active:scale-95 transition-all"
        >
          Initialize Terminal
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

const OnboardingCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  className: string; 
  delay: number;
  titleColor?: string;
}> = ({ icon, title, desc, className, delay, titleColor = "text-white" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`p-6 rounded-[2.5rem] flex flex-col justify-between ${className}`}
  >
    <div className="mb-6">{icon}</div>
    <div>
      <h4 className={`text-xl font-black tracking-tighter leading-none mb-2 ${titleColor}`}>{title}</h4>
      <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-70 ${titleColor}`}>
        {desc}
      </p>
    </div>
  </motion.div>
);

const DataBadge: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2">
    <div className="text-green-600">{icon}</div>
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

export default Onboarding;
