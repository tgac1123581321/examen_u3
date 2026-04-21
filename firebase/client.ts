import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA8IY_Wbh33pdqaaY2kKO54CGifi-fEdPs",
  authDomain: "web-218500.firebaseapp.com",
  projectId: "web-218500",
  storageBucket: "web-218500.appspot.com",
  messagingSenderId: "539802319607",
  appId: "1:539802319607:web:dc04682efd3ffa857531f2"
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
