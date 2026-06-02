export const dynamic = "force-dynamic";

import { getAuditLogs } from "../actions/audit";
import AuditLogsClient from "./client";

export default async function AuditLogsPage() {
  const events = await getAuditLogs();
  return <AuditLogsClient initialEvents={events} />;
}
