import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.auditEvent.deleteMany()
  await prisma.apiKey.deleteMany()
  await prisma.user.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.dailyUsage.deleteMany()
  await prisma.endpointUsage.deleteMany()
  await prisma.organization.deleteMany()

  console.log('Seeding data...')
  
  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Intelligence Corp.',
      plan: 'Enterprise Pro',
      billingCycle: 'monthly',
    }
  })

  // Create Users
  const usersData = [
    { name: "Alex Sterling", email: "alex@acmeintel.com", role: "Owner", avatar: "AS", status: "active", lastActive: "Now" },
    { name: "Sarah Miller", email: "sarah@acmeintel.com", role: "Admin", avatar: "SM", status: "active", lastActive: "2 mins ago" },
    { name: "James Chen", email: "james@acmeintel.com", role: "Developer", avatar: "JC", status: "active", lastActive: "1 hr ago" },
    { name: "Emma Wilson", email: "emma@acmeintel.com", role: "Developer", avatar: "EW", status: "active", lastActive: "3 hrs ago" },
    { name: "Michael Park", email: "michael@acmeintel.com", role: "Developer", avatar: "MP", status: "active", lastActive: "Yesterday" },
    { name: "Lisa Zhang", email: "lisa@acmeintel.com", role: "Viewer", avatar: "LZ", status: "active", lastActive: "2 days ago" },
    { name: "David Brown", email: "david@acmeintel.com", role: "Developer", avatar: "DB", status: "pending", lastActive: "—" },
    { name: "Nina Patel", email: "nina@acmeintel.com", role: "Viewer", avatar: "NP", status: "pending", lastActive: "—" },
  ]

  for (const user of usersData) {
    await prisma.user.create({ data: { ...user, organizationId: org.id } })
  }

  // Create API Keys
  const keysData = [
    { name: "Production_Main_Key", keyString: "nk_live_a8f3k29d8912h3j12hg3h12g3h12g33982", status: "active", lastUsedAt: "2 mins ago", requests: 1200000, permissions: JSON.stringify(["read", "write", "admin"]) },
    { name: "Staging_Internal_Testing", keyString: "nk_test_b7e2m41f8h1298dh128dh12hd812h1104", status: "revoked", lastUsedAt: "3 days ago", requests: 45000, permissions: JSON.stringify(["read", "write"]) },
    { name: "Development_Local", keyString: "nk_dev_c4d8p72g9812h398h1293h1298h1298h7721", status: "active", lastUsedAt: "5 mins ago", requests: 890000, permissions: JSON.stringify(["read"]) },
    { name: "CI_CD_Pipeline", keyString: "nk_ci_e9h1q53r8h1289dh1298dh1289dh12d895540", status: "active", lastUsedAt: "1 hr ago", requests: 320000, permissions: JSON.stringify(["read", "write"]) }
  ]

  for (const key of keysData) {
    await prisma.apiKey.create({ data: { ...key, organizationId: org.id } })
  }

  // Create Audit Events
  const eventsData = [
    { user: "Sarah Miller", avatar: "SM", action: "Invited 2 new team members", type: "Admin", details: "david@acmeintel.com, nina@acmeintel.com", ipAddress: "192.168.1.45" },
    { user: "System", avatar: "SY", action: "Billing threshold alert triggered: 80% quota used", type: "Billing", details: "Token usage: 4.0M / 5.0M", ipAddress: "—" },
    { user: "James Chen", avatar: "JC", action: "Rotated API Key (Production_Main_Key)", type: "Security", details: "Key nk_live_****3982 replaced with nk_live_****8841", ipAddress: "10.0.0.12" },
    { user: "Alex Sterling", avatar: "AS", action: "Upgraded subscription to Enterprise Pro", type: "Billing", details: "Team → Enterprise Pro ($499/mo)", ipAddress: "192.168.1.10" },
    { user: "Emma Wilson", avatar: "EW", action: "Created new API key: CI_CD_Pipeline", type: "API", details: "Permissions: read, write", ipAddress: "10.0.0.24" },
    { user: "System", avatar: "SY", action: "Rate limit exceeded on /v1/chat/completions", type: "System", details: "10,000 rpm limit reached for 2 minutes", ipAddress: "—" },
  ]

  for (const event of eventsData) {
    await prisma.auditEvent.create({ data: { ...event, organizationId: org.id } })
  }

  // Create Invoices
  const invoicesData = [
    { amount: 499.00, status: "paid", date: "Jun 1, 2026", invoiceNumber: "INV-2026-06-01" },
    { amount: 499.00, status: "paid", date: "May 1, 2026", invoiceNumber: "INV-2026-05-01" },
    { amount: 249.00, status: "paid", date: "Apr 1, 2026", invoiceNumber: "INV-2026-04-01" },
    { amount: 249.00, status: "paid", date: "Mar 1, 2026", invoiceNumber: "INV-2026-03-01" },
  ]

  for (const invoice of invoicesData) {
    await prisma.invoice.create({ data: { ...invoice, organizationId: org.id } })
  }

  // Create Daily Usage
  const usageData = Array.from({ length: 90 }).map((_, i) => {
    const d = new Date(2026, 5, 2); // Jun 2, 2026
    d.setDate(d.getDate() - (89 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const day = d.getDate();
    return {
      date: `${month} ${day}`,
      tokens: Number((Math.random() * 3 + 1).toFixed(1)),
      queries: Math.floor(Math.random() * 1000 + 400),
      errors: Math.floor(Math.random() * 50)
    };
  });

  for (const usage of usageData) {
    await prisma.dailyUsage.create({ data: { ...usage, organizationId: org.id } })
  }

  // Create Endpoint Usage
  const endpointData = [
    { endpoint: "/v1/chat/completions", requests: 1245000, errorRate: 0.02, p95Latency: "1.2s" },
    { endpoint: "/v1/embeddings", requests: 843000, errorRate: 0.01, p95Latency: "450ms" },
    { endpoint: "/v1/audio/transcriptions", requests: 45000, errorRate: 0.05, p95Latency: "2.4s" },
    { endpoint: "/v1/images/generations", requests: 12000, errorRate: 0.12, p95Latency: "4.8s" },
    { endpoint: "/v1/fine_tuning/jobs", requests: 450, errorRate: 0.00, p95Latency: "—" },
  ]

  for (const endpoint of endpointData) {
    await prisma.endpointUsage.create({ data: { ...endpoint, organizationId: org.id } })
  }

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
