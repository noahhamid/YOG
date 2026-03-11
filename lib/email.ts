import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetOTP(email: string, otp: string, name: string) {
  try {
    const { error } = await resend.emails.send({
      from: "YOG <onboarding@beysolution.com>",
      to: email,
      subject: "Password Reset Code - YOG",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 20px; text-align: center; }
              .logo { color: white; font-size: 36px; font-weight: bold; letter-spacing: 2px; }
              .content { padding: 40px 30px; text-align: center; }
              .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px; }
              .message { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.6; }
              .otp-box { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 12px; padding: 30px; margin: 30px 0; }
              .otp-code { font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace; }
              .otp-label { color: rgba(255, 255, 255, 0.9); font-size: 12px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
              .footer { background-color: #f8f8f8; padding: 30px; text-align: center; font-size: 14px; color: #999; }
              .expiry { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; text-align: left; border-radius: 4px; }
              .expiry-text { color: #856404; font-size: 14px; margin: 0; }
              .warning { background-color: #fee; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; text-align: left; border-radius: 4px; }
              .warning-text { color: #991b1b; font-size: 14px; margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header"><div class="logo">YOG</div></div>
              <div class="content">
                <div class="title">Password Reset Request</div>
                <div class="message">Hi ${name}, we received a request to reset your password. Use the code below to proceed:</div>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                  <div class="otp-label">Your Reset Code</div>
                </div>
                <div class="expiry">
                  <p class="expiry-text">⏰ This code will expire in 10 minutes.</p>
                </div>
                <div class="warning">
                  <p class="warning-text">🔒 If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated message from YOG.</p>
                <p>Ethiopia's Premier Fashion Marketplace</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}