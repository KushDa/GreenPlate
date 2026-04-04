import axios from 'axios';
import { auth } from '@/firebaseConfig';
import { Capacitor } from '@capacitor/core';

export const API_BASE_URL =
  Capacitor.isNativePlatform()
    ? 'http://10.190.179.254:8000'
    : import.meta.env.VITE_API_BASE_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken(false);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('⚠️ auth.currentUser is NULL – request sent without token');
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('❌ API ERROR:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401 && auth.currentUser) {
      try {
        const newToken = await auth.currentUser.getIdToken(true);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch (e) {
        console.error('❌ Token refresh failed', e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ---------------- API HELPERS ----------------
export const verifyStudent = async () =>
  (await api.post('/auth/verify-student')).data;

export const verifyStaff = async () =>
  (await api.post('/auth/verify-staff')).data;

export const activateStaff = async () =>
  (await api.post('/staff/activate')).data;

export const getStaffProfile = async () =>
  (await api.get('/staff/me')).data;

export const getUserMenu = async () =>
  (await api.get('/user/menu')).data;

export const createPaymentOrder = async (stallId: string, items: any[]) =>
  (await api.post('/user/order/create', { stall_id: stallId, items })).data;

export const verifyOrder = async (data: any) =>
  (await api.post('/user/order/verify', data)).data;

export const getStaffMenu = async () =>
  (await api.get('/staff/menu')).data;

export const deleteMenuItem = async (itemId: string) =>
  (await api.delete(`/staff/menu/${itemId}`)).data;

export const getStaffOrders = async (status: string) =>
  (await api.get(`/staff/orders?status=${status}`)).data;

export const updateOrderStatus = async (orderId: string, status: string) =>
  (await api.patch(`/staff/orders/${orderId}/status`, { status })).data;

export const verifyPickup = async (orderId: string, pickupCode: string) =>
  (await api.post('/staff/orders/verify-pickup', {
    order_id: orderId,
    pickup_code: pickupCode,
  })).data;

export const cancelOrder = async (orderId: string) => 
  (await api.post(`/user/order/${orderId}/cancel`)).data;

export const getDiscountedFeed = async () => 
  (await api.get('/user/feed/discounted')).data;

export const buyResaleItem = async (resaleId: string) =>
  (await api.post(`/user/reasle/${resaleId}/buy`)).data

export const getStallResaleItems = async () =>  
  (await api.get('/staff/resale/items')).data;

export const updateResalePrice  = async (resaleId:string, newPrice: number) =>
  (await api.patch(`/staff/resale/${resaleId}/price`,{new_price:newPrice })).data
