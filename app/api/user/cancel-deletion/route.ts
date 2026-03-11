import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if deletion is scheduled
    if (!user.deletedAt) {
      return NextResponse.json(
        { error: "No deletion scheduled for this account" },
        { status: 400 }
      );
    }

    // Cancel deletion
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null },
    });

    return NextResponse.json({
      success: true,
      message: "Account deletion cancelled successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Cancel deletion error:", error);
    return NextResponse.json(
      { error: "Failed to cancel deletion" },
      { status: 500 }
    );
  }
}