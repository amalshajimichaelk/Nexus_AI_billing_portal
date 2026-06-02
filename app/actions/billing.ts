"use server"

import prisma from "../../lib/prisma"
import { revalidatePath } from "next/cache"
import { enforceRole } from "./auth"

export async function getBillingDetails() {
  const org = await prisma.organization.findFirst({
    include: {
      invoices: {
        orderBy: { date: 'desc' }
      }
    }
  })
  return org
}

export async function upgradePlan(newPlan: string, amount: number) {
  const currentUser = await enforceRole(["Owner"]);
  
  const org = await prisma.organization.findFirst()
  if (!org) throw new Error("No organization found")

  const updatedOrg = await prisma.organization.update({
    where: { id: org.id },
    data: { plan: newPlan }
  })

  await prisma.auditEvent.create({
    data: {
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Changed subscription plan to ${newPlan}`,
      type: "Billing",
      details: `Team \u2192 ${newPlan}`,
      ipAddress: "127.0.0.1",
      organizationId: org.id
    }
  })

  await prisma.invoice.create({
    data: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: amount,
      status: "paid",
      organizationId: org.id
    }
  })

  revalidatePath('/billing')
  revalidatePath('/audit-logs')
  revalidatePath('/')
  return updatedOrg
}
