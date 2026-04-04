import React, { useState } from 'react';
import { X, Camera as CameraIcon, Loader2, Trash2, Save, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../src/services/api';
import { Camera as CapCamera, CameraResultType, CameraSource }  from '@capacitor/camera';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ScannedItem {
  name: string;
  price: number | string;
  description: string;
}

interface DetectedItem {
  name: string;
  price?: number | string;
  description?: string;
}

interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

type NotificationType = 'success' | 'error';

interface NotificationState {
  message: string;
  type: NotificationType;
}

// ── Component ─────────────────────────────────────────────────────────────────
const CreatePost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { staffProfile } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ── Camera / Gallery ──────────────────────────────────────────────────────
  const openCameraOrGallery = async () => {
    if (isAnalyzing) return;
    try {
      setIsAnalyzing(true);
      setShowReview(false);

      const photo = await CapCamera.getPhoto({
        quality: 75,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });

      if (!photo.base64String) return;

      const byteChars = atob(photo.base64String);
      const byteArray = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', blob, 'menu.jpg');

      const { data } = await api.post('/staff/menu/scan-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      if (data.detected_items?.length) {
        setItems(
          (data.detected_items as DetectedItem[]).map((i) => ({
            name: i.name,
            price: i.price ?? '',
            description: i.description ?? '',
          }))
        );
        setShowReview(true);
        showNotification('Items scanned successfully!', 'success');
      } else {
        showNotification('No items detected. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Scan failed:', err);
      showNotification('Failed to read menu. Try manual entry.', 'error');
      setShowReview(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Item Editors ──────────────────────────────────────────────────────────
  const handleUpdateItem = (index: number, field: keyof ScannedItem, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleDeleteItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleAddItem = () =>
    setItems((prev) => [{ name: '', price: '', description: '' }, ...prev]);

  // ── Publish ───────────────────────────────────────────────────────────────
  const handlePublishMenu = async () => {
    if (!items.length) return;
    setIsUploading(true);
    try {
      const me = await api.get('/staff/me');
      const stallId = me.data.stall_id as string;

      await api.post('/staff/menu', {
        stall_id: stallId,
        items: items.map((i) => ({
          name: i.name,
          price: Number(i.price) || 0,
          description: i.description,
          is_available: true,
        })),
      });

      showNotification('Menu uploaded successfully!', 'success');
      setTimeout(onClose, 2000);
    } catch (err) {
      showNotification((err as ApiError).response?.data?.message || 'Failed to save menu.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-white flex flex-col max-w-md mx-auto"
    >
      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className={`absolute top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex gap-3 ${
              notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
            <p className="font-bold text-sm">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-6 border-b flex justify-between items-center">
        <button onClick={onClose}><X size={24} /></button>
        <div className="text-center">
          <h2 className="text-lg font-black">Upload Menu</h2>
          <p className="text-[10px] text-green-600 font-bold uppercase">{staffProfile?.stallName}</p>
        </div>
        <div className="w-6" />
      </header>

      {/* Scanner */}
      {!showReview && (
        <div
          onClick={openCameraOrGallery}
          className="m-6 flex-1 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer relative"
        >
          <CameraIcon size={40} className="text-green-600 mb-4" />
          <p className="font-bold">Scan Menu Card</p>
          {isAnalyzing && (
            <div className="absolute inset-0 bg-green-600/90 rounded-[2.5rem] flex items-center justify-center text-white">
              <Loader2 className="animate-spin" size={40} />
            </div>
          )}
        </div>
      )}

      {/* Review */}
      {showReview && (
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <button onClick={handleAddItem} className="flex items-center gap-1 text-green-600 text-sm font-bold">
            <Plus size={14} /> Add Item
          </button>

          {items.map((item, i) => (
            <div key={i} className="border p-3 rounded-xl space-y-1">
              <input
                value={item.name}
                onChange={(e) => handleUpdateItem(i, 'name', e.target.value)}
                placeholder="Item name"
                className="w-full font-bold outline-none"
              />
              <input
                value={item.description}
                onChange={(e) => handleUpdateItem(i, 'description', e.target.value)}
                placeholder="Description"
                className="w-full text-xs outline-none"
              />
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleUpdateItem(i, 'price', e.target.value)}
                  placeholder="₹0"
                  className="w-20 outline-none"
                />
                <button onClick={() => handleDeleteItem(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {showReview && (
        <div className="p-6 border-t flex gap-3">
          <button
            onClick={() => { setItems([]); setShowReview(false); }}
            className="px-4 py-3 bg-gray-100 rounded-xl font-medium"
          >
            Rescan
          </button>
          <button
            onClick={handlePublishMenu}
            disabled={isUploading}
            className="flex-1 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 font-bold py-3 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Publish Menu
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CreatePost;