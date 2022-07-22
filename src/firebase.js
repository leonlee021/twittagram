import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCMqjob2IVqBFCJqOY9H34L_ocUbxO1eVc",
    authDomain: "instagram-twitter-mash.firebaseapp.com",
    databaseURL: "https://instagram-twitter-mash-default-rtdb.firebaseio.com",
    projectId: "instagram-twitter-mash",
    storageBucket: "instagram-twitter-mash.appspot.com",
    messagingSenderId: "76177855209",
    appId: "1:76177855209:web:9d9bb0092a15bc866a9678",
    measurementId: "G-E1DVJWL86M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }

