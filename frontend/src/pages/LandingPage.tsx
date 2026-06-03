import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, MessageSquare, ArrowRight, CornerDownRight, CheckCircle2, User, Award, ShieldAlert } from "lucide-react";
import { ApiService } from "../services/api";

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ type: "user" | "bot"; text: string; data?: any }[]>([
    { type: "bot", text: "Welcome to BELSOME Concierge. Tell me about your face shape, lifestyle, or upcoming events. E.g., 'I have an oval face and need a clean professional trim for a Board Meeting tomorrow.'" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleConciergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery("");
    setChatLog((prev) => [...prev, { type: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await ApiService.askConcierge(userText);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16 space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold tracking-wider uppercase animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          AI-Powered Grooming Intelligence Platform
        </div>
        
        <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-tight text-slate-900">
          Look Better. Feel Better. <br />
          <span className="bg-gradient-to-r from-brand-primary via-purple-600 to-brand-secondary bg-clip-text text-transparent italic font-normal">
            Belsome.
          </span>
        </h2>

        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-sans">
          The smart beauty and styling ecosystem connecting Hyderabad's customers, elite stylists, premium salons, and corporate wellness programs under a single intelligence layer.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate("/customer")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 font-bold tracking-wide text-white shadow-lg shadow-brand-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            Launch Customer Experience <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigate("/owner")}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold tracking-wide shadow-sm hover:scale-105 active:scale-95 transition-all text-sm"
          >
            Salon Management Portal
          </button>
        </div>
      </section>

      {/* Feature 1: AI Grooming Concierge Chat Bubble */}
      <section className="glass-panel rounded-2xl overflow-hidden shadow-xl relative border border-slate-200/60">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary" />
        <div className="px-6 py-4 border-b border-slate-200/60 flex items-center gap-3 bg-white">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm tracking-wide text-slate-800">AI Grooming Concierge</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Ask style advice, get services & pricing immediately</p>
          </div>
        </div>

        {/* Chat window */}
        <div className="p-4 md:p-6 space-y-4 min-h-[300px] max-h-[420px] overflow-y-auto bg-slate-50/40">
          {chatLog.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xl p-4 rounded-xl text-xs sm:text-sm shadow-sm ${
                chat.type === "user"
                  ? "bg-brand-primary text-white rounded-tr-none"
                  : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none space-y-3"
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                
                {/* AI Structured Suggestions (If present) */}
                {chat.data && (
                  <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-purple-600 block font-mono font-bold uppercase">Suggested Cuts</span>
                        <span className="font-bold text-slate-900">{chat.data.hairstyle}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-pink-600 block font-mono font-bold uppercase">Beard / Face</span>
                        <span className="font-bold text-slate-900">{chat.data.beard}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-700 block font-mono font-bold uppercase">Color Theme</span>
                        <span className="font-bold text-slate-900">{chat.data.color}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-teal-700 block font-mono font-bold uppercase">Required Specialty</span>
                        <span className="font-bold text-slate-900">{chat.data.stylistMatch}</span>
                      </div>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase mb-1">Recommended Platform Services</span>
                      <div className="flex flex-wrap gap-1.5">
                        {chat.data.services.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500 font-semibold">Estimated Cost: <strong className="text-slate-900 font-bold">{chat.data.cost}</strong></span>
                      <button
                        onClick={() => navigate("/customer")}
                        className="px-3 py-1 rounded bg-brand-primary text-white text-[10px] font-bold tracking-wider uppercase hover:opacity-90 flex items-center gap-1 shadow-sm"
                      >
                        Book Now <ArrowRight className="w-2.5 h-2.5" />
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
                <span className="text-xs text-slate-500 font-mono">Analysing profile request...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleConciergeSubmit} className="p-3 bg-white border-t border-slate-200/60 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query... (e.g. 'I want a modern haircut like Virat Kohli for an upcoming event')"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 shadow-sm"
          >
            Consult AI
          </button>
        </form>
      </section>

      {/* Six Pillars / Roles Summary */}
      <section className="space-y-6">
        <h3 className="font-display font-bold text-2xl text-slate-900 text-center md:text-left">
          Explore BELSOME Role Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer */}
          <div
            onClick={() => navigate("/customer")}
            className="glass-panel glass-panel-hover p-6 rounded-xl space-y-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-sans font-bold text-sm text-slate-800">Customer App</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Book custom appointments, get pricing calendars, track live express SLA, complete style quiz, and extract instagram reels profiles.
            </p>
            <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1">
              Test Customer Experience <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Salon Owner */}
          <div
            onClick={() => navigate("/owner")}
            className="glass-panel glass-panel-hover p-6 rounded-xl space-y-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-pink-600" />
            </div>
            <h4 className="font-sans font-bold text-sm text-slate-800">Salon Owner Dashboard</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Review revenue statistics, control peak hour dynamic price surge factors, audit AI procurement catalogues, and read staff behavioral reports.
            </p>
            <span className="text-[10px] text-pink-600 font-bold flex items-center gap-1">
              Open Studio Analytics <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Platform Admin */}
          <div
            onClick={() => navigate("/admin")}
            className="glass-panel glass-panel-hover p-6 rounded-xl space-y-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <h4 className="font-sans font-bold text-sm text-slate-800">Platform Administrator</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Global overview representing aggregate users, growth calculations, and a complete system registry list of live appointments.
            </p>
            <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
              Launch Platform Admin <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
