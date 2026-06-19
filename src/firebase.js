import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9zbNksKFxGdygvAeE4SFfF9Z_638UAJU",
  authDomain: "antalyahotelsystems.firebaseapp.com",
  projectId: "antalyahotelsystems",
  storageBucket: "antalyahotelsystems.firebasestorage.app",
  messagingSenderId: "439121771971",
  appId: "1:439121771971:web:52b5fcb5c739061914d176"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn("Persistence failed-precondition: multiple tabs open");
  } else if (err.code === 'unimplemented') {
    console.warn("Persistence unimplemented");
  }
});