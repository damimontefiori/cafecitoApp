import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-281573522-77e6b",
  "appId": "1:386334266813:web:8d9597eba6d5c13b4aeed4",
  "apiKey": "AIzaSyBZLt4bfXsnDDcYKmXssJ-Gp6aBSZLy56o",
  "authDomain": "studio-281573522-77e6b.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "386334266813"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
