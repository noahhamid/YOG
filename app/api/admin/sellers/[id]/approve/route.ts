export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // NEXT.JS 15: Must await params
    const { id: sellerId } = await params;

    console.log(`✅ Approving seller: ${sellerId}`);

    // Update seller to approved
    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        approved: true,
        rejectionReason: null, // Clear any previous rejection
      },
    });

    console.log(`✅ Seller approved: ${seller.brandName}`);

    return NextResponse.json({
      success: true,
      message: "Seller approved successfully",
      seller,
    });
  } catch (error: any) {
    console.error("❌ Error approving seller:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve seller" },
      { status: 500 }
    );
  }
}