importScripts("/__/firebase/8.1.2/firebase-app.js");
importScripts("/__/firebase/8.1.2/firebase-messaging.js");
importScripts("/__/firebase/init.js");

const messaging = firebase.messaging();

messaging
	.getToken({ vapidKey: "BE8_WQxU18fUBK7Q7B3eeoXFJKn_0hDJIZ2E7dT5xZJY6IYYFUz96tv4fL2sJzox8btaFP7b6cH_MtqgJDrPVqE" })
	.then((currentToken) => {
		console.log(currentToken);
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
		console.error("An error occurred while retrieving token. ", err);
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
