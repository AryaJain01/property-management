"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getProperties(filter?: {
  searchTerm?: string,
  minPrice?: number,
  maxPrice?: number
}) {
  const where: any = {};
  if (filter?.searchTerm) {
    where.OR = [
      { title: { contains: filter.searchTerm } },
      { address: { contains: filter.searchTerm } }
    ]
  }
  if (filter?.minPrice) {
    where.price = { ...where.price, gte: filter.minPrice }
  }
  if (filter?.maxPrice) {
    where.price = { ...where.price, lte: filter.maxPrice }
  }

  return await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { name: true } },
      reviews: { select: { rating: true } }
    }
  });
}

export async function getPropertyById(id: number) {
  return await prisma.property.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, email: true } },
      reviews: { include: { tenant: { select: { name: true } } } }
    }
  });
}

// For Owner Dashboard
export async function getMyProperties() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "OWNER") {
    throw new Error("Unauthorized");
  }

  return await prisma.property.findMany({
    where: { ownerId: parseInt((session.user as any).id) },
    include: {
      bookings: true,
      maintenanceRequests: true
    }
  });
}
