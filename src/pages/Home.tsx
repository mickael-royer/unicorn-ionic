import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import "./Home.css";
import Profile from "../components/Profile";
import Drive from "../components/Drive";
import Login from "../components/LoginButton";
import Logout from "../components/LogoutButton";

const Home: React.FC = () => {
  const { isLoading, isAuthenticated, user } = useAuth0();
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const initSignalRConnection = async () => {
        const newConnection = new HubConnectionBuilder()
          .withUrl("https://unicorn-notification.service.signalr.net")
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        try {
          await newConnection.start();
          console.log("SignalR connected.");
          setConnection(newConnection);

          newConnection.on("ReceiveNotification", (notification: string) => {
            console.log("Notification received:", notification);
            setToastMessage(notification);
            setShowToast(true);
          });
        } catch (error) {
          console.error("SignalR connection failed:", error);
        }
      };

      initSignalRConnection();

      return () => {
        if (connection) {
          connection.stop();
        }
      };
    }
  }, [isAuthenticated, user]);

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
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        color="primary"
      />
    </IonPage>
  );
};

export default Home;
