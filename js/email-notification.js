
import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

const SERVICE_ID = "service_l0x070n";
const TEMPLATE_ID = "template_d77ltlr";
const PUBLIC_KEY = "_CYX6q_OilG7nDkCW";

export async function sendAdminLoginAlert(userEmail) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      user_email: userEmail,
      login_time: new Date().toLocaleString()
    },
    {
      publicKey: PUBLIC_KEY
    }
  );
}
