// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmuvmTAL6uCUPsIaFE7nxUxeMornf62Us",
  authDomain: "rentspace-3bd9d.firebaseapp.com",
  projectId: "rentspace-3bd9d",
  storageBucket: "rentspace-3bd9d.firebasestorage.app",
  messagingSenderId: "1068881535318",
  appId: "1:1068881535318:web:98e9ae0f43ed42efc136f7",
  measurementId: "G-JJBMWK8DQK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'RentSpace';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/logo192.png',
    badge: '/badge.png',
    tag: payload.data?.tag || 'default',
    requireInteraction: true,
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View Order'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'view' || !action) {
    // Open orders page
    const urlToOpen = new URL('/orders', self.location.origin).href;

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Handle push events (fallback for non-Firebase push)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/logo192.png',
      badge: '/badge.png',
      tag: data.tag || 'push-notification',
      requireInteraction: true,
      data: data
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'RentSpace', options)
    );
  }
});
