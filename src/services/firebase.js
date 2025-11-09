// Import the functions you need from the SDKs you need
// // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnGPADKgwWsIhYz2-KG-xWHaXaVkG33A8",
  authDomain: "hackconnect-v2.firebaseapp.com",
  projectId: "hackconnect-v2",
  storageBucket: "hackconnect-v2.firebasestorage.app",
  messagingSenderId: "287263718271",
  appId: "1:287263718271:web:0e501fceec33fcb6a4384a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Analytics may not be available in all environments; guard it.
let analytics;
try {if(firebaseConfig.measurementId){analytics = getAnalytics(app);}} catch (e) {}  //ignore analytics in local host
export { auth, provider, signInWithPopup };