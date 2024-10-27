import { useAuth0 } from '@auth0/auth0-react';
import { IonButton } from '@ionic/react';

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const login = async () => {
    await loginWithRedirect();
  };
  return <IonButton onClick={login}>Log in</IonButton>;
};

export default LoginButton;