export const dynamic = "force-dynamic";

import prisma from "../lib/prisma";
import DashboardClient from "./client";

export default async function DashboardPage() {
  const org = await prisma.organization.findFirst();
  
  if (!org) {
    return <div>Loading...</div>;
  }

  let dailyUsages = await prisma.dailyUsage.findMany({
    where: { organizationId: org.id }
  });

  // Sort them chronologically (dates are stored as "Jun 2", so we append a year for parsing)
  dailyUsages.sort((a, b) => {
    return new Date(`${a.date} 2026`).getTime() - new Date(`${b.date} 2026`).getTime();
  });

  const apiKeys = await prisma.apiKey.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: 'desc' }
  });

  const auditEvents = await prisma.auditEvent.findMany({
    where: { organizationId: org.id },
    orderBy: { timestamp: 'desc' },
    take: 4
  });

  const usersCount = await prisma.user.count({
    where: { organizationId: org.id }
  });

  const activeKeysCount = apiKeys.filter(k => k.status === 'active').length;

  const stats = {
    totalKeys: apiKeys.length,
    activeKeys: activeKeysCount,
    teamMembers: usersCount
  };

  return (
    <DashboardClient 
      dailyUsages={dailyUsages} 
      apiKeys={apiKeys} 
      auditEvents={auditEvents} 
      stats={stats} 
    />
  );
}
