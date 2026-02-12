import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sellerId } = await params;

    console.log(`✅ Approving seller: ${sellerId}`);

    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        approved: true,
        rejectionReason: null,
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