// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyBwnHkj-ZuprID9YKN8MLRVwAx-JEBjdbs",
    authDomain: "customercontrol-b3738.firebaseapp.com",
    projectId: "customercontrol-b3738",
    storageBucket: "customercontrol-b3738.firebasestorage.app",
    messagingSenderId: "941129329767",
    appId: "1:941129329767:web:e97e99afb7b91d54b678c2",
    measurementId: "G-DH4442N0PE"
};

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase configurado correctamente");
} catch (error) {
    console.error("Error inicializando Firebase:", error);
}

// Inicializar servicios
const db = firebase.firestore();
//const storage = firebase.storage();

// Configuración de Firestore para desarrollo
db.settings({
    timestampsInSnapshots: true
});