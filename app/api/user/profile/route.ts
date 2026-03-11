import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userDataHeader = req.headers.get("x-user-data");
    if (!userDataHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = JSON.parse(userDataHeader);

    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        deletedAt: true,
        lastNameChange: true, // ✅ Include this
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userDataHeader = req.headers.get("x-user-data");
    if (!userDataHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = JSON.parse(userDataHeader);
    const body = await req.json();
    const { name } = body;

    // Validate
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if user can change name (2 weeks restriction)
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { lastNameChange: true },
    });

    if (user?.lastNameChange) {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      if (new Date(user.lastNameChange) > twoWeeksAgo) {
        const daysLeft = Math.ceil(
          (new Date(user.lastNameChange).getTime() +
            14 * 24 * 60 * 60 * 1000 -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return NextResponse.json(
          {
            error: `You can change your name again in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
          },
          { status: 400 }
        );
      }
    }

    // Update user name and timestamp
    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: {
        name,
        lastNameChange: new Date(), // ✅ Update timestamp
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}