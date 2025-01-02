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
  apiKey: "AIzaSyCRoCk2y6NsEkni0oXb3EAMk1kiL_Y8sd4",
  authDomain: "unicorn-project-341707.firebaseapp.com",
  projectId: "unicorn-project-341707",
  storageBucket: "unicorn-project-341707.firebasestorage.app",
  messagingSenderId: "1035693891386",
  appId: "1:1035693891386:web:37859f591f430f0ed8fa03"
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

    getToken(messaging, { vapidKey: 'BJkHoavV2CIQJAzxwpyIsjJpCctWsmooQU5BqeTyDKH6tlq0NdU1rshVwpRvsYTA4oZngpY' }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
        
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
