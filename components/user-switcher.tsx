"use client";

import { useEffect, useState, useTransition } from "react";
import { getAllUsers, loginAs, getCurrentUser } from "../app/actions/auth";

export function UserSwitcher() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const [allUsers, current] = await Promise.all([
        getAllUsers(),
        getCurrentUser()
      ]);
      setUsers(allUsers);
      setCurrentUser(current);
    }
    load();
  }, []);

  const handleSwitch = (userId: string) => {
    startTransition(async () => {
      await loginAs(userId);
      const updated = await getCurrentUser();
      setCurrentUser(updated);
      setIsOpen(false);
      window.location.reload(); // Hard reload to clear client state
    });
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-tighter">{currentUser.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white font-bold text-sm">
          {currentUser.avatar}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-14 w-64 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Switch Role</p>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSwitch(user.id)}
                  disabled={isPending}
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                    currentUser.id === user.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex flex-shrink-0 items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
