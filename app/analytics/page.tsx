import { getAnalytics } from "../actions/analytics";
import AnalyticsClient from "./client";

export default async function AnalyticsPage() {
  const data = await getAnalytics();
  return <AnalyticsClient data={data} />;
}
