"use client";

import { useState, useTransition } from "react";
import { upgradePlan } from "../actions/billing";
import toast from "react-hot-toast";

const plansConfig = [
  {
    name: "Starter",
    price: 29,
    description: "For individuals and small projects",
    features: ["500K tokens/month", "2 API keys", "Email support", "Basic analytics"],
    popular: false,
  },
  {
    name: "Team",
    price: 149,
    description: "For growing teams and businesses",
    features: ["2M tokens/month", "10 API keys", "Priority support", "Advanced analytics", "Team management", "Custom roles"],
    popular: true,
  },
  {
    name: "Enterprise Pro",
    price: 499,
    description: "For large-scale AI operations",
    features: ["5M tokens/month", "Unlimited API keys", "24/7 dedicated support", "Full analytics suite", "SSO & SAML", "Audit logs", "Custom SLA"],
    popular: false,
  },
];

export default function BillingClient({ initialOrg }: { initialOrg: any }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isPending, startTransition] = useTransition();
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activePaymentCategory, setActivePaymentCategory] = useState<string | null>("upi");
  const [selectedSubMethod, setSelectedSubMethod] = useState<string | null>("gpay");
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<{name: string, amount: number} | null>(null);

  const handleConfirmPayment = () => {
    if (!selectedPlanForUpgrade) return;
    
    startTransition(async () => {
      try {
        await upgradePlan(selectedPlanForUpgrade.name, selectedPlanForUpgrade.amount);
        toast.success("Payment Successful! Plan Upgraded.");
        setShowPaymentModal(false);
      } catch (error: any) {
        toast.error(error.message || "Payment failed");
      }
    });
  };
  const handleUpgrade = (planName: string) => {
    startTransition(async () => {
      try {
        await upgradePlan(planName, 0); // fallback if not using modal
        toast.success(`Successfully changed plan to ${planName}`);
      } catch (error: any) {
        toast.error(error.message || "Failed to change plan");
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-8 relative">
      {/* Payment Modal Overlay */}
      {showPaymentModal && selectedPlanForUpgrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              </button>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Payment Options</h2>
            </div>

            {/* Body */}
            <div className="p-5 h-[420px] overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">All Payment Options</p>
              
              {/* UPI */}
              <div className={`border rounded-2xl overflow-hidden transition-all ${activePaymentCategory === "upi" ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                <div onClick={() => setActivePaymentCategory(activePaymentCategory === "upi" ? null : "upi")} className="p-4 flex items-center justify-between cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="text-indigo-600 italic font-black text-xl px-1">UPI</div>
                     <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">3 Offers</span>
                   </div>
                   <svg className={`w-5 h-5 text-slate-400 transition-transform ${activePaymentCategory === "upi" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
                {activePaymentCategory === "upi" && (
                  <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                     {[
                       { id: "cred", name: "CRED UPI", sub: "Upto $5 cash...", icon: "🛡️" },
                       { id: "gpay", name: "Google Pay", sub: "", icon: "G" },
                       { id: "phonepe", name: "PhonePe", sub: "", icon: "P" },
                       { id: "amazon", name: "Amazon Pay", sub: "", icon: "A" },
                       { id: "super", name: "Super.Money", sub: "Upto 5% cash...", icon: "S" },
                       { id: "other", name: "Apps & UPI ID", sub: "", icon: "..." },
                     ].map(opt => (
                       <div 
                         key={opt.id} 
                         onClick={() => setSelectedSubMethod(opt.id)}
                         className={`border p-3 rounded-xl cursor-pointer flex flex-col items-start gap-1 transition-all ${selectedSubMethod === opt.id ? "border-indigo-500 bg-white dark:bg-slate-800 shadow-md" : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800"}`}
                       >
                         <div className="flex items-center gap-2">
                           <span className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">{opt.icon}</span>
                           <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{opt.name}</span>
                         </div>
                         {opt.sub && <span className="text-[9px] text-emerald-600 font-bold">{opt.sub}</span>}
                       </div>
                     ))}
                  </div>
                )}
              </div>

              {/* Cards */}
              <div className={`border rounded-2xl overflow-hidden transition-all ${activePaymentCategory === "cards" ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                <div onClick={() => setActivePaymentCategory(activePaymentCategory === "cards" ? null : "cards")} className="p-4 flex items-center justify-between cursor-pointer">
                   <div className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                     <div className="font-bold text-slate-800 dark:text-slate-100">Cards</div>
                   </div>
                   <svg className={`w-5 h-5 text-slate-400 transition-transform ${activePaymentCategory === "cards" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
                {activePaymentCategory === "cards" && (
                  <div className="p-4 pt-0">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg mb-3">
                      Get 5%* Reward Points on online transa...
                    </div>
                    <div className="space-y-3">
                      <input type="text" placeholder="Card Number" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500" />
                      <div className="flex gap-3">
                        <input type="text" placeholder="MM/YY" className="w-1/2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500" />
                        <input type="text" placeholder="CVV" className="w-1/2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Netbanking */}
              <div className={`border rounded-2xl overflow-hidden transition-all ${activePaymentCategory === "netbanking" ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                <div onClick={() => setActivePaymentCategory(activePaymentCategory === "netbanking" ? null : "netbanking")} className="p-4 flex items-center justify-between cursor-pointer">
                   <div className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                     <div className="font-bold text-slate-800 dark:text-slate-100">Netbanking</div>
                   </div>
                   <svg className={`w-5 h-5 text-slate-400 transition-transform ${activePaymentCategory === "netbanking" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>

              {/* Wallet */}
              <div className={`border rounded-2xl overflow-hidden transition-all ${activePaymentCategory === "wallet" ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                <div onClick={() => setActivePaymentCategory(activePaymentCategory === "wallet" ? null : "wallet")} className="p-4 flex items-center justify-between cursor-pointer">
                   <div className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                     <div className="font-bold text-slate-800 dark:text-slate-100">Wallet</div>
                   </div>
                   <svg className={`w-5 h-5 text-slate-400 transition-transform ${activePaymentCategory === "wallet" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-[10px] text-center text-slate-500 mb-4">By proceeding, I agree to Razorpay's Privacy Notice</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">${selectedPlanForUpgrade.amount}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-indigo-500">View Details</p>
                </div>
                <button 
                  onClick={handleConfirmPayment}
                  disabled={!activePaymentCategory || isPending}
                  className="px-10 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight">Billing & Plans</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Manage your subscription, payment methods, and invoices</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 animate-fade-in-up">
        <span className={`text-sm font-semibold ${billingCycle === "monthly" ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            billingCycle === "annual" ? "bg-indigo-600" : "bg-slate-300"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white dark:bg-slate-800 rounded-full shadow transition-transform ${
              billingCycle === "annual" ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className={`text-sm font-semibold ${billingCycle === "annual" ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>
          Annual
        </span>
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">
          Save 20%
        </span>
      </div>

      {/* Plans */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up-delay-1 ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
        {plansConfig.map((plan) => {
          const isCurrent = initialOrg.plan === plan.name;
          return (
            <div
              key={plan.name}
              className={`relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border rounded-[28px] p-6 flex flex-col transition-all duration-300 hover:shadow-xl dark:shadow-none hover:scale-[1.02] ${
                isCurrent
                  ? "border-indigo-300 shadow-xl dark:shadow-none shadow-indigo-100/50 ring-2 ring-indigo-200"
                  : "border-white/80 dark:border-slate-700/50 shadow-lg dark:shadow-none shadow-slate-100/50 dark:shadow-none"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg dark:shadow-none">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg dark:shadow-none">
                  Current Plan
                </div>
              )}
              <div className="mb-6 pt-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{plan.name}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ${billingCycle === "annual" ? Math.round(plan.price * 0.8) : plan.price}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">/mo</span>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  const amount = billingCycle === "annual" ? Math.round(plan.price * 0.8) : plan.price;
                  setSelectedPlanForUpgrade({ name: plan.name, amount });
                  setShowPaymentModal(true);
                }}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  isCurrent
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 cursor-default"
                    : "bg-indigo-900 text-white shadow-lg dark:shadow-none shadow-indigo-200 hover:bg-indigo-800 hover:scale-[1.02] active:scale-[0.98]"
                }`}
                disabled={isCurrent || isPending}
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
