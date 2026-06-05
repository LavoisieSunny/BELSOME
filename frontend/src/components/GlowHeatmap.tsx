import React from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface GlowHeatmapProps {
  salonId: string;
  selectedDate?: string;
  selectedTimeSlot?: string;
  onSlotSelect?: (dateStr: string, timeSlotStr: string) => void;
  onSlotInspect?: (dayName: string, hourStr: string, priceMultiplier: number, bookedCount: number, capacity: number) => void;
  highlightSelected?: boolean;
}

// 12-hour block representation (9:00 AM to 8:00 PM)
const HOURS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

const DAYS = [
  { name: "Mon", dayIndex: 1, label: "Monday", offsetDays: 0 },
  { name: "Tue", dayIndex: 2, label: "Tuesday", offsetDays: 1 },
  { name: "Wed", dayIndex: 3, label: "Wednesday", offsetDays: 2 },
  { name: "Thu", dayIndex: 4, label: "Thursday", offsetDays: 3 },
  { name: "Fri", dayIndex: 5, label: "Friday", offsetDays: 4 },
  { name: "Sat", dayIndex: 6, label: "Saturday", offsetDays: 5 },
  { name: "Sun", dayIndex: 0, label: "Sunday", offsetDays: 6 }
];

export default function GlowHeatmap({
  salonId,
  selectedDate,
  selectedTimeSlot,
  onSlotSelect,
  onSlotInspect,
  highlightSelected = true
}: GlowHeatmapProps) {
  const { appointments, stylists, salons } = useBelsomeStore();
  const currentSalon = salons.find(s => s.id === salonId) || salons[0];
  const salonStylists = stylists; // default available stylists

  // Dynamic pricing multipliers configured in salon store
  const peakSurge = currentSalon.peakSurge || 15;
  const offPeakDiscount = currentSalon.offPeakDiscount || 20;

  // Reference Monday for active week (June 1st, 2026 matches the DB default appointments range)
  const baseMondayDate = new Date("2026-06-01");

  // Get date string matching a weekday
  const getWeekdayDateStr = (offset: number) => {
    const d = new Date(baseMondayDate);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  // Pricing model logic (Glow Pricing Engine)
  const getSlotPricing = (dayIndex: number, hourStr: string) => {
    const isAm = hourStr.toLowerCase().includes("am");
    let hour = parseInt(hourStr.split(":")[0]);
    if (isAm && hour === 12) hour = 0;
    if (!isAm && hour !== 12) hour += 12;

    const isWeekendOrEvening = dayIndex === 0 || dayIndex === 5 || dayIndex === 6 || hour >= 17;
    const isOffPeak = dayIndex >= 1 && dayIndex <= 4 && hour >= 10 && hour < 14;

    if (isWeekendOrEvening) {
      return {
        label: "Peak Demand (Surge)",
        multiplier: 1 + (peakSurge / 100),
        reason: `${peakSurge}% Surge Rate`,
        type: "surge" as const
      };
    } else if (isOffPeak) {
      return {
        label: "Off-Peak (Discount)",
        multiplier: 1 - (offPeakDiscount / 100),
        reason: `${offPeakDiscount}% Discount`,
        type: "discount" as const
      };
    } else {
      return {
        label: "Standard Rate",
        multiplier: 1.0,
        reason: "Standard Rate",
        type: "standard" as const
      };
    }
  };

  // Convert time to 24-hour hour index for matching
  const getHourValue = (time: string) => {
    const isAm = time.toLowerCase().includes("am");
    let hr = parseInt(time.split(":")[0]);
    if (isAm && hr === 12) hr = 0;
    if (!isAm && hr !== 12) hr += 12;
    return hr;
  };

  // Get occupancy counts for day + hour
  const getSlotAvailability = (targetDateStr: string, hourStr: string) => {
    const activeAppts = appointments.filter(appt => {
      if (appt.salonId !== salonId || appt.status === "Cancelled") return false;
      if (appt.date !== targetDateStr) return false;
      return getHourValue(appt.timeSlot) === getHourValue(hourStr);
    });

    const capacity = salonStylists.length || 3;
    const booked = activeAppts.length;
    const remaining = Math.max(0, capacity - booked);

    return {
      capacity,
      booked,
      remaining,
      isFull: remaining === 0
    };
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Glow Pricing Legend:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 inline-block" />
            <span className="text-red-700 dark:text-red-400 font-bold">Hot (+{peakSurge}% Surge)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 inline-block" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Cool (-{offPeakDiscount}% Promo)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-indigo-50 dark:bg-purple-950/20 border border-indigo-200 dark:border-indigo-900/40 inline-block" />
            <span className="text-indigo-700 dark:text-indigo-400 font-bold">Standard (1.0x Rate)</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 inline-block" />
            <span>Fully Booked</span>
          </span>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 shadow-sm relative">
        <table className="w-full border-collapse min-w-[640px] text-center table-fixed">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <th className="w-16 py-3 font-mono text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase border-r border-slate-200 dark:border-slate-800">Time</th>
              {DAYS.map(day => {
                const dateStr = getWeekdayDateStr(day.offsetDays);
                const isSelectedDay = selectedDate === dateStr;
                return (
                  <th 
                    key={day.name} 
                    className={`py-3 text-[11px] font-bold border-r border-slate-200 dark:border-slate-800 transition-colors ${
                      isSelectedDay 
                        ? "text-purple-650 dark:text-purple-400 bg-purple-500/5" 
                        : "text-slate-700 dark:text-slate-350"
                    }`}
                  >
                    <div>{day.label}</div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-550 font-mono font-medium mt-0.5">{dateStr.split("-").slice(1).join("/")}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {HOURS.map(hourStr => (
              <tr key={hourStr} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10">
                {/* Hour header column */}
                <td className="py-2.5 font-mono text-[9px] text-slate-550 dark:text-slate-405 font-bold uppercase bg-slate-50/50 dark:bg-slate-900/20 border-r border-slate-200 dark:border-slate-800 select-none">
                  {hourStr.replace(" ", "\u00A0")}
                </td>

                {/* Day columns */}
                {DAYS.map(day => {
                  const targetDateStr = getWeekdayDateStr(day.offsetDays);
                  const pricing = getSlotPricing(day.dayIndex, hourStr);
                  const availability = getSlotAvailability(targetDateStr, hourStr);
                  
                  const isSelectedSlot = highlightSelected && selectedDate === targetDateStr && selectedTimeSlot === hourStr;

                  // Styles depending on pricing category and booking status
                  let cellBg = "bg-indigo-50/30 hover:bg-indigo-50/70 border-indigo-100/50 text-indigo-700 dark:bg-purple-950/10 dark:border-purple-900/20 dark:text-purple-300";
                  let tagText = "Std";

                  if (pricing.type === "surge") {
                    cellBg = "bg-red-50/30 hover:bg-red-50/60 border-red-100/50 text-red-700 dark:bg-red-950/10 dark:border-red-900/20 dark:text-red-400";
                    tagText = `+${peakSurge}%`;
                  } else if (pricing.type === "discount") {
                    cellBg = "bg-emerald-50/30 hover:bg-emerald-50/60 border-emerald-150/50 text-emerald-700 dark:bg-emerald-950/10 dark:border-emerald-900/20 dark:text-emerald-400";
                    tagText = `-${offPeakDiscount}%`;
                  }

                  if (availability.isFull) {
                    cellBg = "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-60 line-through cursor-not-allowed select-none";
                    tagText = "Full";
                  } else if (isSelectedSlot) {
                    // Highlight overrides
                    cellBg = "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/20 scale-[1.02] z-10";
                  }

                  const handleCellClick = () => {
                    if (availability.isFull) return;
                    
                    if (onSlotSelect) {
                      onSlotSelect(targetDateStr, hourStr);
                    }
                    if (onSlotInspect) {
                      onSlotInspect(
                        day.label,
                        hourStr,
                        pricing.multiplier,
                        availability.booked,
                        availability.capacity
                      );
                    }
                  };

                  return (
                    <td 
                      key={day.name}
                      onClick={handleCellClick}
                      className={`p-1.5 border-r border-slate-200 dark:border-slate-800 transition-all select-none cursor-pointer relative group ${cellBg}`}
                    >
                      <div className="flex flex-col justify-center items-center h-8">
                        <span className="text-[10px] font-bold leading-none font-mono">
                          {isSelectedSlot ? "SELECTED" : tagText}
                        </span>
                        
                        {!availability.isFull && (
                          <span className={`text-[7.5px] font-mono font-bold mt-1 opacity-75 ${
                            isSelectedSlot ? "text-white" :
                            availability.booked > 0 ? "text-amber-600 dark:text-amber-400" :
                            "text-slate-400 dark:text-slate-500"
                          }`}>
                            {isSelectedSlot 
                              ? `${hourStr}` 
                              : availability.booked > 0 
                              ? `Booked\u00A0${availability.booked}/${availability.capacity}` 
                              : "🟢\u00A0Free"}
                          </span>
                        )}
                      </div>

                      {/* Tooltip on hover */}
                      {!availability.isFull && !isSelectedSlot && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[9px] py-1 px-2 rounded shadow-lg z-25 font-mono whitespace-nowrap leading-none select-none pointer-events-none">
                          {pricing.label} • {availability.remaining} free slots
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
