import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsappTemplate(to, partnerName, clientName, date, time, notes) {
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    contentSid: process.env.TWILIO_TEMPLATE_SID,
    contentVariables: JSON.stringify({
      "1": partnerName,
      "2": clientName,
      "3": date,
      "4": time,
      "5": notes || "Sin notas"
    })
  });
}