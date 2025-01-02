// Import Firebase modules
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Firebase configuration (use your project configuration)
firebase.initializeApp({
    key: "AIzaSyCRoCk2y6NsEkni0oXb3EAMk1kiL_Y8sd4",
    apiKey: "AIzaSyAca7ZQQqwIISsGatmJ-95fz4fyn-YOFMM",
    authDomain: "unicorn-firebase-423a9.firebaseapp.com",
    projectId: "unicorn-firebase-423a9",
    storageBucket: "unicorn-firebase-423a9.firebasestorage.app",
    messagingSenderId: "613125335253",
    appId: "1:613125335253:web:56e45faf8454ae17009a5c"
  });

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});