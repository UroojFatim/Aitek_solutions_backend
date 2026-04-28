/**
 * Generate password reset email content
 * @param {Object} param0
 * @param {string} param0.username - Recipient's name
 * @param {string} param0.resetLink - Password reset URL
 * @returns {{ subject: string, html: string, text: string }}
 */
export function getPasswordResetEmail({ username, resetLink }) {
  const subject = 'Reset Your Password';
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello, ${username}</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetLink}" style="background: #0078d4; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
  const text = `Hello, ${username}\n\nYou requested a password reset. Use the link: ${resetLink}\nIf you did not request this, ignore this email.`;
  return { subject, html, text };
}

/**
 * Generate client status notification email content (Admin to Client)
 * @param {Object} param0
 * @param {string} param0.username - Recipient's name
 * @param {string} param0.subject - Email subject
 * @param {string} param0.message - Simple one-line message
 * @returns {{ subject: string, html: string, text: string }}
 */
export function getClientStatusNotificationEmail({ username, subject, message }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333; margin-bottom: 20px;">WolfPack Portal Update</h2>
        
        <p style="color: #555; margin-bottom: 15px;">Hello <strong>${username}</strong>,</p>
        
        <div style="background: #fff; padding: 20px; border-radius: 6px; border-left: 4px solid #0078d4; margin-bottom: 20px;">
          <p style="margin: 0; color: #333; font-size: 16px;">${message}</p>
        </div>
        
        <p style="color: #555; margin-bottom: 20px;">
          Please log into your WolfPack Portal to view the updated status and take any required actions.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
             style="background: #0078d4; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Dashboard
          </a>
        </div>
        
        <p style="color: #888; font-size: 14px; margin-top: 30px; text-align: center;">
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  `;
  
  const text = `Hello ${username},\n\n${message}\n\nPlease log into your WolfPack Portal to view the updated status and take any required actions.\n\nIf you have any questions, please contact our support team.`;
  
  return { subject, html, text };
}
/**
 * Generate admin notification email content (Client to Admin)
 * @param {Object} param0
 * @param {string} param0.subject - Email subject
 * @param {string} param0.message - Simple one-line message
 * @returns {{ subject: string, html: string, text: string }}
 */
export function getAdminNotificationEmail({ subject, message }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333; margin-bottom: 20px;">WolfPack Portal Admin Alert</h2>
        
        <div style="background: #fff; padding: 20px; border-radius: 6px; border-left: 4px solid #0078d4; margin-bottom: 20px;">
          <p style="margin: 0; color: #333; font-size: 16px;">${message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/client"
             style="background: #0078d4; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Review in Admin Portal
          </a>
        </div>
        
        <p style="color: #888; font-size: 14px; margin-top: 30px; text-align: center;">
          This is an automated notification from the WolfPack Portal.
        </p>
      </div>
    </div>
  `;

  const text = `${message}\n\nReview in admin portal: ${(process.env.FRONTEND_URL || 'http://localhost:5173') + '/admin/client'}`;

  return { subject, html, text };
}