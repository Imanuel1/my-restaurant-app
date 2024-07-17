// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging } from "firebase/messaging/sw";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9CUQnxpBL-_fwrQWMDUiTkOAn7uCMbmM",
  authDomain: "myrestaurant-cff7c.firebaseapp.com",
  projectId: "myrestaurant-cff7c",
  storageBucket: "myrestaurant-cff7c.appspot.com",
  messagingSenderId: "601748001618",
  appId: "1:601748001618:web:0c3c73a83dd04e05cf208b",
  measurementId: "G-LJ4JSF3RYN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// if (!firebase.getApps()?.length) {
//   firebase.initializeApp(firebaseConfig);
// }

export const messaging = () => getMessaging(app);
