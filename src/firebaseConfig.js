// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBlKeXenGsy7LDhEueNXzKWYZn1DY1yU6E",
    authDomain: "x-clone-6fdfb.firebaseapp.com",
    projectId: "x-clone-6fdfb",
    storageBucket: "x-clone-6fdfb.appspot.com",
    messagingSenderId: "513392181946",
    appId: "1:513392181946:web:xxxxxxxxxxxxxx",
    measurementId: "G-XXXXXXXXXX" // opcional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);