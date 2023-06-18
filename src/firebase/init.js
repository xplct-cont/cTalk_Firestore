import { getFirestore } from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyC_3MBFNUov6shup1WOEYf1cmYEuyR2FyA",
  authDomain: "cheaptalk-708fc.firebaseapp.com",
  projectId: "cheaptalk-708fc",
  storageBucket: "cheaptalk-708fc.appspot.com",
  messagingSenderId: "206284799526",
  appId: "1:206284799526:web:804c1129f61ecf8db4b0e7"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

export { auth, db, app };
