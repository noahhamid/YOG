import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id },
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

    const status = seller.status.toLowerCase();

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