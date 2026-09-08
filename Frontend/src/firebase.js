import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBklGsvyURRD-3K5uzMZu_Z8PXld-3b1Lc",
  authDomain: "mifra-enterprises.firebaseapp.com",
  projectId: "mifra-enterprises",
  storageBucket: "mifra-enterprises.firebasestorage.app",
  messagingSenderId: "720923361792",
  appId: "1:720923361792:web:d9e233b69ebb42d2ba0ee5",
  measurementId: "G-LHC0B0SHMW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);