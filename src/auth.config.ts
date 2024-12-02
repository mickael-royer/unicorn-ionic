import { isPlatform } from "@ionic/react";

export const domain = process.env.REACT_APP_AUTH0_DOMAIN || "";
export const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

const appId = "io.ionic.starter";

// Use `auth0Domain` in string interpolation below so that it doesn't
// get replaced by the quickstart auto-packager
const auth0Domain = domain;

const iosOrAndroid = isPlatform('ios') || isPlatform('android');

// export const callbackUri = iosOrAndroid
//  ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
//  : 'https://unicorn.royerm.fr/';

export const callbackUri = process.env.REACT_APP_AUTH0_CALLBACK_URI || "";
