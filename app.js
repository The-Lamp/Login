// Import Firebase Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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
const auth = getAuth(app);

// Sign Up Logic
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const terms = document.getElementById("terms").checked;

  if (password !== confirmPassword) {
    document.getElementById("error-message").innerText = "Passwords do not match!";
    return;
  }

  if (!terms) {
    document.getElementById("error-message").innerText = "You must agree to the terms and conditions.";
    return;
  }

  try {
    // Create User with Email and Password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optionally, you can save the username in your database
    document.getElementById("error-message").innerText = "Account created successfully!";

    // Redirect to dashboard.html after signup
    window.location.href = 'dashboard.html';

  } catch (error) {
    document.getElementById("error-message").innerText = error.message;
  }
});

// Switch to Signup Form
document.getElementById("show-signup").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-title").textContent = "Create Account";
  document.getElementById("email-form").style.display = "none"; // Hide email form
  document.getElementById("signup-form").style.display = "block"; // Show signup form
  document.getElementById("phone-form").style.display = "none"; // Hide phone form
  document.getElementById("otp-form").style.display = "none"; // Hide OTP form
});

// Switch to Login Form
document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-title").textContent = "Login";
  document.getElementById("email-form").style.display = "block"; // Show email form
  document.getElementById("signup-form").style.display = "none"; // Hide signup form
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

// Email Sign Up/Login
const emailForm = document.getElementById("email-form");
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Logged in:", userCredential.user);
      
      // Redirect to dashboard.html after successful login
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        document.getElementById("error-message").textContent = "User not found. Please create an account.";
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
      document.getElementById("otp-form").style.display = "block"; // Show OTP form
      document.getElementById("phone-form").style.display = "none"; // Hide phone form
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
      
      // Redirect to dashboard.html after successful OTP verification
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      document.getElementById("error-message").textContent = error.message;
    });
}
