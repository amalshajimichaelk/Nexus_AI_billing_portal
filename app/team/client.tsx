"use client";

import { useState, useTransition } from "react";
import { inviteTeamMember } from "../actions/team";
import toast from "react-hot-toast";

const roleColors: Record<string, string> = {
  Owner: "bg-violet-100 text-violet-700",
  Admin: "bg-indigo-100 text-indigo-700",
  Developer: "bg-sky-100 text-sky-700",
  Viewer: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
};

const avatarColors = [
  "from-indigo-400 to-violet-500",
  "from-rose-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-500",
  "from-fuchsia-400 to-purple-500",
  "from-lime-400 to-green-500",
  "from-cyan-400 to-teal-500",
];

export default function TeamClient({ initialMembers }: { initialMembers: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = initialMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = initialMembers.filter((m) => m.status === "active").length;
  const pendingCount = initialMembers.filter((m) => m.status === "pending").length;

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    startTransition(async () => {
      try {
        await inviteTeamMember(inviteEmail, inviteRole);
        toast.success(`Invited ${inviteEmail}`);
        setInviteEmail("");
        setInviteRole("Developer");
        setShowInvite(false);
      } catch (error: any) {
        toast.error(error.message || "Failed to invite member");
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Team</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Manage team members, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="px-5 py-2.5 bg-indigo-900 text-white rounded-xl font-bold text-sm shadow-lg dark:shadow-none shadow-indigo-200 hover:bg-indigo-800 hover:scale-105 transition-all active:scale-95"
        >
          + Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Members</p>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{initialMembers.length}</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pending</p>
          <p className="text-3xl font-extrabold text-amber-500 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Roles</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-1">4</p>
        </div>
      </div>

      {/* Search */}
      <div className="animate-fade-in-up-delay-1">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none"
          />
        </div>
      </div>

      {/* Members List */}
      <div className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none animate-fade-in-up-delay-1 ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
        <div className="space-y-3">
          {filteredMembers.map((member, idx) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-slate-700/50 rounded-2xl hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{member.name}</p>
                    {member.status === "pending" && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[9px] font-bold rounded-full uppercase">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:block">{member.lastActive}</span>
                <span
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${roleColors[member.role]}`}
                >
                  {member.role}
                </span>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 dark:text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[28px] p-8 shadow-2xl dark:shadow-none w-full max-w-md animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">Email Address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
            />
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2 mt-4">Role</label>
            <select 
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
            >
              <option>Developer</option>
              <option>Viewer</option>
              <option>Admin</option>
            </select>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={isPending}
                className="flex-1 py-3 bg-indigo-900 text-white rounded-xl font-bold text-sm shadow-lg dark:shadow-none shadow-indigo-200 hover:bg-indigo-800 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Inviting...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
