import { createPaymentOrder } from './api';

interface CartItem {
  item_id: string;
  quantity: number;
}

// ✅ 1. Define a strict interface for the result
export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  internalOrderId?: string;
  error?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));

    document.body.appendChild(script);
  });
};

/**
 * Shared helper to open the Razorpay Modal.
 */
const openRazorpay = async (
  orderData: any,
  userEmail: string,
  userName: string
): Promise<PaymentResult> => { // ✅ 2. Use the interface here
  try {
    await loadRazorpaySDK();

    return await new Promise((resolve) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'GreenPlate',
        description: orderData.notes?.type === 'RESALE' ? 'Resale Item Payment' : 'Food Order Payment',
        order_id: orderData.id, 

        prefill: {
          email: userEmail,
          name: userName,
        },

        theme: {
          color: '#10B981',
        },

        handler: (response: any) => {
          console.log('✅ Razorpay success:', response);

          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            internalOrderId: orderData.internal_order_id,
          });
        },

        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  } catch (error: any) {
    console.error('❌ Razorpay Error:', error);
    return {
      success: false,
      error: error?.message || 'Failed to open payment gateway',
    };
  }
};

/**
 * 1. REGULAR CHECKOUT
 */
export const initiatePayment = async (
  cartItems: CartItem[],
  stallId: string,
  userEmail: string,
  userName: string
): Promise<PaymentResult> => { // ✅ 3. Explicit return type
  try {
    console.log('🔄 Creating payment order...', { stallId, cartItems });

    const orderData = await createPaymentOrder(stallId, cartItems);
    return await openRazorpay(orderData, userEmail, userName);

  } catch (error: any) {
    console.error('❌ Payment Init Error:', error);
    return {
      success: false,
      error: error?.message || 'Payment initiation failed',
    };
  }
};

/**
 * 2. RESALE CHECKOUT
 */
export const initiateResalePayment = async (
  resaleConfig: any, 
  userEmail: string,
  userName: string
): Promise<PaymentResult> => { // ✅ 4. Explicit return type
  try {
    console.log('🔄 Initiating resale payment...', resaleConfig);
    return await openRazorpay(resaleConfig, userEmail, userName);
  } catch (error: any) {
    console.error('❌ Resale Payment Error:', error);
    return {
      success: false,
      error: error?.message || 'Resale payment failed',
    };
  }
};