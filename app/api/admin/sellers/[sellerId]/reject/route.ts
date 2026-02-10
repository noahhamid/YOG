import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    // Only admins can reject
    await requireAdmin();

    const { sellerId } = params;
    const body = await req.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Find seller
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 }
      );
    }

    // Reject seller
    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        approved: false,
        rejectionReason: reason,
      },
    });

    return NextResponse.json({
      message: "Seller rejected",
      seller: updatedSeller,
    });
  } catch (error: any) {
    console.error("Error rejecting seller:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject seller" },
      { status: 500 }
    );
  }
}