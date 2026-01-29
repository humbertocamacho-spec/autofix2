import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('❌ Twilio credentials missing');
}

const client = twilio(accountSid, authToken);

export async function sendWhatsappTemplate(to, variables) {
  const response = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    contentSid: process.env.TWILIO_TEMPLATE_SID,
    contentVariables: JSON.stringify(variables)
  });

  console.log('✅ WhatsApp (template) enviado. SID:', response.sid);
}
