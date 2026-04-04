import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, MapPin, ShoppingBag, BellRing, ChefHat,
  CheckCircle, X, Store, AlertTriangle, RefreshCcw, Loader2, Info,
} from 'lucide-react';
import { cancelOrder } from '../src/services/api';

// ── Types ─────────────────────────────────────────────────────────────────────
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface RefundInfo {
  status: string;
  amount: number;
  razorpay_refund_id?: string;
  bank_ref?: string;
}

// Extends whatever Order type comes from AppContext with optional refund field
interface OrderWithRefund {
  refund?: RefundInfo;
}

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  message: string;
  type: NotificationType;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const getOrderTotal = (items: OrderItem[]): number =>
  items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

const getItemsCount = (items: OrderItem[]): number =>
  items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

// ── Status Badge ───────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'Cancelled') return (
    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-red-50 text-red-600">
      <X size={12} /><span className="text-xs font-semibold">Cancelled</span>
    </div>
  );
  if (status === 'Ready') return (
    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-emerald-50 text-emerald-600">
      <BellRing size={12} /><span className="text-xs font-semibold">Ready for Pickup</span>
    </div>
  );
  if (['Reserved', 'Payment Pending', 'Paid'].includes(status)) return (
    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-blue-50 text-blue-600">
      <ChefHat size={12} /><span className="text-xs font-semibold">Preparing</span>
    </div>
  );
  if (['Claimed', 'Completed'].includes(status)) return (
    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-gray-100 text-gray-600">
      <CheckCircle size={12} /><span className="text-xs font-semibold">Completed</span>
    </div>
  );
  return (
    <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-gray-50 text-gray-500">
      <span className="text-xs font-semibold">{status}</span>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const MyOrders: React.FC = () => {
  const { orders, loadOrders } = useApp();
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedId ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure? If the order is READY, only 70% will be refunded.")) return;
    setIsCancelling(true);
    try {
      const res = await cancelOrder(orderId);
      showNotification(res.message, 'success');
      setSelectedId(null);
      loadOrders();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showNotification(msg || 'Cancellation Failed', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const PAST_STATUSES = new Set(['Claimed', 'Completed', 'Cancelled']);
  const filteredOrders = orders.filter((o) =>
    activeTab === 'Active' ? !PAST_STATUSES.has(o.status as string) : PAST_STATUSES.has(o.status as string)
  );
  const selectedOrder = orders.find((o) => o.id === selectedId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-gray-50 relative" style={{ fontFamily: 'Geom' }}>

      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-emerald-600 text-white' :
              notification.type === 'error'   ? 'bg-red-500 text-white' :
                                                'bg-blue-600 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="flex-shrink-0" size={24} />}
            {notification.type === 'error'   && <AlertTriangle className="flex-shrink-0" size={24} />}
            {notification.type === 'info'    && <Info className="flex-shrink-0" size={24} />}
            <p className="text-sm font-bold flex-1">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="p-1 bg-white/20 rounded-full hover:bg-white/30">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white z-10 relative shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
        <div className="flex gap-4 border-b border-gray-200">
          {(['Active', 'Past'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="relative pb-3 px-1">
              <span className={`text-sm font-semibold transition-colors ${activeTab === tab ? 'text-emerald-600' : 'text-gray-500'}`}>
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div layoutId="order-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-4">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center h-64 text-center mt-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="text-gray-300" size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No orders here</h3>
              <p className="text-sm text-gray-500 max-w-[240px]">Your {activeTab.toLowerCase()} orders will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const items = (order.items || []) as OrderItem[];
                const itemsCount = getItemsCount(items);
                const totalAmount = getOrderTotal(items);

                return (
                  <motion.div
                    layoutId={`myorders-card-${order.id}`} key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }}
                    className={`bg-white rounded-2xl p-4 border relative cursor-pointer ${
                      order.status === 'Ready' ? 'border-emerald-200 shadow-sm shadow-emerald-100/50' : 'border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <motion.h3 layoutId={`myorders-title-${order.id}`} className="text-base font-bold text-gray-900">
                          {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
                        </motion.h3>
                        <motion.div layoutId={`myorders-meta-${order.id}`} className="flex items-center gap-1.5 text-gray-500 mt-1">
                          <Store size={14} className="text-emerald-600" />
                          <span className="text-xs font-medium text-gray-800">{order.cafeteriaName || 'Unknown Stall'}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-900 font-medium">₹{totalAmount}</span>
                        </motion.div>
                      </div>
                      <motion.div layoutId={`myorders-status-${order.id}`}>
                        <StatusBadge status={order.status as string} />
                      </motion.div>
                    </div>

                    <div className="space-y-1 mb-2">
                      {items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-500 flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                      {items.length > 2 && (
                        <div className="text-xs text-gray-400 font-medium">+ {items.length - 2} more items...</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedId && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div layoutId={`myorders-card-${selectedId}`} className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]" style={{ fontFamily: 'Geom' }}>

              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </motion.button>

              <div className="overflow-y-auto p-6 flex flex-col h-full">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2 pr-10">
                    <div>
                      <motion.h3 layoutId={`myorders-title-${selectedId}`} className="text-xl font-bold text-gray-900">Order Details</motion.h3>
                      <motion.div layoutId={`myorders-meta-${selectedId}`} className="flex items-center gap-1.5 text-gray-500 mt-1">
                        <MapPin size={14} className="text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700">{selectedOrder.cafeteriaName || "Unknown Stall"}</span>
                      </motion.div>
                    </div>
                    <motion.div layoutId={`myorders-status-${selectedId}`}>
                      <StatusBadge status={selectedOrder.status as string} />
                    </motion.div>
                  </div>

                  {/* Refund Info */}
                  {selectedOrder.status === 'Cancelled' && (selectedOrder as unknown as OrderWithRefund).refund && (() => {
                    const refund = (selectedOrder as unknown as OrderWithRefund).refund!;
                    return (
                      <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-red-700">
                          <RefreshCcw size={18} />
                          <h4 className="font-bold text-sm">Refund Details</h4>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="font-medium text-gray-900">{refund.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="font-medium text-gray-900">₹{refund.amount}</span>
                          </div>
                          {refund.razorpay_refund_id && (
                            <div className="flex justify-between">
                              <span>Refund ID:</span>
                              <span className="font-mono text-gray-900 text-[10px]">{refund.razorpay_refund_id}</span>
                            </div>
                          )}
                          {refund.bank_ref && (
                            <div className="flex justify-between">
                              <span>Bank RRN:</span>
                              <span className="font-mono text-green-700 font-bold">{refund.bank_ref}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 italic">Refunds typically take 3-5 business days.</p>
                      </div>
                    );
                  })()}
                </div>

                {/* QR Code */}
                {['Reserved', 'Ready', 'Paid'].includes(selectedOrder.status) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 mb-6 text-center"
                  >
                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm p-2">
                      <QrCode size={140} className="text-gray-900" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Pickup Code</p>
                      <p className="text-3xl font-bold text-gray-900 tracking-wider">{selectedOrder.qrCode || '----'}</p>
                    </div>
                  </motion.div>
                )}

                {/* Item List */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                  <div className="space-y-3 mb-6">
                    {((selectedOrder.items || []) as OrderItem[]).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm border border-gray-100">×{item.quantity}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">₹{item.price}/each</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 px-2">
                      <span className="text-sm font-medium text-gray-500">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">₹{getOrderTotal((selectedOrder.items || []) as OrderItem[])}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-auto pt-2">
                  {['Reserved', 'Paid', 'Ready', 'Payment Pending'].includes(selectedOrder.status as string) && (
                    <div className="mb-4">
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        disabled={isCancelling}
                        className="w-full py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isCancelling ? <Loader2 size={16} className="animate-spin" /> : <AlertTriangle size={16} />}
                        Cancel Order
                      </button>
                      <p className="text-center text-[10px] text-gray-400 mt-2">
                        {selectedOrder.status === 'Ready' ? '50% Refund applies for Ready items.' : 'Full Refund applies.'}
                      </p>
                    </div>
                  )}

                  {selectedOrder.status === 'Ready' && (
                    <div className="w-full py-4 rounded-xl text-sm font-bold bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                      <BellRing size={20} className="animate-pulse" />
                      <span>Order Ready for Pickup</span>
                    </div>
                  )}
                  {['Reserved', 'Payment Pending', 'Paid'].includes(selectedOrder.status) && (
                    <div className="w-full py-4 rounded-xl text-sm font-bold bg-blue-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                      <ChefHat size={20} />
                      <span>Kitchen is Preparing</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyOrders;