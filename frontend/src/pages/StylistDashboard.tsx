import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { Sparkles, Calendar, Star, CheckCircle, Clock, BookOpen, Upload, Award } from "lucide-react";

export default function StylistDashboard() {
  const { stylists, appointments } = useBelsomeStore();
  const currentStylist = stylists[0]; // Logged in as Vikram Malhotra

  const [activeTab, setActiveTab] = useState<"bookings" | "portfolio" | "exam">("bookings");
  
  // Custom look uploader mock
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [lookAdded, setLookAdded] = useState(false);

  const handleAddLook = (e: React.FormEvent) => {
    e.preventDefault();
    setLookAdded(true);
    setTimeout(() => {
      setLookAdded(false);
      setBeforeUrl("");
      setAfterUrl("");
    }, 2000);
  };

  const stylistBookings = appointments.filter((a) => a.stylistId === currentStylist.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sub Menu */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center font-bold text-amber-600 shadow-sm">
              V
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 leading-tight">{currentStylist.name}</h4>
              <span className="text-[10px] text-slate-400 font-semibold">Vikram Malhotra • Stylist</span>
            </div>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="space-y-1">
            {[
              { id: "bookings", label: "My Appointments", icon: Calendar },
              { id: "portfolio", label: "Manage Portfolio", icon: Upload },
              { id: "exam", label: "AI Exam Scorecard", icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    activeTab === tab.id
                      ? "bg-amber-50 border border-amber-100 text-amber-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {activeTab === "bookings" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Upcoming Styling Schedule</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage client schedules and product preference checklists.</p>
              </div>
              <span className="text-xs font-mono text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded shadow-sm">
                {stylistBookings.length} Active Slots
              </span>
            </div>

            <div className="space-y-4">
              {stylistBookings.map((appt) => (
                <div key={appt.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-800 leading-tight">{appt.customerName}</h4>
                      <span className="text-[9px] bg-purple-50 border border-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono font-bold">
                        {appt.serviceName}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {appt.date} • {appt.timeSlot}</span>
                      <span>Studio: <strong className="text-slate-700">{appt.salonName}</strong></span>
                    </div>
                    {appt.productPreference.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[9px] text-pink-700 font-mono font-bold">
                        <span>Checklist:</span>
                        {appt.productPreference.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-pink-50 border border-pink-100">{p} Certified</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex sm:flex-col justify-between items-end gap-2 text-right shrink-0">
                    <span className="font-mono text-sm font-bold text-slate-800">₹{appt.finalPrice}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{appt.pricingReason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio management */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Upload Transformational Looks</h3>
                <p className="text-xs text-slate-500 font-semibold">Before-and-after galleries help style-DNA quizzes match you with the right clients.</p>
              </div>

              <form onSubmit={handleAddLook} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-amber-700 font-bold uppercase">Before Look URL</label>
                  <input
                    type="text"
                    required
                    value={beforeUrl}
                    onChange={(e) => setBeforeUrl(e.target.value)}
                    placeholder="Before image link"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-amber-700 font-bold uppercase">After Look URL</label>
                  <input
                    type="text"
                    required
                    value={afterUrl}
                    onChange={(e) => setAfterUrl(e.target.value)}
                    placeholder="After image link"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs uppercase tracking-wider h-9 shadow-sm"
                >
                  {lookAdded ? "Look Saved!" : "Upload Look"}
                </button>
              </form>
            </div>

            {/* Look showcase */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h4 className="font-display font-bold text-base text-slate-900">My Active Lookbook transformed</h4>
              <div className="grid grid-cols-2 gap-4">
                {currentStylist.beforeAfter.map((ba, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-sm">
                    <div className="flex gap-2">
                      <div className="relative w-1/2 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                        <img src={ba.before} className="w-full h-32 object-cover" alt="" />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/85 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white">BEFORE</span>
                      </div>
                      <div className="relative w-1/2 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                        <img src={ba.after} className="w-full h-32 object-cover" alt="" />
                        <span className="absolute bottom-1.5 right-1.5 bg-amber-500 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white">AFTER</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Exam Scorecard */}
        {activeTab === "exam" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] px-2 py-0.5 bg-amber-55/60 border border-amber-200 text-amber-700 font-mono rounded inline-block mb-1 font-bold">
                  AI Behavioral Exam Profile
                </span>
                <h3 className="font-display font-bold text-xl text-slate-900">Vikram Malhotra - Performance Scorecard</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-semibold block">Overall Composure Score:</span>
                <strong className="text-base text-amber-700 font-mono font-bold">{currentStylist.aiScore}% (HIRE GRADE)</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <ScoreMetric label="Empathy" pct={95} color="bg-green-500" />
              <ScoreMetric label="Linguistic Tone" pct={90} color="bg-purple-500" />
              <ScoreMetric label="Clarity" pct={94} color="bg-blue-500" />
              <ScoreMetric label="Problem Solving" pct={92} color="bg-pink-550" />
              <ScoreMetric label="Product Upsell" pct={88} color="bg-amber-500" />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-650 font-semibold shadow-inner">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 font-display text-sm">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Assessor General Feedback Memo
              </h4>
              <p className="leading-relaxed">
                Candidate excels in multilingual client handling, demonstrating a calm demeanor under pressure and high empathetic validation. Successfully addresses product inventory objections by pivoting to paraben-free organic alternatives.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreMetric({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2 shadow-sm bg-white">
      <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">{label}</span>
      <h5 className="font-mono text-lg font-bold text-slate-800">{pct}%</h5>
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
