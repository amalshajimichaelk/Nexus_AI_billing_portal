"use client";

import { useState } from "react";

export default function NotificationsClient({ notifications }: { notifications: any[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated on your account activity</p>
        </div>
        <div className="flex gap-1 bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-slate-700/50 rounded-xl p-1 shadow-sm">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === t
                  ? "bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-100"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {t === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] overflow-hidden shadow-xl dark:shadow-none animate-fade-in-up-delay-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No notifications</div>
        ) : (
          <div className="divide-y divide-white/60 dark:divide-slate-800/60">
            {notifications.map((notif, i) => (
              <div key={notif.id} className={`p-6 flex gap-4 transition-colors ${i < 3 && activeTab === "unread" ? "bg-indigo-50/30 dark:bg-indigo-900/10" : "hover:bg-white/60 dark:hover:bg-slate-800/60"}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                  {notif.avatar || "SY"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{notif.action}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(notif.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.details}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                      {notif.type}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">by {notif.user}</span>
                  </div>
                </div>
                {i < 3 && activeTab === "unread" && (
                  <div className="shrink-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
