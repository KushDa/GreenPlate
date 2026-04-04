import { createPaymentOrder} from './api';
import type { CartItem } from './api';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  internalOrderId?: string;
  error?: string;
}

interface RazorpayOrderData {
  id: string;
  amount: number;
  currency: string;
  internal_order_id: string;
  notes?: { type?: string };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { email: string; name: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: { ondismiss: () => void };
}


// ── SDK Loader ────────────────────────────────────────────────────────────────
const loadRazorpaySDK = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });

// ── Core Razorpay Opener ──────────────────────────────────────────────────────
const openRazorpay = async (
  orderData: RazorpayOrderData,
  userEmail: string,
  userName: string,
): Promise<PaymentResult> => {
  try {
    await loadRazorpaySDK();

    return await new Promise((resolve) => {
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'GreenPlate',
        description: orderData.notes?.type === 'RESALE' ? 'Resale Item Payment' : 'Food Order Payment',
        order_id: orderData.id,
        prefill: { email: userEmail, name: userName },
        theme: { color: '#10B981' },
        handler: (response: RazorpaySuccessResponse) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            internalOrderId: orderData.internal_order_id,
          });
        },
        modal: {
          ondismiss: () => resolve({ success: false, error: 'Payment cancelled by user' }),
        },
      };

      new window.Razorpay(options).open();
    });
  } catch (err) {
    console.error('❌ Razorpay Error:', err);
    return { success: false, error: (err as Error).message || 'Failed to open payment gateway' };
  }
};

// ── Public API ────────────────────────────────────────────────────────────────
export const initiatePayment = async (
  cartItems: CartItem[],
  stallId: string,
  userEmail: string,
  userName: string,
): Promise<PaymentResult> => {
  try {
    const orderData = await createPaymentOrder(stallId, cartItems);
    return await openRazorpay(orderData as RazorpayOrderData, userEmail, userName);
  } catch (err) {
    console.error('❌ Payment Init Error:', err);
    return { success: false, error: (err as Error).message || 'Payment initiation failed' };
  }
};

export const initiateResalePayment = async (
  resaleConfig: RazorpayOrderData,
  userEmail: string,
  userName: string,
): Promise<PaymentResult> => {
  try {
    return await openRazorpay(resaleConfig, userEmail, userName);
  } catch (err) {
    console.error('❌ Resale Payment Error:', err);
    return { success: false, error: (err as Error).message || 'Resale payment failed' };
  }
};