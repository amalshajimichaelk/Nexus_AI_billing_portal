export const dynamic = "force-dynamic";

import { getAuditLogs } from "../actions/audit";
import NotificationsClient from "./client";

export default async function NotificationsPage() {
  const notifications = await getAuditLogs();
  return <NotificationsClient notifications={notifications} />;
}
