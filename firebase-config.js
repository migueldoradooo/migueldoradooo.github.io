// 1. Importar desde las URLs de la CDN para que el navegador lo entienda
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// 2. Importar los servicios de Auth (Login) y Firestore (Base de datos)
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tu configuración web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAJIydql2_a7S7H4ClhDvjk26e_CG8wzmc",
  authDomain: "clientes-db-ec584.firebaseapp.com",
  projectId: "clientes-db-ec584",
  storageBucket: "clientes-db-ec584.firebasestorage.app",
  messagingSenderId: "558458129111",
  appId: "1:558458129111:web:0d4231795520fc5694fe92",
  measurementId: "G-RMEE5KS4KF"
};

// 3. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// 4. EXPORTAR todo para poder usarlo en tu app.js
export { app, analytics, auth, db };