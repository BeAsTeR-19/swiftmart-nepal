
const firebaseConfig = {
  projectId: "swiftmart-nepal-db",
  appId: "1:1073632338094:web:3d620c49a66c2cbf0a0d3f",
  storageBucket: "swiftmart-nepal-db.firebasestorage.app",
  apiKey: "AIzaSyAEL58j-iLYUWvDdFb7J2euZ2Yk7GTMphc",
  authDomain: "swiftmart-nepal-db.firebaseapp.com",
  messagingSenderId: "1073632338094"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
