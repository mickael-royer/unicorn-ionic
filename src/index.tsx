import ReactDOM from 'react-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { domain as auth0Domain, clientId, callbackUri } from "./auth.config";
import App from './App';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables
dotenv.config();

ReactDOM.render(
  <Auth0Provider
  domain={auth0Domain}
  clientId={clientId}
  useRefreshTokens={true}
  cacheLocation="localstorage"
  redirectUri={callbackUri}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
