import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { otpStore } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    console.log(`🔍 Verifying OTP for ${email}: ${otp}`); // DEBUG

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Get stored OTP
    const stored = otpStore.get(email);

    console.log(`📦 Stored OTP data:`, stored); // DEBUG

    if (!stored) {
      return NextResponse.json(
        { error: "OTP not found or expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json(
        { error: "OTP has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (stored.code !== otp) {
      console.log(`❌ OTP mismatch: Expected ${stored.code}, got ${otp}`); // DEBUG
      return NextResponse.json(
        { error: "Invalid OTP. Please check the code and try again." },
        { status: 400 }
      );
    }

    console.log(`✅ OTP verified successfully!`); // DEBUG

    // OTP is valid - delete it
    otpStore.delete(email);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { seller: true },
    });

    if (!user) {
      console.log(`👤 Creating new user for ${email}`); // DEBUG
      
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: email.split('@')[0],
          phone: `+251${Math.floor(Math.random() * 1000000000)}`,
          password: randomPassword,
          role: "USER",
        },
        include: { seller: true },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        sellerId: user.seller?.id || null,
        sellerApproved: user.seller?.approved || false,
      },
    });
  } catch (error) {
    console.error("❌ Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}