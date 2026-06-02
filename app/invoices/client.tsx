"use client";

import toast from "react-hot-toast";

export default function InvoicesClient({ initialOrg }: { initialOrg: any }) {
  const exportInvoicesToCSV = () => {
    if (!initialOrg.invoices || initialOrg.invoices.length === 0) {
      toast.error("No invoices to download");
      return;
    }
    const headers = ["Invoice Number", "Date", "Amount", "Status"];
    const csvContent = [
      headers.join(","),
      ...initialOrg.invoices.map((inv: any) => 
        `"${inv.invoiceNumber}","${inv.date}","${inv.amount}","${inv.status}"`
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoices_all.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoices downloaded successfully");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight">Invoices</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">View and download your billing history</p>
      </div>

      <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-[28px] p-6 shadow-xl dark:shadow-none shadow-slate-100/50 dark:shadow-none animate-fade-in-up-delay-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">All Invoices</h3>
          <button 
            onClick={exportInvoicesToCSV}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Download All
          </button>
        </div>
        <div className="space-y-3">
          {initialOrg.invoices.map((inv: any) => (
            <div
              key={inv.id}
              className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-slate-700/50 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{inv.invoiceNumber}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-base text-slate-800 dark:text-slate-100">${inv.amount}</span>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
          {initialOrg.invoices.length === 0 && (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              No invoices found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
