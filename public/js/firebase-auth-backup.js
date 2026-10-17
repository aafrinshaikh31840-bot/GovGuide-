
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
   sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Replace these values with your own Firebase project config.

const firebaseConfig = {
  apiKey: "AIzaSyCTzZxQ4F3aid5MhBH17a8_BZm3I0ZjOic",
  authDomain: "govguide-ca4e7.firebaseapp.com",
  projectId: "govguide-ca4e7",
  storageBucket: "govguide-ca4e7.firebasestorage.app",
  messagingSenderId: "493258840997",
  appId: "1:493258840997:web:4502a4e36933c6a5f4664c",
  measurementId: "G-CCWY9757MY"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Register a new user and send verification email.
export async function registerUser(email, password) {
  const result = await createUserWithEmailAndPassword(
    auth, email, password
  );

  await sendEmailVerification(result.user);
  await signOut(auth);

  return "Account created. Please check your email to verify it.";
}

// Sign in only when email is verified.
export async function loginUser(email, password) {
  const result = await signInWithEmailAndPassword(
    auth, email, password
  );

  if (!result.user.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }

  return result.user;
}

export async function logoutUser() {
  await signOut(auth);
}

// Keep the page updated when authentication changes.
export function watchLoginState(callback) {
  return onAuthStateChanged(auth, callback);
}
export async function resetUserPassword(email) {
  await sendPasswordResetEmail(auth, email);
  return "Password reset link sent. Please check your email inbox and spam folder.";
}

