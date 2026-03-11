import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    if (!userStr)
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });

    const user = JSON.parse(userStr);

    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        brandName: true,
        approved: true,
        status: true,
        rejectionReason: true,
        pausedAt: true,
        pausedReason: true,
        suspendedAt: true,
        suspendedReason: true,
        deletedAt: true,
      },
    });

    if (!seller) {
      return NextResponse.json({ status: "none", approved: false });
    }

    // Use the new status field as source of truth
    const status = seller.status.toLowerCase(); // "pending","approved","rejected","paused","suspended","deleted"

    return NextResponse.json({
      status,
      approved: seller.approved,
      seller: {
        id: seller.id,
        brandName: seller.brandName,
        approved: seller.approved,
        status: seller.status,
        rejectionReason: seller.rejectionReason,
        pausedReason: seller.pausedReason,
        pausedAt: seller.pausedAt,
        suspendedReason: seller.suspendedReason,
        suspendedAt: seller.suspendedAt,
        deletedAt: seller.deletedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error checking seller status:", error);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}