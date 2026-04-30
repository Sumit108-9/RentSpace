import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

/* ============================================
   PART 4: FIREBASE CLOUD MESSAGING SERVICE
   Push notifications for RentSpace
   ============================================ */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

let app = null;
let messaging = null;

export const initializeFirebase = () => {
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      
      onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'RentSpace', {
            body: payload.notification?.body,
            icon: payload.notification?.icon || '/logo192.png',
            data: payload.data,
            tag: payload.data?.orderId || 'default'
          });
        }
      });
    }
    return { app, messaging };
  } catch (error) {
    console.error('Firebase init error:', error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const { messaging } = initializeFirebase() || {};
      if (messaging) {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || ''
        });
        console.log('FCM Token:', token);
        localStorage.setItem('fcmToken', token);
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};

export const sendOrderNotification = async (orderId, customerName) => {
  const token = localStorage.getItem('fcmToken');
  if (!token) {
    console.log('No FCM token available');
    return false;
  }
  
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        title: 'Order Confirmed',
        body: `Hi ${customerName}, your RentSpace order #${orderId?.slice(-8)} has been placed successfully!`,
        icon: '/logo192.png',
        data: { orderId, type: 'order_confirmation', clickAction: '/orders' }
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Send notification error:', error);
    return false;
  }
};

export const subscribeToTopic = async (topic) => {
  const token = localStorage.getItem('fcmToken');
  if (!token) return false;
  
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, topic })
    });
    return response.ok;
  } catch (error) {
    console.error('Subscribe error:', error);
    return false;
  }
};

export { messaging };
