const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");

setGlobalOptions({maxInstances: 5});
initializeApp();
const db = getFirestore();

const allowedOrigins = [
  "https://govguide-ca4e7.web.app",
  "https://govguide-ca4e7.firebaseapp.com"
];

exports.submitContactMessage = onRequest(
  {cors: allowedOrigins, maxInstances: 5},
  async (req, res) => {
    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
    }

    try {
      const {fullName, email, messageType, subject, message} = req.body || {};
      const clean = value => typeof value === "string" ? value.trim() : "";

      const data = {
        fullName: clean(fullName),
        email: clean(email).toLowerCase(),
        messageType: clean(messageType),
        subject: clean(subject),
        message: clean(message)
      };

      if (
        data.fullName.length < 2 || data.fullName.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
        data.email.length > 254 ||
        !["Question", "Complaint", "Feedback", "Suggestion"].includes(data.messageType) ||
        data.subject.length < 2 || data.subject.length > 150 ||
        data.message.length < 5 || data.message.length > 5000
      ) {
        return res.status(400).json({error: "Please check all form fields."});
      }

      const ref = await db.collection("contactMessages").add({
        ...data,
        status: "new",
        createdAt: FieldValue.serverTimestamp()
      });

      return res.status(201).json({
        success: true,
        id: ref.id,
        message: "Your message has been submitted successfully."
      });
    } catch (error) {
      console.error("Contact submission failed:", error);
      return res.status(500).json({error: "Submission failed. Please try again."});
    }
  }
);
