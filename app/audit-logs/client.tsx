"use client";

import { useState } from "react";

const typeConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Admin: { color: "text-indigo-700", bg: "bg-indigo-100", dot: "bg-indigo-500" },
  Security: { color: "text-rose-700", bg: "bg-rose-100", dot: "bg-rose-500" },
  Billing: { color: "text-emerald-700", bg: "bg-emerald-100", dot: "bg-emerald-500" },
  API: { color: "text-sky-700", bg: "bg-sky-100", dot: "bg-sky-500" },
  System: { color: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
};

const avatarColors: Record<string, string> = {
  SM: "from-rose-400 to-pink-500",
  SY: "from-slate-400 to-slate-500",
  JC: "from-emerald-400 to-teal-500",
  AS: "from-indigo-400 to-violet-500",
  EW: "from-amber-400 to-orange-500",
  MP: "from-sky-400 to-blue-500",
};

export default function AuditLogsClient({ initialEvents }: { initialEvents: any[] }) {
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = initialEvents.filter((event) => {
    const matchesType = filterType === "All" || event.type === filterType;
    const matchesSearch =
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportToCSV = () => {
    if (filteredEvents.length === 0) return;
    const headers = ["ID", "Timestamp", "User", "Action", "Type", "Details", "IP Address"];
    const csvContent = [
      headers.join(","),
      ...filteredEvents.map(e => 
        `"${e.id}","${new Date(e.timestamp).toISOString()}","${e.user}","${e.action}","${e.type}","${e.details.replace(/"/g, '""')}","${e.ipAddress}"`
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Complete activity trail for your organization</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="px-5 py-2.5 bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-slate-700/50 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 shadow-sm hover:bg-white/80 dark:bg-slate-800/80 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, users, or details..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          />
        </div>
        <div className="flex gap-1 bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-slate-700/50 rounded-xl p-1 shadow-sm shrink-0">
          {["All", "Admin", "Security", "Billing", "API", "System"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === type
                  ? "bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-100"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 dark:text-slate-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3 animate-fade-in-up-delay-1">
        {filteredEvents.map((event) => {
          const config = typeConfig[event.type] || typeConfig["System"];
          const isExpanded = expandedId === event.id;
          return (
            <div
              key={event.id}
              className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[20px] overflow-hidden shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none hover:shadow-xl dark:shadow-none transition-all duration-200 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : event.id)}
            >
              <div className="p-5 flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${config.dot} shrink-0`}></div>
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[event.avatar] || "from-slate-400 to-slate-500"} flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0`}
                >
                  {event.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    <span className="font-bold text-slate-900 dark:text-white">{event.user}</span>{" "}
                    {event.action}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider shrink-0 ${config.bg} ${config.color}`}>
                  {event.type}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-white/60 dark:border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Details</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{event.details}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">IP Address</p>
                      <p className="text-sm font-mono text-slate-600 dark:text-slate-300 mt-1">{event.ipAddress}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-white/30 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px]">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400 dark:text-slate-500 font-medium">No events match your filters</p>
            <p className="text-sm text-slate-300 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
