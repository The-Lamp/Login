// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Email Sign Up/Login
const emailForm = document.getElementById("email-form");
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Logged in:", userCredential.user);
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        auth.createUserWithEmailAndPassword(email, password)
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
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

function sendOTP() {
  const phoneNumber = document.getElementById("phone-number").value;
  const appVerifier = window.recaptchaVerifier;

  auth.signInWithPhoneNumber(phoneNumber, appVerifier)
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
