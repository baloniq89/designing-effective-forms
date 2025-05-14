import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXRwMMm9ySXCMMN7J5qeCnhB_ceIPVolw",
  authDomain: "tpf-pk-bb.firebaseapp.com",
  projectId: "tpf-pk-bb",
  storageBucket: "tpf-pk-bb.firebasestorage.app",
  messagingSenderId: "265107812876",
  appId: "1:265107812876:web:38879294d947e830d67429",
  measurementId: "G-09YJ4TFYSS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

window.addEventListener("DOMContentLoaded", () => {
  const signInButton = document.querySelector("#signInButton");
  const signOutButton = document.querySelector("#signOutButton");

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const userSignIn = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.error("Błąd logowania:", error.code, error.message);
      });
  };

  const userSignOut = async () => {
    signOut(auth)
      .then(() => {
        alert("You have been signed out!");
      })
      .catch((error) => {
        console.error("Błąd wylogowania:", error.code, error.message);
      });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      alert("You are authenticated with Google");
      console.log(user);
    }
  });

  signInButton.addEventListener("click", userSignIn);
  signOutButton.addEventListener("click", userSignOut);
});
