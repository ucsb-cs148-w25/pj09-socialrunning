import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2oAF8S1eMVcYg-YOXeYHykq6r0ypD73I",
  authDomain: "syncopace-148.firebaseapp.com",
  projectId: "syncopace-148",
  storageBucket: "syncopace-148.firebasestorage.app",
  messagingSenderId: "438165622478",
  appId: "1:438165622478:web:b1f4ca077b7a813c258a9f",
  measurementId: "G-CB7J20NZ00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
  }
});

export { app, auth };