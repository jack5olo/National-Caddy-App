// ============================================================================
// FIREBASE ENGINE INITIALIZER (firebase-config.js)
// ============================================================================

// 1. Import the specific tools we need from Firebase's web delivery server
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Your official application configuration credentials
const firebaseConfig = {
    apiKey: "AIzaSyBtaEpMf4-9R5oXDzRiepKjvNpou0HwenY",
    authDomain: "the-national-caddy-app.firebaseapp.com",
    projectId: "the-national-caddy-app",
    storageBucket: "the-national-caddy-app.firebasestorage.app",
    messagingSenderId: "789380705486",
    appId: "1:789380705486:web:d208e3572d8d11f952f49f",
    measurementId: "G-VM7F2E3Q53"
};

// 3. Boot up the services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. Safely share these tools so your main app.js can use them later
window.firebaseAuth = auth;
window.firebaseDb = db;
window.fbHelpers = { doc, setDoc, getDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut };