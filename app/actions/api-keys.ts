"use server"

import prisma from "../../lib/prisma"
import { revalidatePath } from "next/cache"
import { enforceRole } from "./auth"

export async function getApiKeys() {
  return await prisma.apiKey.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function createApiKey(name: string) {
  const currentUser = await enforceRole(["Owner", "Admin", "Developer"]);
  
  const org = await prisma.organization.findFirst()
  if (!org) throw new Error("No organization found")

  const newKey = await prisma.apiKey.create({
    data: {
      name,
      keyString: `nk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      status: "active",
      lastUsedAt: "Never",
      requests: 0,
      permissions: JSON.stringify(["read"]),
      organizationId: org.id
    }
  })

  await prisma.auditEvent.create({
    data: {
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Created new API key: ${name}`,
      type: "API",
      details: "Permissions: read",
      ipAddress: "127.0.0.1",
      organizationId: org.id
    }
  })

  revalidatePath('/api-keys')
  revalidatePath('/audit-logs')
  return newKey
}

export async function revokeApiKey(id: string) {
  const currentUser = await enforceRole(["Owner", "Admin", "Developer"]);
  
  const key = await prisma.apiKey.update({
    where: { id },
    data: { status: "revoked" }
  })

  const org = await prisma.organization.findFirst()
  if (org) {
    await prisma.auditEvent.create({
      data: {
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Revoked API Key: ${key.name}`,
        type: "Security",
        details: `Key ${key.keyString.substring(0, 10)}... revoked`,
        ipAddress: "127.0.0.1",
        organizationId: org.id
      }
    })
  }

  revalidatePath('/api-keys')
  revalidatePath('/audit-logs')
  return key
}
