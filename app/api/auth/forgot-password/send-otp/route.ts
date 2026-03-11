import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetOTP } from "@/lib/email";

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists or not (security)
      return NextResponse.json({
        message: "If this email exists, an OTP has been sent",
      });
    }

    // Check if OAuth user
    if (user.provider && user.provider !== "credentials") {
      return NextResponse.json(
        { error: `This account uses ${user.provider} sign-in. Please use ${user.provider} to log in.` },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing unused OTPs for this email
    await prisma.passwordReset.deleteMany({
      where: { email: email.toLowerCase() },
    });

    // Create new OTP
    await prisma.passwordReset.create({
      data: {
        email: email.toLowerCase(),
        otp,
        expiresAt,
      },
    });

    console.log(`🔑 Password reset OTP for ${email}: ${otp}`); // DEBUG

    // Send email
    const emailSent = await sendPasswordResetOTP(email, otp, user.name);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}