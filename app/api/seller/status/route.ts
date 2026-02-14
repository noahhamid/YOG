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

    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      seller: {
        id: seller.id,
        brandName: seller.brandName,
        approved: seller.approved,
        rejectionReason: seller.rejectionReason,
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching seller status:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller status" },
      { status: 500 }
    );
  }
}