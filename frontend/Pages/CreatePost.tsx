import React, { useState } from 'react';
import {
  X,
  Camera as CameraIcon,
  Loader2,
  Trash2,
  Save,
  Plus,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera as CapCamera,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import api from '../src/services/api';

interface ScannedItem {
  name: string;
  price: number | string;
  description: string;
}

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

const CreatePost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { staffProfile } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [items, setItems] = useState<ScannedItem[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [notification, setNotification] =
    useState<NotificationState | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // =========================
  // 📸 CAMERA / GALLERY PICK
  // =========================
  const openCameraOrGallery = async () => {
    if (isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      setShowReview(false);

      const photo = await CapCamera.getPhoto({
        quality: 75,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt, // 📸 Camera OR 🖼️ Gallery
      });

      if (!photo.base64String) {
        setIsAnalyzing(false);
        return;
      }

      // Base64 → Blob
      const byteChars = atob(photo.base64String);
      const byteNumbers = new Array(byteChars.length)
        .fill(0)
        .map((_, i) => byteChars.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', blob, 'menu.jpg');

      const response = await api.post('/staff/menu/scan-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      const data = response.data;

      if (data.detected_items?.length) {
        setItems(
          data.detected_items.map((i: any) => ({
            name: i.name,
            price: i.price || '',
            description: i.description || '',
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

  const handleUpdateItem = (
    index: number,
    field: keyof ScannedItem,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([{ name: '', price: '', description: '' }, ...items]);
  };

  const handlePublishMenu = async () => {
    if (!items.length) return;
    setIsUploading(true);

    try {
      const me = await api.get('/staff/me');
      const stallId = me.data.stall_id;

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
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || 'Failed to save menu.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-white flex flex-col max-w-md mx-auto"
    >
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`absolute top-6 left-4 right-4 z-[70] p-4 rounded-2xl shadow-xl flex gap-3 ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={24} />
            ) : (
              <AlertTriangle size={24} />
            )}
            <div>
              <p className="font-bold text-sm">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-6 border-b flex justify-between items-center">
        <button onClick={onClose}>
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-black">Upload Menu</h2>
          <p className="text-[10px] text-green-600 font-bold uppercase">
            {staffProfile?.stallName}
          </p>
        </div>
        <div className="w-6" />
      </header>

      {/* Scanner */}
      {!showReview && (
        <div
          onClick={openCameraOrGallery}
          className="m-6 flex-1 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer"
        >
          <CameraIcon size={40} className="text-green-600 mb-4" />
          <p className="font-bold">Scan Menu Card</p>
          {isAnalyzing && (
            <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center text-white">
              <Loader2 className="animate-spin" size={40} />
            </div>
          )}
        </div>
      )}

      {/* Review */}
      {showReview && (
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <button
            onClick={handleAddItem}
            className="text-green-600 text-sm font-bold"
          >
            <Plus size={14} /> Add Item
          </button>

          {items.map((item, i) => (
            <div key={i} className="border p-3 rounded-xl">
              <input
                value={item.name}
                onChange={(e) =>
                  handleUpdateItem(i, 'name', e.target.value)
                }
                placeholder="Item name"
                className="w-full font-bold"
              />
              <input
                value={item.description}
                onChange={(e) =>
                  handleUpdateItem(i, 'description', e.target.value)
                }
                placeholder="Description"
                className="w-full text-xs"
              />
              <div className="flex justify-between">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleUpdateItem(i, 'price', e.target.value)
                  }
                  placeholder="₹0"
                  className="w-20"
                />
                <button onClick={() => handleDeleteItem(i)}>
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
            onClick={() => {
              setItems([]);
              setShowReview(false);
            }}
            className="px-4 py-3 bg-gray-100 rounded-xl"
          >
            Rescan
          </button>
          <button
            onClick={handlePublishMenu}
            disabled={isUploading}
            className="flex-1 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Publish Menu
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CreatePost;
