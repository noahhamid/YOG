import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Require authentication - throws error if not logged in
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized - Please sign in");
  }
  
  return user;
}

/**
 * Require specific role - throws error if user doesn't have required role
 */
export async function requireRole(roles: ("USER" | "SELLER" | "ADMIN")[]) {
  const user = await requireAuth();
  
  if (!roles.includes(user.role)) {
    throw new Error(`Forbidden - Requires role: ${roles.join(" or ")}`);
  }
  
  return user;
}

/**
 * Require seller role and return sellerId
 */
export async function requireSeller() {
  const user = await requireRole(["SELLER", "ADMIN"]);
  
  if (user.role === "SELLER" && !user.sellerId) {
    throw new Error("Seller profile not found");
  }
  
  return {
    user,
    sellerId: user.sellerId as string,
  };
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return await requireRole(["ADMIN"]);
}

/**
 * Check if user has specific role (doesn't throw error)
 */
export async function hasRole(roles: ("USER" | "SELLER" | "ADMIN")[]) {
  const user = await getCurrentUser();
  
  if (!user) return false;
  
  return roles.includes(user.role);
}

/**
 * API Response helpers
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}