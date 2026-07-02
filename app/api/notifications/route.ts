import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ notifications: [] });

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        productId: true,
        sellerId: true,
        imageUrl: true,
        read: true,
        createdAt: true,
      },
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    console.error("❌ Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { notificationId, markAllRead } = await req.json();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId, userId: session.user.id },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error updating notification:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("id");

    if (!notificationId)
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 });

    await prisma.notification.delete({
      where: { id: notificationId, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error deleting notification:", error);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}