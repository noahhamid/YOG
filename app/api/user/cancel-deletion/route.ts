import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.deletedAt) {
      return NextResponse.json(
        { error: "No deletion scheduled for this account" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: null },
    });

    return NextResponse.json({
      success: true,
      message: "Account deletion cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel deletion error:", error);
    return NextResponse.json(
      { error: "Failed to cancel deletion" },
      { status: 500 }
    );
  }
}