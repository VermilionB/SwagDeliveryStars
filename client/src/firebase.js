import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD-OUGaZvVJImY1CM2EWlWarvvQ0fCgYmU",
    authDomain: "swagdeliverystars.firebaseapp.com",
    projectId: "swagdeliverystars",
    storageBucket: "swagdeliverystars.appspot.com",
    messagingSenderId: "701968038276",
    appId: "1:701968038276:web:93b7865989e513ff1885d1",
    measurementId: "G-FGYC5GCZJH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };