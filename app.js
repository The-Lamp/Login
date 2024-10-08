// Switch to Signup Form
document.getElementById("show-signup").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-title").textContent = "Create Account";
  document.getElementById("email-form").style.display = "none"; // Hide email form
  document.getElementById("phone-form").style.display = "none"; // Hide phone form
  document.getElementById("otp-form").style.display = "none"; // Hide OTP form
});

// Switch to Login Form
document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-title").textContent = "Login";
  document.getElementById("email-form").style.display = "block"; // Show email form
  document.getElementById("phone-form").style.display = "none"; // Hide phone form
  document.getElementById("otp-form").style.display = "none"; // Hide OTP form
});

// Switch to Login from OTP Form
document.getElementById("show-login-otp").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-title").textContent = "Login";
  document.getElementById("email-form").style.display = "block"; // Show email form
  document.getElementById("phone-form").style.display = "none"; // Hide phone form
  document.getElementById("otp-form").style.display = "none"; // Hide OTP form
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZJZvAD5_2VxuZ-VRLVShISqTA-8ylIxU",
  authDomain: "the-lamp-55d80.firebaseapp.com",
  projectId: "the-lamp-55d80",
  storageBucket: "the-lamp-55d80.appspot.com",
  messagingSenderId: "24684558102",
  appId: "1:24684558102:web:41b16eb13d3ec097b74237",
  measurementId: "G-PZXVSM51BQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Email Sign Up/Login
const emailForm = document.getElementById("email-form");
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Logged in:", userCredential.user);
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log("Signed Up:", userCredential.user);
          })
          .catch((signupError) => {
            document.getElementById("error-message").textContent = signupError.message;
          });
      } else {
        document.getElementById("error-message").textContent = error.message;
      }
    });
});

// Phone Number Login
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  'size': 'normal',
  'callback': (response) => {
    console.log("Recaptcha Solved");
  },
  'expired-callback': () => {
    console.log("Recaptcha Expired");
  }
}, auth);

function sendOTP() {
  const phoneNumber = document.getElementById("phone-number").value;
  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      document.getElementById("otp-form").style.display = "block";
      document.getElementById("phone-form").style.display = "none";
    })
    .catch((error) => {
      document.getElementById("error-message").textContent = error.message;
    });
}

function verifyOTP() {
  const otp = document.getElementById("otp").value;

  window.confirmationResult.confirm(otp)
    .then((result) => {
      console.log("Logged in:", result.user);
    })
    .catch((error) => {
      document.getElementById("error-message").textContent = error.message;
    });
}
