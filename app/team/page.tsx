export const dynamic = "force-dynamic";

import { getTeamMembers } from "../actions/team";
import TeamClient from "./client";

export default async function TeamPage() {
  const members = await getTeamMembers();
  return <TeamClient initialMembers={members} />;
}
