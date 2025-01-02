import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";

import { useAuth0 } from "@auth0/auth0-react";
import "./Home.css";
import Profile from "../components/Profile";
import Drive from "../components/Drive";
import Login from "../components/LoginButton";
import Logout from "../components/LogoutButton";


import { useEffect, useState } from "react";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRoCk2y6NsEkni0oXb3EAMk1kiL_Y8sd4",
  authDomain: "unicorn-project-341707.firebaseapp.com",
  projectId: "unicorn-project-341707",
  storageBucket: "unicorn-project-341707.firebasestorage.app",
  messagingSenderId: "1035693891386",
  appId: "1:1035693891386:web:37859f591f430f0ed8fa03"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// Notification Permission Function
const requestNotificationPermission = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    console.log("Registering service worker...");
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    } else {
      console.warn('Service Worker not supported in this browser.');
    }

    const token = await getToken(messaging, {
      vapidKey: "BH-8qoL7AuilWVfEZuF21ZxUAFM3cbBri_BNPn6bwM12-8Wmza6J2b31bleKBe0QCVEZH_dkLUcmKKMzdG-3Ozo", // Replace with your actual VAPID key
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM token retrieved:", token);
      // Send the token to your backend to register the device
    } else {
      console.warn("Failed to retrieve FCM token. Check browser settings and VAPID key.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

const Home: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return null;
  }


  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);

    // Display notification as a toast
    if (payload.notification) {
      setToastMessage(payload.notification.body || "New notification received");
      setShowToast(true);
    }
  });
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scribe Parser</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Scribe Parser</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="container">
          <Profile />          
          {isAuthenticated ? (
          <div>
          <Drive/>
          <Logout/>
          </div>
        ) : (
          <Login/>
        )}
        </div>        
      </IonContent>
      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        color="primary"
      />
    </IonPage>
  );
};

export default Home;