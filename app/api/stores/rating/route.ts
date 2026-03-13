import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/store/rating?sellerId=xxx
export async function GET(req: NextRequest) {
  const sellerId = req.nextUrl.searchParams.get("sellerId");
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  const userData = req.headers.get("x-user-data");
  const me = userData ? (() => { try { return JSON.parse(userData) as { id: string }; } catch { return null; } })() : null;

  const [agg, myRow] = await Promise.all([
    prisma.storeReview.aggregate({
      where: { sellerId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    me
      ? prisma.storeReview.findUnique({ where: { sellerId_userId: { sellerId, userId: me.id } } })
      : null,
  ]);

  return NextResponse.json({
    avg:      agg._avg.rating ?? 0,
    total:    agg._count.rating,
    myRating: myRow?.rating ?? 0,
  });
}

// POST /api/store/rating  { sellerId, rating }
export async function POST(req: NextRequest) {
  const userData = req.headers.get("x-user-data");
  if (!userData) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  let me: { id: string; name: string };
  try { me = JSON.parse(userData); } catch { return NextResponse.json({ error: "Bad user data" }, { status: 400 }); }

  const { sellerId, rating } = await req.json() as { sellerId: string; rating: number };
  if (!sellerId || !rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  // Block sellers from rating their own store
  const seller = await prisma.seller.findUnique({ where: { id: sellerId }, select: { userId: true } });
  if (seller?.userId === me.id)
    return NextResponse.json({ error: "Cannot rate your own store" }, { status: 403 });

  await prisma.storeReview.upsert({
    where:  { sellerId_userId: { sellerId, userId: me.id } },
    create: { sellerId, userId: me.id, userName: me.name, rating, comment: "" },
    update: { rating },
  });

  // Return fresh avg
  const agg = await prisma.storeReview.aggregate({
    where: { sellerId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return NextResponse.json({ avg: agg._avg.rating ?? 0, total: agg._count.rating, myRating: rating });
}

// DELETE /api/store/rating?sellerId=xxx
export async function DELETE(req: NextRequest) {
  const userData = req.headers.get("x-user-data");
  if (!userData) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  const me = JSON.parse(userData) as { id: string };
  const sellerId = req.nextUrl.searchParams.get("sellerId");
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  await prisma.storeReview.deleteMany({ where: { sellerId, userId: me.id } });

  const agg = await prisma.storeReview.aggregate({
    where: { sellerId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return NextResponse.json({ avg: agg._avg.rating ?? 0, total: agg._count.rating, myRating: 0 });
}