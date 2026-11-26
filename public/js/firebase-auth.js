
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  signInWithPopup,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTzZxQ4F3aid5MhBH17a8_BZm3I0ZjOic",
  authDomain: "govguide-ca4e7.firebaseapp.com",
  projectId: "govguide-ca4e7",
  storageBucket: "govguide-ca4e7.firebasestorage.app",
  messagingSenderId: "493258840997",
  appId: "1:493258840997:web:4502a4e36933c6a5f4664c",
  measurementId: "G-CCWY9757MY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create a profile only if one does not already exist.
async function ensureUserProfile(user, name = "") {
  if (!user?.email) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: name.trim() || user.displayName || "",
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("User profile tracking failed:", error);
  }
}

// Save a successful login event.
async function recordLogin(user, method) {
  if (!user?.email) return;

  try {
    await addDoc(collection(db, "loginEvents"), {
      email: user.email,
      method,
      loginTime: serverTimestamp()
    });
  } catch (error) {
    console.error("Login history could not be saved:", error);
  }
}

// Register a new account and send verification email.
export async function registerUser(name, email, password) {
  const result = await createUserWithEmailAndPassword(
    auth, email, password
  );

  await ensureUserProfile(result.user, name);
  await sendEmailVerification(result.user);
  await signOut(auth);

  return "Account created. Please check your email to verify it.";
}

// Email/password login.
export async function loginUser(email, password) {
  const result = await signInWithEmailAndPassword(
    auth, email, password
  );

  if (!result.user.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }

  await ensureUserProfile(result.user);
  await recordLogin(result.user, "password");

  return result.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function watchLoginState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function resetUserPassword(email) {
  await sendPasswordResetEmail(auth, email);
  return "Password reset link sent. Please check your email inbox and spam folder.";
}

// Google login.
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  await ensureUserProfile(result.user);
  await recordLogin(result.user, "google");

  return result.user;
}





// Save a Contact Us message for the Admin Dashboard.
export async function submitContactMessage(data) {
  const messageType = String(data.messageType || "").trim();
  const fullName = String(data.fullName || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const subject = String(data.subject || "").trim();
  const message = String(data.message || "").trim();

  const allowedTypes = ["Question", "Complaint", "Feedback", "Suggestion"];

  if (!allowedTypes.includes(messageType)) {
    throw new Error("Please select a valid message category.");
  }

  if (!fullName || !email || !subject || !message) {
    throw new Error("Please complete all contact form fields.");
  }

  if (fullName.length > 100 || email.length > 254 ||
      subject.length > 150 || message.length > 5000) {
    throw new Error("One or more fields are too long.");
  }

  await addDoc(collection(db, "contactMessages"), {
    messageType,
    fullName,
    email,
    subject,
    message,
    status: "new",
    createdAt: serverTimestamp()
  });
}

// Add a password to an existing Google account.
export async function linkPasswordToGoogleAccount(password) {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("Please sign in with Google first.");
  }

  const credential = EmailAuthProvider.credential(
    user.email,
    password
  );

  const result = await linkWithCredential(user, credential);

  await ensureUserProfile(result.user);

  return "Password successfully added to your Google account.";
}