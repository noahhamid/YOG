import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch user notifications
export async function GET(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json({ notifications: [] });
    }

    const user = JSON.parse(userStr);

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Last 50 notifications
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("❌ Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Mark notification as read
export async function POST(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId, markAllRead } = await req.json();
    const user = JSON.parse(userStr);

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false,
        },
        data: {
          read: true,
        },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId: user.id,
        },
        data: {
          read: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification
export async function DELETE(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("id");
    const user = JSON.parse(userStr);

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}