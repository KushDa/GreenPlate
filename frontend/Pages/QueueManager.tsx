import React, { useEffect, useState } from 'react';
import { Bell, User, ChevronRight,Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStaffOrders, updateOrderStatus } from '../src/services/api';


interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  order_id: string;
  pickup_code: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const QueueManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      if (orders.length === 0) setLoading(true);
      const data = await getStaffOrders("PAID");
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setProcessingId(orderId);
      await updateOrderStatus(orderId, "READY");
      setOrders(prev => prev.filter(o => o.order_id !== orderId));
    } catch (err) {
      alert("Failed to update order status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-transparent">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Kitchen Queue</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-1">
          Pending Preparation ({orders.length})
        </p>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-[3.5rem] border-2 border-dashed border-gray-100">
             <Bell className="text-gray-200 mx-auto mb-4" size={56} />
             <h3 className="text-xl font-black text-gray-900">All Clear</h3>
             <p className="text-xs font-bold text-gray-400 uppercase">No pending orders</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {orders.map(order => (
                <motion.div
                  key={order.order_id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-7 rounded-[3rem] border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-900 text-white rounded-[1.75rem] flex items-center justify-center">
                           <User size={26} />
                        </div>
                        <div>
                           {/* --- CHANGE: Showing Order ID Fragment instead of Pickup Code --- */}
                           <h4 className="font-black text-xl text-gray-900 leading-none tracking-tight uppercase">
                             Order #{order.order_id.slice(-6)}
                           </h4>
                           <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                              To Prepare
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-[2.25rem] border border-gray-100 mb-6">
                     <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="font-black text-gray-900">{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  <button 
                    onClick={() => handleAcceptOrder(order.order_id)}
                    disabled={processingId === order.order_id}
                    className="w-full bg-gray-900 text-white py-6 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-emerald-600"
                  >
                     {processingId === order.order_id ? "Updating..." : "Mark as Ready"}
                     <ChevronRight size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default QueueManager;