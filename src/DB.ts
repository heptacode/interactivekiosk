import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "dotenv/config";

export const db = firebase
	.initializeApp({
		apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
		authDomain: "interactive-kiosk.firebaseapp.com",
		databaseURL: "https://interactive-kiosk.firebaseio.com",
		projectId: "interactive-kiosk",
		storageBucket: "interactive-kiosk.appspot.com",
		messagingSenderId: "258332243148",
		appId: "1:258332243148:web:818efb6e1f23a03088fe69",
		measurementId: "G-4PXCEVHDC0",
	})
	.firestore();

export const storageRef = firebase.storage().ref();
