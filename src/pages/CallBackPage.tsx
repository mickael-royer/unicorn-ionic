// src/CallbackPage.tsx

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'; 
import { useAuth0 } from '@auth0/auth0-react';

const CallbackPage: React.FC = () => {
  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const history = useHistory(); // Get the history object

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const codeVerifier = 'generateCodeVerifier()';

        // Set the code verifier in session storage
        sessionStorage.setItem('codeVerifier', codeVerifier);

        await loginWithRedirect({
          code_challenge: codeVerifier,
          code_challenge_method: 'S256',
        });

        // Optionally, get the access token for local usage
        //const accessToken = await getAccessTokenWithPopup();
        //console.log('Access Token:', accessToken);

         // Redirect to the Home page after successful authentication
         history.push('/home');
      } catch (error) {
        console.error('Callback error:', error);
      }
    };

    handleCallback();
  }, [loginWithRedirect, getAccessTokenWithPopup, history]);

  return <div>Loading...</div>;
};

export default CallbackPage;
