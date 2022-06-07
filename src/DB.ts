import '@firebase/messaging';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import Store from '@/store';

firebase.initializeApp({
  apiKey: 'AIzaSyBPzOY8sn3N9Pyn27tmnLZSTQYrH3RE5CE',
  authDomain: 'interactive-kiosk.firebaseapp.com',
  databaseURL: 'https://interactive-kiosk.firebaseio.com',
  projectId: 'interactive-kiosk',
  storageBucket: 'interactive-kiosk.appspot.com',
  messagingSenderId: '258332243148',
  appId: '1:258332243148:web:818efb6e1f23a03088fe69',
  measurementId: 'G-4PXCEVHDC0',
});

const messaging = firebase.messaging();

messaging
  .getToken({
    vapidKey:
      'BE8_WQxU18fUBK7Q7B3eeoXFJKn_0hDJIZ2E7dT5xZJY6IYYFUz96tv4fL2sJzox8btaFP7b6cH_MtqgJDrPVqE',
  })
  .then(currentToken => {
    if (currentToken) {
      Store.state.fcmToken = currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  })
  .catch(err => {
    console.error('An error occurred while retrieving token. ', err);
  });

messaging.onMessage(payload => {
  console.log(payload);
  alert(`[${payload.notification.title}] ${payload.notification.body}`);
});

export const db = firebase.firestore();

export const storageRef = firebase.storage().ref();
