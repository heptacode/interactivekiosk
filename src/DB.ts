import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "@firebase/messaging";
import "dotenv/config";

firebase.initializeApp({
	apiKey: "AIzaSyBPzOY8sn3N9Pyn27tmnLZSTQYrH3RE5CE",
	authDomain: "interactive-kiosk.firebaseapp.com",
	databaseURL: "https://interactive-kiosk.firebaseio.com",
	projectId: "interactive-kiosk",
	storageBucket: "interactive-kiosk.appspot.com",
	messagingSenderId: "258332243148",
	appId: "1:258332243148:web:818efb6e1f23a03088fe69",
	measurementId: "G-4PXCEVHDC0",
});

const messaging = firebase.messaging();
messaging.onMessage((payload) => {
	alert(payload);
});

export const db = firebase.firestore();

export const storageRef = firebase.storage().ref();
