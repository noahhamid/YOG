import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // NEXT.JS 15: Must await params
    const { id: sellerId } = await params;
    const { reason } = await req.json();

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    console.log(`❌ Rejecting seller: ${sellerId}`);

    // Update seller with rejection
    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        approved: false,
        rejectionReason: reason,
      },
    });

    console.log(`❌ Seller rejected: ${seller.brandName}`);

    return NextResponse.json({
      success: true,
      message: "Seller rejected successfully",
      seller,
    });
  } catch (error: any) {
    console.error("❌ Error rejecting seller:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject seller" },
      { status: 500 }
    );
  }
}