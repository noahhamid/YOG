import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userDataHeader = req.headers.get("x-user-data");
    if (!userDataHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userData = JSON.parse(userDataHeader);
    if (userData.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { sellerId, action, reason } = await req.json();

    if (!sellerId || !action)
      return NextResponse.json(
        { error: "Seller ID and action are required" },
        { status: 400 }
      );

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller)
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });

    let updateData: Record<string, unknown> = {};
    let notifTitle = "";
    let notifMessage = "";

    switch (action) {
      case "approve":
        updateData = {
          status: "APPROVED",
          approved: true,
          rejectionReason: null,
          pausedAt: null,
          pausedReason: null,
          suspendedAt: null,
          suspendedReason: null,
        };
        notifTitle = "🎉 Your store has been approved!";
        notifMessage =
          "Congratulations! Your seller application has been approved. You can now add products and start selling on Yog Fashion.";
        break;

      case "reject":
        updateData = {
          status: "REJECTED",
          approved: false,
          rejectionReason: reason || "Application rejected by admin",
        };
        notifTitle = "Application Not Approved";
        notifMessage = `Your seller application was not approved. Reason: ${
          reason || "Application rejected by admin"
        }. You may reapply after addressing the issue.`;
        break;

      case "pause":
        updateData = {
          status: "PAUSED",
          pausedAt: new Date(),
          pausedReason: reason || "Account paused by admin",
        };
        notifTitle = "⚠️ Your store has been paused";
        notifMessage = `Your seller account has been temporarily paused. Reason: ${
          reason || "Account paused by admin"
        }. Please contact support to resolve this.`;
        break;

      case "unpause":
        updateData = {
          status: "APPROVED",
          pausedAt: null,
          pausedReason: null,
        };
        notifTitle = "✅ Your store has been reactivated";
        notifMessage =
          "Your seller account has been reactivated. You can now manage your products and receive orders again.";
        break;

      case "suspend":
        updateData = {
          status: "SUSPENDED",
          suspendedAt: new Date(),
          suspendedReason: reason || "Account suspended by admin",
        };
        await prisma.product.updateMany({
          where: { sellerId },
          data: { status: "ARCHIVED" },
        });
        notifTitle = "🚫 Your store has been suspended";
        notifMessage = `Your seller account has been suspended and your products have been hidden. Reason: ${
          reason || "Account suspended by admin"
        }. Contact support if you believe this is a mistake.`;
        break;

      case "unsuspend":
        updateData = {
          status: "APPROVED",
          suspendedAt: null,
          suspendedReason: null,
        };
        await prisma.product.updateMany({
          where: { sellerId },
          data: { status: "PUBLISHED" },
        });
        notifTitle = "✅ Suspension lifted";
        notifMessage =
          "Your seller account has been unsuspended and your products are live again. Welcome back to Yog Fashion.";
        break;

      case "delete":
        updateData = {
          status: "DELETED",
          deletedAt: new Date(),
        };
        await prisma.product.updateMany({
          where: { sellerId },
          data: { status: "ARCHIVED" },
        });
        notifTitle = "Account Deleted";
        notifMessage =
          "Your seller account has been permanently deleted along with all your products. Contact support if you have questions.";
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: updateData,
    });

    // Notify the seller in-app
    await prisma.notification.create({
      data: {
        userId: seller.userId,
        type: "SYSTEM",
        title: notifTitle,
        message: notifMessage,
        sellerId: seller.id,
        read: false,
      },
    });

    return NextResponse.json({
      message: `Seller ${action}ed successfully`,
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Seller action error:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    );
  }
}