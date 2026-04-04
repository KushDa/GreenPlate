/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from 'react';

// FIX 1: Added 'type' keyword for all these type/interface imports
import type { UserRole, AppState, FoodDeal, Order, Cafeteria } from '../types';
import { auth } from '../src/firebaseConfig';
import api from '../src/services/api';
import { INITIAL_DEALS, INITIAL_CAFETERIAS } from '../constants';

type StaffProfile = {
  role: 'manager' | 'staff';
  stallId: string;
  stallName: string;
  email: string;
  name?: string;
};

interface AppContextType extends AppState {
  setUserRole: (role: UserRole | null) => void;
  setOnboarded: (val: boolean) => void;
  setVerified: (val: boolean) => void;
  staffProfile: StaffProfile | null;
  setStaffProfile: (p: StaffProfile | null) => void;
  addDeal: (deal: Omit<FoodDeal, 'id' | 'isClaimed'>) => void;
  toggleCafeteriaStatus: (id: string) => void;
  loadOrders: () => Promise<void>;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);

  const managedCafeteriaId = 'cafe-1';

  const [cafeterias, setCafeterias] = useState<Cafeteria[]>(INITIAL_CAFETERIAS);
  const [deals, setDeals] = useState<FoodDeal[]>(INITIAL_DEALS);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = useCallback(async () => {
    // FIX 2: Changed UserRole.USER to the string literal 'USER'
    if (userRole !== 'USER' || !auth.currentUser) return;

    try {
      const response = await api.get('/user/orders');
      const data = response.data;

      // Handle multiple backend formats safely
      if (data && typeof data === 'object' && 'orders' in data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    }
  }, [userRole]);

  const addDeal = (dealData: Omit<FoodDeal, 'id' | 'isClaimed'>) => {
    const newDeal: FoodDeal = {
      ...dealData,
      id: Math.random().toString(36).substring(2, 11),
      isClaimed: false,
    };
    setDeals((prev) => [newDeal, ...prev]);
  };

  const toggleCafeteriaStatus = (id: string) => {
    setCafeterias((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOpen: !c.isOpen } : c))
    );
  };

  const resetApp = () => {
    setUserRole(null);
    setStaffProfile(null);
    setOnboarded(false);
    setVerified(false);
    setDeals(INITIAL_DEALS);
    setOrders([]);
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      // FIX 3: Changed UserRole.USER to the string literal 'USER'
      if (user && userRole === 'USER') {
        loadOrders();
      } else {
        setOrders([]);
      }
    });

    return () => unsub();
  }, [userRole, loadOrders]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        onboarded,
        isVerified,
        staffProfile,
        setStaffProfile,
        managedCafeteriaId,
        cafeterias,
        deals,
        orders,
        loadOrders,
        setUserRole,
        setOnboarded,
        setVerified,
        addDeal,
        toggleCafeteriaStatus,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};