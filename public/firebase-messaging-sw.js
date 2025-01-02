// Import Firebase modules
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Firebase configuration (use your project configuration)
firebase.initializeApp({
    apiKey: "AIzaSyCRoCk2y6NsEkni0oXb3EAMk1kiL_Y8sd4",
    authDomain: "unicorn-project-341707.firebaseapp.com",
    projectId: "unicorn-project-341707",
    storageBucket: "unicorn-project-341707.firebasestorage.app",
    messagingSenderId: "1035693891386",
    appId: "1:1035693891386:web:37859f591f430f0ed8fa03"
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