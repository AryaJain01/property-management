"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function createBooking(propertyId: number, startDate: Date, endDate: Date) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "TENANT") {
    throw new Error("Unauthorized: Only tenants can book properties.");
  }

  // Fetch property to calculate price
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error("Property not found");

  // Conflict validation
  const existingBookings = await prisma.booking.findMany({
    where: {
      propertyId,
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [
        { startDate: { lte: endDate }, endDate: { gte: startDate } } // Overlap condition
      ]
    }
  });

  if (existingBookings.length > 0) {
    throw new Error("Property is already booked for the selected dates.");
  }

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  if (days <= 0) throw new Error("Invalid dates");

  const totalAmount = days * property.price;

  const booking = await prisma.booking.create({
    data: {
      propertyId,
      tenantId: parseInt((session.user as any).id),
      startDate,
      endDate,
      totalAmount,
      status: "PENDING"
    }
  });

  return booking;
}

export async function getMyBookings() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  return await prisma.booking.findMany({
    where: { tenantId: parseInt((session.user as any).id) },
    include: { property: true, payment: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getBookingsForOwner() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "OWNER") {
    throw new Error("Unauthorized");
  }

  return await prisma.booking.findMany({
    where: { property: { ownerId: parseInt((session.user as any).id) } },
    include: { property: true, tenant: { select: { name: true, email: true } }, payment: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateBookingStatus(bookingId: number, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "OWNER") {
    throw new Error("Unauthorized");
  }

  // Ensure owner owns this property
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { property: true }
  });

  if (!booking || booking.property.ownerId !== parseInt((session.user as any).id)) {
    throw new Error("Not authorized to update this booking");
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  });
}
