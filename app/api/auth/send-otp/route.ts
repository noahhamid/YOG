import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP (expires in 5 minutes)
    otpStore.set(email.toLowerCase(), {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    console.log(`📧 OTP for ${email}: ${otp}`); // DEBUG

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "YOG <no-reply@beysolution.com>",
      to: email,
      subject: "Your YOG Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #000000 0%, #434343 100%);
                padding: 40px 20px;
                text-align: center;
              }
              .logo {
                color: white;
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 2px;
              }
              .content {
                padding: 40px 30px;
                text-align: center;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 20px;
              }
              .message {
                font-size: 16px;
                color: #666;
                margin-bottom: 30px;
                line-height: 1.6;
              }
              .otp-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
              }
              .otp-code {
                font-size: 42px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
              }
              .otp-label {
                color: rgba(255, 255, 255, 0.9);
                font-size: 12px;
                margin-top: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .footer {
                background-color: #f8f8f8;
                padding: 30px;
                text-align: center;
                font-size: 14px;
                color: #999;
              }
              .expiry {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
                border-radius: 4px;
              }
              .expiry-text {
                color: #856404;
                font-size: 14px;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">YOG</div>
              </div>
              <div class="content">
                <div class="title">Verify Your Email</div>
                <div class="message">
                  Welcome to YOG! To complete your sign-in, please use the verification code below:
                </div>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                  <div class="otp-label">Your Verification Code</div>
                </div>
                <div class="expiry">
                  <p class="expiry-text">
                    ⏰ This code will expire in 5 minutes. If you didn't request this code, please ignore this email.
                  </p>
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
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Verify OTP endpoint - NOW CREATES USER AND SESSION
export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    console.log(`🔍 Verifying OTP for ${email}: ${otp}`); // DEBUG

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
      return NextResponse.json(
        { error: "OTP not found or expired" },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    if (stored.code !== otp) {
      console.log(`❌ Invalid OTP. Expected: ${stored.code}, Got: ${otp}`);
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    console.log(`✅ OTP verified!`);

    // OTP is valid - delete it
    otpStore.delete(email.toLowerCase());

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { seller: true },
    });

    if (!user) {
      console.log(`👤 Creating new user for ${email}`);
      
      // Create new user
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: email.split('@')[0], // Use email prefix as name
          phone: `+251${Math.floor(Math.random() * 1000000000)}`, // Temp phone
          password: randomPassword,
          role: "USER",
        },
        include: { seller: true },
      });

      console.log(`✅ User created: ${user.id}`);
    } else {
      console.log(`✅ Existing user found: ${user.id}`);
    }

    // Return success with user data
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}