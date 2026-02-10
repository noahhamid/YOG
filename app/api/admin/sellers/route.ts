import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Only admins can view applications
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";

    let whereClause: any = {};

    if (filter === "pending") {
      whereClause = {
        approved: false,
        rejectionReason: null,
      };
    } else if (filter === "approved") {
      whereClause = { approved: true };
    } else if (filter === "rejected") {
      whereClause = {
        approved: false,
        NOT: { rejectionReason: null },
      };
    }

    const sellers = await prisma.seller.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ sellers });
  } catch (error: any) {
    console.error("Error fetching sellers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch sellers" },
      { status: error.message === "Forbidden - Requires role: ADMIN" ? 403 : 500 }
    );
  }
}