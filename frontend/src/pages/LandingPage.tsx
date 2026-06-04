import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, MessageSquare, ArrowRight, CornerDownRight, CheckCircle2, 
  User, Award, ShieldAlert, Scissors, ShoppingBag, Briefcase, 
  Timer, Users, ArrowUpRight, Play, ShieldCheck, HeartPulse
} from "lucide-react";
import { ApiService } from "../services/api";

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ type: "user" | "bot"; text: string; data?: any }[]>([
    { type: "bot", text: "Welcome to BELSOME Concierge. Tell me about your face shape, lifestyle, or upcoming events. E.g., 'I have an oval face and need a clean professional trim for a Board Meeting tomorrow.'" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConciergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery("");
    setChatLog((prev) => [...prev, { type: "user", text: userText }]);
    setLoading(true);
    setError(null);

    try {
      const history = chatLog.map(c => ({ role: c.type, text: c.text }));
      const response = await ApiService.askConcierge(userText, history);
      setChatLog((prev) => [
        ...prev,
        {
          type: "bot",
          text: response.reply,
          data: response
        }
      ]);
    } catch (err) {
      console.error(err);
      setError("AI is unavailable. Please start the backend or check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = async (chipText: string) => {
    setChatLog((prev) => [...prev, { type: "user", text: chipText }]);
    setLoading(true);
    setError(null);
    try {
      const history = chatLog.map(c => ({ role: c.type, text: c.text }));
      const response = await ApiService.askConcierge(chipText, history);
      setChatLog((prev) => [
        ...prev,
        {
          type: "bot",
          text: response.reply,
          data: response
        }
      ]);
    } catch (err) {
      console.error(err);
      setError("AI is unavailable. Please start the backend or check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Grid Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
        
        {/* Left Column: Headline and Pitch */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-extrabold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            National Startup Competition Finalist
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-[1.1] text-slate-900">
            Grooming Reinvented <br />
            with <span className="bg-gradient-to-r from-brand-primary via-purple-600 to-brand-secondary bg-clip-text text-transparent italic font-normal">AI Intelligence</span>
          </h2>

          <p className="text-slate-650 text-sm sm:text-base leading-relaxed max-w-xl font-semibold">
            BELSOME is Hyderabad's premier decentralized styling ecosystem. We coordinate customers, elite stylists, and luxury studios under a unified AI scheduling and styling layer.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate("/customer")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-extrabold text-xs tracking-wider uppercase hover:opacity-95 shadow-md shadow-brand-primary/20 hover:scale-103 active:scale-97 transition-all flex items-center gap-2"
            >
              Launch Customer App <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/owner")}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs tracking-wider uppercase hover:scale-103 active:scale-97 transition-all shadow-sm flex items-center gap-1.5"
            >
              Owner Portal <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Hyderabad Vitals */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg">
            <div className="text-xs">
              <span className="text-slate-400 block font-mono font-bold uppercase tracking-wider text-[9px]">LAUNCH REGIONS</span>
              <strong className="text-slate-800 text-[11px] font-bold">Jubilee Hills / Gachibowli</strong>
            </div>
            <div className="text-xs">
              <span className="text-slate-400 block font-mono font-bold uppercase tracking-wider text-[9px]">PARTNER SALONS</span>
              <strong className="text-slate-800 text-[11px] font-bold">50+ Premium Studios</strong>
            </div>
            <div className="text-xs">
              <span className="text-slate-400 block font-mono font-bold uppercase tracking-wider text-[9px]">QUEUE SLA</span>
              <strong className="text-purple-700 text-[11px] font-extrabold">20-Min Seating Cover</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Visual Smartphone/Scanner Mockup */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] aspect-[9/16] bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 overflow-hidden animate-float">
            {/* Camera notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700 shadow-inner" />
            </div>

            {/* Glowing active banner */}
            <div className="absolute top-10 left-4 right-4 bg-emerald-650/90 backdrop-blur-sm border border-emerald-500 text-white text-[9px] font-mono font-bold tracking-wider px-3 py-1 rounded-xl shadow-lg flex items-center justify-between z-20">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                VOGUE AI COORDINATOR ACTIVE
              </span>
              <span className="text-gray-250">HYD v2.0</span>
            </div>

            {/* Scanning Line overlay */}
            <div className="green-scan-line" />

            {/* Content Screen */}
            <div className="w-full h-full rounded-[30px] overflow-hidden relative bg-slate-950">
              <img 
                src="/belsome_hero_lux.png" 
                className="w-full h-full object-cover opacity-85" 
                alt="Luxury Male Grooming Mockup" 
              />
              {/* Dark vignette bottom gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

              {/* Statistical Overlay cards on screen */}
              <div className="absolute bottom-6 left-4 right-4 space-y-2.5 z-20">
                {/* Hair Match card */}
                <div className="glass-panel bg-black/60 border border-white/10 p-2.5 rounded-xl flex items-center justify-between text-xs text-white">
                  <div>
                    <span className="text-[8px] text-purple-400 font-mono block uppercase tracking-wider leading-none">EXTRACTED HAIRSTYLE</span>
                    <strong className="font-bold text-[11px] leading-tight block mt-0.5">Slick Side Part with Fade</strong>
                  </div>
                  <span className="bg-purple-700/80 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white">
                    97% Match
                  </span>
                </div>

                {/* Seating timer card */}
                <div className="glass-panel bg-black/60 border border-white/10 p-2.5 rounded-xl flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-pink-500 animate-pulse" />
                    <div>
                      <span className="text-[8px] text-pink-400 font-mono block uppercase tracking-wider leading-none">EXPRESS WAITING TIME</span>
                      <strong className="font-bold text-[11px] leading-tight block mt-0.5">4 Mins until seated</strong>
                    </div>
                  </div>
                  <span className="text-emerald-450 font-mono font-bold text-[9px]">SLA OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Startup Metrics Strip */}
      <section className="bg-white/40 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-150">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">ACTIVE BOOKINGS</span>
            <strong className="text-3xl font-extrabold text-slate-800 tracking-tight">1,240+</strong>
            <p className="text-[10px] text-slate-500 font-semibold">Processed Today</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">MANAGED STARTUP VALUE</span>
            <strong className="text-3xl font-extrabold text-purple-750 tracking-tight">₹4.2L</strong>
            <p className="text-[10px] text-slate-500 font-semibold">Weekly Gross Volume</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">AVG CHAIR SEATING</span>
            <strong className="text-3xl font-extrabold text-pink-700 tracking-tight">14.8m</strong>
            <p className="text-[10px] text-slate-500 font-semibold">Hyderabad Industry Best</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">SLA ADHERENCE</span>
            <strong className="text-3xl font-extrabold text-teal-700 tracking-tight">99.2%</strong>
            <p className="text-[10px] text-slate-500 font-semibold">Refund Backing Guarantee</p>
          </div>
        </div>
      </section>

      {/* 3. AI Grooming Concierge Chat Console */}
      <section className="glass-panel rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 relative">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary via-purple-600 to-brand-secondary" />
        
        {/* Interactive Console Header */}
        <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-550/10 border border-purple-200/60 flex items-center justify-center shadow-inner">
              <MessageSquare className="w-5 h-5 text-purple-650" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm tracking-wide text-slate-800">BELSOME AI Grooming Concierge</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Submit a custom styling request or try out preset prompt cards below</p>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-purple-50 text-purple-700 border border-purple-100 font-bold px-2 py-0.5 rounded shadow-sm">
            ONLINE
          </span>
        </div>

        {/* Chat History window */}
        <div className="p-4 md:p-6 space-y-4 min-h-[300px] max-h-[420px] overflow-y-auto bg-slate-50/45">
          {chatLog.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm shadow-sm leading-relaxed ${
                chat.type === "user"
                  ? "bg-brand-primary text-white rounded-tr-none"
                  : "bg-white border border-slate-200/80 text-slate-900 rounded-tl-none space-y-3"
              }`}>
                <p className="whitespace-pre-wrap">{chat.text}</p>
                
                {/* AI Structured Recommendations */}
                {chat.data && (
                  <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs animate-fade-in">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <span className="text-[9px] text-purple-600 block font-mono font-bold uppercase tracking-wider">Suggested Cut</span>
                        <strong className="font-bold text-slate-900 mt-0.5 block">{chat.data.hairstyle}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-pink-600 block font-mono font-bold uppercase tracking-wider">Suggested Beard</span>
                        <strong className="font-bold text-slate-900 mt-0.5 block">{chat.data.beard}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-amber-700 block font-mono font-bold uppercase tracking-wider">Highlights Color</span>
                        <strong className="font-bold text-slate-900 mt-0.5 block">{chat.data.color}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-teal-700 block font-mono font-bold uppercase tracking-wider">Required Specialist</span>
                        <strong className="font-bold text-slate-900 mt-0.5 block">{chat.data.stylistMatch}</strong>
                      </div>
                    </div>
                    
                    <div className="h-px bg-slate-200" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase tracking-wider mb-1.5">Recommended Platform Services</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chat.data.services.map((s: string) => (
                          <span key={s} className="px-2.5 py-0.5 rounded bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-slate-205 my-2" />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-550 font-semibold">Estimated Cost: <strong className="text-slate-900 font-bold">{chat.data.cost}</strong></span>
                      <button
                        onClick={() => navigate("/customer")}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-[10.5px] font-bold tracking-wider uppercase hover:opacity-90 flex items-center gap-1 shadow-md shadow-brand-primary/10 transition-all active:scale-95"
                      >
                        Book Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200/80 p-4 rounded-xl rounded-tl-none flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 font-mono">Running VOGUE analysis engine...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}
        </div>

        {/* Prompt presets chips */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-150 flex flex-wrap gap-2 items-center">
          <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider mr-1">💡 Preset Prompts:</span>
          {[
            { label: "Oval Face & Board Meeting", query: "I have an oval face shape, need a professional low-maintenance executive short crop haircut for a board presentation." },
            { label: "Wedding Beard Sculpting", query: "Suggest a wedding grooming package for a heart face with dense beard styling and de-tan face pack." },
            { label: "Curly Hair & Dryness", query: "My hair is wavy and very dry/frizzy. I want styling ideas and scalp hydration treatments." }
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleChipClick(chip.query)}
              disabled={loading}
              className="px-3 py-1 rounded-full bg-white hover:bg-purple-50 hover:border-purple-250 border border-slate-200 text-[10px] font-bold text-slate-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <form onSubmit={handleConciergeSubmit} className="p-3 bg-white border-t border-slate-150 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask styling advice... (e.g. 'I want a modern crop fade like Ranbir Kapoor')"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 shadow-sm transition-all active:scale-95"
            disabled={loading}
          >
            Consult AI
          </button>
        </form>
      </section>

      {/* 4. Complete 6 Pillars Role Architecture */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            BELSOME Start-up Role Architecture
          </h3>
          <p className="text-xs text-slate-450 font-semibold leading-relaxed">
            Click on any role switcher button in the top navigation bar to explore BELSOME's decentralized product modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: "customer",
              title: "Customer App",
              desc: "Book slots dynamically, choose certified organic products, compute DNA profiles, simulation avatar styling, and shop celebrity looks.",
              icon: User,
              color: "text-purple-600 bg-purple-50 border-purple-100",
              route: "/customer",
              badge: "LIVE DEMO"
            },
            {
              id: "owner",
              title: "Salon Owner Dashboard",
              desc: "Review daily revenue logs, configure dynamic off-peak discount multipliers, accept AI-procured catalogs, and audit behavioral exams.",
              icon: Award,
              color: "text-pink-600 bg-pink-50 border-pink-100",
              route: "/owner",
              badge: "LIVE DEMO"
            },
            {
              id: "stylist",
              title: "Stylist Workplace",
              desc: "Track client booking slots, read customized product requests (vegan/organic), complete skill courses, and manage customer portfolios.",
              icon: Scissors,
              color: "text-amber-600 bg-amber-50 border-amber-100",
              route: "/stylist",
              badge: "LIVE DEMO"
            },
            {
              id: "vendor",
              title: "Vendor Marketplace",
              desc: "List products, check margin score certifications, and accept automated procurement catalogs directly from Hyderabad studios.",
              icon: ShoppingBag,
              color: "text-teal-600 bg-teal-50 border-teal-100",
              route: "/vendor",
              badge: "LIVE DEMO"
            },
            {
              id: "hr",
              title: "HR Corporate Suite",
              desc: "Fund credits, review wellness usage dashboard, set employee parameters, and manage team grooming benefits.",
              icon: Briefcase,
              color: "text-indigo-600 bg-indigo-50 border-indigo-100",
              route: "/hr",
              badge: "LIVE DEMO"
            },
            {
              id: "admin",
              title: "Platform Admin Console",
              desc: "Monitor Hyderabad marketplace aggregate growth metrics, active stylists, and view the global database appointments list.",
              icon: ShieldAlert,
              color: "text-red-600 bg-red-50 border-red-100",
              route: "/admin",
              badge: "LIVE DEMO"
            }
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => navigate(pillar.route)}
                className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${pillar.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[8.5px] bg-slate-100 border border-slate-200 text-slate-500 font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                      {pillar.badge}
                    </span>
                  </div>
                  
                  <h4 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-700 font-bold hover:text-purple-900">
                  <span>Open Platform Module</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
