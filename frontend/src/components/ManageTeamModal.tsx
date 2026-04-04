"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2, X, Check, Shield, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { auth } from "../firebaseConfig";

interface ManageTeamModalProps {
  onClose: () => void;
}

interface StaffMember {
  uid: string;
  email: string;
  name?: string;
  role: "manager" | "staff";
  status: string;
}

const ManageTeamModal: React.FC<ManageTeamModalProps> = ({ onClose }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI Feedback State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const fetchStaff = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await api.get("/staff/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const list = Array.isArray(res.data) ? res.data : res.data.staff || [];
      setStaffList(list);
    } catch (err) {
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;

    setActionLoading(true);
    setFeedback(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.delete(`/staff/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setStaffList((prev) => prev.filter((s) => s.uid !== uid));
      setFeedback({ type: 'success', message: "Staff member removed successfully." });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || "Failed to remove staff." });
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (staff: StaffMember) => {
    setEditingId(staff.uid);
    setEditEmail(staff.email);
    setFeedback(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditEmail("");
  };

  const saveEdit = async (uid: string) => {
    if (!editEmail.includes("@")) {
      setFeedback({ type: 'error', message: "Please enter a valid email." });
      return;
    }

    setActionLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.put(
        `/staff/${uid}/email`,
        { new_email: editEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStaffList((prev) =>
        prev.map((s) => (s.uid === uid ? { ...s, email: editEmail } : s))
      );
      setEditingId(null);
      setFeedback({ type: 'success', message: "Email updated successfully." });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.response?.data?.message || "Failed to update email." });
    } finally {
      setActionLoading(false);
    }
  };

  const getDisplayName = (staff: StaffMember) => {
    return staff.name || staff.email.split('@')[0];
  };

  const getInitials = (staff: StaffMember) => {
    const name = staff.name || staff.email.split('@')[0];
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AnimatePresence>
      {/* 1. Backdrop Overlay */}
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* 2. Pop-up Card Container */}
        <motion.div 
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", duration: 0.5, bounce: 0.3 }
          }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
            <h3 style={{ fontFamily: "Geom" }} className="text-xl font-bold text-gray-900">
              Manage Team
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Feedback Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`px-6 py-3 text-sm font-medium flex items-center gap-2 overflow-hidden ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}
              >
                 {feedback.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                 {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable List */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                <div className="w-8 h-8 border-3 border-gray-100 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading team...</span>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500 text-sm bg-red-50 rounded-xl border border-red-100 mx-2">
                {error}
              </div>
            ) : staffList.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200 mx-2">
                No staff members found.
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {staffList.map((staff) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
                      key={staff.uid}
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 overflow-hidden flex-1">
                        {/* Avatar with initials */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${staff.role === 'manager' ? 'bg-gray-900' : 'bg-emerald-500'}`}>
                          {staff.name ? (
                            <span className="text-sm">{getInitials(staff)}</span>
                          ) : (
                            staff.role === 'manager' ? <Shield size={20} /> : <User size={20} />
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1 mr-2">
                          {editingId === staff.uid ? (
                            <input 
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              autoFocus
                              placeholder="Enter new email"
                            />
                          ) : (
                            <>
                              <p className="font-semibold text-gray-900 truncate text-sm">
                                {getDisplayName(staff)}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                            </>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                              {staff.role}
                            </span>
                            <span className={`text-[10px] font-medium flex items-center gap-1 ${staff.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {staff.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pl-2">
                        {editingId === staff.uid ? (
                          <>
                            <button 
                              onClick={() => saveEdit(staff.uid)}
                              disabled={actionLoading}
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 transition-all"
                            >
                              <Check size={16} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={cancelEdit}
                              disabled={actionLoading}
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:scale-105 transition-all"
                            >
                              <X size={16} strokeWidth={2.5} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEdit(staff)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                              title="Edit Email"
                            >
                              <Edit2 size={16} />
                            </button>
                            
                            {staff.role !== 'manager' && (
                              <button 
                                onClick={() => handleDelete(staff.uid)}
                                disabled={actionLoading}
                                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                title="Remove Staff"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ManageTeamModal;