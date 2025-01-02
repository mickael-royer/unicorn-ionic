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
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  key: "AIzaSyCRoCk2y6NsEkni0oXb3EAMk1kiL_Y8sd4",
  apiKey: "AIzaSyAca7ZQQqwIISsGatmJ-95fz4fyn-YOFMM",
  authDomain: "unicorn-firebase-423a9.firebaseapp.com",
  projectId: "unicorn-firebase-423a9",
  storageBucket: "unicorn-firebase-423a9.firebasestorage.app",
  messagingSenderId: "613125335253",
  appId: "1:613125335253:web:56e45faf8454ae17009a5c"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const requestNotificationPermission = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    console.log("Registering service worker...");
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: 'BJtI5VaCyj1eJWa7L3Sq33N6LAlCletPhn7mqMAaxODdeEc2gFYlR_k_lN74wr7ABoHu0a77WxCH8tEeJqHlGFc',        
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM token retrieved:", token);
      // Send token to backend
    } else {
      console.warn("Failed to retrieve FCM token.");
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

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message received: ", payload);
        if (payload.notification) {
          const title = payload.notification.title || "Notification";
          const body = payload.notification.body || "You have a new message";
          setToastMessage(`${title}: ${body}`);
          setShowToast(true);
        }
      });

      return () => unsubscribe(); // Cleanup
    }
  }, [isAuthenticated]);

  if (isLoading) return null;

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
              <Drive />
              <Logout />
            </div>
          ) : (
            <Login />
          )}
        </div>
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => {
          setShowToast(false);
          setToastMessage("");
        }}
        message={toastMessage}
        duration={3000}
        color="primary"
      />
    </IonPage>
  );
};

export default Home;
