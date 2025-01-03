import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";

import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import "./Home.css";
import Profile from "../components/Profile";
import Drive from "../components/Drive";
import Login from "../components/LoginButton";
import Logout from "../components/LogoutButton";

const Home: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Initialize Pusher
      const pusher = new Pusher("404b62fffcad0de861ed", {
        cluster: "eu",
      });

      // Subscribe to the channel
      const channel = pusher.subscribe("unicorn-notification");

      // Bind to the event
      channel.bind("publish", (data: any) => {
        // Update the toast message and display it
        setToastMessage(data.message || "File published !");
        setShowToast(true);
      });

      // Cleanup on component unmount
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
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
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={10000}
        color="success"
        icon="sparklesOutline"
      />
    </IonPage>
  );
};

export default Home;
