importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBJJ_eCXXZtCAHT9MGBpxBtTjtc9K0TcKg",
  authDomain: "busstrikeapp.firebaseapp.com",
  projectId: "busstrikeapp",
  storageBucket: "busstrikeapp.firebasestorage.app",
  messagingSenderId: "458094094282",
  appId: "1:458094094282:web:16f321eca2ad5bd1275133",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/bus-icon.svg'
  });
});
