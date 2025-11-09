// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM0JOz8Gbfi5SPpTbVkdFn6J9Xf8wgL8Y",
  authDomain: "hackconnectmvp.firebaseapp.com",
  projectId: "hackconnectmvp",
  storageBucket: "hackconnectmvp.firebasestorage.app",
  messagingSenderId: "5227865211",
  appId: "1:5227865211:web:330b2d079d1461f2b9aede",
  measurementId: "G-CQHZ0D0747"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);