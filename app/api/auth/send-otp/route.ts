import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

// Store OTPs and user data temporarily - FIXED TYPE SYNTAX
interface OTPData {
  code: string;
  expiresAt: number;
  attempts: number;
  userData?: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  };
}

const otpStore = new Map<string, OTPData>();
const rateLimitMap = new Map<string, number>();

const RATE_LIMIT_MINUTES = 1;
const MAX_ATTEMPTS = 5;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Send OTP for sign up
export async function POST(req: NextRequest) {
  try {
    const { email, name, password, phone } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Rate limiting
    const lastSent = rateLimitMap.get(email.toLowerCase());
    const now = Date.now();

    if (lastSent && now - lastSent < RATE_LIMIT_MINUTES * 60 * 1000) {
      const waitTime = Math.ceil(
        (RATE_LIMIT_MINUTES * 60 * 1000 - (now - lastSent)) / 1000
      );
      return NextResponse.json(
        { error: `Please wait ${waitTime} seconds before requesting a new code` },
        { status: 429 }
      );
    }

    const otp = generateOTP();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store OTP with user data
    otpStore.set(email.toLowerCase(), {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
      userData: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
      },
    });

    rateLimitMap.set(email.toLowerCase(), now);

    console.log(`📧 OTP for ${email}: ${otp}`); // DEBUG

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "YOG <onboarding@beysolution.com>",
      to: email,
      subject: "Your YOG Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #000000 0%, #434343 100%); padding: 40px 20px; text-align: center; }
              .logo { color: white; font-size: 36px; font-weight: bold; letter-spacing: 2px; }
              .content { padding: 40px 30px; text-align: center; }
              .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px; }
              .message { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.6; }
              .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0; }
              .otp-code { font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace; }
              .otp-label { color: rgba(255, 255, 255, 0.9); font-size: 12px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
              .footer { background-color: #f8f8f8; padding: 30px; text-align: center; font-size: 14px; color: #999; }
              .expiry { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; text-align: left; border-radius: 4px; }
              .expiry-text { color: #856404; font-size: 14px; margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header"><div class="logo">YOG</div></div>
              <div class="content">
                <div class="title">Welcome to YOG, ${name}!</div>
                <div class="message">To complete your registration, please use the verification code below:</div>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                  <div class="otp-label">Your Verification Code</div>
                </div>
                <div class="expiry">
                  <p class="expiry-text">⏰ This code will expire in 5 minutes. If you didn't request this code, please ignore this email.</p>
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
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Verify OTP and create account
export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    console.log(`🔍 Verifying OTP for ${email}: ${otp}`);

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
      return NextResponse.json(
        { error: "OTP not found or expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "OTP has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (stored.code !== otp) {
      stored.attempts++;

      if (stored.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(email.toLowerCase());
        return NextResponse.json(
          { error: "Too many failed attempts. Please request a new code." },
          { status: 400 }
        );
      }

      const attemptsLeft = MAX_ATTEMPTS - stored.attempts;
      return NextResponse.json(
        { error: `Invalid OTP. ${attemptsLeft} attempts remaining.` },
        { status: 400 }
      );
    }

    console.log(`✅ OTP verified!`);

    // OTP is valid - create user
    if (!stored.userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 400 });
    }

    const { name, email: userEmail, password, phone } = stored.userData;

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email: userEmail,
        password,
        phone: phone || null,
        provider: "credentials",
        role: "USER",
      },
    });

    console.log(`✅ New user created: ${user.id}`);

    // Delete OTP
    otpStore.delete(email.toLowerCase());

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}