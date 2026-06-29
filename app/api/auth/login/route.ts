import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) return NextResponse.json({ ok: true });

    // Check if account is scheduled for deletion
    if (user.deletedAt) {
      const daysRemaining = Math.ceil(
        (new Date(user.deletedAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return NextResponse.json({
        scheduledForDeletion: true,
        deletionDate: user.deletedAt,
        daysRemaining,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}