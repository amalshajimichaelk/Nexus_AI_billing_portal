"use server"

import prisma from "../../lib/prisma"

export async function getAuditLogs() {
  return await prisma.auditEvent.findMany({
    orderBy: {
      timestamp: 'desc'
    }
  })
}
