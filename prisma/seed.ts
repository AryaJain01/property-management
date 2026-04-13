import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean DB
  await prisma.review.deleteMany()
  await prisma.maintenanceRequest.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('password123', 10)

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@college.edu',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  })

  const owner = await prisma.user.create({
    data: {
      email: 'owner@college.edu',
      name: 'Property Owner',
      password,
      role: 'OWNER',
    },
  })

  const tenant = await prisma.user.create({
    data: {
      email: 'tenant@college.edu',
      name: 'Tenant User',
      password,
      role: 'TENANT',
    },
  })

  // Create Properties
  const prop1 = await prisma.property.create({
    data: {
      title: 'Luxury Downtown Apartment',
      description: 'A beautiful 2-bedroom apartment in the heart of the city. Perfect for students and young professionals.',
      address: '123 Main St, Cityville',
      price: 1200, // per month for instance, but app might do per night
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
      ownerId: owner.id,
    },
  })

  const prop2 = await prisma.property.create({
    data: {
      title: 'Cozy Studio near Campus',
      description: 'Compact studio apartment just a 5-minute walk from the main university campus. Fully furnished.',
      address: '456 College Ave, Cityville',
      price: 800,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1e52db0642?q=80&w=1974&auto=format&fit=crop',
      ownerId: owner.id,
    },
  })
  
  const prop3 = await prisma.property.create({
    data: {
      title: 'Modern Highrise Condo',
      description: 'Stunning city views from the 24th floor. Includes gym and pool access.',
      address: '789 Skyline Blvd, Cityville',
      price: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
      ownerId: owner.id,
    },
  })

  // Create Mock Booking
  const booking = await prisma.booking.create({
    data: {
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-15'),
      status: 'CONFIRMED',
      totalAmount: 14 * 80, // e.g. 14 days * $80/day
      tenantId: tenant.id,
      propertyId: prop1.id,
    },
  })

  // Create Mock Payment
  await prisma.payment.create({
    data: {
      amount: booking.totalAmount,
      status: 'COMPLETED',
      stripeId: 'pi_mock123abc',
      bookingId: booking.id,
      userId: tenant.id,
    },
  })

  // Create Mock Maintenance Request
  await prisma.maintenanceRequest.create({
    data: {
      title: 'Leaky Faucet',
      description: 'The kitchen faucet is dripping continuously.',
      status: 'OPEN',
      tenantId: tenant.id,
      propertyId: prop1.id,
    },
  })

  // Create Mock Review
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Amazing place! Definitely recommend it.',
      tenantId: tenant.id,
      propertyId: prop2.id, // For a property they presumably rented in the past
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
