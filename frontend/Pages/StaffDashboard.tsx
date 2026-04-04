"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import {
  Package, Star, Power, Plus, TrendingUp, Activity,
  Edit2, Trash2, X, Users, CheckCircle, AlertTriangle, Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { getStaffMenu, deleteMenuItem, getStallResaleItems, updateResalePrice } from "../src/services/api";
import AddStaffModal from '../src/components/AddStaffModal';
import ManageTeamModal from '../src/components/ManageTeamModal';
import { auth } from "../src/firebaseConfig";

// ── Constants ─────────────────────────────────────────────────────────────────
const MENU_IMAGE_BASE_URL = "https://raw.githubusercontent.com/AkibDa/backend/main/images_for_demo";
const getMenuImage = (imageRef?: string) =>
  imageRef ? `${MENU_IMAGE_BASE_URL}/${imageRef}.jpg` : undefined;

// ── Types ─────────────────────────────────────────────────────────────────────
interface BackendMenuItem {
  item_id: string;
  name: string;
  price: number;
  description: string;
  is_available: boolean;
  image_ref?: string;
}

interface ResaleItem {
  resale_id: string;
  original_price: number;
  discounted_price: number;
  max_price: number;
  items: { name: string; quantity: number }[];
}

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

// ── Sub-components ─────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm h-28 flex flex-col justify-between border border-gray-100">
    <div className="flex justify-between items-start">
      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</span>
      <div className="text-gray-400">{icon}</div>
    </div>
    <span className="text-2xl font-bold text-gray-900">{value}</span>
  </div>
);

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="relative bg-white rounded-3xl p-6 z-10 w-full max-w-sm mx-4 shadow-2xl"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
        <X size={20} />
      </button>
      {children}
    </motion.div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const StaffDashboard: React.FC = () => {
  const [backendOrders, setBackendOrders] = useState<unknown[]>([]);
  const [menuItems, setMenuItems] = useState<BackendMenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showManageTeam, setShowManageTeam] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'resale'>('menu');
  const [resaleItems, setResaleItems] = useState<ResaleItem[]>([]);
  const [editingPrice, setEditingPrice] = useState<{ id: string; price: number; max: number } | null>(null);

  const { cafeterias, managedCafeteriaId, staffProfile, toggleCafeteriaStatus } = useApp();

  const showNotification = useCallback((message: string, type: NotificationState['type']) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Initial data load
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchStats = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await api.get("/staff/orders?status=PAID", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBackendOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    const fetchMenu = async () => {
      try {
        setIsMenuLoading(true);
        const data = await getStaffMenu();
        setMenuItems(data.menu_items || []);
      } catch (err) {
        console.error("Failed menu load", err);
      } finally {
        setIsMenuLoading(false);
      }
    };

    fetchStats();
    fetchMenu();
  }, []);

  // Load resale items on tab change
  useEffect(() => {
    if (activeTab !== 'resale') return;
    const loadResale = async () => {
      try {
        setResaleItems(await getStallResaleItems());
      } catch (err) {
        console.error("Failed to load resale items", err);
      }
    };
    loadResale();
  }, [activeTab]);

  const handleDeleteClick = (itemId: string, itemName: string) =>
    setItemToDelete({ id: itemId, name: itemName });

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { id, name } = itemToDelete;
    setItemToDelete(null);
    setIsDeleting(id);
    try {
      await deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((item) => item.item_id !== id));
      showNotification(`"${name}" deleted successfully.`, 'success');
    } catch {
      showNotification("Delete failed. Please try again.", 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (itemName: string) =>
    showNotification(`Editing "${itemName}" is coming soon!`, 'info');

  const saveNewPrice = async () => {
    if (!editingPrice) return;
    try {
      await updateResalePrice(editingPrice.id, editingPrice.price);
      showNotification('Price updated successfully!', 'success');
      setEditingPrice(null);
      setResaleItems(await getStallResaleItems());
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showNotification(msg || 'Failed to update price', 'error');
    }
  };

  if (!staffProfile) return <div className="p-10 text-center">Loading...</div>;

  const myCafe = cafeterias.find((c) => c.id === managedCafeteriaId) || cafeterias[0];

  return (
    <div style={{ fontFamily: 'Geom' }} className="flex flex-col h-full bg-gray-50 overflow-hidden relative">

      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-emerald-600 text-white' :
              notification.type === 'error'   ? 'bg-red-500 text-white' :
                                                'bg-blue-600 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="flex-shrink-0" size={24} />}
            {notification.type === 'error'   && <AlertTriangle className="flex-shrink-0" size={24} />}
            {notification.type === 'info'    && <Info className="flex-shrink-0" size={24} />}
            <div>
              <h4 className="font-bold text-sm capitalize">{notification.type}</h4>
              <p className="text-xs opacity-90 font-medium">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-auto p-1 bg-white/20 rounded-full hover:bg-white/30">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100 flex justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">Control Panel</p>
          <h1 className="text-3xl font-bold">{staffProfile.stallName || myCafe.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${myCafe.isOpen ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-500">{myCafe.isOpen ? "Store is Live" : "Store is Closed"}</span>
          </div>
        </div>
        <button
          onClick={() => toggleCafeteriaStatus(myCafe.id)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${myCafe.isOpen ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}
        >
          <Power size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Orders" value={backendOrders.length.toString()} icon={<Activity size={18} />} />
          <StatCard label="Active Menu"  value={menuItems.length.toString()} icon={<Package size={18} />} />
          <StatCard label="Rating"       value={myCafe.rating.toString()} icon={<Star size={18} />} />
          <StatCard label="Revenue"      value="Coming Soon" icon={<TrendingUp size={18} />} />
        </div>

        {/* Staff Management (managers only) */}
        {staffProfile.role === "manager" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Staff Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowAddStaff(true)} className="bg-black text-white py-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <Plus size={16} /> Add Staff
              </button>
              <button onClick={() => setShowManageTeam(true)} className="bg-white border py-4 rounded-xl flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <Users size={16} /> View Team
              </button>
            </div>
          </div>
        )}

        {/* Inventory */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Inventory</h3>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'menu' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
              >Full Menu</button>
              <button
                onClick={() => setActiveTab('resale')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'resale' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
              >Resale Items</button>
            </div>
          </div>

          {/* Menu Tab */}
          {activeTab === 'menu' ? (
            isMenuLoading ? (
              <div className="text-center py-10 text-gray-400 text-sm">Loading Menu...</div>
            ) : (
              <div className="space-y-3 pb-20">
                {menuItems.map((item) => (
                  <motion.div
                    layout key={item.item_id}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {item.image_ref
                        ? <img src={getMenuImage(item.image_ref)} alt={item.name} className="w-full h-full object-cover" />
                        : "🍱"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 style={{ fontFamily: 'Geom' }} className="font-semibold text-gray-900 mb-0.5 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400 truncate mb-1">{item.description}</p>
                      <span className="text-sm font-bold text-emerald-600">₹{item.price}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleEditClick(item.name)} className="p-2 bg-gray-50 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button
                        disabled={isDeleting === item.item_id}
                        onClick={() => handleDeleteClick(item.item_id, item.name)}
                        className="p-2 bg-gray-50 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {isDeleting === item.item_id
                          ? <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 size={14} />}
                      </button>
                    </div>
                  </motion.div>
                ))}
                {menuItems.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No items in menu. Start by adding some!
                  </div>
                )}
              </div>
            )
          ) : (
            /* Resale Tab */
            <div className="space-y-3 pb-20">
              {resaleItems.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  No resale items available.
                </div>
              ) : resaleItems.map((item) => (
                <motion.div
                  key={item.resale_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      {item.items[0]?.name || "Unknown Item"}{' '}
                      <span className="text-gray-400 text-xs">(x{item.items[0]?.quantity})</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">₹{item.original_price}</span>
                      <span className="text-lg font-bold text-orange-600">₹{item.discounted_price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingPrice({ id: item.resale_id, price: item.discounted_price, max: item.max_price })}
                    className="p-2.5 bg-orange-50 rounded-xl text-orange-600 hover:bg-orange-100 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddStaff && (
          <Modal onClose={() => setShowAddStaff(false)}>
            <AddStaffModal onClose={() => setShowAddStaff(false)} />
          </Modal>
        )}
        {showManageTeam && (
          <Modal onClose={() => setShowManageTeam(false)}>
            <ManageTeamModal onClose={() => setShowManageTeam(false)} />
          </Modal>
        )}

        {itemToDelete && (
          <Modal onClose={() => setItemToDelete(null)}>
            <div className="text-center pt-2">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item?</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[240px] mx-auto">
                Are you sure you want to delete{' '}
                <span className="font-bold text-gray-800">"{itemToDelete.name}"</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setItemToDelete(null)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200">Yes, Delete</button>
              </div>
            </div>
          </Modal>
        )}

        {editingPrice && (
          <Modal onClose={() => setEditingPrice(null)}>
            <div className="pt-2">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Update Price</h3>
              <p className="text-xs text-gray-500 mb-4">
                Max allowed price: <span className="font-bold text-gray-800">₹{editingPrice.max}</span>
              </p>
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  value={editingPrice.price}
                  onChange={(e) => setEditingPrice({ ...editingPrice, price: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <button onClick={saveNewPrice} className="w-full py-3.5 rounded-xl bg-black text-white font-bold hover:bg-gray-900 transition-colors">
                Save Changes
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffDashboard;