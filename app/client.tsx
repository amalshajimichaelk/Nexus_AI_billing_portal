"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-700 rounded-2xl p-4 shadow-xl dark:shadow-none">
        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">{label}</p>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
          {(payload[0].value).toFixed(1)}M tokens
        </p>
      </div>
    );
  }
  return null;
}

const typeColors: Record<string, string> = {
  Admin: "bg-indigo-500",
  Finance: "bg-amber-500",
  Billing: "bg-emerald-500",
  Security: "bg-slate-400",
  API: "bg-sky-500",
  System: "bg-rose-500",
};

export default function DashboardClient({
  dailyUsages,
  apiKeys,
  auditEvents,
  stats
}: {
  dailyUsages: any[],
  apiKeys: any[],
  auditEvents: any[],
  stats: any
}) {
  const [timeRange, setTimeRange] = useState<"month" | "previous">("month");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-in-up">
        {[
          { label: "Total Tokens", value: "3.8M", sub: "of 5M quota", accent: "from-indigo-500 to-violet-500" },
          { label: "API Calls Today", value: "24,891", sub: "+12% vs yesterday", accent: "from-emerald-500 to-teal-500" },
          { label: "Active Keys", value: stats.activeKeys, sub: `of ${stats.totalKeys} total`, accent: "from-amber-500 to-orange-500" },
          { label: "Team Members", value: stats.teamMembers, sub: "In Organization", accent: "from-rose-500 to-pink-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none hover:shadow-xl dark:shadow-none hover:scale-[1.02] transition-all duration-300"
          >
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${stat.accent}`}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Usage Analytics Chart */}
        <section className="col-span-12 xl:col-span-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-2xl dark:shadow-none shadow-indigo-100/50 flex flex-col animate-fade-in-up-delay-1">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Usage Analytics</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Real-time token consumption across all tenants
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange("month")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  timeRange === "month"
                    ? "bg-white/80 dark:bg-slate-800/80 border border-white dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-100"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeRange("previous")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  timeRange === "previous"
                    ? "bg-white/80 dark:bg-slate-800/80 border border-white dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-100"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                Previous
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyUsages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${(v).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tokenGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Estimated Cost */}
        <section className="col-span-12 md:col-span-6 xl:col-span-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 flex flex-col justify-between animate-fade-in-up-delay-2">
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">
              Estimated Cost
            </p>
            <h3 className="text-5xl font-extrabold text-indigo-900 dark:text-indigo-50 tracking-tighter">
              $1,242<span className="text-2xl text-slate-400 dark:text-slate-500">.80</span>
            </h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +12.4% vs last month
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-600 dark:text-slate-300">Token Quota</span>
                <span className="font-bold">3.8M / 5M</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-white dark:border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full shadow-inner transition-all duration-1000"
                  style={{ width: "76%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-600 dark:text-slate-300">API Rate Limit</span>
                <span className="font-bold">8K / 10K rpm</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-white dark:border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-inner transition-all duration-1000"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
            <button 
              onClick={() => toast.success("Successfully refilled $100 in credits!")}
              className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold shadow-lg dark:shadow-none shadow-indigo-200 hover:bg-indigo-800 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
            >
              Refill Credits
            </button>
          </div>
        </section>

        {/* Active API Keys */}
        <section className="col-span-12 md:col-span-6 xl:col-span-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none flex flex-col animate-fade-in-up-delay-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Active API Keys</h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline hover:text-indigo-800 transition-colors">
              + Create New
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {apiKeys.slice(0, 3).map((apiKey) => (
              <div
                key={apiKey.id}
                className={`p-4 border rounded-2xl flex items-center justify-between transition-all duration-200 hover:shadow-md ${
                  apiKey.status === "active"
                    ? "bg-white/60 dark:bg-slate-800/60 border-white dark:border-slate-700 shadow-sm"
                    : "bg-white/30 border-white/60 dark:border-slate-800 opacity-70"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      apiKey.status === "active"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{apiKey.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{apiKey.keyString.substring(0, 15)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {apiKey.status === "active" && (
                    <button
                      onClick={() => handleCopyKey(apiKey.id, apiKey.keyString)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 dark:text-slate-300"
                      title="Copy key"
                    >
                      {copiedKeyId === apiKey.id ? (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  )}
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                      apiKey.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {apiKey.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Audit Activity */}
        <section className="col-span-12 xl:col-span-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none flex flex-col animate-fade-in-up-delay-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Audit Activity</h3>
            <button className="text-sm text-indigo-600 font-bold hover:underline">View All</button>
          </div>
          <div className="flex-1 space-y-5">
            {auditEvents.slice(0, 4).map((event) => (
              <div key={event.id} className="flex gap-4 group">
                <div className={`w-2 h-2 rounded-full ${typeColors[event.type] || "bg-slate-400"} mt-1.5 shrink-0 group-hover:scale-150 transition-transform`}></div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span className="font-bold text-slate-900 dark:text-white">{event.user}</span>{" "}
                    {event.action}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tighter mt-0.5">
                    {event.type} • {new Date(event.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
