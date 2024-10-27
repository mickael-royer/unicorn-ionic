import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useAuth0 } from "@auth0/auth0-react";
import "./Home.css";
import Profile from "../components/Profile";
import Drive from "../components/Drive";
import Login from "../components/LoginButton";
import Logout from "../components/LogoutButton";

const Home: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return null;
  }

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
    </IonPage>
  );
};

export default Home;