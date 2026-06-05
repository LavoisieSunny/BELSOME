import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { Sparkles, Calendar, Star, CheckCircle, Clock, BookOpen, Upload, Award, ShieldCheck, RefreshCcw } from "lucide-react";

export default function StylistDashboard() {
  const { stylists, appointments, completeAppointment } = useBelsomeStore();
  const currentStylist = stylists[0]; // Logged in as Vikram Malhotra

  const [activeTab, setActiveTab] = useState<"bookings" | "scanner" | "portfolio" | "exam">("bookings");
  const [scannedPassport, setScannedPassport] = useState<any>(null);
  
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

  const simulateScannerMatch = () => {
    const rohanAppt = appointments.find(a => a.customerName.includes("Rohan"));
    
    const mockData = {
      styleDNA: {
        profileName: "Dapper Executive",
        tagline: "Corporate Grooming Excellence",
        hairSuggestion: rohanAppt?.serviceName.includes("Back") ? "Slicked Back Undercut" : "Signature Haircut & Consultation",
        beardSuggestion: "Classic Heavy Stubble",
        preferences: rohanAppt?.productPreference || ["Organic", "Paraben-Free"]
      },
      lastService: rohanAppt?.status === "Completed" ? rohanAppt.serviceName : "Signature Haircut & Consultation",
      stylistMatch: rohanAppt?.stylistName || "Vikram Malhotra",
      skinTone: "#F5C29A",
      faceShape: "oval"
    };

    const addToast = (useBelsomeStore.getState() as any).addToast;
    if (addToast) {
      addToast("🔌 Initializing simulator connection...", "info");
    }

    setTimeout(() => {
      setScannedPassport(mockData);
      if (addToast) {
        addToast("✨ Scanner simulated: Decoded customer Rohan K.'s QR Passport!", "success");
      }
    }, 600);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const addToast = (useBelsomeStore.getState() as any).addToast;
    if (!file) return;

    if (addToast) {
      addToast("📸 File uploaded. Loading QR analyzer...", "info");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            if ((window as any).jsQR) {
              const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height);
              if (code) {
                try {
                  const parsed = JSON.parse(code.data);
                  setScannedPassport(parsed);
                  if (addToast) {
                    addToast("✨ Customer Passport QR decoded successfully!", "success");
                  }
                } catch (err) {
                  if (addToast) {
                    addToast("⚠️ Decoded text: " + code.data, "warning");
                  }
                }
              } else {
                if (addToast) {
                  addToast("❌ No QR Code detected. Crop closely or upload a clearer image.", "error");
                }
              }
            } else {
              if (addToast) {
                addToast("❌ QR Scanner library (jsQR) is not loaded.", "error");
              }
            }
          } catch (canvasErr) {
            console.error(canvasErr);
            if (addToast) {
              addToast("❌ Canvas analysis failed. Try a smaller image file.", "error");
            }
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
              { id: "scanner", label: "Scan Customer Passport", icon: ShieldCheck },
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

        {activeTab === "scanner" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">BELSOME Digital Passport Reader</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Scan a customer's passport QR code to instantly sync styling history and preference checklists.</p>
              </div>
              <span className="text-xs font-mono text-purple-700 font-bold bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded shadow-sm">
                Live QR Decoder
              </span>
            </div>

            {scannedPassport ? (
              <div className="space-y-6 animate-fade-in">
                {/* Visual Passport Profile Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Avatar & Facial Geometry HUD */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-3 left-3 flex gap-1 z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>

                    <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider pt-2">FACIAL PROFILE SYNC</span>

                    {/* Vector Face Shape Visualizer based on decoded data */}
                    <div className="w-32 h-32 flex items-center justify-center my-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                        {/* Neck */}
                        <path d="M43,65 L43,85 L57,85 L57,65 Z" fill={scannedPassport.skinTone || "#F5C29A"} />
                        {/* Face */}
                        <path 
                          d={
                            scannedPassport.faceShape === "round"
                              ? "M30,45 C30,22 70,22 70,45 C70,68 60,82 50,82 C40,82 30,68 30,45 Z"
                              : scannedPassport.faceShape === "square"
                              ? "M30,42 C30,22 70,22 70,42 C70,62 65,78 50,78 C35,78 30,62 30,42 Z"
                              : scannedPassport.faceShape === "heart"
                              ? "M31,42 C28,18 72,18 69,42 C66,60 55,83 50,85 C45,83 34,60 31,42 Z"
                              : "M32,45 C32,22 68,22 68,45 C68,68 50,85 50,85 C50,85 32,68 32,45 Z" // Oval
                          }
                          fill={scannedPassport.skinTone || "#F5C29A"}
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                        />
                        {/* Hair Outline */}
                        <path d="M30,38 C35,18 65,18 70,38 Q50,42 30,38 Z" fill="#1e1b4b" />
                        {/* Eyes */}
                        <circle cx="42" cy="45" r="2.5" fill="#1e293b" />
                        <circle cx="58" cy="45" r="2.5" fill="#1e293b" />
                        {/* Mouth */}
                        <path d="M44,60 Q50,65 56,60" stroke="#1e293b" strokeWidth="1" fill="none" />
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-base text-white capitalize">{scannedPassport.faceShape || "Oval"} Geometry</h4>
                      <p className="text-[10px] text-slate-400 font-semibold font-mono">Skin Tone Hex: {scannedPassport.skinTone || "N/A"}</p>
                    </div>
                  </div>

                  {/* Middle Column: Style DNA Suggestions */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] bg-purple-50 border border-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                            Style DNA: {scannedPassport.styleDNA?.profileName || "Casual Trendsetter"}
                          </span>
                          <h4 className="font-display font-extrabold text-xl text-slate-900 mt-1">{scannedPassport.styleDNA?.tagline || "Clean modern styling"}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">DECODED VERIFIED</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Recommended Hairstyle</span>
                          <strong className="text-slate-800 text-sm block">{scannedPassport.styleDNA?.hairSuggestion || "Signature Trim"}</strong>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Recommended Beard</span>
                          <strong className="text-slate-800 text-sm block">{scannedPassport.styleDNA?.beardSuggestion || "Corporate Stubble"}</strong>
                        </div>
                      </div>

                      {/* Chemical preference warning */}
                      <div className="p-3.5 bg-pink-50 border border-pink-100 rounded-xl flex items-start gap-3 text-pink-850">
                        <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                          <h5 className="font-bold">Chemical Allergy & Preference Verification Checklist</h5>
                          <p className="text-[10px] text-pink-650 leading-relaxed font-semibold">
                            Customer profile mandates utilizing exclusively **{(scannedPassport.styleDNA?.preferences || []).join(" / ") || "Standard"}** certified products. Check salon chemical inventory before matches.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History & Active Bookings */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-bold text-sm text-slate-800">Styling & Service History Summary</h4>
                    <span className="text-[9px] font-mono text-slate-400">PASSPORT LAST SYNCED: JUST NOW</span>
                  </div>

                  <div className="divide-y divide-slate-250 border-t border-b border-slate-200 my-2">
                    <div className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">LAST SERVICE COMPLETED</span>
                        <strong className="text-slate-800 text-sm">{scannedPassport.lastService || "None"}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono">ASSIGNED STYLIST</span>
                        <strong className="text-slate-800 text-sm">{scannedPassport.stylistMatch || "None"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Complete Booking Trigger Action */}
                  {(() => {
                    const upcomingAppt = appointments.find(
                      (a) => a.customerName.includes("Rohan") && a.status === "Upcoming"
                    );

                    return upcomingAppt ? (
                      <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="space-y-0.5 text-left flex-1">
                          <span className="text-[9.5px] text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded inline-block font-mono">Upcoming Booking Detected</span>
                          <p className="text-[11px] text-slate-500 font-semibold mt-1">Ready to start styling? You can complete the session to finalize their passport registry history.</p>
                        </div>
                        <button
                          onClick={() => {
                            completeAppointment(upcomingAppt.id);
                            setScannedPassport({
                              ...scannedPassport,
                              lastService: upcomingAppt.serviceName,
                              stylistMatch: upcomingAppt.stylistName
                            });
                            const toastFn = (useBelsomeStore.getState() as any).addToast;
                            if (toastFn) {
                              toastFn("🎉 Session completed! Customer Passport updated with history.", "success");
                            }
                          }}
                          className="px-5 py-2.5 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm shrink-0 transition-all"
                        >
                          Complete Active Styling Session
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 text-center text-slate-450 text-[11px] font-mono font-bold">
                        🟢 No active styling sessions pending. Customer's history is fully up to date!
                      </div>
                    );
                  })()}
                </div>

                {/* Back to scanning */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setScannedPassport(null)}
                    className="text-xs text-purple-750 hover:text-purple-905 font-bold flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-sm transition-all uppercase tracking-wider"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Scan / Upload New Passport
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 space-y-6 max-w-lg mx-auto text-center">
                {/* Simulated Scanning Aperture */}
                <div className="relative w-48 h-48 border-2 border-dashed border-purple-300 rounded-3xl flex items-center justify-center bg-slate-50/50 shadow-inner group overflow-hidden select-none">
                  {/* Glowing scan bar animation */}
                  <div className="absolute inset-x-0 h-1 bg-purple-550/80 shadow-md shadow-purple-500 animate-scan-beam" />
                  
                  {/* Scanner HUD target corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-500" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-500" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-500" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-500" />

                  <div className="flex flex-col items-center justify-center gap-2 text-purple-500/70 group-hover:text-purple-650 transition-colors">
                    <ShieldCheck className="w-12 h-12 stroke-[1.2] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SCANNER ACTIVE</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-extrabold text-xl text-slate-800">Awaiting QR Passport Scanner Feed</h4>
                  <p className="text-xs text-slate-550 leading-relaxed font-semibold max-w-sm">
                    Drag and drop a screenshot of the customer's QR code, upload the image, or trigger the quick test simulator below.
                  </p>
                </div>

                {/* Upload Action */}
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-250 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-purple-300 transition-all bg-white shadow-sm p-4">
                      <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                        <Upload className="w-6 h-6 text-slate-405" />
                        <span className="text-[11px] font-bold">Upload QR Code Passport Screenshot</span>
                        <span className="text-[9px] text-slate-400">Supports PNG, JPG, JPEG</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleQrUpload} 
                      />
                    </label>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-400 font-bold uppercase">OR</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* Simulator trigger button */}
                  <button
                    onClick={simulateScannerMatch}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-650 hover:opacity-90 font-bold text-xs text-white uppercase tracking-wider shadow-md shadow-purple-600/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    ⚡ Simulate Live QR Scan (Demo Mode)
                  </button>
                </div>
              </div>
            )}
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
