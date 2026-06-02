import prisma from "../lib/prisma";
import DashboardClient from "./client";

export default async function DashboardPage() {
  const org = await prisma.organization.findFirst();
  
  if (!org) {
    return <div>Loading...</div>;
  }

  const dailyUsages = await prisma.dailyUsage.findMany({
    where: { organizationId: org.id },
    orderBy: { id: 'asc' }
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
