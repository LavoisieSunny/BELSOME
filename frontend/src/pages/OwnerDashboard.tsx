import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { ApiService } from "../services/api";
import { 
  Award, TrendingUp, DollarSign, Calendar, PackageCheck, AlertCircle, 
  Settings, CheckCircle2, RefreshCcw, Heart, Send, BarChart2, PlusCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function OwnerDashboard() {
  const { 
    salons, appointments, vendorProducts, examAttempts, weddingProjects, 
    updateGlowSettings, addVendorProduct, addExamAttempt, updateWeddingProject 
  } = useBelsomeStore();

  const [activeTab, setActiveTab] = useState<"analytics" | "glow" | "procurement" | "staff" | "bridal">("analytics");
  const [error, setError] = useState<string | null>(null);
  const [procureError, setProcureError] = useState<string | null>(null);
  const [examError, setExamError] = useState<string | null>(null);

  // Glow pricing adjustments
  const currentSalon = salons[0];
  const [peakSurgeInput, setPeakSurgeInput] = useState(currentSalon.peakSurge);
  const [offPeakInput, setOffPeakInput] = useState(currentSalon.offPeakDiscount);
  const [glowSaved, setGlowSaved] = useState(false);

  // Procurement state
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodCerts, setProdCerts] = useState("Vegan, Paraben-Free");
  const [prodCost, setProdCost] = useState(250);
  const [prodRetail, setProdRetail] = useState(650);
  const [procureResult, setProcureResult] = useState<any>(null);
  const [procureLoading, setProcureLoading] = useState(false);

  // Behavioral Exam state
  const [candidateName, setCandidateName] = useState("");
  const [examLanguage, setExamLanguage] = useState("English");
  const [examScenario, setExamScenario] = useState("Complaint Handling: Haircut length discrepancy");
  const [candidateResponse, setCandidateResponse] = useState("");
  const [examResult, setExamResult] = useState<any>(null);
  const [examLoading, setExamLoading] = useState(false);

  // Bridal scheduling state
  const currentWedding = weddingProjects[0];
  const [timelineEvent, setTimelineEvent] = useState("");
  const [timelineTime, setTimelineTime] = useState("10:00 AM");

  const handleGlowSave = () => {
    updateGlowSettings(currentSalon.id, peakSurgeInput, offPeakInput);
    setGlowSaved(true);
    setTimeout(() => setGlowSaved(false), 2000);
  };

  const handleProcureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodBrand) return;

    setProcureLoading(true);
    setProcureError(null);
    try {
      const response = await ApiService.analyzeProcurement({
        name: prodName,
        brand: prodBrand,
        certifications: prodCerts,
        cost: prodCost,
        retail: prodRetail,
        budget: 5000,
        prefBrands: "BioGlow, OrganicLife",
        marginGoal: 50
      });
      setProcureResult(response);
      addVendorProduct({
        name: prodName,
        brand: prodBrand,
        certifications: prodCerts.split(","),
        cost: prodCost,
        retail: prodRetail,
        margin: parseFloat(((prodRetail - prodCost) / prodRetail * 100).toFixed(1)),
        score: response.score,
        status: response.status,
        explanation: response.explanation
      });
      setProdName("");
      setProdBrand("");
    } catch (e) {
      console.error(e);
      setProcureError("AI is unavailable. Make sure the backend is running.");
    } finally {
      setProcureLoading(false);
    }
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateResponse) return;

    setExamLoading(true);
    setExamError(null);
    try {
      const response = await ApiService.evaluateBehavioral({
        scenario: examScenario,
        language: examLanguage,
        response: candidateResponse
      });
      setExamResult(response);
      addExamAttempt({
        candidateName,
        language: examLanguage,
        scenario: examScenario,
        score: response.overallScore,
        status: response.status,
        feedback: response.feedback.empathy + " " + response.feedback.resolution
      });
      setCandidateName("");
      setCandidateResponse("");
    } catch (e) {
      console.error(e);
      setExamError("AI is unavailable. Make sure the backend is running.");
    } finally {
      setExamLoading(false);
    }
  };

  const addBridalTimeline = () => {
    if (!timelineEvent) return;
    const newEvent = {
      id: `time-${currentWedding.timeline.length + 1}`,
      time: timelineTime,
      event: timelineEvent,
      status: "Upcoming"
    };
    const updated = {
      ...currentWedding,
      timeline: [...currentWedding.timeline, newEvent]
    };
    updateWeddingProject(updated);
    setTimelineEvent("");
  };

  const salonAppts = appointments.filter((a) => a.salonId === currentSalon.id);
  const totalRevenue = salonAppts.reduce((sum, item) => sum + item.finalPrice, 0);

  // Group by date for line/area chart
  const revenueByDate = appointments
    .filter((a) => a.salonId === currentSalon.id)
    .reduce((acc: Record<string, number>, appt) => {
      acc[appt.date] = (acc[appt.date] || 0) + appt.finalPrice;
      return acc;
    }, {});

  const sortedDates = Object.keys(revenueByDate).sort();
  const chartData = sortedDates.length >= 3 
    ? sortedDates.map(date => ({ label: date.split("-").slice(1).join("/"), value: revenueByDate[date] }))
    : [
        { label: "06/01", value: 4200 },
        { label: "06/02", value: 3100 },
        { label: "06/03", value: 5800 },
        { label: "06/04", value: 7200 },
        { label: "06/05", value: totalRevenue || 6100 }
      ];

  const maxVal = Math.max(...chartData.map(d => d.value)) * 1.15 || 8000;
  const points = chartData.map((d, i) => {
    const x = i * (350 / (chartData.length - 1)) + 40;
    const y = 140 - (d.value / maxVal) * 100;
    return { x, y, label: d.label, value: d.value };
  });

  const linePath = `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`;
  const areaPath = `${linePath} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

  const standardCount = salonAppts.filter(a => !a.pricingReason.includes("Off-Peak") && !a.pricingReason.includes("Surge")).length;
  const surgeCount = salonAppts.filter(a => a.pricingReason.includes("Surge")).length;
  const offPeakCount = salonAppts.filter(a => a.pricingReason.includes("Off-Peak")).length;
  
  const statsStandard = 3 + standardCount;
  const statsSurge = 2 + surgeCount;
  const statsOffPeak = 4 + offPeakCount;
  const statsTotal = statsStandard + statsSurge + statsOffPeak;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Dashboard Submenu */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-sm">
          <h3 className="text-xs font-mono text-slate-400 uppercase px-3 pb-2 font-bold tracking-wider">Salon Owner</h3>
          {[
            { id: "analytics", label: "Studio Overview", icon: BarChart2 },
            { id: "glow", label: "Glow Pricing Engine", icon: Settings },
            { id: "procurement", label: "Procurement Agent", icon: PackageCheck },
            { id: "staff", label: "Staff Exam Portal", icon: Award },
            { id: "bridal", label: "Bridal War Room", icon: Heart }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  activeTab === tab.id
                    ? "bg-pink-50 border border-pink-100 text-pink-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel p-5 rounded-xl border border-slate-200/60 bg-white flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider block">Gross Salon Revenue</span>
                  <h4 className="font-display font-extrabold text-2xl text-slate-900 mt-1 font-mono">₹{totalRevenue}</h4>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shadow-sm">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-slate-200/60 bg-white flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider block">Total Bookings</span>
                  <h4 className="font-display font-extrabold text-2xl text-slate-900 mt-1">{salonAppts.length}</h4>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-slate-200/60 bg-white flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider block">Growth Indicator</span>
                  <h4 className="font-display font-extrabold text-2xl text-slate-900 mt-1">+14.2%</h4>
                </div>
                <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                </div>
              </div>
            </div>

            {/* Studio Analytics Charts Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gross Revenue Trend Area Chart */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 leading-tight">Weekly Gross Revenue Trend</h3>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">HYDERABAD JUBILEE HILLS REGISTRY</span>
                </div>
                
                <div className="relative h-44 w-full">
                  <svg className="w-full h-full" viewBox="0 0 440 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6D28D9" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => (
                      <line
                        key={ratio}
                        x1="30"
                        y1={150 - ratio * 110}
                        x2="410"
                        y2={150 - ratio * 110}
                        stroke="#F1F5F9"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Filled Area path */}
                    <path d={areaPath} fill="url(#purpleGradient)" />

                    {/* Colored Line Path */}
                    <motion.path
                      d={linePath}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Interactive Marker Dots */}
                    {points.map((p, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        {/* Glow effect */}
                        <motion.circle
                          cx={p.x}
                          cy={p.y}
                          r="12"
                          fill="#7C3AED"
                          className="opacity-0 group-hover:opacity-15"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                        
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          fill="#7C3AED"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="transition-all duration-200 group-hover:r-7 shadow-lg"
                        />

                        {/* Tooltip Popup */}
                        <foreignObject
                          x={p.x - 35}
                          y={p.y - 35}
                          width="70"
                          height="25"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        >
                          <div className="bg-slate-900/95 text-white text-[9px] py-1 px-1.5 rounded-lg shadow-lg text-center font-mono font-bold leading-none border border-slate-700/55">
                            ₹{p.value}
                          </div>
                        </foreignObject>
                      </g>
                    ))}
                  </svg>

                  {/* X-Axis Labels */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between px-7 text-[9px] font-mono text-slate-400 font-bold">
                    {points.map((p, idx) => (
                      <span key={idx} style={{ position: "absolute", left: `${(idx / (points.length - 1)) * 82 + 8}%` }}>
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Tier breakdown horizontal bar chart */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 leading-tight">Pricing Model Distribution</h3>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">SURGE PRICING ENGINE METRICS</span>
                </div>

                <div className="space-y-4 pt-2">
                  {[
                    { label: "Standard Rate", count: statsStandard, percent: (statsStandard / statsTotal) * 100, color: "from-purple-500 to-indigo-600" },
                    { label: "Peak Demand Surge", count: statsSurge, percent: (statsSurge / statsTotal) * 100, color: "from-pink-500 to-rose-500" },
                    { label: "Off-Peak Discount", count: statsOffPeak, percent: (statsOffPeak / statsTotal) * 100, color: "from-emerald-400 to-teal-600" }
                  ].map((tier) => (
                    <div key={tier.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-750">
                        <span className="text-slate-800">{tier.label}</span>
                        <span className="font-mono text-slate-500">{tier.count} slots ({tier.percent.toFixed(1)}%)</span>
                      </div>
                      
                      <div className="relative w-full h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tier.percent}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={`absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r ${tier.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[10px] text-purple-850 leading-relaxed font-sans font-semibold">
                  ⚡ <strong>Glow Engine Advice:</strong> Peak demand periods account for <strong>{((statsSurge / statsTotal) * 100).toFixed(0)}%</strong> of bookings. Consider lowering off-peak times by 1 hour to balance stylist occupancy.
                </div>
              </div>
            </div>

            {/* Appointments table */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base text-slate-800">Live Appointment Registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-mono font-bold">
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Service</th>
                      <th className="py-2.5">Stylist</th>
                      <th className="py-2.5">Scheduled Slot</th>
                      <th className="py-2.5">Paid Price</th>
                      <th className="py-2.5 text-right">Pricing Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salonAppts.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50">
                        <td className="py-3 font-bold text-slate-800">{appt.customerName}</td>
                        <td className="py-3 text-slate-600 font-semibold">{appt.serviceName}</td>
                        <td className="py-3 text-purple-700 font-semibold">{appt.stylistName}</td>
                        <td className="py-3 text-slate-500 font-semibold">{appt.date} • {appt.timeSlot}</td>
                        <td className="py-3 font-mono text-slate-900 font-bold">₹{appt.finalPrice}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            appt.pricingReason.includes("Off-Peak") ? "bg-green-50 border border-green-150 text-green-700" :
                            appt.pricingReason.includes("Surge") ? "bg-amber-55/60 border border-amber-200 text-amber-700" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {appt.pricingReason.split(" (")[0]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Glow Pricing Settings */}
        {activeTab === "glow" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Glow Dynamic Pricing Rules</h3>
              <p className="text-xs text-slate-500 font-semibold">Configure margins, weekend demand surge multipliers, and off-peak discount codes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Surge */}
              <div className="space-y-3">
                <label className="text-xs text-amber-700 font-mono font-bold uppercase block">Peak Hour Surge Factor</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={peakSurgeInput}
                    onChange={(e) => setPeakSurgeInput(parseInt(e.target.value))}
                    className="flex-1 accent-pink-500 bg-slate-200 rounded-lg appearance-none h-1.5"
                  />
                  <span className="font-mono text-sm font-bold w-12 text-right">+{peakSurgeInput}%</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                  Applies automatic pricing surges during weekends (Fridays to Sundays) and evening slots after 5:00 PM.
                </p>
              </div>

              {/* Off Peak */}
              <div className="space-y-3">
                <label className="text-xs text-green-700 font-mono font-bold uppercase block">Off-Peak Discount Rate</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={offPeakInput}
                    onChange={(e) => setOffPeakInput(parseInt(e.target.value))}
                    className="flex-1 accent-purple-600 bg-slate-200 rounded-lg appearance-none h-1.5"
                  />
                  <span className="font-mono text-sm font-bold w-12 text-right">-{offPeakInput}%</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                  Applies discounts during quiet hours: Mon-Thu between 10:00 AM and 02:00 PM.
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-bold">Changes immediately adjust Customer Booking prices</span>
              <button
                onClick={handleGlowSave}
                className="px-5 py-2.5 rounded-lg bg-brand-secondary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-md shadow-brand-secondary/15 transition-all"
              >
                {glowSaved ? "Pricing System Saved!" : "Save Dynamic Settings"}
              </button>
            </div>
          </div>
        )}

        {/* AI Procurement Agent */}
        {activeTab === "procurement" && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">AI Procurement Agent Catalog Assessor</h3>
                <p className="text-xs text-slate-500 font-semibold">Owner specifies brand guidelines and margins. BELSOME AI automatically reviews vendor proposals.</p>
              </div>

              <form onSubmit={handleProcureSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="E.g., Botanical Anti-Frizz Serum"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Brand</label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="BioGlow"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Cost / Retail</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={prodCost}
                      onChange={(e) => setProdCost(parseInt(e.target.value))}
                      className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-900"
                    />
                    <input
                      type="number"
                      required
                      value={prodRetail}
                      onChange={(e) => setProdRetail(parseInt(e.target.value))}
                      className="w-1/2 bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-brand-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm h-10 w-full"
                >
                  Submit Proposal
                </button>
              </form>

              {procureError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                  {procureError}
                </div>
              )}

              {procureLoading && (
                <div className="p-8 text-center text-xs text-slate-500 font-mono font-semibold flex items-center justify-center gap-2">
                  <RefreshCcw className="w-4 h-4 animate-spin text-purple-600" />
                  Running AI chemical checklist audit...
                </div>
              )}

              {/* AI scoring result card */}
              {procureResult && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase">BELSOME Audit Decision</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block mt-0.5 ${
                        procureResult.status === "ACCEPT" ? "bg-green-50 border border-green-200 text-green-700" :
                        procureResult.status === "REVIEW" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                        "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                        {procureResult.status} (Score: {procureResult.score})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase">Certification Status</span>
                      <strong className="text-xs text-slate-800">{procureResult.safetyCert}</strong>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 font-semibold">
                    <p><strong className="text-slate-800 font-mono text-[9px] block uppercase font-bold">Margin Analysis:</strong> {procureResult.marginAnalysis}</p>
                    <p><strong className="text-slate-800 font-mono text-[9px] block uppercase font-bold">Volume Recommendation:</strong> {procureResult.stockRecommendation}</p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200 rounded text-xs text-slate-650 font-semibold shadow-sm">
                    <strong className="text-slate-900 block font-mono text-[9px] uppercase font-bold mb-1">AI Recommendation Memo:</strong>
                    {procureResult.explanation}
                  </div>
                </div>
              )}
            </div>

            {/* Proposals registry log */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h4 className="font-display font-bold text-base text-slate-900">Catalog Proposals Log</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vendorProducts.map((vp) => (
                  <div key={vp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm leading-tight">{vp.name}</h5>
                        <span className="text-[10px] text-slate-400 font-semibold">Brand: {vp.brand}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                        vp.status === "ACCEPT" ? "bg-green-50 border border-green-200 text-green-700" :
                        vp.status === "REVIEW" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                        "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                        Score {vp.score} • {vp.status}
                      </span>
                    </div>
                    <div className="h-px bg-slate-200" />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>Cost Price: <strong>₹{vp.cost}</strong></span>
                      <span>Target Margin: <strong>{vp.margin}%</strong></span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-semibold">{vp.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Staff Behavioral Exam */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">AI Staff Behavioral Interviewer</h3>
                <p className="text-xs text-slate-500 font-semibold">Assess candidate responsiveness, language capabilities (EN/HI/TE), crisis composure, and upselling retention skills.</p>
              </div>

              <form onSubmit={handleExamSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Candidate Name</label>
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Candidate Name"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Interview Language</label>
                    <select
                      value={examLanguage}
                      onChange={(e) => setExamLanguage(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Telugu</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Scenario Profile</label>
                    <select
                      value={examScenario}
                      onChange={(e) => setExamScenario(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none"
                    >
                      <option>Complaint Handling: Haircut length discrepancy</option>
                      <option>Upselling: Promoting premium facial treatments</option>
                      <option>Nervous Groom: Calming styling anxieties</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-purple-700 font-bold block uppercase">Candidate Verbal Response</label>
                  <textarea
                    required
                    rows={3}
                    value={candidateResponse}
                    onChange={(e) => setCandidateResponse(e.target.value)}
                    placeholder="Type candidate verbal response to analyze..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
                  />
                </div>

                {/* Quick Presets for Demo */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-mono font-bold text-[9px]">Demo Presets:</span>
                  <button
                    type="button"
                    onClick={() => setCandidateResponse("I apologize for this. I'll fix the length right away and give you a complimentary hair spa for next time.")}
                    className="px-2.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold border border-slate-200 shadow-sm"
                  >
                    Good Response (Apology + Compensation + Upsell)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCandidateResponse("No, the haircut is exactly as we agreed. I cannot change it now.")}
                    className="px-2.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold border border-slate-200 shadow-sm"
                  >
                    Bad Response (Defensive)
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-brand-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm transition-all"
                >
                  Analyze Candidate Composure
                </button>
              </form>

              {examError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                  {examError}
                </div>
              )}

              {examLoading && (
                <div className="p-8 text-center text-xs text-slate-550 font-mono font-semibold flex items-center justify-center gap-2">
                  <RefreshCcw className="w-4 h-4 animate-spin text-purple-600" />
                  Running AI vocal linguistic evaluation...
                </div>
              )}

              {/* Exam result card */}
              {examResult && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase">Linguistic Evaluation</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block mt-0.5 ${
                        examResult.status === "HIRE" ? "bg-green-50 border border-green-200 text-green-700" :
                        examResult.status === "TRAIN" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                        "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                        {examResult.status} (Score: {examResult.overallScore})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase">Composure Rating</span>
                      <strong className="text-xs text-slate-800">{examResult.composureRating}</strong>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 font-semibold">
                    <div>
                      <strong className="text-slate-800 font-mono text-[9px] block uppercase font-bold">Empathy Assessment:</strong>
                      <p className="mt-0.5">{examResult.feedback.empathy}</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 font-mono text-[9px] block uppercase font-bold">Resolution effectiveness:</strong>
                      <p className="mt-0.5">{examResult.feedback.resolution}</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200 rounded text-xs text-slate-650 font-semibold shadow-sm">
                    <strong className="text-slate-900 block font-mono text-[9px] uppercase font-bold mb-1">Recommended Training:</strong>
                    {examResult.recommendedCourses.join(" • ")}
                  </div>
                </div>
              )}
            </div>

            {/* Exams Logs registry */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h4 className="font-display font-bold text-base text-slate-900">Behavioral Exams History log</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {examAttempts.map((ex) => (
                  <div key={ex.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm leading-tight">{ex.candidateName}</h5>
                        <span className="text-[10px] text-slate-400 font-semibold">Language: {ex.language} • {ex.date}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                        ex.status === "HIRE" ? "bg-green-50 border border-green-200 text-green-700" :
                        ex.status === "TRAIN" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                        "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                        Score {ex.score}% • {ex.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-semibold">{ex.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bridal War Room coordination */}
        {activeTab === "bridal" && (
          <div className="glass-panel p-6 rounded-2xl border border-pink-100 bg-gradient-to-br from-white to-pink-50/20 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-pink-100 pb-4">
              <div>
                <span className="text-[9px] px-2 py-0.5 bg-pink-50 border border-pink-100 text-pink-700 font-mono rounded inline-block mb-1 font-bold">
                  Bridal War Room Coordinator
                </span>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Project: {currentWedding.brideName}'s Gala</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-semibold block">Wedding Date:</span>
                <strong className="text-xs text-slate-700 font-bold">{currentWedding.weddingDate}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-pink-700 font-mono uppercase tracking-wider">Coordinated Timeline Plan</h4>
                  <span className="text-xs text-slate-400 font-semibold">Live Drag & Drop Simulation</span>
                </div>

                <div className="space-y-2">
                  {currentWedding.timeline.map((item) => (
                    <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-1 rounded border border-purple-100">{item.time}</span>
                        <span className="text-slate-700 font-semibold">{item.event}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        item.status === "Completed" ? "bg-green-50 border border-green-200 text-green-700" :
                        "bg-amber-50 border border-amber-200 text-amber-700 animate-pulse"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={timelineEvent}
                    onChange={(e) => setTimelineEvent(e.target.value)}
                    placeholder="Add wedding scheduler event (e.g. Nail Art Touch-up)"
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={timelineTime}
                    onChange={(e) => setTimelineTime(e.target.value)}
                    placeholder="Time"
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={addBridalTimeline}
                    className="px-3 rounded-lg bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-1 space-y-4">
                <h4 className="font-bold text-xs text-pink-700 font-mono uppercase tracking-wider">Vendor Checkout Bundles</h4>
                <div className="space-y-3">
                  {currentWedding.bookedVendors.map((v, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">{v.role}</span>
                        <span className="text-[9px] text-green-600 font-bold">{v.status}</span>
                      </div>
                      <h5 className="font-bold text-slate-800">{v.name}</h5>
                      <span className="text-pink-600 font-mono font-bold block pt-1">₹{v.cost}</span>
                    </div>
                  ))}

                  <div className="h-px bg-slate-200" />
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-650">
                    <span>Total Package:</span>
                    <strong className="text-slate-900 text-sm font-mono font-bold">₹{currentWedding.bookedVendors.reduce((sum, item) => sum + item.cost, 0)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
