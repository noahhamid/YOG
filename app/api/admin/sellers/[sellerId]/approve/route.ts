import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    // Only admins can approve
    await requireAdmin();

    const { sellerId } = params;

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

    // Approve seller
    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        approved: true,
        rejectionReason: null, // Clear any previous rejection
      },
    });

    return NextResponse.json({
      message: "Seller approved successfully",
      seller: updatedSeller,
    });
  } catch (error: any) {
    console.error("Error approving seller:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve seller" },
      { status: 500 }
    );
  }
}