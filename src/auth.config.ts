import { isPlatform } from "@ionic/react";

export const domain = "royerm.eu.auth0.com";
export const clientId = "bVa2PDrmp8zmJ9tumzIrDa1lmgQ9IkxX";
const appId = "io.ionic.starter";

// Use `auth0Domain` in string interpolation below so that it doesn't
// get replaced by the quickstart auto-packager
const auth0Domain = domain;

const iosOrAndroid = isPlatform('ios') || isPlatform('android');

// export const callbackUri = iosOrAndroid
//  ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
//  : 'https://unicorn.royerm.fr/';

export const callbackUri = 'https://unicorn.royerm.fr/';