import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

if (!accountSid || !authToken) {
  throw new Error('❌ Twilio credentials missing')
}

const client = twilio(accountSid, authToken)

export async function sendWhatsappMessage(to, message) {
  console.log('📤 Enviando WhatsApp a:', to)

  const response = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to.replace(/\s/g, '')}`,
    body: message
  })

  console.log('✅ WhatsApp enviado. SID:', response.sid)
}