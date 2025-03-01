// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy96VqW4yh9B-NBeYMyjHr62jt2uRVwio",
  authDomain: "budget-tracker-40d8d.firebaseapp.com",
  projectId: "budget-tracker-40d8d",
  storageBucket: "budget-tracker-40d8d.firebasestorage.app",
  messagingSenderId: "385695995492",
  appId: "1:385695995492:web:a4a8b63ff5ee070dcc3171",
  measurementId: "G-Z5W26HZZCG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
