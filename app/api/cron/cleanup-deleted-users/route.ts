import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find users scheduled for deletion where deletedAt is in the past
    const usersToDelete = await prisma.user.findMany({
      where: {
        deletedAt: {
          lte: now,
        },
      },
    });

    // Delete users
    const deletePromises = usersToDelete.map((user) =>
      prisma.user.delete({
        where: { id: user.id },
      })
    );

    await Promise.all(deletePromises);

    return NextResponse.json({
      message: `Deleted ${usersToDelete.length} users`,
      count: usersToDelete.length,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to cleanup users" },
      { status: 500 }
    );
  }
}