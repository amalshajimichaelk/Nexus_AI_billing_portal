"use server"

import prisma from "../../lib/prisma"

export async function getAnalytics() {
  const org = await prisma.organization.findFirst()
  if (!org) return { dailyUsages: [], endpointUsages: [] }

  let dailyUsages = await prisma.dailyUsage.findMany({
    where: { organizationId: org.id }
  })

  // Sort them chronologically
  dailyUsages.sort((a, b) => {
    return new Date(`${a.date} 2026`).getTime() - new Date(`${b.date} 2026`).getTime();
  });

  const endpointUsages = await prisma.endpointUsage.findMany({
    where: { organizationId: org.id },
    orderBy: { requests: 'desc' }
  })

  return { dailyUsages, endpointUsages }
}
