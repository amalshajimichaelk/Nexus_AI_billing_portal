"use server"

import prisma from "../../lib/prisma"

export async function getAnalytics() {
  const org = await prisma.organization.findFirst()
  if (!org) return { dailyUsages: [], endpointUsages: [] }

  const dailyUsages = await prisma.dailyUsage.findMany({
    where: { organizationId: org.id },
    orderBy: { id: 'asc' } // In real world order by date
  })

  const endpointUsages = await prisma.endpointUsage.findMany({
    where: { organizationId: org.id },
    orderBy: { requests: 'desc' }
  })

  return { dailyUsages, endpointUsages }
}
