// services/twilioService.js
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createCall(toNumber) {
  return client.calls.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: toNumber,
    url: "http://demo.twilio.com/docs/voice.xml",
  });
}
