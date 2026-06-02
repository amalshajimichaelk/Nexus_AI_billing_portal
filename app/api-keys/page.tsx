export const dynamic = "force-dynamic";

import { getApiKeys } from "../actions/api-keys";
import ApiKeysClient from "./client";

export default async function ApiKeysPage() {
  const keys = await getApiKeys();
  return <ApiKeysClient initialKeys={keys} />;
}
