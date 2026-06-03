import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useBelsomeStore } from "../store/belsomeStore";
import { MessageSquare, Users, User, ShieldAlert, Award, ShoppingBag, Briefcase, QrCode, Sparkles, Send } from "lucide-react";

export default function AppLayout() {
  const { userRole, changeUserRole } = useBelsomeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  const roles = [
    { id: "customer", label: "Customer", path: "/customer", icon: User, color: "text-purple-600" },
    { id: "owner", label: "Salon Owner", path: "/owner", icon: Award, color: "text-pink-600" },
    { id: "stylist", label: "Stylist", path: "/stylist", icon: Sparkles, color: "text-amber-600" },
    { id: "vendor", label: "Vendor", path: "/vendor", icon: ShoppingBag, color: "text-teal-600" },
    { id: "hr", label: "HR Manager", path: "/hr", icon: Briefcase, color: "text-indigo-600" },
    { id: "admin", label: "Platform Admin", path: "/admin", icon: ShieldAlert, color: "text-red-600" },
  ];

  const handleRoleChange = (roleId: string, path: string) => {
    changeUserRole(roleId);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <header className="glass-panel sticky top-0 z-40 border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center font-display font-extrabold text-xl tracking-wider text-white shadow-lg shadow-brand-primary/20">
            B
          </div>
          <div>
            <h1 className="font-display font-black text-xl tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-purple-900 bg-clip-text text-transparent">
              BELSOME
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest mt-1">Look Better. Feel Better. Belsome.</p>
          </div>
        </div>

        {/* Navigation Indicator / Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all border ${
              location.pathname === "/"
                ? "bg-slate-100 border-slate-200 text-slate-800 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Concept Pitch
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 font-mono font-semibold">
            Hyderabad Launch
          </span>
        </div>
      </header>

      {/* Role Switching Control Panel */}
      <div className="bg-white/80 border-b border-slate-200/60 px-6 py-2.5 flex items-center justify-between overflow-x-auto gap-4 scrollbar-none z-30 sticky top-[73px] backdrop-blur-md shadow-sm shadow-slate-100/50">
        <div className="flex items-center gap-2 text-slate-500 text-xs shrink-0 font-semibold">
          <Users className="w-4 h-4 text-purple-600" />
          <span>Demo Role switcher:</span>
        </div>
        <div className="flex items-center gap-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = location.pathname.startsWith(role.path);
            return (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id, role.path)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all border shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary border-none text-white shadow-md shadow-brand-primary/20 scale-105"
                    : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : role.color}`} />
                {role.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 z-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4 mt-12 z-20 shadow-inner">
        <p>© 2026 BELSOME Grooming Intelligence. Developed for National Startup Competition.</p>
        <p className="font-semibold text-slate-500">Vite • Tailwind CSS • Zustand DB Engine • Centralized LLM Controller</p>
      </footer>

      {/* Module 11: WhatsApp Booking Bot Floating Simulator */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setWhatsappOpen(!whatsappOpen)}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all animate-bounce"
          title="Open WhatsApp Booking Bot"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {whatsappOpen && <WhatsAppBot onClose={() => setWhatsappOpen(false)} />}
      </div>
    </div>
  );
}

// Interactive WhatsApp Chat Simulator Component
function WhatsAppBot({ onClose }: { onClose: () => void }) {
  const { services, addAppointment } = useBelsomeStore();
  const [step, setStep] = useState<number>(0);
  const [chat, setChat] = useState<{ sender: "user" | "bot"; text: string; options?: string[] }[]>([
    { sender: "bot", text: "🟢 BELSOME Smart Grooming Bot\n\nScan QR or start chat. Send 'Book Appointment' to instantly configure your slots." }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setChat((prev) => [...prev, { sender: "user", text }]);
    setInputText("");

    setTimeout(() => {
      processBotReply(text);
    }, 600);
  };

  const processBotReply = (userMsg: string) => {
    const msg = userMsg.toLowerCase();

    if (step === 0 && (msg.includes("book") || msg.includes("hi") || msg.includes("hello"))) {
      setStep(1);
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Which luxury service would you like to book today?",
          options: services.map((s) => s.name)
        }
      ]);
    } else if (step === 1) {
      setStep(2);
      const matched = services.find((s) => s.name.toLowerCase().includes(userMsg.toLowerCase())) || services[0];
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Got it: ${matched.name}. What date works for you? (Format: YYYY-MM-DD or say 'Tomorrow')`,
          options: ["2026-06-04", "2026-06-05", "2026-06-06"]
        }
      ]);
    } else if (step === 2) {
      setStep(3);
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Select your preferred slot timing:",
          options: ["10:00 AM", "12:30 PM", "04:00 PM"]
        }
      ]);
    } else if (step === 3) {
      setStep(4);
      const finalService = services[0];
      addAppointment({
        customerName: "WhatsApp Client",
        salonId: "salon-1",
        salonName: "BELSOME Signature Studio",
        serviceId: finalService.id,
        serviceName: finalService.name,
        stylistId: "stylist-1",
        stylistName: "Vikram Malhotra",
        date: "2026-06-04",
        timeSlot: userMsg,
        productPreference: ["Organic"],
        originalPrice: finalService.price,
        finalPrice: finalService.price * 0.8,
        pricingReason: "WhatsApp Automated Booking Promo"
      });

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `🎉 *Appointment Confirmed!*\n\n📍 Studio: BELSOME Signature Studio\n💇 Service: ${finalService.name}\n📅 Date: 2026-06-04\n⏰ Time: ${userMsg}\n🛡️ SLA Guarantee: Express Track 20-Min Activated.\n\nThank you for choosing BELSOME!`
        }
      ]);
    } else {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "To book a new slot, type 'Book Appointment' or say 'Hi'."
        }
      ]);
      setStep(0);
    }
  };

  return (
    <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[460px] bg-white border border-emerald-500/35 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Bot Header */}
      <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-sm">
            💬
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight">WhatsApp Booking Bot</h4>
            <span className="text-[10px] text-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online • Verified Business
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-emerald-100 hover:text-white text-lg font-bold">
          ×
        </button>
      </div>

      {/* QR Code Scan Simulator Info */}
      <div className="bg-slate-50 p-2.5 border-b border-emerald-500/10 flex items-center justify-between gap-2 text-[10px] text-emerald-700 font-mono">
        <div className="flex items-center gap-1.5">
          <QrCode className="w-4 h-4 shrink-0 animate-pulse" />
          <span>Demo bot scans directly on device</span>
        </div>
        <span className="text-slate-400">4 Messages Flow</span>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#efeae2]">
        {chat.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`p-3 rounded-2xl text-xs max-w-[85%] whitespace-pre-line leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-[#d9fdd3] text-slate-900 border border-[#d9fdd3] rounded-tr-none"
                  : "bg-white text-slate-950 border border-slate-200/60 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>

            {/* Quick Option Buttons */}
            {msg.options && (
              <div className="mt-2 flex flex-wrap gap-1.5 justify-start max-w-[90%]">
                {msg.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSend(opt)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-emerald-500/25 text-[10px] text-emerald-700 transition-all font-semibold shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type message..."
          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => handleSend()}
          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
