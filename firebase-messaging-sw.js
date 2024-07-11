// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId
firebase.initializeApp({
    apiKey: "AIzaSyD9CUQnxpBL-_fwrQWMDUiTkOAn7uCMbmM",
    authDomain: "myrestaurant-cff7c.firebaseapp.com",
    projectId: "myrestaurant-cff7c",
    storageBucket: "myrestaurant-cff7c.appspot.com",
    messagingSenderId: "601748001618",
    appId: "1:601748001618:web:0c3c73a83dd04e05cf208b",
    measurementId: "G-LJ4JSF3RYN",
});

const messaging = firebase.messaging();

// Customize notification handler here
messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
