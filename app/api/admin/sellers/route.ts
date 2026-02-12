import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // In production, verify admin authentication here
    // For now, we'll trust the frontend check

    const sellers = await prisma.seller.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`📊 Fetched ${sellers.length} sellers for admin`);

    return NextResponse.json({
      success: true,
      sellers,
    });
  } catch (error: any) {
    console.error("❌ Error fetching sellers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}