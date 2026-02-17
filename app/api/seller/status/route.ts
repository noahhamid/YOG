import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const userStr = req.headers.get("x-user-data");
    
    if (!userStr) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userStr);

    // Find seller record
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json({
        status: "none",
        approved: false,
        rejectionReason: null,
      });
    }

    // Determine status
    let status = "pending";
    if (seller.approved) {
      status = "approved";
    } else if (seller.rejectionReason) {
      status = "rejected";
    }

    console.log(`✅ Seller status check: ${user.email} - ${status} (approved: ${seller.approved})`);

    return NextResponse.json({
      status,
      approved: seller.approved,
      rejectionReason: seller.rejectionReason,
      seller: {
        id: seller.id,
        brandName: seller.brandName,
        approved: seller.approved,
      },
    });
  } catch (error: any) {
    console.error("❌ Error checking seller status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}