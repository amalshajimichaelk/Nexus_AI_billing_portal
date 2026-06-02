"use client";

import { useEffect, useState, useTransition } from "react";
import { getBillingDetails } from "../app/actions/billing";
import toast from "react-hot-toast";

export function OrgSwitcher() {
  const [org, setOrg] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const current = await getBillingDetails();
      setOrg(current);
    }
    load();
  }, []);

  const handleCreateOrg = () => {
    toast("Multi-org support coming soon!", { icon: "🚀" });
    setIsOpen(false);
  };

  if (!org) return null;

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-white/60 dark:bg-slate-800/80 rounded-lg text-sm border border-white dark:border-slate-700 flex items-center gap-2 shadow-sm hover:bg-white/90 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
        <span className="font-medium text-slate-800 dark:text-slate-200">{org.name}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 top-12 w-64 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Organizations</p>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
              <button
                className="w-full flex items-center gap-3 p-2 text-left rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex flex-shrink-0 items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                  {org.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{org.name}</p>
                  <p className="text-[10px] font-bold uppercase opacity-80">{org.plan}</p>
                </div>
                <svg className="w-4 h-4 ml-auto text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
            <div className="p-2 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={handleCreateOrg}
                className="w-full flex items-center gap-2 p-2 text-left rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-bold">Create Organization</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
