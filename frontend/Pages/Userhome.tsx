import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Loader2, ShoppingBag, X,  Timer, Zap, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../src/firebaseConfig';
import { getUserMenu, verifyOrder, getDiscountedFeed, buyResaleItem  } from '../src/services/api';
import { initiatePayment,initiateResalePayment } from '../src/services/paymentService';

const MENU_IMAGE_BASE_URL = "https://raw.githubusercontent.com/AkibDa/backend/main/images_for_demo";

const getMenuImage = (imageRef?: string) => {
  if (!imageRef) return undefined;
  return `${MENU_IMAGE_BASE_URL}/${imageRef}.jpg`;
};

// ... (Keep existing MenuItem and Stall interfaces) ...
interface MenuItem {
  item_id: string;
  name: string;
  price: number;
  description?: string;
  image_ref?: string;
  category?: string;
  is_available: boolean;
}

interface Stall {
  stall_id: string;
  stall_name: string;
  menu_items: MenuItem[];
}

// ✅ 1. Add Notification Interface
interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

const UserHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Menu' | 'Discounted'>('Menu');
  
  // Menu State
  const [searchQuery, setSearchQuery] = useState('');
  const [stalls, setStalls] = useState<Stall[]>([]);
  
  // Discounted Feed State
  const [discountedItems, setDiscountedItems] = useState<any[]>([]);
  
  // Shared State
  const [cart, setCart] = useState<Map<string, { item: MenuItem; stallId: string; quantity: number }>>(new Map());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  
  // ✅ 2. Add Notification State
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // ✅ 3. Helper to show toast
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); 
  };

  // ... (Keep useEffect for loading data) ...
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'Menu') {
          const menuData = await getUserMenu();
          setStalls(menuData.stalls || []);
        } else {
          const feed = await getDiscountedFeed();
          setDiscountedItems(feed || []);
        }
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // --- CART LOGIC ---
  const addToCart = (item: MenuItem, stallId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const currentStallIds = Array.from(new Set(Array.from(cart.values()).map(i => i.stallId)));
    
    if (currentStallIds.length > 0 && currentStallIds[0] !== stallId) {
      showNotification("You can only order from one stall at a time. Clear cart to switch.", 'error');
      return; 
    }

    const cartKey = `${stallId}-${item.item_id}`;
    const newCart = new Map(cart);
    const existing = newCart.get(cartKey);
    if (existing) {
      newCart.set(cartKey, { ...existing, quantity: existing.quantity + 1 });
    } else {
      newCart.set(cartKey, { item, stallId, quantity: 1 });
    }
    setCart(newCart);
  };

  const removeFromCart = (item: MenuItem, stallId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const cartKey = `${stallId}-${item.item_id}`;
    const newCart = new Map(cart);
    const existing = newCart.get(cartKey);
    if (existing && existing.quantity > 1) {
      newCart.set(cartKey, { ...existing, quantity: existing.quantity - 1 });
    } else {
      newCart.delete(cartKey);
    }
    setCart(newCart);
  };

  const cartTotal = Array.from(cart.values()).reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const cartItemCount = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);

  // --- CHECKOUT LOGIC (Regular Menu) ---
  const handleCheckout = async () => {
    if (cart.size === 0) return;
    setIsCheckingOut(true);

    try {
      const user = auth.currentUser;
      if (!user) { 
        showNotification('Please sign in to place an order', 'error'); 
        return; 
      }

      const cartValues = Array.from(cart.values());
      const stallId = cartValues[0].stallId;
      const cartItems = cartValues.map((item) => ({ item_id: item.item.item_id, quantity: item.quantity }));

      const result = await initiatePayment(cartItems, stallId, user.email || '', user.displayName || '');
      
      if (result.success) {
        await verifyOrder({
          razorpay_payment_id: result.paymentId!,
          razorpay_order_id: result.orderId!, 
          razorpay_signature: result.signature!,
          internal_order_id: result.internalOrderId!,
        });
        setCart(new Map()); 
        setShowCart(false); 
        // ✅ 4. Use Toast
        showNotification('Order placed successfully!', 'success');
      } else {
        showNotification(`Payment failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // --- RESALE BUY LOGIC (Discounted Feed) ---
  const handleBuyResale = async (resaleItem: any) => {
    const user = auth.currentUser;
    if (!user) { 
      showNotification('Please sign in to buy items', 'error'); 
      return; 
    }

    if (!window.confirm(`Buy ${resaleItem.items[0].name} for ₹${resaleItem.discounted_price}?`)) return;

    setIsCheckingOut(true);
    try {
      // 1. Reserve item & get payment config
      const paymentConfig = await buyResaleItem(resaleItem.resale_id);

      // 2. Open Razorpay
      const result = await initiateResalePayment(paymentConfig, user.email || '', user.displayName || '');

      if (result.success) {
        // 3. Verify Payment
        await verifyOrder({
            razorpay_payment_id: result.paymentId!,
            razorpay_order_id: result.orderId!,
            razorpay_signature: result.signature!,
            internal_order_id: result.internalOrderId!,
        });
        // ✅ 5. Use Toast
        showNotification('Deal claimed! Check My Orders.', 'success');
        
        // Refresh feed to remove sold item
        const feed = await getDiscountedFeed();
        setDiscountedItems(feed || []);
      } else {
        showNotification('Payment Cancelled', 'info');
      }
    } catch (error: any) {
      showNotification(`Failed: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ... (Keep renderMenuContent and renderDiscountedContent same as before) ...
  const renderMenuContent = () => {
    const filteredStalls = stalls.map(stall => {
      if (!searchQuery.trim()) return stall;
      const matchingItems = stall.menu_items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...stall, menu_items: matchingItems };
    }).filter(stall => stall.menu_items.length > 0);

    if (filteredStalls.length === 0) {
      return <div className="text-center py-20 text-gray-400"><p>No dishes found for "{searchQuery}"</p></div>;
    }

    return filteredStalls.map((stall) => (
      <div key={stall.stall_id} className="mb-8">
        <div className="px-6 mb-3">
          <h2 className="text-lg font-bold text-gray-900">{stall.stall_name}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{stall.menu_items.length} items available</p>
        </div>
        <div className="space-y-3 px-6">
          {stall.menu_items.map((item) => {
            const cartKey = `${stall.stall_id}-${item.item_id}`;
            const qty = cart.get(cartKey)?.quantity || 0;
            return (
              <div key={item.item_id} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {item.image_ref ? <img src={getMenuImage(item.image_ref)} alt={item.name} className="w-full h-full object-cover" /> : "🍽️"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{item.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.description}</p>
                  <p className="text-base font-bold text-gray-900">₹{item.price}</p>
                </div>
                <div className="flex items-center">
                  {qty === 0 ? (
                    <button onClick={(e) => addToCart(item, stall.stall_id, e)} className="w-9 h-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700">
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                      <button onClick={(e) => removeFromCart(item, stall.stall_id, e)} className="w-7 h-7 flex items-center justify-center text-emerald-700"><Minus size={16} strokeWidth={2.5} /></button>
                      <span className="font-bold text-sm text-emerald-700 min-w-[16px] text-center">{qty}</span>
                      <button onClick={(e) => addToCart(item, stall.stall_id, e)} className="w-7 h-7 flex items-center justify-center text-emerald-700"><Plus size={16} strokeWidth={2.5} /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  const renderDiscountedContent = () => {
    if (discountedItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Timer size={48} className="mb-4 opacity-50" />
          <p>No discounted meals right now.</p>
          <p className="text-xs">Check back later for flash deals!</p>
        </div>
      );
    }
    return (
      <div className="px-6 space-y-4 pt-2">
        {discountedItems.map((item) => (
          <div key={item.resale_id} className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">50% OFF</div>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{item.stall_name}</h4>
                <p className="text-xs text-gray-500 mb-2">{item.items.map((i:any) => `${i.quantity}x ${i.name}`).join(', ')}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">₹{item.discounted_price}</span>
                  <span className="text-sm text-gray-400 line-through">₹{item.original_price}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleBuyResale(item)}
              disabled={isCheckingOut}
              className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800"
            >
              {isCheckingOut ? <Loader2 className="animate-spin" size={16}/> : "Claim Deal Now"}
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-2">Ready to eat • Immediate pickup</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative" style={{ fontFamily: 'Geom' }}>
      
      {/* 🔔 TOAST NOTIFICATION POPUP */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-emerald-600 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="flex-shrink-0" size={24} />}
            {notification.type === 'error' && <AlertTriangle className="flex-shrink-0" size={24} />}
            {notification.type === 'info' && <Info className="flex-shrink-0" size={24} />}
            
            <div>
              <p className="text-sm font-bold">{notification.message}</p>
            </div>

            <button onClick={() => setNotification(null)} className="ml-auto p-1 bg-white/20 rounded-full hover:bg-white/30">
               <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <div className="bg-white px-6 pt-6 pb-2 sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Menu</h1>
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
          <button 
            onClick={() => setActiveTab('Menu')} 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Menu' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            Full Menu
          </button>
          <button 
            onClick={() => setActiveTab('Discounted')} 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'Discounted' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
          >
            <Zap size={14} fill={activeTab === 'Discounted' ? "currentColor" : "none"} />
            Flash Deals
          </button>
        </div>

        {/* Search Bar (Only for Full Menu) */}
        {activeTab === 'Menu' && (
          <div className="relative mb-2">
            {/* FIX: Added z-10 and pointer-events-none so icon stays ON TOP of input background */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              autoComplete="off" // Added to prevent the floating suggestion bubble
              className="w-full bg-gray-50 border border-gray-200 py-2.5 pl-10 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {searchQuery && (
              // FIX: Added z-10 to ensure clickable button stays ON TOP
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 z-10">
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-emerald-600 w-8 h-8" /></div>
        ) : (
          activeTab === 'Menu' ? renderMenuContent() : renderDiscountedContent()
        )}
      </div>

      {/* Cart Button */}
      <AnimatePresence>
        {activeTab === 'Menu' && cartItemCount > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-20 left-6 right-6 z-50">
            <button onClick={() => setShowCart(true)} className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><ShoppingBag size={20} strokeWidth={2.5} /></div>
                <div className="text-left">
                  <p className="text-xs font-medium opacity-90">View Cart</p>
                  <p className="text-sm font-bold">{cartItemCount} items • ₹{cartTotal}</p>
                </div>
              </div>
              <span className="font-bold">Checkout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold">Your Cart</h3>
                <button onClick={() => setShowCart(false)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {Array.from(cart.values()).map(({ item, stallId, quantity }) => (
                  <div key={`${stallId}-${item.item_id}`} className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {item.image_ref ? <img src={getMenuImage(item.image_ref)} className="w-full h-full object-cover" /> : "🍽️"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">₹{item.price} × {quantity}</p>
                    </div>
                    <p className="font-bold">₹{item.price * quantity}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold">₹{cartTotal}</span>
                </div>
                <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                  {isCheckingOut ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : 'Pay Now'}
                </button>
              </div>
            </motion.div>
          </>
        )} 
      </AnimatePresence>
    </div>
  );
};

export default UserHome;