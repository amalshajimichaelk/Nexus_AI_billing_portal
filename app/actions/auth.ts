"use server"

import { cookies } from "next/headers"
import prisma from "../../lib/prisma"

const COOKIE_NAME = "nexus_user_id"

export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function loginAs(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, { path: '/' })
  return { success: true }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) return user
  }

  // Fallback to Owner if no cookie (for first time load)
  const fallbackUser = await prisma.user.findFirst({
    where: { role: 'Owner' }
  })
  
  if (fallbackUser && !userId) {
    // Automatically log them in as owner
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, fallbackUser.id, { path: '/' })
  }

  return fallbackUser
}

export async function enforceRole(allowedRoles: string[]) {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error("Unauthorized: No active user found.")
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Unauthorized: Your role (${user.role}) does not have permission to perform this action.`)
  }

  return user
}
