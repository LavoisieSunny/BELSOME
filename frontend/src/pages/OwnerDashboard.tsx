import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { ApiService } from "../services/api";
import { 
  Award, TrendingUp, DollarSign, Calendar, PackageCheck, AlertCircle, 
  Settings, CheckCircle2, RefreshCcw, Heart, Send, BarChart2, PlusCircle,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import GlowHeatmap from "../components/GlowHeatmap";
import AIReasoning from "../components/AIReasoning";

const getPricingBullets = (reason: string) => {
  const base = reason || "Standard Rate";
  if (base.includes("Off-Peak")) {
    return [
      base,
      "Applied Mon-Thu between 10:00 AM and 02:00 PM.",
      "Incentivizes bookings during historically quiet intervals."
    ];
  }
  if (base.includes("Surge") || base.includes("Demand")) {
    return [
      base,
      "Applies during high-occupancy weekend or evening slots.",
      "Stylist capacity thresholds exceeded, triggering surge multiplier."
    ];
  }
  return [
    base,
    "Standard base styling rate applies.",
    "Optimal pricing balance with no dynamic adjustments."
  ];
};

export default function OwnerDashboard() {
  const { 
    salons, appointments, vendorProducts, examAttempts, weddingProjects, 
    updateGlowSettings, addVendorProduct, addExamAttempt, updateWeddingProject,
    addToast, activeCity
  } = useBelsomeStore();

  const [activeTab, setActiveTab] = useState<"analytics" | "glow" | "heatmap" | "procurement" | "staff" | "bridal">("analytics");
  const [error, setError] = useState<string | null>(null);
  const [procureError, setProcureError] = useState<string | null>(null);
  const [examError, setExamError] = useState<string | null>(null);

  // AI BELSOME Score states
  const [belsomeScoreData, setBelsomeScoreData] = useState<{
    score: number;
    level: string;
    summary: string;
    breakdown: {
      procurement: { score: number; feedback: string };
      staff: { score: number; feedback: string };
      bookings: { score: number; feedback: string };
      rating: { score: number; feedback: string };
    };
    recommendations: string[];
  } | null>(null);
  const [belsomeLoading, setBelsomeLoading] = useState(false);
  const [belsomeError, setBelsomeError] = useState<string | null>(null);

  // Live Revenue Ticker states
  const [liveRevenueOffset, setLiveRevenueOffset] = useState(0);
  const [revenueFlash, setRevenueFlash] = useState(false);

  // AI Wedding Day Planner States
  const [planDate, setPlanDate] = useState("2026-11-20");
  const [planFamilyCount, setPlanFamilyCount] = useState(3);
  const [planCeremonyType, setPlanCeremonyType] = useState("Traditional Hindu Wedding");
  
  const [weddingPlan, setWeddingPlan] = useState<{
    timeline: { id: string; time: string; event: string; status: string }[];
    assignments: string[];
    roster: string[];
    totalCost: number;
    b2bPitch: string;
    isOffline?: boolean;
  } | null>(null);
  
  const [weddingPlanLoading, setWeddingPlanLoading] = useState(false);
  const [weddingPlanError, setWeddingPlanError] = useState<string | null>(null);


  // Inspector & Promotion States
  const [inspectedSlot, setInspectedSlot] = useState<{
    dayName: string;
    hourStr: string;
    priceMultiplier: number;
    bookedCount: number;
    capacity: number;
  } | null>(null);
  const [promotedSlots, setPromotedSlots] = useState<string[]>([]);
  const [promoting, setPromoting] = useState(false);

  // Glow pricing adjustments
  const currentSalon = salons[0];
  const [peakSurgeInput, setPeakSurgeInput] = useState(currentSalon.peakSurge);
  const [offPeakInput, setOffPeakInput] = useState(currentSalon.offPeakDiscount);
  const [glowSaved, setGlowSaved] = useState(false);

  // AI Pricing Forecast State
  const [forecast, setForecast] = useState<{
    projectedRevenue: number;
    surgeGains: number;
    offPeakDiscountLoss: number;
    offPeakVolumeUplift: number;
    netImpact: number;
    recommendationText: string;
    surgeStatus: "OPTIMAL" | "TOO_HIGH" | "TOO_LOW";
    offPeakStatus: "OPTIMAL" | "TOO_HIGH" | "TOO_LOW";
  } | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setForecastLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await ApiService.getPricingForecast(peakSurgeInput, offPeakInput);
        if (active) {
          setForecast(res);
          setForecastError(null);
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setForecastError("Failed to load forecast recommendation.");
        }
      } finally {
        if (active) {
          setForecastLoading(false);
        }
      }
    }, 400); // 400ms debounce

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [peakSurgeInput, offPeakInput]);

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

  const fetchBelsomeScore = async () => {
    setBelsomeLoading(true);
    setBelsomeError(null);
    try {
      const currentSalon = salons[0];
      const avgProcureScore = vendorProducts.length > 0 
        ? vendorProducts.reduce((sum, p) => sum + p.score, 0) / vendorProducts.length 
        : 85;
      const avgExamScore = examAttempts.length > 0 
        ? examAttempts.reduce((sum, e) => sum + e.score, 0) / examAttempts.length 
        : 75;
      const salonAppts = appointments.filter((a) => a.salonId === currentSalon.id);
      const totalCount = salonAppts.length;
      const completedCount = salonAppts.filter(a => a.status === "Completed").length;
      const upcomingCount = salonAppts.filter(a => a.status === "Upcoming").length;
      const completionRate = totalCount > 0 
        ? ((completedCount + upcomingCount) / totalCount) * 100 
        : 92;
      const customerRating = currentSalon?.rating || 4.9;

      const res = await ApiService.getBelsomeScore({
        salonName: currentSalon.name,
        procurementQuality: avgProcureScore,
        staffExamScores: avgExamScore,
        bookingCompletionRate: completionRate,
        customerRating: customerRating
      });
      setBelsomeScoreData(res);
    } catch (err: any) {
      console.error(err);
      setBelsomeError("Failed to calculate trust score.");
    } finally {
      setBelsomeLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBelsomeScore();
  }, [activeCity, vendorProducts.length, examAttempts.length, appointments.length]);

  React.useEffect(() => {
    const names = ["Aarav", "Kabir", "Rohan", "Aditya", "Vikram", "Neha", "Priya", "Ananya", "Simran", "Rahul"];
    const services = ["Haircut & Consultation", "Beard Trim & Grooming", "Slicked Back Undercut", "De-Tan Facial", "Royal Makeover"];
    const basePrices = [800, 500, 1100, 1200, 15000];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * services.length);
      const name = names[Math.floor(Math.random() * names.length)];
      const service = services[idx];
      const price = basePrices[idx];

      setLiveRevenueOffset(prev => prev + price);
      setRevenueFlash(true);
      setTimeout(() => setRevenueFlash(false), 1000);
      
      addToast(`⚡ Live Booking Completed: ${name} — ${service} — ₹${price.toLocaleString("en-IN")}`, "success");
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGenerateWeddingPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setWeddingPlanLoading(true);
    setWeddingPlanError(null);
    addToast("👰 Orchestrating AI groom/bride & guest timelines...", "info");
    
    try {
      const res = await ApiService.getWeddingPlanner({
        date: planDate,
        familyCount: planFamilyCount,
        ceremonyType: planCeremonyType
      });
      setWeddingPlan(res);
      addToast("✨ AI Wedding Day Grooming Plan generated successfully!", "success");
    } catch (err: any) {
      console.error("Wedding planner API failed, falling back to client mock:", err);
      try {
        const res = await ApiService.getClientSideMock("wedding-planner", {
          date: planDate,
          familyCount: planFamilyCount,
          ceremonyType: planCeremonyType
        });
        setWeddingPlan({ ...res, isOffline: true });
        addToast("✨ AI Wedding Day Grooming Plan generated (offline mode)!", "info");
      } catch (mockErr) {
        setWeddingPlanError("AI is unavailable. Make sure the backend is running.");
      }
    } finally {
      setWeddingPlanLoading(false);
    }
  };

  const handleGlowSave = () => {
    updateGlowSettings(currentSalon.id, peakSurgeInput, offPeakInput);
    setGlowSaved(true);
    addToast("⚡ Dynamic pricing settings saved successfully!", "success");
    setTimeout(() => setGlowSaved(false), 2000);
  };

  const handleProcureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodBrand) return;

    setProcureLoading(true);
    setProcureError(null);
    addToast("🧪 Auditing vendor proposal against chemical guidelines...", "info");
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
      
      const toastType = response.status === "ACCEPT" ? "success" : response.status === "REVIEW" ? "warning" : "error";
      addToast(`📋 Proposal audited! Decision: ${response.status} (Safety Score: ${response.score})`, toastType);
    } catch (e) {
      console.error("Procurement API failed, falling back to mock:", e);
      try {
        const response = await ApiService.getClientSideMock("procurement", {
          name: prodName,
          brand: prodBrand,
          certifications: prodCerts,
          cost: prodCost,
          retail: prodRetail,
          budget: 5000,
          prefBrands: "BioGlow, OrganicLife",
          marginGoal: 50
        });
        const offlineResponse = { ...response, isOffline: true };
        setProcureResult(offlineResponse);
        addVendorProduct({
          name: prodName,
          brand: prodBrand,
          certifications: prodCerts.split(","),
          cost: prodCost,
          retail: prodRetail,
          margin: parseFloat(((prodRetail - prodCost) / prodRetail * 100).toFixed(1)),
          score: offlineResponse.score,
          status: offlineResponse.status,
          explanation: offlineResponse.explanation
        });
        setProdName("");
        setProdBrand("");
        addToast(`📋 Proposal audited (offline mode)! Decision: ${offlineResponse.status}`, "info");
      } catch (fallbackErr) {
        setProcureError("AI is unavailable. Make sure the backend is running.");
      }
    } finally {
      setProcureLoading(false);
    }
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateResponse) return;

    setExamLoading(true);
    setExamError(null);
    addToast("🎓 Running AI behavioral analysis on candidate response...", "info");
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
      
      const toastType = response.status === "HIRE" ? "success" : response.status === "TRAIN" ? "warning" : "error";
      addToast(`📝 Evaluation complete! Classification: ${response.status} (Score: ${response.overallScore}%)`, toastType);
    } catch (e) {
      console.error("Behavioral exam API failed, falling back to mock:", e);
      try {
        const response = await ApiService.getClientSideMock("behavioral-exam", {
          scenario: examScenario,
          language: examLanguage,
          response: candidateResponse
        });
        const offlineResponse = { ...response, isOffline: true };
        setExamResult(offlineResponse);
        addExamAttempt({
          candidateName,
          language: examLanguage,
          scenario: examScenario,
          score: offlineResponse.overallScore,
          status: offlineResponse.status,
          feedback: offlineResponse.feedback.empathy + " " + offlineResponse.feedback.resolution
        });
        setCandidateName("");
        setCandidateResponse("");
        addToast(`📝 Evaluation complete (offline mode)! Classification: ${offlineResponse.status}`, "info");
      } catch (fallbackErr) {
        setExamError("AI is unavailable. Make sure the backend is running.");
      }
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
    addToast(`📅 Added timeline event: "${timelineEvent}" at ${timelineTime}!`, "success");
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
            { id: "heatmap", label: "Demand Heatmap", icon: Calendar },
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
            {/* AI BELSOME Trust Score Dashboard Header */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden">
              {/* Decorative premium gradients */}
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-pink-300/15 to-purple-400/15 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-gradient-to-tr from-blue-300/10 to-indigo-400/10 rounded-full blur-2xl -z-10 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Circular Gauge Score display */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background track */}
                      <circle
                        cx="72"
                        cy="72"
                        r="58"
                        className="stroke-slate-100"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Foreground indicator */}
                      <motion.circle
                        cx="72"
                        cy="72"
                        r="58"
                        className={`stroke-current ${(belsomeScoreData?.score ?? 0) >= 90 ? "text-pink-600" : (belsomeScoreData?.score ?? 0) >= 80 ? "text-purple-600" : (belsomeScoreData?.score ?? 0) >= 65 ? "text-amber-500" : "text-rose-500"}`}
                        strokeWidth="8"
                        strokeDasharray={364}
                        initial={{ strokeDashoffset: 364 }}
                        animate={{ strokeDashoffset: 364 * (1 - (belsomeScoreData?.score ?? 85) / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-extrabold font-mono text-slate-800 leading-none">
                        {belsomeLoading ? (
                          <RefreshCcw className="w-6 h-6 text-purple-600 animate-spin" />
                        ) : (
                          belsomeScoreData?.score ?? "--"
                        )}
                      </span>
                      <span className="text-[10px] text-slate-450 uppercase font-mono font-bold tracking-wider mt-1.5">BELSOME Score</span>
                    </div>
                  </div>
                  
                  {/* Trust Level Badge */}
                  {!belsomeLoading && belsomeScoreData && (
                    <span className={`mt-3 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-sm border ${
                      belsomeScoreData.level === "Elite Trust" ? "bg-pink-50 border-pink-100 text-pink-700" :
                      belsomeScoreData.level === "Gold Standard" ? "bg-purple-50 border-purple-100 text-purple-700" :
                      belsomeScoreData.level === "Accredited Premium" ? "bg-blue-50 border-blue-100 text-blue-800" :
                      "bg-rose-50 border-rose-100 text-rose-700"
                    }`}>
                      ✨ {belsomeScoreData.level}
                    </span>
                  )}
                </div>

                {/* Trust Score breakdown & summary */}
                <div className="flex-1 space-y-4 w-full text-left">
                  <div>
                    <h2 className="text-sm font-bold text-slate-850 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                      Live AI Trust operations Audit
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {belsomeLoading ? "Analyzing operational logs, staff certificates, customer feedback channels..." : belsomeScoreData?.summary}
                    </p>
                  </div>

                  {/* Operational breakdown meters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "procurement", label: "Procurement Quality", icon: PackageCheck, color: "bg-emerald-500", rawVal: `${belsomeScoreData?.breakdown.procurement.score ?? 85}%` },
                      { key: "staff", label: "Staff Exam Rating", icon: Award, color: "bg-purple-500", rawVal: `${belsomeScoreData?.breakdown.staff.score ?? 75}%` },
                      { key: "bookings", label: "Booking Completion", icon: Calendar, color: "bg-blue-500", rawVal: `${belsomeScoreData?.breakdown.bookings.score ?? 92}%` },
                      { key: "rating", label: "Customer Rating", icon: Heart, color: "bg-pink-500", rawVal: `${((belsomeScoreData?.breakdown.rating.score ?? 98) / 20).toFixed(1)}/5.0` }
                    ].map((item) => {
                      const Icon = item.icon;
                      const metrics = belsomeScoreData?.breakdown[item.key as "procurement" | "staff" | "bookings" | "rating"];
                      return (
                        <div key={item.key} className="space-y-1 p-2 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <Icon className="w-3.5 h-3.5 text-slate-500" />
                              {item.label}
                            </span>
                            <span className="font-mono text-slate-650">{item.rawVal}</span>
                          </div>
                          <div className="relative w-full h-1.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                            <div className={`absolute top-0 bottom-0 left-0 rounded-full ${item.color}`} style={{ width: `${metrics?.score ?? 80}%` }} />
                          </div>
                          <p className="text-[9px] text-slate-400 font-medium leading-normal line-clamp-1 hover:line-clamp-none transition-all cursor-help">
                            {metrics?.feedback}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actionable recommendations & manual recalculate */}
              {!belsomeLoading && belsomeScoreData && (
                <>
                  <div className="h-px bg-slate-100 my-4" />
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[9px] text-pink-600 font-mono font-bold uppercase block tracking-wider">Priority AI Recommendations</span>
                      <ul className="space-y-1">
                        {belsomeScoreData.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                            <span className="inline-block w-1 h-1 rounded-full bg-pink-500 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={fetchBelsomeScore}
                      disabled={belsomeLoading}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wide hover:bg-slate-50 flex items-center justify-center gap-2 transition-all self-end"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Audited Recalculate
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel p-5 rounded-xl border border-slate-200/60 bg-white flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider block">Gross Salon Revenue</span>
                  <h4 className={`font-display font-extrabold text-2xl mt-1 font-mono transition-all duration-300 ${
                    revenueFlash ? "text-green-600 scale-105" : "text-slate-900"
                  }`}>
                    ₹{(totalRevenue + liveRevenueOffset).toLocaleString("en-IN")}
                  </h4>
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
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">{(activeCity === "Bangalore" ? "BANGALORE INDIRANAGAR" : activeCity === "Mumbai" ? "MUMBAI BANDRA" : activeCity === "Delhi" ? "DELHI CONNAUGHT PLACE" : "HYDERABAD JUBILEE HILLS").toUpperCase()} REGISTRY</span>
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
                        className="stroke-slate-100 dark:stroke-slate-800"
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
                        <td className="py-3 text-right flex items-center justify-end gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            appt.pricingReason.includes("Off-Peak") ? "bg-green-50 border border-green-150 text-green-700" :
                            appt.pricingReason.includes("Surge") ? "bg-amber-55/60 border border-amber-200 text-amber-700" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {appt.pricingReason.split(" (")[0]}
                          </span>
                          <AIReasoning
                            bullets={getPricingBullets(appt.pricingReason)}
                            label="Why this price?"
                          />
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
          <div className="space-y-6">
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

            {/* AI Revenue Forecast Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6 relative overflow-hidden">
              {/* Premium Glow effect background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-100/20 rounded-full blur-2xl -z-10 pointer-events-none" />

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900">AI Revenue Forecast & Strategy Audit</h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase font-mono">BELSOME Pricing Intelligence Engine</p>
                  </div>
                </div>
                {forecastLoading && (
                  <span className="flex items-center gap-1.5 text-[10px] text-purple-600 font-mono font-bold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 animate-pulse">
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Recalculating...
                  </span>
                )}
              </div>

              {forecastError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-semibold">
                  {forecastError}
                </div>
              )}

              {forecastLoading ? (
                <div className="space-y-6 animate-pulse">
                  {/* Stats columns skeleton */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-2 h-24">
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                        <div className="h-6 bg-slate-250 dark:bg-slate-750 rounded w-24" />
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-855 rounded w-20" />
                      </div>
                    ))}
                  </div>

                  {/* Projection Breakdown skeleton */}
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-36" />
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-xl space-y-4 shadow-inner">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-48" />
                            <div className="h-3 bg-slate-250 dark:bg-slate-750 rounded w-16" />
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation block skeleton */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 flex gap-4 h-20">
                    <div className="h-5 bg-slate-250 dark:bg-slate-750 rounded w-16" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-slate-250 dark:bg-slate-800 rounded w-36" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-855 rounded w-full" />
                    </div>
                  </div>
                </div>
              ) : forecast ? (
                <div className="space-y-6">
                  {/* Dynamic Revenue Comparison Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1 shadow-sm">
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">Baseline Revenue</span>
                      <h5 className="font-mono text-lg font-bold text-slate-500">₹1,54,000</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">Before dynamic pricing</span>
                    </div>

                    <div className="p-4 bg-purple-50/50 border border-purple-100/70 rounded-xl space-y-1 shadow-sm relative overflow-hidden">
                      <span className="text-[9px] text-purple-500 font-mono font-bold uppercase block">Projected Revenue</span>
                      <h5 className="font-mono text-lg font-extrabold text-purple-700">₹{forecast.projectedRevenue.toLocaleString("en-IN")}</h5>
                      <span className="text-[10px] text-purple-600 font-semibold block">Estimated monthly billing</span>
                    </div>

                    <div className={`p-4 border rounded-xl space-y-1 shadow-sm ${
                      forecast.netImpact >= 0 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                        : "bg-rose-50 border-rose-100 text-rose-800"
                    }`}>
                      <span className="text-[9px] font-mono font-bold uppercase block">Net Impact</span>
                      <h5 className="font-mono text-lg font-bold flex items-center gap-1">
                        {forecast.netImpact >= 0 ? "+" : ""}
                        ₹{forecast.netImpact.toLocaleString("en-IN")}
                      </h5>
                      <span className="text-[10px] font-semibold">
                        {forecast.netImpact >= 0 ? "Revenue Growth" : "Revenue Decline"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Breakdown Breakdown Chart */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide font-mono">Monthly Projection Breakdown</h5>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-inner">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 font-semibold">Weekend / Evening Surge Gains:</span>
                        <span className="font-mono font-bold text-pink-600">+₹{forecast.surgeGains.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (forecast.surgeGains / 154000) * 100 * 5)}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-slate-600 font-semibold">Off-Peak Quiet Hour Discounts:</span>
                        <span className="font-mono font-bold text-slate-500">-₹{forecast.offPeakDiscountLoss.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-slate-400 h-full rounded-full" style={{ width: `${Math.min(100, (forecast.offPeakDiscountLoss / 154000) * 100 * 5)}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-slate-600 font-semibold">Off-Peak Volume Customer Acquisition:</span>
                        <span className="font-mono font-bold text-emerald-600">+₹{forecast.offPeakVolumeUplift.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, (forecast.offPeakVolumeUplift / 154000) * 100 * 5)}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation Audit Alert */}
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-start shadow-sm transition-all ${
                    forecast.surgeStatus === "OPTIMAL" && forecast.offPeakStatus === "OPTIMAL"
                      ? "bg-emerald-50 border-emerald-250 text-emerald-950"
                      : (forecast.surgeStatus === "TOO_HIGH" || forecast.offPeakStatus === "TOO_HIGH")
                        ? "bg-rose-50 border-rose-250 text-rose-950"
                        : "bg-amber-50 border-amber-250 text-amber-950"
                  }`}>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold uppercase ${
                        forecast.surgeStatus === "OPTIMAL" && forecast.offPeakStatus === "OPTIMAL"
                          ? "bg-emerald-600 text-white"
                          : (forecast.surgeStatus === "TOO_HIGH" || forecast.offPeakStatus === "TOO_HIGH")
                            ? "bg-rose-600 text-white"
                            : "bg-amber-600 text-white"
                      }`}>
                        {forecast.surgeStatus === "OPTIMAL" && forecast.offPeakStatus === "OPTIMAL"
                          ? "Optimized"
                          : "Audit Alert"
                      }
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h6 className="text-xs font-bold font-display uppercase tracking-wider">Dynamic Pricing Recommendations</h6>
                      <p className="text-xs leading-relaxed font-semibold opacity-90">{forecast.recommendationText}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {activeTab === "heatmap" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Real-time Demand Heatmap & Booking Grid</h3>
                <p className="text-xs text-slate-550 font-semibold mt-0.5">Click any calendar slot to inspect occupancy rates, analyze pricing tiers, and push promotions to quiet slots.</p>
              </div>
              <span className="text-xs font-mono text-pink-700 font-bold bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded shadow-sm">
                Owner Dashboard Feed
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Heatmap Grid */}
              <div className="xl:col-span-3">
                <GlowHeatmap
                  salonId={currentSalon.id}
                  highlightSelected={false}
                  onSlotInspect={(dayName, hourStr, priceMultiplier, bookedCount, capacity) => {
                    setInspectedSlot({ dayName, hourStr, priceMultiplier, bookedCount, capacity });
                  }}
                />
              </div>

              {/* Inspector Panel */}
              <div className="xl:col-span-1">
                {inspectedSlot ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-left shadow-sm animate-fade-in">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Inspecting Slot</span>
                      <h4 className="font-display font-extrabold text-sm text-slate-800">{inspectedSlot.dayName} at {inspectedSlot.hourStr}</h4>
                    </div>

                    <div className="space-y-3.5 text-xs text-slate-650 font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rate Multiplier:</span>
                        <strong className="text-slate-800 font-mono">{inspectedSlot.priceMultiplier}x</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stylist Occupancy:</span>
                        <strong className="text-slate-800">{inspectedSlot.bookedCount} / {inspectedSlot.capacity} Stylists</strong>
                      </div>

                      {/* Occupancy Progress bar */}
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-primary h-full rounded-full transition-all"
                          style={{ width: `${(inspectedSlot.bookedCount / inspectedSlot.capacity) * 105}%` }}
                        />
                      </div>

                      {/* Diagnosis */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[8px] font-mono font-bold text-slate-400 uppercase block tracking-wider">Diagnosis</span>
                        <div className="mt-1 flex items-center gap-1.5">
                          {inspectedSlot.bookedCount === inspectedSlot.capacity ? (
                            <span className="text-[10px] text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded font-mono font-bold uppercase">
                              🔥 Fully Occupied
                            </span>
                          ) : inspectedSlot.priceMultiplier > 1.0 ? (
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded font-mono font-bold uppercase">
                              📈 Peak Surge Hour
                            </span>
                          ) : inspectedSlot.priceMultiplier < 1.0 ? (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono font-bold uppercase">
                              ❄️ Quiet Off-Peak Hour
                            </span>
                          ) : (
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono font-bold uppercase">
                              🟢 Standard Slot
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Promotional SMS block */}
                      {inspectedSlot.bookedCount < inspectedSlot.capacity && (
                        <div className="pt-4 border-t border-slate-200 space-y-3">
                          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl space-y-1.5">
                            <h5 className="font-bold text-purple-800 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Promotion Available
                            </h5>
                            <p className="text-[10px] text-slate-500 leading-normal">
                              This slot has vacant stylists. Send an automated SMS promotion with an extra 10% off code to boost bookings.
                            </p>
                          </div>

                          {promotedSlots.includes(`${inspectedSlot.dayName}-${inspectedSlot.hourStr}`) ? (
                            <button
                              disabled
                              className="w-full py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4.5 h-4.5 text-green-600" /> Promoted successfully
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setPromoting(true);
                                addToast("📢 Dispatched SMS campaign requests to BELSOME client directory...", "info");
                                setTimeout(() => {
                                  const slotKey = `${inspectedSlot.dayName}-${inspectedSlot.hourStr}`;
                                  setPromotedSlots([...promotedSlots, slotKey]);
                                  setPromoting(false);
                                  addToast(`🎉 Promotion active! SMS coupon BELSOME-${inspectedSlot.dayName.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)} sent to 42 users.`, "success");
                                }, 800);
                              }}
                              className="w-full py-2.5 rounded-lg bg-brand-primary text-white text-[10px] font-bold tracking-wider uppercase hover:opacity-90 transition-all shadow-md shadow-brand-primary/10 flex items-center justify-center gap-1.5"
                            >
                              {promoting ? "Sending..." : "📢 Dispatch Promo SMS"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] border border-dashed border-slate-250 rounded-xl flex flex-col justify-center items-center p-6 text-center text-slate-400 bg-slate-50/50 shadow-inner select-none">
                    <Calendar className="w-8 h-8 text-slate-300 stroke-[1.5] mb-2 animate-pulse" />
                    <span className="text-[11px] font-bold">No Slot Inspected</span>
                    <p className="text-[9.5px] font-semibold mt-1">Select any cell on the calendar grid to show demand metrics and promotions console.</p>
                  </div>
                )}
              </div>
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
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 shadow-inner animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                      <div className="h-5 bg-slate-250 dark:bg-slate-750 rounded w-28" />
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                      <div className="h-4 bg-slate-250 dark:bg-slate-750 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="p-3.5 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded space-y-2 shadow-sm">
                    <div className="h-2.5 bg-slate-250 dark:bg-slate-855 rounded w-28" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-11/12" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
                  </div>
                </div>
              )}

              {/* AI scoring result card */}
              {procureResult && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase">BELSOME Audit Decision</span>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block ${
                          procureResult.status === "ACCEPT" ? "bg-green-50 border border-green-200 text-green-700" :
                          procureResult.status === "REVIEW" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                          "bg-red-50 border border-red-200 text-red-700"
                        }`}>
                          {procureResult.status} (Score: {procureResult.score})
                        </span>
                        {procureResult.isOffline && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Live AI offline — showing demo data
                          </span>
                        )}
                      </div>
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
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 shadow-inner animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                      <div className="h-5 bg-slate-250 dark:bg-slate-750 rounded w-28" />
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                      <div className="h-4 bg-slate-250 dark:bg-slate-750 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="p-3.5 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded space-y-2 shadow-sm">
                    <div className="h-2.5 bg-slate-250 dark:bg-slate-855 rounded w-28" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                  </div>
                </div>
              )}

              {/* Exam result card */}
              {examResult && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase">Linguistic Evaluation</span>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block ${
                          examResult.status === "HIRE" ? "bg-green-50 border border-green-200 text-green-700" :
                          examResult.status === "TRAIN" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                          "bg-red-50 border border-red-200 text-red-700"
                        }`}>
                          {examResult.status} (Score: {examResult.overallScore})
                        </span>
                        {examResult.isOffline && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Live AI offline — showing demo data
                          </span>
                        )}
                      </div>
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
          <div className="space-y-6">
            {/* Planner Inputs & B2B Pitch Card */}
            <div className="glass-panel p-6 rounded-2xl border border-pink-150 bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/20 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch">
                
                <div className="flex-1 space-y-4 text-left">
                  <div>
                    <span className="text-[9px] px-2 py-0.5 bg-pink-50 border border-pink-100 text-pink-700 font-mono rounded inline-block mb-1.5 font-bold uppercase tracking-wider">
                      B2B Enterprise Portal
                    </span>
                    <h3 className="font-display font-extrabold text-base text-slate-900">AI Wedding Day Grooming & Logistics planner</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Instantly balance stylist occupancy, minimize booking gaps, and calculate group treatment quotes for large bridal parties.
                    </p>
                  </div>

                  <form onSubmit={handleGenerateWeddingPlan} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Ceremony Type</label>
                      <select
                        value={planCeremonyType}
                        onChange={(e) => setPlanCeremonyType(e.target.value)}
                        className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-semibold"
                      >
                        <option>Traditional Hindu Wedding</option>
                        <option>Sangeet Gala Party</option>
                        <option>Cocktail Night</option>
                        <option>Grand Reception</option>
                        <option>Christian Nuptials</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Wedding Date</label>
                      <input
                        type="date"
                        required
                        value={planDate}
                        onChange={(e) => setPlanDate(e.target.value)}
                        className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-mono text-purple-700 font-bold uppercase">Guests / Family Count</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        required
                        value={planFamilyCount}
                        onChange={(e) => setPlanFamilyCount(parseInt(e.target.value))}
                        className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={weddingPlanLoading}
                      className="sm:col-span-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-650 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-90 shadow-md shadow-pink-600/10 flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                      {weddingPlanLoading ? (
                        <>
                          <RefreshCcw className="w-4 h-4 animate-spin animate-infinite" /> Orchestrating Timeline...
                        </>
                      ) : (
                        "Generate Coordinated Grooming Timeline"
                      )}
                    </button>
                  </form>
                </div>

                {/* B2B Logistics Pitch sidebox */}
                <div className="w-full lg:w-80 bg-purple-50/50 border border-purple-100 p-4 rounded-xl flex flex-col justify-between shadow-inner text-left">
                  <div className="space-y-2">
                    <span className="text-[8px] text-purple-550 font-mono font-bold uppercase tracking-wider block">B2B Yield Optimization Pitch</span>
                    <h4 className="font-bold text-xs text-purple-800 leading-snug">Maximize High-Ticket Guest Revenue</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Bridal bookings represent the highest ticket orders in styling. BELSOME AI load-balances family guest slots around lead bride treatment windows to minimize stylist idle time and capture 100% group service margin.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-purple-100 text-[10px] font-mono text-purple-700 font-bold flex items-center gap-1">
                    ⚡ 42% Average Margin Lift
                  </div>
                </div>

              </div>
            </div>

            {/* Generated Plan Output */}
            {weddingPlanError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                {weddingPlanError}
              </div>
            )}

            {weddingPlan ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in text-left">
                {/* Timeline */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="font-display font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-pink-600" />
                      Coordinated Wedding Day Timeline
                    </h4>
                    <span className="text-[9px] font-mono bg-green-50 text-green-700 border border-green-100 font-bold px-2 py-0.5 rounded uppercase">
                      {weddingPlan.isOffline ? "Mock Mode" : "AI Optimized"}
                    </span>
                  </div>

                  <div className="space-y-3.5 relative pl-4 border-l border-slate-200 ml-2 py-2">
                    {weddingPlan.timeline.map((evt, idx) => (
                      <div key={evt.id} className="relative space-y-1">
                        {/* Bullet point node */}
                        <span className="absolute -left-[22.5px] top-1.5 w-3 h-3 rounded-full border border-pink-500 bg-white shadow-sm" />
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-pink-700 font-bold bg-pink-50 px-2 py-0.5 rounded border border-pink-100 shrink-0">
                            {evt.time}
                          </span>
                          <span className="text-[11px] text-slate-755 font-semibold leading-relaxed">{evt.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* B2B Logistics Description */}
                  <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-xl text-xs text-purple-950 font-semibold leading-relaxed flex gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="block text-[10px] font-mono uppercase tracking-wider mb-1 text-purple-900">AI Logistics Optimization Memo:</strong>
                      {weddingPlan.b2bPitch}
                    </div>
                  </div>
                </div>

                {/* assignments and roster */}
                <div className="lg:col-span-1 space-y-6">
                  {/* service assignments */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 text-left">
                    <h4 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Family Guest Assignments
                    </h4>
                    <div className="space-y-2.5">
                      {weddingPlan.assignments.map((as, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-[11px] shadow-sm font-semibold">
                          <span className="text-slate-700">{as.split(" - ")[0]}</span>
                          <strong className="font-mono text-pink-650 shrink-0">{as.split(" - ")[1]}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">Total Bridal Package:</span>
                      <span className="text-slate-900 text-sm font-mono font-bold">₹{weddingPlan.totalCost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Stylists roster */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 text-left">
                    <h4 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Deployed Stylist Roster
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {weddingPlan.roster.map((st, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg text-purple-700 text-xs font-bold font-mono">
                          🧑‍🎨 {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto text-xs text-slate-400 font-semibold space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                <p>No active wedding grooming plan simulated.</p>
                <p className="text-[10px]">Enter wedding coordinates above and hit generate to model the logistics flow.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
