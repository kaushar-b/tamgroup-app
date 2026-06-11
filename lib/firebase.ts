import { initializeApp } from 'firebase/app';

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {

  apiKey: "AIzaSyDOva0jMXCvt55nKHXEiS2BGlRo5niWiOM",

  authDomain: "tam-app-2674c.firebaseapp.com",

  projectId: "tam-app-2674c",

  storageBucket: "tam-app-2674c.firebasestorage.app",

  messagingSenderId: "900257883854",

  appId: "1:900257883854:web:008e757ee27cb5365ed29f",

};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {

  persistence: getReactNativePersistence(AsyncStorage),

});

