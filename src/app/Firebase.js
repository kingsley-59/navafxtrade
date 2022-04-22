// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWBswtOD4eN85W3WsG3dCYeDi28wNjvvA",
  authDomain: "navafxtrade-admin.firebaseapp.com",
  projectId: "navafxtrade-admin",
  storageBucket: "navafxtrade-admin.appspot.com",
  messagingSenderId: "233981423604",
  appId: "1:233981423604:web:947d143376b46ad7db93a1"
};

console.log(firebaseConfig.storageBucket);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const storage = getStorage(app);

export default auth;