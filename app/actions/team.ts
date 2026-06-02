"use server"

import prisma from "../../lib/prisma"
import { revalidatePath } from "next/cache"
import { enforceRole } from "./auth"

export async function getTeamMembers() {
  return await prisma.user.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export async function inviteTeamMember(email: string, role: string) {
  const currentUser = await enforceRole(["Owner", "Admin"]);
  
  const org = await prisma.organization.findFirst()
  if (!org) throw new Error("No organization found")

  const avatar = email.substring(0, 2).toUpperCase()

  const newUser = await prisma.user.create({
    data: {
      name: email.split('@')[0],
      email,
      role,
      status: "pending",
      avatar,
      lastActive: "—",
      organizationId: org.id
    }
  })

  await prisma.auditEvent.create({
    data: {
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Invited new team member: ${email}`,
      type: "Admin",
      details: `Role: ${role}`,
      ipAddress: "127.0.0.1",
      organizationId: org.id
    }
  })

  revalidatePath('/team')
  revalidatePath('/audit-logs')
  return newUser
}
