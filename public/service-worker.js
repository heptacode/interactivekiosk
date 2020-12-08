var cacheName = "firebaseStorage";
var urlsToCache = ["/assets/images/payments.svg", "/assets/images/credit_card.svg"];

self.addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener("fetch", function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) return response;
			return fetch(event.request);
		})
	);
});

importScripts("/__/firebase/8.1.2/firebase-app.js");
importScripts("/__/firebase/8.1.2/firebase-messaging.js");
importScripts("/__/firebase/init.js");

const messaging = firebase.messaging();
messaging.onMessage((payload) => {
	alert(payload);
});

messaging
	.getToken({ vapidKey: process.env.VUE_APP_FIREBASE_WEBPUSH_KEY })
	.then((currentToken) => {
		if (currentToken) {
			sendTokenToServer(currentToken);
			updateUIForPushEnabled(currentToken);
		} else {
			// Show permission request.
			console.log("No registration token available. Request permission to generate one.");
			// Show permission UI.
			updateUIForPushPermissionRequired();
			setTokenSentToServer(false);
		}
	})
	.catch((err) => {
		console.log("An error occurred while retrieving token. ", err);
		showToken("Error retrieving registration token. ", err);
		setTokenSentToServer(false);
	});

messaging.onBackgroundMessage((payload) => {
	console.log("[firebase-messaging-sw.js] Received background message ", payload);

	const notificationTitle = "Background Message Title";
	const notificationOptions = {
		body: "Background Message body.",
		icon: "/assets/images/favicon.png",
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
