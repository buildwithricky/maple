import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDS7s_R5yVHS4P-vG9oimVA1wvOLS9TFDQ",
  authDomain: "maplepay-exchange.firebaseapp.com",
  projectId: "maplepay-exchange",
  storageBucket: "maplepay-exchange.appspot.com",
  messagingSenderId: "1098122884603",
  appId: "1:1098122884603:web:f8cf0b6a5f42db76dd875e",
  measurementId: "G-34E2ZSTV4N"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;