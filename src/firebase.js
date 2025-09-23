// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics'; // ✅ Import this

// Your Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: "G-STVN0RF073"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBiwmwZhnd_kbPPfAud0RWg27v9O-GVQC0",
  authDomain: "nairalancers-ee497.firebaseapp.com",
  projectId: "nairalancers-ee497",
  storageBucket: "nairalancers-ee497.firebasestorage.app",
  messagingSenderId: "166236716243",
  appId: "1:166236716243:web:71bb8e51ed80b9ef5da826",
  measurementId: "G-STVN0RF073"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider (optional)
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection every time
});

export default app;
export { analytics };