import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { BarChart, DollarSign, Calendar, Users, ShieldAlert, Download, RefreshCcw } from "lucide-react";

export default function AdminDashboard() {
  const { appointments, salons, stylists, corporateAccounts } = useBelsomeStore();
  const [exportSuccess, setExportSuccess] = useState(false);

  const totalRevenue = appointments.reduce((sum, item) => sum + item.finalPrice, 0);
  const totalBookings = appointments.length;

  const handleExportCSV = () => {
    setExportSuccess(true);
    
    const headers = "ID,CustomerName,Salon,Service,Date,TimeSlot,PaidAmount\n";
    const rows = appointments.map((a) => `${a.id},${a.customerName},${a.salonName},${a.serviceName},${a.date},${a.timeSlot},${a.finalPrice}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "belsome_platform_appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setExportSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-white to-slate-50/50 shadow-sm">
        <div>
          <span className="text-[9px] px-2 py-0.5 bg-red-50 border border-red-100 text-red-700 font-mono rounded inline-block mb-1 font-bold">
            Global Platform Administrator
          </span>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 leading-none">Platform Command Centre</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1.5">Aggregated statistics mapping all salons, corporate programs, and AI transactions in Hyderabad.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          {exportSuccess ? "CSV Exported!" : "Export System CSV"}
        </button>
      </div>

      {/* Grid Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <KPIItem title="Aggregate Platform Revenue" val={`₹${totalRevenue}`} label="Platform GTV" icon={DollarSign} color="text-green-600" bg="bg-green-50 border-green-100" />
        <KPIItem title="Aggregate Bookings" val={totalBookings.toString()} label="Total appointments" icon={Calendar} color="text-purple-650" bg="bg-purple-50 border-purple-100" />
        <KPIItem title="Listed Stylists" val={stylists.length.toString()} label="Registry Active" icon={Users} color="text-amber-600" bg="bg-amber-50 border-amber-100" />
        <KPIItem title="Active Studios" val={salons.length.toString()} label="Hyderabad Launch" icon={ShieldAlert} color="text-teal-600" bg="bg-teal-50 border-teal-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simple SVG Chart */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-800">Monthly Platform Booking Growth</h3>
          
          <div className="h-48 flex items-end gap-3 pt-6 font-mono text-[9px] text-slate-400 font-bold">
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-slate-100 hover:bg-purple-600/10 rounded-t w-full transition-all border border-slate-200/50" style={{ height: "45%" }} />
              <span>Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-slate-100 hover:bg-purple-600/10 rounded-t w-full transition-all border border-slate-200/50" style={{ height: "60%" }} />
              <span>Feb</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-slate-100 hover:bg-purple-600/10 rounded-t w-full transition-all border border-slate-200/50" style={{ height: "55%" }} />
              <span>Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-slate-100 hover:bg-purple-600/10 rounded-t w-full transition-all border border-slate-200/50" style={{ height: "70%" }} />
              <span>Apr</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-slate-100 hover:bg-purple-600/10 rounded-t w-full transition-all border border-slate-200/50" style={{ height: "85%" }} />
              <span>May</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end font-bold text-purple-700">
              <div className="bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t w-full transition-all shadow-md shadow-brand-primary/10" style={{ height: "98%" }} />
              <span>Jun (Live)</span>
            </div>
          </div>
        </div>

        {/* Corporate Wellness status */}
        <div className="md:col-span-1 glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-800">Corporate Clients Log</h3>
          <div className="space-y-3">
            {corporateAccounts.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">{c.companyName}</span>
                  <span className="text-purple-700 font-mono font-bold">{c.plan}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Budget: ₹{c.allocatedCredits}</span>
                  <span>Used: ₹{c.usedCredits}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* platform-wide registry */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-slate-800">Aggregate Platform Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-mono font-bold">
                <th className="py-2">Transaction ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Salon</th>
                <th className="py-2">Stylist</th>
                <th className="py-2">Paid Price</th>
                <th className="py-2 text-right">Method Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-3 font-mono text-purple-700 font-bold">{a.id}</td>
                  <td className="py-3 text-slate-900 font-bold">{a.customerName}</td>
                  <td className="py-3 text-slate-650 font-semibold">{a.salonName}</td>
                  <td className="py-3 text-slate-600 font-semibold">{a.stylistName}</td>
                  <td className="py-3 font-mono text-slate-900 font-bold">₹{a.finalPrice}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-500 font-bold border border-slate-200">
                      {a.pricingReason.split(" (")[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPIItem({ title, val, label, icon: Icon, color, bg }: {
  title: string;
  val: string;
  label: string;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
      <div className="space-y-1">
        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">{title}</span>
        <h4 className="font-display font-extrabold text-2xl text-slate-900 mt-1 font-mono">{val}</h4>
        <span className="text-[10px] text-slate-400 block font-semibold">{label}</span>
      </div>
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shadow-sm`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  );
}
