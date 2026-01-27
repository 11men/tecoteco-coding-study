import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBJJ_eCXXZtCAHT9MGBpxBtTjtc9K0TcKg",
  authDomain: "busstrikeapp.firebaseapp.com",
  projectId: "busstrikeapp",
  storageBucket: "busstrikeapp.firebasestorage.app",
  messagingSenderId: "458094094282",
  appId: "1:458094094282:web:16f321eca2ad5bd1275133",
  measurementId: "G-5WX92K3HCT"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
