import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userDataHeader = req.headers.get("x-user-data");
    if (!userDataHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = JSON.parse(userDataHeader);
    if (userData.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { sellerId, action, reason } = await req.json();

    if (!sellerId || !action) {
      return NextResponse.json(
        { error: "Seller ID and action are required" },
        { status: 400 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    let updateData: any = {};

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
        break;

      case "reject":
        updateData = {
          status: "REJECTED",
          approved: false,
          rejectionReason: reason || "Application rejected by admin",
        };
        break;

      case "pause":
        updateData = {
          status: "PAUSED",
          pausedAt: new Date(),
          pausedReason: reason || "Account paused by admin",
        };
        break;

      case "unpause":
        updateData = {
          status: "APPROVED",
          pausedAt: null,
          pausedReason: null,
        };
        break;

      case "suspend":
        updateData = {
          status: "SUSPENDED",
          suspendedAt: new Date(),
          suspendedReason: reason || "Account suspended by admin",
        };
        // Hide all products
        await prisma.product.updateMany({
          where: { sellerId },
          data: { status: "ARCHIVED" },
        });
        break;

      case "unsuspend":
        updateData = {
          status: "APPROVED",
          suspendedAt: null,
          suspendedReason: null,
        };
        // Restore products
        await prisma.product.updateMany({
          where: { sellerId },
          data: { status: "PUBLISHED" },
        });
        break;

      case "delete":
        updateData = {
          status: "DELETED",
          deletedAt: new Date(),
        };
        // Archive all products
        await prisma.product.updateMany({
          where: { sellerId },
          data: { status: "ARCHIVED" },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: updateData,
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