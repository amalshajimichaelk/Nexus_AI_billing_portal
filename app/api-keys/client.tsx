"use client";

import { useState, useTransition } from "react";
import { createApiKey, revokeApiKey } from "../actions/api-keys";
import toast from "react-hot-toast";

export default function ApiKeysClient({ initialKeys }: { initialKeys: any[] }) {
  // Use transition to avoid UI freezing during server actions
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const handleCopy = (id: string, keyString: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string) => {
    startTransition(async () => {
      try {
        await revokeApiKey(id);
        toast.success("API key revoked");
      } catch (error: any) {
        toast.error(error.message || "Failed to revoke API key");
      }
    });
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    startTransition(async () => {
      try {
        await createApiKey(newKeyName);
        toast.success("API key created");
        setNewKeyName("");
        setShowCreateModal(false);
      } catch (error: any) {
        toast.error(error.message || "Failed to create API key");
      }
    });
  };

  const activeCount = initialKeys.filter((k) => k.status === "active").length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">API Keys</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            Manage your API keys and access permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-indigo-900 text-white rounded-xl font-bold text-sm shadow-lg dark:shadow-none shadow-indigo-200 hover:bg-indigo-800 hover:scale-105 transition-all active:scale-95"
        >
          + Create New Key
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Keys</p>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{initialKeys.length}</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Revoked</p>
          <p className="text-3xl font-extrabold text-slate-400 dark:text-slate-500 mt-1">{initialKeys.length - activeCount}</p>
        </div>
      </div>

      {/* Keys List */}
      <div className={`space-y-4 animate-fade-in-up-delay-1 ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
        {initialKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border rounded-[20px] p-5 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none transition-all duration-200 hover:shadow-xl dark:shadow-none ${
              apiKey.status === "active" ? "border-white/80 dark:border-slate-700/50" : "border-white/60 dark:border-slate-800 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    apiKey.status === "active"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{apiKey.name}</p>
                  <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">{apiKey.keyString.substring(0, 15)}...{apiKey.keyString.substring(apiKey.keyString.length - 4)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Last used: {apiKey.lastUsedAt}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{apiKey.requests.toLocaleString()} requests</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 mr-2">
                  {JSON.parse(apiKey.permissions).map((perm: string) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded-md uppercase"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
                {apiKey.status === "active" && (
                  <>
                    <button
                      onClick={() => handleCopy(apiKey.id, apiKey.keyString)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 dark:text-slate-300"
                      title="Copy key"
                    >
                      {copiedId === apiKey.id ? (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleRevoke(apiKey.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 transition-colors text-slate-400 dark:text-slate-500 hover:text-rose-500"
                      title="Revoke key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  </>
                )}
                <span
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ml-1 ${
                    apiKey.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {apiKey.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[28px] p-8 shadow-2xl dark:shadow-none w-full max-w-md animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Create New API Key</h2>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">Key Name</label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Production_Key"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="flex-1 py-3 bg-indigo-900 text-white rounded-xl font-bold text-sm shadow-lg dark:shadow-none shadow-indigo-200 hover:bg-indigo-800 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
