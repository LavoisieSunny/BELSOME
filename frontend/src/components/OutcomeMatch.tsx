import React, { useState, useRef, useEffect } from "react";
import { ApiService } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Upload, Trash2, Camera, Star, ArrowRight, RefreshCw, Eye } from "lucide-react";
import { useBelsomeStore } from "../store/belsomeStore";
import AIReasoning from "./AIReasoning";

const PRESET_LOOK_GOALS = [
  "Bridal Glow",
  "Clean Professional Cut",
  "Curly to Sleek Straight",
  "Grey Coverage / Restyle",
  "Men's Grooming Reset"
];

export default function OutcomeMatch() {
  const { stylists, activeCity, addToast } = useBelsomeStore();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  
  // Selfie upload states
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [successRates, setSuccessRates] = useState<Record<string, {
    successRate: number;
    basedOnCount: number;
    reasoning: string[];
    isEstimated?: boolean;
  }>>({});
  const [ratesLoading, setRatesLoading] = useState(false);

  // Filter & sort stylists by computed successRate descending, falling back to aiScore
  const sortedStylists = [...stylists]
    .sort((a, b) => {
      const rateA = successRates[a.id]?.successRate ?? a.aiScore;
      const rateB = successRates[b.id]?.successRate ?? b.aiScore;
      return rateB - rateA;
    })
    .slice(0, 3);

  // Trigger analysis simulation when selfie is uploaded
  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelfiePreview(reader.result as string);
      setIsScanning(true);
      setScanComplete(false);
      
      // Simulate high-fidelity scan matching
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        addToast("📸 Selfie analysis complete: Structure and skin tone mapped!", "success");
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSelfie = () => {
    setSelfiePreview(null);
    setScanComplete(false);
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get matching reason dynamically based on stylist & chosen goal
  const getMatchReason = (stylistName: string, goal: string) => {
    const name = stylistName.toLowerCase();
    const g = goal.toLowerCase();

    // Check stylist specialty archetype
    const isMasterSculptor = name.includes("vikram") || name.includes("arjun") || name.includes("sameer") || name.includes("rahul");
    const isColorist = name.includes("priya") || name.includes("kavya") || name.includes("aisha") || name.includes("neha");
    const isNatural = name.includes("suresh") || name.includes("rohan") || name.includes("kabir") || name.includes("amit");

    if (g.includes("bridal")) {
      if (isColorist) {
        return `As a certified Color & Makeup Specialist, she delivers exquisite bridal makeovers. Her styling matches your desired high-impact festive glow.`;
      }
      if (isMasterSculptor) {
        return `Her expertise in high-definition structured hairstyling guarantees that your bridal updos look clean and hold perfectly for photography.`;
      }
      return `His experience with chemical-free Ayurvedic skin glow treatments will prepare your skin and hair follicles for a radiant natural look.`;
    }

    if (g.includes("clean professional")) {
      if (isMasterSculptor) {
        return `An alumnus of Sassoon Academy London, his scissor work is tailored for clean, sharp executive cuts and dapper office-ready silhouettes.`;
      }
      if (isColorist) {
        return `Exceptional at subtle texturizing and professional grooming profiles that enhance corporate portraits and business styles.`;
      }
      return `Recommended for low-intensity, refreshing scalp massage cuts that keep you looking neat and feeling stress-free.`;
    }

    if (g.includes("curly")) {
      if (isNatural) {
        return `As a Natural Wave Artist, he uses specialized curl creams and steam diffusers to smoothly texturize curls into sleek straight flows with zero frizz.`;
      }
      if (isMasterSculptor) {
        return `Highly proficient in advanced heat protection straight blowouts and structural styling for high-humidity areas.`;
      }
      return `Applies organic smoothing masks and keratin shield color-safe treatments to maintain a glossy, straight finish.`;
    }

    if (g.includes("grey")) {
      if (isColorist) {
        return `A certified L'Oreal Color Expert. She excels at customized ammonia-free grey coverage and subtle dimensions without hair damage.`;
      }
      if (isNatural) {
        return `Uses plant-based, chemical-free henna blending and hair-root rejuvenation packs to preserve natural hair strength.`;
      }
      return `Coordinates structural taper cuts that work organically with your silver transitions for a contemporary look.`;
    }

    // Men's Grooming Reset default
    if (isMasterSculptor) {
      return `Our BELSOME Diamond Stylist fade specialist. His dynamic razor fades and hot towel resets are designed for a total masculine style makeover.`;
    }
    if (isColorist) {
      return `Great at modern visual texturizing and styling lines that align with active athlete and celebrity trends.`;
    }
    return `Provides dynamic Ayurvedic scalp therapies and clean stubble sculpting to reset hair health and relieve work fatigue.`;
  };

  useEffect(() => {
    if (!selectedGoal) return;
    
    const fetchRates = async () => {
      setRatesLoading(true);
      const newRates: typeof successRates = {};
      
      await Promise.all(
        stylists.map(async (stylist) => {
          try {
            const res = await ApiService.getStylistSuccessRate(stylist.id, selectedGoal);
            if (res && typeof res.successRate === "number") {
              newRates[stylist.id] = {
                successRate: res.successRate,
                basedOnCount: res.basedOnCount,
                reasoning: res.reasoning || [],
                isEstimated: res.basedOnCount === 0
              };
            } else {
              newRates[stylist.id] = {
                successRate: stylist.aiScore,
                basedOnCount: stylist.reviewsCount,
                reasoning: [getMatchReason(stylist.name, selectedGoal)],
                isEstimated: true
              };
            }
          } catch (err) {
            console.error(`Failed to fetch success rate for ${stylist.name}:`, err);
            newRates[stylist.id] = {
              successRate: stylist.aiScore,
              basedOnCount: stylist.reviewsCount,
              reasoning: [getMatchReason(stylist.name, selectedGoal)],
              isEstimated: true
            };
          }
        })
      );
      
      setSuccessRates(newRates);
      setRatesLoading(false);
    };
    
    fetchRates();
  }, [selectedGoal, stylists]);

  // Staggered reveal configuration
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="glass-panel bg-white/60 dark:bg-slate-950/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-850/60">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-400 text-[10px] font-extrabold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
            Outcome Match Engine v1.2
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
            Match Your Look, <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent italic font-normal">Select Your Artist</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xl">
            Choose a transformation goal and optional selfie. BELSOME AI will match you with the top 3 certified stylists in {activeCity} with a guaranteed 20-min seating SLA.
          </p>
        </div>
      </div>

      {/* Preset Chips & Selfie Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Column: Preset Chips & Upload */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-3">
            <label className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold uppercase tracking-wider block">
              1. Choose a Transformation Goal
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_LOOK_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(goal);
                      addToast(`Selected goal: "${goal}"`, "info");
                    }}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border shadow-sm active:scale-95 ${
                      isSelected
                        ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-transparent scale-102"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-250/30"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold uppercase tracking-wider block">
              2. Add a Selfie for AI Face Scan (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelfieChange}
                className="hidden"
                id="selfie-file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-102 active:scale-97 transition-all shadow-sm shrink-0"
              >
                <Upload className="w-4 h-4 text-slate-400" />
                Upload Selfie Image
              </button>

              {selfiePreview && (
                <div className="flex items-center gap-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/30 px-3 py-2 rounded-xl relative overflow-hidden flex-1 sm:max-w-xs">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-purple-200 dark:border-purple-800 relative bg-slate-950">
                    <img src={selfiePreview} alt="Selfie preview" className="w-full h-full object-cover" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-[9px] text-purple-700 dark:text-purple-400 font-mono font-bold block">
                      {isScanning ? "AI SCANNING..." : "SCAN SUCCESSFUL"}
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-350 font-bold block truncate">
                      {isScanning ? "Processing facial markers..." : "Oval structure mapped"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveSelfie}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove Selfie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Laser Scan line overlay */}
                  {isScanning && <div className="animate-scan-beam" />}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Affordance / Instructions */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-5 rounded-2xl text-left space-y-3.5 relative overflow-hidden">
            <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-pink-500" /> Scanner Insights
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              <p>
                Our AI model automatically matches structural haircuts based on face shape analysis:
              </p>
              <ul className="space-y-1.5 list-disc list-inside pl-1 text-[11px] text-slate-650 dark:text-slate-450">
                <li><strong className="text-slate-850 dark:text-slate-300">Oval:</strong> High versatility, fits almost any crop or flow</li>
                <li><strong className="text-slate-850 dark:text-slate-300">Round:</strong> Creates height via Textured Quiffs & Fades</li>
                <li><strong className="text-slate-850 dark:text-slate-300">Square:</strong> Softens strong angles via Textured Tapers</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Stylist Reveal Results */}
      <AnimatePresence>
        {selectedGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-8 border-t border-slate-200/60 dark:border-slate-850/60 pt-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="text-left">
                <span className="text-[10px] text-purple-700 dark:text-purple-400 font-mono font-bold uppercase tracking-wider block">
                  AI RECOMMENDATIONS FOR "{selectedGoal.toUpperCase()}"
                </span>
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mt-0.5">
                  Top 3 Match Profiles in {activeCity}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedGoal(null);
                  handleRemoveSelfie();
                }}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold flex items-center gap-1.5 self-start sm:self-center transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Selection
              </button>
            </div>

            {/* Stylists Grid */}
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {sortedStylists.map((stylist, index) => {
                const firstBeforeAfter = stylist.beforeAfter?.[0];
                const alignmentReason = getMatchReason(stylist.name, selectedGoal);
                
                const rateInfo = successRates[stylist.id];
                const displaySuccessRate = rateInfo ? rateInfo.successRate : stylist.aiScore;
                const displayCount = rateInfo ? rateInfo.basedOnCount : stylist.reviewsCount;
                const isEstimated = rateInfo ? !!rateInfo.isEstimated : true;
                const displayReasoning = rateInfo ? rateInfo.reasoning : [alignmentReason];

                return (
                  <motion.div
                    key={stylist.id}
                    variants={itemVariants}
                    className="glass-panel bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:shadow-md dark:hover:border-purple-900/40 transition-all relative overflow-hidden group"
                  >
                    {/* Visual Rank Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-mono font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      #{index + 1}
                    </div>

                    <div className="space-y-4">
                      {/* Name & Specialty */}
                      <div className="text-left space-y-1 pr-6">
                        <h4 className="font-sans font-black text-base text-slate-900 dark:text-white leading-snug">
                          {stylist.name}
                        </h4>
                        <span className="inline-block text-[10px] text-purple-700 dark:text-purple-400 font-mono font-bold bg-purple-50 dark:bg-purple-950/30 px-2.5 py-0.5 rounded-md border border-purple-100/30 dark:border-purple-900/30">
                          {stylist.specialty}
                        </span>
                      </div>

                      {/* Before / After Images */}
                      {firstBeforeAfter && (
                        <div className="grid grid-cols-2 gap-2 relative rounded-xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-inner bg-slate-950/10">
                          {/* Before image */}
                          <div className="relative aspect-[4/5] bg-slate-900">
                            <img
                              src={firstBeforeAfter.before}
                              alt="Before"
                              className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                              loading="lazy"
                            />
                            <span className="absolute bottom-1.5 left-2 bg-black/70 text-[8px] font-mono font-black tracking-widest text-slate-300 px-1.5 py-0.5 rounded">
                              BEFORE
                            </span>
                          </div>

                          {/* After image */}
                          <div className="relative aspect-[4/5] bg-slate-900">
                            <img
                              src={firstBeforeAfter.after}
                              alt="After"
                              className="w-full h-full object-cover scale-102 group-hover:scale-100 transition-transform duration-500"
                              loading="lazy"
                            />
                            <span className="absolute bottom-1.5 right-2 bg-brand-primary/95 text-white text-[8px] font-mono font-black tracking-widest px-1.5 py-0.5 rounded shadow-sm">
                              AFTER
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Success Rate Stats */}
                      <div className={`text-left space-y-1 ${ratesLoading ? "animate-pulse" : ""}`}>
                        <strong className="text-xs text-slate-850 dark:text-slate-200 block leading-tight font-extrabold flex items-center gap-1">
                          {Math.round(displaySuccessRate)}% success rate
                          {isEstimated && (
                            <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500 font-mono">
                              (estimated)
                            </span>
                          )}
                        </strong>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal font-semibold">
                          on similar transformations ({displayCount} past clients)
                        </p>

                        {/* Star Rating below */}
                        <div className="flex items-center gap-0.5 pt-1 text-amber-400">
                          {Array.from({ length: Math.floor(stylist.rating) }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                          {stylist.rating % 1 !== 0 && (
                            <Star className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400/50" />
                          )}
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold ml-1 font-mono">
                            {stylist.rating}
                          </span>
                        </div>
                      </div>

                      {/* Why this match accordion */}
                      <div className="pt-2 text-left">
                        <AIReasoning
                          bullets={displayReasoning}
                          label="Why this match?"
                        />
                      </div>
                    </div>

                    {/* Book Stylist CTA */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-850">
                      <button
                        type="button"
                        onClick={() => {
                          addToast(`Direct booking requested with ${stylist.name}!`, "success");
                          // Scroll to AI Concierge for appointment confirmation, or handle simulation
                          document.getElementById("ai-concierge-console")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-55 dark:bg-slate-850 hover:bg-brand-primary dark:hover:bg-brand-primary hover:text-white dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-transparent text-slate-700 dark:text-slate-350 text-xs font-extrabold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-97"
                      >
                        Book {stylist.name.split(" ")[0]} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
