// src/firebaseConfig.ts
import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Define your Firebase configuration with proper typing
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDN0vNr8ulD-qVpOUQaesdHtfyBqBIo9Hs",
  authDomain: "senateway-f2c37.firebaseapp.com",
  databaseURL: "https://senateway-f2c37-default-rtdb.firebaseio.com",
  projectId: "senateway-f2c37",
  storageBucket: "senateway-f2c37.firebasestorage.app",
  messagingSenderId: "118997397813",
  appId: "1:118997397813:web:23c6193d932a01e9d21c7c",
  measurementId: "G-007DC2JWQ2",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Analytics only if supported (browser environment)
isSupported()
  .then((supported: boolean) => {
    if (supported) {
      const analytics: Analytics = getAnalytics(app);
      console.log("✅ Firebase Analytics initialized");
    } else {
      console.log("⚠️ Analytics not supported in this environment");
    }
  })
  .catch((error: unknown) => {
    console.error("Error checking analytics support:", error);
  });

export default app;
export { database };
