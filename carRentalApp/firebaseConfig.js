// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// 1. import the firestore service
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ0xPcR-XU5t9JA80CW86ZGNL9_Uw2XJk",
  authDomain: "w10s1-da719.firebaseapp.com",
  projectId: "w10s1-da719",
  storageBucket: "w10s1-da719.firebasestorage.app",
  messagingSenderId: "501123117795",
  appId: "1:501123117795:web:fc37a7e1c94494fcd40bd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. initialize Firestore service
const db = getFirestore(app)    //  initializing the database service
const auth = getAuth(app)        // initialize the authentication service

// 3. export the Firestore service from this js file so other parts of your app can use it
export { db , auth }