import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: "odetail-backend.firebaseapp.com",
	projectId: "odetail-backend",
	storageBucket: "odetail-backend.appspot.com",
	messagingSenderId: "309927545393",
	appId: "1:309927545393:web:0cee7f41f533277e2b6310",
	measurementId: "G-DQ0X4S3S95",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
export const companyName = "aztec";
