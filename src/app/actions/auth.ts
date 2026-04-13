"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function testAction() {
  return "OK"
}
// Removed generic register action logic here to keep separate API route.
