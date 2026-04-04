
import React, { useState } from 'react';
import { MapPin, Navigation, ChevronRight, X, Search, Layers, Compass, Salad, Pizza, Sandwich } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const MapView: React.FC = () => {
  const { deals } = useApp();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('satellite');

  const cafeterias = Array.from(new Set<string>(deals.map(d => d.cafeteriaName))).map((name: string, idx) => {
    const cafeDeals = deals.filter(d => d.cafeteriaName === name && !d.isClaimed);
    return { 
      name, 
      dealsCount: cafeDeals.length, 
      id: name.replace(/\s+/g, '-').toLowerCase(),
      primaryDeal: cafeDeals[0],
      top: 30 + (idx * 20),
      left: 20 + (idx * 30)
    };
  });

  return (
    <div className="h-full relative overflow-hidden bg-gray-900">
      {/* High Fidelity Satellite Google Map Integration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
          src={mapMode === 'satellite' 
            ? "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1600" 
            : "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600"} 
          className="w-full h-full object-cover opacity-60 contrast-125 brightness-75 grayscale-[0.2]" 
          alt="Campus Aerial View"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30"></div>
        
        {/* Render markers with specialized food icons */}
        {cafeterias.map((cafe) => (
          <div 
            key={cafe.id}
            className="absolute transition-all duration-700 ease-out"
            style={{ top: `${cafe.top}%`, left: `${cafe.left}%` }}
          >
            <Marker 
              onClick={() => setSelectedPin(cafe.id)} 
              active={selectedPin === cafe.id} 
              count={cafe.dealsCount} 
              name={cafe.name}
              dealType={cafe.primaryDeal?.name}
            />
          </div>
        ))}

        {/* User Location Indicator */}
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500 rounded-full border-[6px] border-white/40 shadow-[0_0_40px_rgba(59,130,246,1)] z-10 relative"></div>
            <div className="absolute -inset-6 bg-blue-400/20 rounded-full animate-ping opacity-40"></div>
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl shadow-2xl border border-white whitespace-nowrap">
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">You are here</span>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating UI Search Bar */}
      <div className="absolute top-8 left-6 right-6 z-20">
        <div className="bg-white/95 backdrop-blur-2xl p-2.5 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white flex items-center gap-3">
          <div className="p-3.5 bg-gray-50 rounded-[1.75rem] text-gray-400">
             <Search size={22} />
          </div>
          <input 
            type="text"
            placeholder="Search for your favorite cafeteria..."
            className="flex-1 bg-transparent border-none py-3 focus:outline-none font-black text-gray-800 tracking-tight placeholder:text-gray-400"
          />
          <button 
            onClick={() => setMapMode(mapMode === 'satellite' ? 'standard' : 'satellite')}
            className="w-14 h-14 bg-green-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl shadow-green-200 active:scale-90 transition-all"
          >
             <Navigation size={24} />
          </button>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
          <MapControl icon={<Layers size={22} />} onClick={() => {}} />
          <MapControl icon={<Compass size={22} className="animate-pulse" />} onClick={() => {}} />
          <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-[2.25rem] shadow-2xl border border-white overflow-hidden">
            <button className="p-5 text-gray-400 hover:text-green-600 border-b border-gray-100 transition-colors font-black text-lg">+</button>
            <button className="p-5 text-gray-400 hover:text-green-600 transition-colors font-black text-lg">-</button>
          </div>
      </div>

      {/* Interactive Detail Popup Overlay */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-10 left-6 right-6 z-30"
          >
            <div className="bg-white p-7 rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/50 flex gap-6 items-center relative group backdrop-blur-3xl overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-50 rounded-full blur-3xl opacity-30"></div>
              
              <button 
                onClick={() => setSelectedPin(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-gray-100/80 shadow-sm rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
              
              <div className="w-28 h-28 bg-green-50 rounded-[2.5rem] flex items-center justify-center overflow-hidden shrink-0 border-[6px] border-white shadow-xl relative z-10">
                <img 
                    src={`https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&q=80&w=200`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="Canteen" 
                />
              </div>
              
              <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-black text-gray-900 leading-tight capitalize tracking-tighter mb-1">
                  {selectedPin.replace(/-/g, ' ')}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(22,163,74,0.6)]"></div>
                   <span className="text-[11px] font-black text-green-600 uppercase tracking-widest">3 Active Deals Available</span>
                </div>
                <button className="mt-5 w-full py-4 bg-green-600 rounded-[1.75rem] text-[11px] font-black text-white uppercase tracking-[0.25em] flex items-center justify-center gap-2 shadow-xl shadow-green-100 transition-all hover:bg-green-700 active:scale-95">
                  View Menu <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Marker: React.FC<{ onClick: () => void; active: boolean; count: number; name: string; dealType?: string }> = ({ onClick, active, count, name, dealType = "" }) => {
  const getIcon = () => {
    const lowerType = dealType.toLowerCase();
    if (lowerType.includes('salad') || lowerType.includes('bowl')) return <Salad size={28} />;
    if (lowerType.includes('pizza')) return <Pizza size={28} />;
    if (lowerType.includes('wrap') || lowerType.includes('sandwich')) return <Sandwich size={28} />;
    return <MapPin size={28} />;
  };

  return (
    <button 
      onClick={onClick}
      className="relative group transition-all transform hover:scale-110 active:scale-90 flex flex-col items-center"
    >
      <div className={`p-4 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-500 ${active ? 'bg-green-600 text-white scale-125 -translate-y-5 ring-12 ring-green-600/20' : 'bg-white/95 text-green-600 backdrop-blur-md border border-white'}`}>
         {getIcon()}
      </div>
      
      <AnimatePresence>
        {!active && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-black/85 backdrop-blur-xl px-5 py-2 rounded-2xl shadow-2xl border border-white/10"
          >
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">{name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {count > 0 && !active && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-600 text-white text-[11px] font-black rounded-[1.25rem] flex items-center justify-center border-[4px] border-white shadow-2xl group-hover:scale-110">
          {count}
        </div>
      )}
    </button>
  );
};

const MapControl: React.FC<{ icon: React.ReactNode; onClick: () => void }> = ({ icon, onClick }) => (
    <button 
        onClick={onClick}
        className="w-15 h-15 bg-white/95 backdrop-blur-md rounded-[1.75rem] shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-500 hover:text-green-600 transition-all border border-white active:scale-90"
    >
        {icon}
    </button>
);

export default MapView;
