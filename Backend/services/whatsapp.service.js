import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsappTemplate(to, date, time, clientName, partnerName, notes) {
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    contentSid: process.env.TWILIO_TEMPLATE_SID,
    contentVariables: JSON.stringify({
      "1": date,
      "2": time,
      "3": clientName,
      "4": partnerName,
      "5": notes || "Sin notas"
    })
  });
}
