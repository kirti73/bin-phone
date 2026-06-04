import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBS4Q0MnnnEi34qeHJC-utlAARGVf7th50",
  authDomain: "recyclebin-d3be8.firebaseapp.com",
  databaseURL: "https://recyclebin-d3be8-default-rtdb.firebaseio.com",
  projectId: "recyclebin-d3be8",
  storageBucket: "recyclebin-d3be8.firebasestorage.app",
  messagingSenderId: "267063057316",
  appId: "1:267063057316:web:58175c59294d572f387f31"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);