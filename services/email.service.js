import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const {
  OFFICE365_EMAIL,
  OFFICE365_PASSWORD
} = process.env;

if (!OFFICE365_EMAIL || !OFFICE365_PASSWORD) {
  console.warn('Office 365 email credentials are not set in environment variables.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: OFFICE365_EMAIL,
    pass: OFFICE365_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

/**
 * Send an email using Office 365 SMTP
 * @param {Object} param0
 * @param {string|string[]} param0.to - Recipient email(s)
 * @param {string} param0.subject - Email subject
 * @param {string} [param0.text] - Plain text body
 * @param {string} [param0.html] - HTML body
 * @returns {Promise<{messageId: string}>}
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: OFFICE365_EMAIL,
      to,
      subject,
      text,
      html,
    });
    return { messageId: info.messageId };
  } catch (error) {
    throw error;
  }
} 