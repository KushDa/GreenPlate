// IncomingReservations.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { Package, CheckCircle2, ShoppingBag, Loader2, X, KeyRound, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStaffOrders, verifyPickup } from '../src/services/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReadyOrder {
  order_id: string;
  pickup_code: string;
  status: string;
  items: OrderItem[];
  user_details?: { name: string };
}

interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

interface FeedbackState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
const IncomingReservations: React.FC = () => {
  const [readyOrders, setReadyOrders] = useState<ReadyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ReadyOrder | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ show: false, type: 'success', message: '' });

  const showFeedback = useCallback((type: FeedbackState['type'], message: string) => {
    setFeedback({ show: true, type, message });
    if (type === 'success') setTimeout(() => setFeedback((prev) => ({ ...prev, show: false })), 3000);
  }, []);

  const fetchReady = useCallback(async () => {
    try {
      if (readyOrders.length === 0) setLoading(true);
      const data = await getStaffOrders('READY');
      setReadyOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load pickups', err);
    } finally {
      setLoading(false);
    }
  }, [readyOrders.length]);

  useEffect(() => {
    fetchReady();
    const interval = setInterval(fetchReady, 15000);
    return () => clearInterval(interval);
  }, [fetchReady]);

  const openVerifyModal = (order: ReadyOrder) => {
    setSelectedOrder(order);
    setOtpInput('');
    setShowVerifyModal(true);
  };

  const closeVerifyModal = () => {
    setShowVerifyModal(false);
    setSelectedOrder(null);
    setOtpInput('');
    setIsVerifying(false);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || otpInput.length < 4) {
      showFeedback('error', 'Please enter a valid 4-digit code.');
      return;
    }
    setIsVerifying(true);
    try {
      await verifyPickup(selectedOrder.order_id, otpInput);
      setReadyOrders((prev) => prev.filter((o) => o.order_id !== selectedOrder.order_id));
      closeVerifyModal();
      showFeedback('success', 'Verification Successful! Handover Complete.');
    } catch (err) {
      showFeedback('error', (err as ApiError).response?.data?.message || 'Verification failed.');
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Geom' }} className="flex flex-col h-full bg-gray-50 overflow-hidden relative">

      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase">Pickup Hub</p>
        <h1 className="text-3xl font-bold text-gray-900">Ready for Pickup</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-500">{readyOrders.length} Orders Waiting</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : readyOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Shelf Empty</h3>
            <p className="text-sm text-gray-400">No orders waiting for pickup</p>
          </div>
        ) : (
          <AnimatePresence>
            {readyOrders.map((order) => (
              <motion.div
                key={order.order_id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Package size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">#{order.order_id.slice(-6).toUpperCase()}</h3>
                      <p className="text-xs font-medium text-gray-400">{order.user_details?.name || 'Student'}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">Ready</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm mb-1 last:mb-0">
                      <span className="text-gray-600"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openVerifyModal(order)}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <KeyRound size={16} /> Verify & Handover
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Verify Modal */}
      <AnimatePresence>
        {showVerifyModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeVerifyModal} className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 z-10 shadow-2xl"
            >
              <button onClick={closeVerifyModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20} /></button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <KeyRound size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verify Pickup</h3>
                <p className="text-sm text-gray-500">Enter the 4-digit code from the student</p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4}
                  value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="0000"
                  className="w-full bg-gray-50 border border-gray-200 text-center text-3xl font-bold tracking-[0.5em] py-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-300"
                  autoFocus
                />
                <button
                  type="submit" disabled={isVerifying || otpInput.length < 4}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
                >
                  {isVerifying ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  {isVerifying ? 'Verifying...' : 'Confirm Handover'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {feedback.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`absolute top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              feedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {feedback.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{feedback.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncomingReservations;