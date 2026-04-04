"use client";

import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { auth } from "../firebaseConfig";

interface AddStaffModalProps {
  onClose: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddStaff = async () => {
    if (!email) {
      setError("Please enter an email");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      await api.post(
        "/staff/add-member",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Staff invite sent successfully");
      setEmail("");
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Geom' }}>
              Add Team Member
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Input Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Staff Email Address
              </label>
              <input
                  type="email"
                  placeholder="staff@tint.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  autoFocus
              />
            </div>

            {/* Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium overflow-hidden"
                >
                    {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium overflow-hidden"
                >
                    {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-black text-white flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
              >
                {loading ? (
                   "Adding…" 
                ) : (
                  <>
                      <UserPlus size={16} />
                      Add Member
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddStaffModal;