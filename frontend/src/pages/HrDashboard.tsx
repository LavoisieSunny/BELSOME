import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { Briefcase, CreditCard, Gift, Send, Users, ShieldAlert, CheckCircle } from "lucide-react";

export default function HrDashboard() {
  const { corporateAccounts, allocateCorporateCredits, activeCity } = useBelsomeStore();
  const currentCorp = corporateAccounts[0]; // Logged in as local Corporate Account

  const [allocAmount, setAllocAmount] = useState(15000);
  const [allocSuccess, setAllocSuccess] = useState(false);

  // Gifting state
  const [giftEmail, setGiftEmail] = useState("");
  const [giftTier, setGiftTier] = useState("Silver Tier Code (₹1,500)");
  const [giftSuccess, setGiftSuccess] = useState(false);

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    allocateCorporateCredits(currentCorp.id, allocAmount);
    setAllocSuccess(true);
    setTimeout(() => setAllocSuccess(false), 2000);
  };

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftEmail) return;
    setGiftSuccess(true);
    setTimeout(() => {
      setGiftSuccess(false);
      setGiftEmail("");
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sub Menu */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shadow-sm">
              C
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 leading-tight">{currentCorp.companyName}</h4>
              <span className="text-[10px] text-slate-400 font-semibold font-bold">Corporate Account</span>
            </div>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="text-xs text-slate-500 font-semibold leading-normal">
            BELSOME Corporate Wellness program allocates grooming and beauty credits directly to corporate accounts.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Credits */}
          <div className="glass-panel p-5 rounded-xl border border-slate-200/60 bg-white flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-mono uppercase font-bold block">Allocated Credits</span>
              <h4 className="font-display font-extrabold text-2xl text-slate-800 font-mono">₹{currentCorp.allocatedCredits}</h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
          </div>

          {/* Used */}
          <div className="glass-panel p-5 rounded-xl border border-slate-200/60 bg-white flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-mono uppercase font-bold block">Utilized Credits</span>
              <h4 className="font-display font-extrabold text-2xl text-slate-800 font-mono">₹{currentCorp.usedCredits}</h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-red-650" />
            </div>
          </div>

          {/* Plan Tier */}
          <div className="glass-panel p-5 rounded-xl border border-slate-200/60 bg-white flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 font-mono uppercase font-bold block">Subscription Tier</span>
              <h4 className="font-display font-extrabold text-2xl text-slate-800">{currentCorp.plan}</h4>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-55 border border-amber-100 flex items-center justify-center shadow-sm">
              <Gift className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Credit Allocator */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900">Reallocate Employee Grooming Funds</h3>
          <form onSubmit={handleAllocate} className="flex gap-4 items-end max-w-md">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-mono text-indigo-700 font-bold uppercase">Topup Amount (INR)</label>
              <input
                type="number"
                required
                value={allocAmount}
                onChange={(e) => setAllocAmount(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              {allocSuccess ? "Credits Allocated!" : "Allocate Credits"}
            </button>
          </form>
        </div>

        {/* Subscription gifting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Issue Subscription Gift Voucher</h3>
            <form onSubmit={handleSendGift} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-indigo-700 font-bold uppercase">Recipients Email</label>
                <input
                  type="email"
                  required
                  value={giftEmail}
                  onChange={(e) => setGiftEmail(e.target.value)}
                  placeholder="employee@techcorp.com"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-indigo-700 font-bold uppercase">Gift Value Tier</label>
                <select
                  value={giftTier}
                  onChange={(e) => setGiftTier(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                >
                  <option>Bronze Tier Code (₹800)</option>
                  <option>Silver Tier Code (₹1,500)</option>
                  <option>Gold Tier Code (₹3,000)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {giftSuccess ? "Gift Voucher Sent!" : "Issue Gift Voucher"}
              </button>
            </form>
          </div>

          {/* Usage Track */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 flex flex-col justify-between">
            <h3 className="font-display font-bold text-base text-slate-900">Corporate Program Utilization</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Credit Budget Used</span>
                <span>{Math.round((currentCorp.usedCredits / currentCorp.allocatedCredits) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-indigo-600 h-full transition-all" 
                  style={{ width: `${(currentCorp.usedCredits / currentCorp.allocatedCredits) * 100}%` }} 
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold leading-normal">
              Wellness credits automatically cover executive grooming sessions at BELSOME partner salons in {activeCity === "Bangalore" ? "Indiranagar and ORR" : activeCity === "Mumbai" ? "Bandra and Andheri" : activeCity === "Delhi" ? "Connaught Place and Vasant Kunj" : "Gachibowli and Jubilee Hills"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
