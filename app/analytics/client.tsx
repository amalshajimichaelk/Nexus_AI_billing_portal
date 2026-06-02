"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const modelUsage = [
  { name: "GPT-4o", tokens: 1800000, color: "#6366f1" },
  { name: "Claude 3.5", tokens: 1200000, color: "#8b5cf6" },
  { name: "Gemini Pro", tokens: 500000, color: "#ec4899" },
  { name: "Llama 3.1", tokens: 300000, color: "#f59e0b" },
];

const monthlyTrend = [
  { month: "Jun", cost: 380 },
  { month: "Jul", cost: 420 },
  { month: "Aug", cost: 510 },
  { month: "Sep", cost: 490 },
  { month: "Oct", cost: 620 },
  { month: "Nov", cost: 780 },
  { month: "Dec", cost: 890 },
  { month: "Jan", cost: 950 },
  { month: "Feb", cost: 870 },
  { month: "Mar", cost: 1050 },
  { month: "Apr", cost: 1120 },
  { month: "May", cost: 1242 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-700 rounded-2xl p-3 shadow-xl dark:shadow-none">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-xs mt-0.5" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" && entry.value > 10000
              ? `${(entry.value / 1000).toFixed(0)}K`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsClient({ data }: { data: any }) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const { dailyUsages, endpointUsages } = data;

  const totalTokens = modelUsage.reduce((sum, m) => sum + m.tokens, 0);

  const filteredDailyUsages = period === "7d"
    ? dailyUsages.slice(-7)
    : period === "30d"
      ? dailyUsages.slice(-30)
      : dailyUsages;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Deep insights into your AI API usage and costs</p>
        </div>
        <div className="flex gap-1 bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-slate-700/50 rounded-xl p-1 shadow-sm">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === p
                  ? "bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-100"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 dark:text-slate-300"
              }`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-in-up">
        {[
          { label: "Total Requests", value: "1.38M", change: "+8.2%", positive: true },
          { label: "Avg Latency", value: "245ms", change: "-12ms", positive: true },
          { label: "Error Rate", value: "0.03%", change: "-0.01%", positive: true },
          { label: "Total Cost", value: "$1,242", change: "+12.4%", positive: false },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none hover:shadow-xl dark:shadow-none hover:scale-[1.02] transition-all duration-300"
          >
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
            <p className={`text-xs font-bold mt-1 ${stat.positive ? "text-emerald-600" : "text-amber-600"}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Daily Usage Chart */}
        <section className="col-span-12 xl:col-span-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none animate-fade-in-up-delay-1">
          <h3 className="font-bold text-lg mb-1">Daily Token Usage</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Tokens consumed per day</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredDailyUsages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `${(v).toFixed(1)}M`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="tokens" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Model Usage Pie */}
        <section className="col-span-12 xl:col-span-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none animate-fade-in-up-delay-2">
          <h3 className="font-bold text-lg mb-1">Model Distribution</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Token usage by model</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="tokens"
                >
                  {modelUsage.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {modelUsage.map((model) => (
              <div key={model.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model.color }}></div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{model.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {((model.tokens / totalTokens) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Trend */}
        <section className="col-span-12 xl:col-span-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none animate-fade-in-up-delay-2">
          <h3 className="font-bold text-lg mb-1">Cost Trend</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Monthly spending over time</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="costAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="cost" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#costAreaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top Endpoints */}
        <section className="col-span-12 xl:col-span-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none animate-fade-in-up-delay-3">
          <h3 className="font-bold text-lg mb-1">Top Endpoints</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Most used API endpoints</p>
          <div className="space-y-3">
            {endpointUsages.map((ep: any) => (
              <div
                key={ep.endpoint}
                className="p-4 bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-slate-700/50 rounded-2xl flex items-center justify-between hover:shadow-md transition-all"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">{ep.endpoint}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{ep.requests.toLocaleString()} calls</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{ep.p95Latency}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">avg latency</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${ep.errorRate > 0.05 ? "text-amber-600" : "text-emerald-600"}`}>
                      {(ep.errorRate * 100).toFixed(2)}%
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">error rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
