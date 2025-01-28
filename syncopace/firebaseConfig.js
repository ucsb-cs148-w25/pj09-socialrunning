import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD2oAF8S1eMVcYg-YOXeYHykq6r0ypD73I",
  authDomain: "syncopace-148.firebaseapp.com",
  projectId: "syncopace-148",
  storageBucket: "syncopace-148.firebasestorage.app",
  messagingSenderId: "438165622478",
  appId: "1:438165622478:web:b1f4ca077b7a813c258a9f",
  measurementId: "G-CB7J20NZ00"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };