// Pages/Profile.tsx

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, LogOut, Bell, Shield, Store, UserCircle, Briefcase, Edit2, Check, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import api from '../src/services/api';
import { auth } from '../src/firebaseConfig';

const Profile: React.FC = () => {
  const { resetApp, staffProfile, userRole, setStaffProfile } = useApp();
  const user = auth.currentUser;

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [localName, setLocalName] = useState<string | null>(null);
  const currentName = localName || staffProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetApp();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const startEditing = () => {
    setEditedName(currentName);
    setIsEditingName(true);
    setError(null);
  };

  const cancelEditing = () => {
    setIsEditingName(false);
    setEditedName('');
    setError(null);
  };

  const saveNameChange = async () => {
    if (!editedName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      if (staffProfile || (userRole as string) === 'staff') {
        await api.patch(
          '/staff/profile',
          { name: editedName.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (staffProfile) {
          setStaffProfile({ ...staffProfile, name: editedName.trim() });
        }
      } else {
        await api.patch(
          '/user/profile',
          { name: editedName.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLocalName(editedName.trim());
      }
      setIsEditingName(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  // --- STAFF VIEW ---
  if (staffProfile || (userRole as string) === 'staff') {

    return (
      <div style={{fontFamily: 'Geom'}} className="h-full bg-gray-50 overflow-y-auto">
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 flex-shrink-0">
              <Briefcase size={28} />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="space-y-2">
                  {/* FIX: Added flex-wrap to handle small screens */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full min-w-[140px] flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter name"
                      autoFocus
                    />
                    <div className="flex gap-2">
                        <button onClick={saveNameChange} disabled={saving} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50">
                        <Check size={16} />
                        </button>
                        <button onClick={cancelEditing} disabled={saving} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                        <X size={16} />
                        </button>
                    </div>
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 truncate">{currentName}</h2>
                  <button onClick={startEditing} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                  {staffProfile?.role || "Staff"}
                </span>
                <span className="text-xs text-gray-400 truncate">{user?.email}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase">Stall Name</p>
                <p className="font-mono text-sm font-semibold text-gray-700 truncate">{staffProfile?.stallName || "----"}</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> Active
                </p>
             </div>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <MenuItem icon={<Store size={20} />} label="Stall Configuration" />
          <MenuItem icon={<Settings size={20} />} label="App Settings" />
          <MenuItem icon={<Shield size={20} />} label="Security & Access" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors mt-6">
            <LogOut size={20} /> <span className="font-semibold">Log Out</span>
          </button>
        </div>
        <div className="text-center py-6"><p className="text-xs text-gray-300 font-mono">Staff Terminal v2.1</p></div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  return (
    <div  style={{fontFamily: "Geom"}}className="h-full bg-gray-50 overflow-y-auto">
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full overflow-hidden shadow-emerald-200 shadow-lg p-0.5 flex-shrink-0">
             <div className="w-full h-full bg-white rounded-full overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'User'}`} alt="Profile" className="w-full h-full object-cover"/>
             </div>
          </div>
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="space-y-2">
                {/* FIX: Added flex-wrap here too */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full min-w-[140px] flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter name"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={saveNameChange} disabled={saving} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50">
                        <Check size={16} />
                    </button>
                    <button onClick={cancelEditing} disabled={saving} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                        <X size={16} />
                    </button>
                  </div>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 style={{ fontFamily: 'Geom' }} className="text-xl font-bold text-gray-900 truncate">{currentName}</h2>
                <button onClick={startEditing} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 size={16} /></button>
              </div>
            )}
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-100 rounded-full opacity-50" />
          <div className="relative z-10">
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">Impact Created</p>
            <div className="flex items-baseline gap-1">
              <p style={{ fontFamily: 'Geom' }} className="text-3xl font-bold text-emerald-800">0</p>
              <span className="text-sm text-emerald-600 font-medium">Meals Saved</span>
            </div>
          </div>
          <div className="text-3xl relative z-10">🌱</div>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <MenuItem icon={<UserCircle size={20} />} label="Account Details" />
        <MenuItem icon={<Settings size={20} />} label="Preferences" />
        <MenuItem icon={<Bell size={20} />} label="Notifications" />
        <MenuItem icon={<Shield size={20} />} label="Privacy Policy" />
        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 text-red-600 hover:bg-red-50 transition-colors mt-4">
          <LogOut size={20} /> <span className="font-semibold">Sign Out</span>
        </button>
      </div>
      <div className="text-center py-6"><p className="text-xs text-gray-400">GreenPlate Student v2.0</p></div>
    </div>
  );
};

const MenuItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all active:scale-[0.98]">
    <div className="text-gray-500">{icon}</div>
    <span className="font-semibold text-gray-700 text-sm">{label}</span>
  </button>
);

export default Profile;