import { getBillingDetails } from "../actions/billing";
import BillingClient from "./client";

export default async function BillingPage() {
  const org = await getBillingDetails();
  return <BillingClient initialOrg={org} />;
}
