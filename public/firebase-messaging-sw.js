importScripts("/__/firebase/8.1.2/firebase-app.js");
importScripts("/__/firebase/8.1.2/firebase-messaging.js");
importScripts("/__/firebase/init.js");

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log("[firebase-messaging-sw.js] Received background message ", payload);

	const notificationTitle = "Background Message Title";
	const notificationOptions = {
		body: "Background Message body.",
		icon: "/assets/images/favicon.png",
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
