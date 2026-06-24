// Importando o Firebase (Versão Modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDv1rLIPNyCGhYE1MsuxLE8tGD7-eCGE0Q",
    authDomain: "j23consultoria.firebaseapp.com",
    projectId: "j23consultoria",
    storageBucket: "j23consultoria.firebasestorage.app",
    messagingSenderId: "916361217794",
    appId: "1:916361217794:web:98b2efde767a0e5bd1e41b"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportamos as referências e funções para usar nos outros arquivos
export { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot };

// Configuração de Login (Simples)
export const LOGIN_USER = "admin";
export const LOGIN_PASS = "1234";