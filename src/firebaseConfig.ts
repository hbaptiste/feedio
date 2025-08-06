import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "<API_KEY>",
  databaseURL: "https://feed-io-2bf05.firebaseio.com",
  authDomain: "feed-io-2bf05.firebaseapp.com",
  projectId: "feed-io-2bf05",
  storageBucket: "feed-io-2bf05.appspot.com",
  messagingSenderId: "1052851113828",
  appId: "1:1052851113828:web:ba3eca53d65b77be2a3471",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const database = getFirestore(app);
export { database };
export default storage;
