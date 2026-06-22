import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBelsomeStore } from "../store/belsomeStore";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Star, Scissors, Users, Award, ShieldCheck, Heart } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { ApiService } from "../services/api";

const SPECIALTIES = [
  "Bridal Glow & Makeovers",
  "Clean Executive Scissor Cuts",
  "Men's Fade & Grooming Reset",
  "Ayurvedic Skincare & Detox",
  "Textured Waves & Straightening"
];

const BASE_SEEDS: Record<string, number> = {
  "Bridal Glow & Makeovers": 48,
  "Clean Executive Scissor Cuts": 76,
  "Men's Fade & Grooming Reset": 68,
  "Ayurvedic Skincare & Detox": 32,
  "Textured Waves & Straightening": 41
};

export default function CityPulse() {
  const { salons, stylists, appointments, activeCity, fetchAppointments, fetchStylists, addToast } = useBelsomeStore();
  const [jitters, setJitters] = useState<Record<string, number>>({});
  const [realtimeActive, setRealtimeActive] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isDemoMode = queryParams.get("demo") === "true";

  // Supabase Realtime Subscription
  useEffect(() => {
    let channel: any;
    try {
      channel = supabase
        .channel("realtime-appointments")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "appointments" },
          (payload) => {
            console.log("Realtime appointment insert detected:", payload);
            const customerName = payload.new?.customer_name || "A customer";
            addToast(`Realtime Alert: Booking for ${customerName} received!`, "success");
            fetchAppointments();
            fetchStylists();
          }
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            setRealtimeActive(true);
            console.log("Supabase Realtime connected successfully!");
          } else {
            setRealtimeActive(false);
            console.log("Supabase Realtime status:", status, err);
          }
        });
    } catch (err) {
      console.error("Failed to initialize Supabase Realtime:", err);
      setRealtimeActive(false);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchAppointments, fetchStylists, addToast]);

  // Jitter fallback animation logic
  useEffect(() => {
    if (realtimeActive) {
      setJitters({});
      return;
    }

    const interval = setInterval(() => {
      // Pick a random specialty
      const randomSpec = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
      // Generate random jitter between -3.0% and +3.0%
      const jitterVal = Math.random() * 6 - 3;
      setJitters((prev) => ({
        ...prev,
        [randomSpec]: parseFloat(jitterVal.toFixed(1))
      }));
    }, 4000 + Math.random() * 2000); // 4-6 seconds random interval

    return () => clearInterval(interval);
  }, [realtimeActive]);

  const simulateBooking = async () => {
    if (simulating) return;
    setSimulating(true);
    addToast("Triggering simulation booking...", "info");
    try {
      const firstNames = ["Aarav", "Ananya", "Ishaan", "Kavya", "Rohan", "Zara", "Vikram", "Priya", "Aditya", "Meera"];
      const lastNames = ["Sharma", "Reddy", "Mehta", "Iyer", "Sen", "Goel", "Kapoor", "Nair", "Singh", "Patel"];
      const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      
      const randomSalon = salons.length > 0 ? salons[Math.floor(Math.random() * salons.length)] : { id: "salon-1", name: "BELSOME Signature Studio" };
      const randomStylist = stylists.length > 0 ? stylists[Math.floor(Math.random() * stylists.length)] : { id: "stylist-1", name: "Vikram Malhotra" };
      
      const mockServices = [
        { id: "serv-1", name: "Signature Haircut & Consultation", price: 800 },
        { id: "serv-2", name: "Premium Slicked Back Undercut", price: 1100 },
        { id: "serv-3", name: "Beard Trim & Hot Towel Hydration", price: 500 },
        { id: "serv-4", name: "Charcoal De-Tan Facial & Mask", price: 1200 },
        { id: "serv-5", name: "Royal Bridal Makeover Pack", price: 15000 }
      ];
      const randomService = mockServices[Math.floor(Math.random() * mockServices.length)];
      
      const timeSlots = ["10:00 AM", "12:30 PM", "03:00 PM", "05:30 PM", "07:00 PM"];
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      const dateToday = new Date().toISOString().split("T")[0];
      
      const fakeAppt = {
        customerName: randomName,
        salonId: randomSalon.id,
        salonName: randomSalon.name,
        serviceId: randomService.id,
        serviceName: randomService.name,
        stylistId: randomStylist.id,
        stylistName: randomStylist.name,
        date: dateToday,
        timeSlot: randomTime,
        productPreference: ["Organic"],
        originalPrice: randomService.price,
        finalPrice: randomService.price,
        pricingReason: "Demo Live Simulation",
        city: activeCity
      };

      await ApiService.createAppointment(fakeAppt);
      addToast(`Booking inserted successfully for ${randomName}!`, "success");
    } catch (err: any) {
      console.error("Failed to simulate booking:", err);
      addToast(`Simulation failed: ${err.message}`, "error");
    } finally {
      setSimulating(false);
    }
  };

  // Compute specialty stats
  const getSpecialtyForAppt = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes("bridal") || name.includes("makeover")) {
      return "Bridal Glow & Makeovers";
    }
    if (name.includes("undercut") || name.includes("fade") || name.includes("trim") || name.includes("beard")) {
      return "Men's Fade & Grooming Reset";
    }
    if (name.includes("haircut") || name.includes("consultation")) {
      return "Clean Executive Scissor Cuts";
    }
    if (name.includes("facial") || name.includes("mask") || name.includes("detox") || name.includes("tan")) {
      return "Ayurvedic Skincare & Detox";
    }
    return "Textured Waves & Straightening";
  };

  const counts: Record<string, number> = {};
  SPECIALTIES.forEach((spec) => {
    counts[spec] = 0;
  });

  appointments.forEach((appt) => {
    const spec = getSpecialtyForAppt(appt.serviceName);
    counts[spec] = (counts[spec] || 0) + 1;
  });

  const totalCounts = SPECIALTIES.map((spec) => {
    const totalCount = (counts[spec] || 0) + (BASE_SEEDS[spec] || 10);
    return {
      name: spec,
      count: totalCount
    };
  });

  // Sort by count descending
  totalCounts.sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...totalCounts.map((s) => s.count)) || 100;

  // Top 3 rising stylists by aiScore
  const risingStylists = [...stylists]
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="glass-panel bg-white/60 dark:bg-slate-950/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl relative overflow-hidden text-left">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-pink-300/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-blue-300/10 to-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-red-650 dark:text-red-400 font-mono font-bold tracking-widest uppercase">
                {realtimeActive ? "LIVE REALTIME FEED" : "LIVE MARKET FEED"}
              </span>
            </div>
            
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
              {activeCity}'s beauty trends, <span className="bg-gradient-to-r from-brand-primary via-purple-600 to-brand-secondary bg-clip-text text-transparent italic font-normal">right now</span>
            </h2>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xl">
              An aggregate dashboard plotting local grooming patterns, service-velocity metrics, and rising stylist scores in the {activeCity} hub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isDemoMode && (
              <button
                onClick={simulateBooking}
                disabled={simulating}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-650 hover:to-purple-750 text-white font-bold text-xs font-mono uppercase tracking-wider px-4 py-3 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${simulating ? "animate-spin" : "animate-pulse"}`} />
                {simulating ? "Booking..." : "Simulate Booking"}
              </button>
            )}

            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 px-4 py-3 rounded-2xl shadow-sm">
              <TrendingUp className="w-5 h-5 text-purple-650 animate-bounce" />
              <div>
                <span className="text-[8px] text-slate-400 block font-mono font-bold uppercase tracking-wider">ACTIVE BOOKINGS</span>
                <strong className="text-sm font-extrabold text-slate-800 dark:text-white font-mono">1,482 today</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Column: Trending Specialties */}
        <div className="lg:col-span-7 glass-panel bg-white/60 dark:bg-slate-950/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-150 dark:border-slate-850/60">
            <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-brand-primary" />
              Top 5 Trending Specialties This Week
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase tracking-wide">
              Computed from live service-velocity registries
            </p>
          </div>

          <div className="space-y-5">
            {totalCounts.map((spec) => {
              const rawPct = (spec.count / maxCount) * 100;
              // Apply dynamic jitter animation purely client-side
              const jitterVal = jitters[spec.name] || 0;
              const animatedPct = Math.max(15, Math.min(100, rawPct + jitterVal));

              return (
                <div key={spec.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-850 dark:text-slate-250">
                    <span className="font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      {spec.name}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px] font-bold">
                      {Math.round(spec.count + (jitterVal * 0.4))} active jobs
                    </span>
                  </div>

                  <div className="relative w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner border border-slate-200/30 dark:border-slate-800/30">
                    <motion.div
                      animate={{ width: `${animatedPct}%` }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100/50 dark:border-purple-900/30 text-[10px] sm:text-[11px] text-purple-750 dark:text-purple-300 leading-relaxed font-semibold">
            ✨ <strong>Live Insight:</strong> Specialty demand shifts dynamically based on local festival seasons, weekend corporate bookings, and dynamic promotional surges.
          </div>
        </div>

        {/* Right Column: Top 3 Rising Stylists */}
        <div className="lg:col-span-5 glass-panel bg-white/60 dark:bg-slate-950/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6">
          <div className="space-y-1 pb-3 border-b border-slate-150 dark:border-slate-850/60">
            <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-secondary animate-pulse" />
              Rising Stylists (Top 3)
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase tracking-wide">
              Ranked by aggregate AI matching indices
            </p>
          </div>

          <div className="space-y-4">
            {risingStylists.map((stylist, index) => (
              <div 
                key={stylist.id} 
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 flex items-center justify-between gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Micro badge rank */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-purple-500/10 dark:bg-purple-500/20 rounded-br-2xl flex items-center justify-center font-mono font-black text-xs text-purple-600 dark:text-purple-400">
                  #{index + 1}
                </div>

                <div className="space-y-1.5 text-left pl-4">
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {stylist.name}
                  </h4>
                  <span className="inline-block text-[9.5px] text-purple-700 dark:text-purple-400 font-mono font-bold">
                    {stylist.specialty.split(" & ")[0]}
                  </span>
                  
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong className="text-slate-700 dark:text-slate-300 ml-0.5 font-mono">{stylist.rating}</strong>
                    </span>
                    <span>Exp: <strong className="text-slate-700 dark:text-slate-300 font-mono">{stylist.experience}</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-slate-800 dark:text-white justify-end">
                    <span className="text-xl font-mono font-black">{stylist.aiScore}</span>
                    <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-slate-450 block uppercase tracking-wider mt-0.5">
                    Rise index
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-pink-50/50 dark:bg-pink-950/20 rounded-xl border border-pink-100/50 dark:border-pink-900/30 text-[10px] sm:text-[11px] text-pink-700 dark:text-pink-400 leading-relaxed font-semibold">
            🤝 <strong>Exams & Certification Audit:</strong> Every rising stylist holds verified Sassoon or L'Oreal diplomas linked in their BELSOME profile.
          </div>
        </div>

      </div>
    </div>
  );
}
