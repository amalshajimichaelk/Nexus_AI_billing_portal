export const dynamic = "force-dynamic";

import { getBillingDetails } from "../actions/billing";
import InvoicesClient from "./client";

export default async function InvoicesPage() {
  const org = await getBillingDetails();

  if (!org) {
    return <div>No organization found. Please run seed script.</div>;
  }

  return <InvoicesClient initialOrg={org} />;
}
