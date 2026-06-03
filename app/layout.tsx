"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";
import { UserSwitcher } from "../components/user-switcher";
import { OrgSwitcher } from "../components/org-switcher";
import { Toaster } from "react-hot-toast";
// @ts-ignore
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

const navItems = [
  {
    section: "Management",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        name: "Billing",
        href: "/billing",
        icon: (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
      {
        name: "Invoices",
        href: "/invoices",
        icon: (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        name: "API Keys",
        href: "/api-keys",
        icon: (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        ),
      },
      {
        name: "Team",
        href: "/team",
        icon: (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 15.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Advanced",
    items: [
      {
        name: "Analytics",
        href: "/analytics",
        icon: (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        name: "Audit Logs",
        href: "/audit-logs",
        icon: (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable} h-full`} suppressHydrationWarning>
      <body className="w-full h-full bg-[#f8f9fc] dark:bg-[#0a0f1c] text-slate-800 dark:text-slate-200 overflow-hidden font-sans relative flex antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <Toaster position="top-center" />
        {/* Background Decorative Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-200/40 blur-[100px] z-0 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[120px] z-0 pointer-events-none"></div>
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-pink-100/40 blur-[80px] z-0 pointer-events-none"></div>

        {/* Sidebar */}
        <aside className="w-64 h-full bg-white/40 dark:bg-slate-950/60 backdrop-blur-2xl border-r border-white/60 dark:border-slate-800 flex flex-col z-10 shrink-0 relative">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600">
              Nexus AI
            </span>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto w-full no-scrollbar">
            {navItems.map((group) => (
              <div key={group.section}>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 py-2 mt-4 first:mt-0">
                  {group.section}
                </div>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full transition-all duration-200 ${
                        isActive
                          ? "bg-white/80 dark:bg-slate-800 shadow-sm border border-white/80 dark:border-slate-700 text-indigo-700 dark:text-indigo-400 font-medium"
                          : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-4 mt-auto w-full">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-4 rounded-2xl text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <p className="text-xs opacity-80 mb-1">Current Plan</p>
              <p className="font-bold text-lg mb-3">Enterprise Pro</p>
              <Link
                href="/billing"
                className="block w-full py-2 bg-white text-indigo-700 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors text-center"
              >
                Manage Plan
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative z-10 w-full min-w-0 h-full">
          <header className="h-20 px-8 flex items-center justify-between border-b border-white/60 dark:border-slate-800 bg-white/20 dark:bg-slate-900/50 backdrop-blur-lg shrink-0 relative z-50">
            <div className="flex items-center gap-2">
              <OrgSwitcher />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/notifications" className="p-2 bg-white/60 dark:bg-slate-800/60 rounded-full border border-white dark:border-slate-700 shadow-sm relative text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
              </Link>
              <UserSwitcher />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto w-full p-8 custom-scrollbar">
            {children}
          </div>
        </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
