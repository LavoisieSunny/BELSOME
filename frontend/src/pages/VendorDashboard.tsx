import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { ApiService } from "../services/api";
import { ShoppingBag, PlusCircle, AlertCircle, CheckCircle2, TrendingUp, RefreshCcw } from "lucide-react";

export default function VendorDashboard() {
  const { vendorProducts, addVendorProduct } = useBelsomeStore();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [certs, setCerts] = useState("Organic, Vegan");
  const [cost, setCost] = useState(300);
  const [retail, setRetail] = useState(800);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand) return;

    setLoading(true);
    try {
      const response = await ApiService.analyzeProcurement({
        name,
        brand,
        certifications: certs,
        cost,
        retail,
        budget: 5000,
        prefBrands: "BioGlow, OrganicLife",
        marginGoal: 50
      });
      
      const margin = parseFloat(((retail - cost) / retail * 100).toFixed(1));
      
      addVendorProduct({
        name,
        brand,
        certifications: certs.split(","),
        cost,
        retail,
        margin,
        score: response.score,
        status: response.status,
        explanation: response.explanation
      });

      setLastResult({ ...response, name, brand, margin });
      setName("");
      setBrand("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sub Menu */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-150 flex items-center justify-center font-bold text-teal-600 shadow-sm">
              V
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 leading-tight">BioGlow Chemicals</h4>
              <span className="text-[10px] text-slate-400 font-semibold">Partner Vendor</span>
            </div>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="text-xs text-slate-500 font-semibold leading-normal">
            Upload premium catalog ingredients to BELSOME. AI immediately scores catalog listings for Hyderabad studios.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">Proposal Catalog Ingredient Uploader</h3>
            <p className="text-xs text-slate-500 font-semibold">Submit product lines to partner salons. AI checks cost-to-margin ratio and certifications.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-teal-700 font-bold uppercase">Product Line Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., HydraMoist Beard Softener"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-teal-700 font-bold uppercase">Brand Label</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="E.g., BioGlow"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-teal-700 font-bold uppercase">Chemical Disclosures / Certs</label>
              <input
                type="text"
                value={certs}
                onChange={(e) => setCerts(e.target.value)}
                placeholder="E.g., Organic, Vegan, Toxin-Free"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-teal-700 font-bold uppercase">Wholesale Price (Cost)</label>
              <input
                type="number"
                required
                value={cost}
                onChange={(e) => setCost(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-teal-700 font-bold uppercase">Retail Price (Salon List)</label>
              <input
                type="number"
                required
                value={retail}
                onChange={(e) => setRetail(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-teal-650/10 w-full"
            >
              Submit to Salon Network
            </button>
          </form>

          {loading && (
            <div className="p-8 text-center text-xs text-slate-500 font-mono font-semibold flex items-center justify-center gap-2">
              <RefreshCcw className="w-4 h-4 animate-spin text-teal-650" />
              Auditing catalog pricing rules...
            </div>
          )}

          {/* AI Decision Card */}
          {lastResult && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">{lastResult.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">Margin: {lastResult.margin}%</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  lastResult.status === "ACCEPT" ? "bg-green-50 border border-green-200 text-green-700" :
                  lastResult.status === "REVIEW" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                  "bg-red-50 border border-red-200 text-red-700"
                }`}>
                  {lastResult.status} (Score: {lastResult.score})
                </span>
              </div>
              <div className="h-px bg-slate-200" />
              <p className="text-[11px] text-slate-600 leading-normal font-sans font-semibold">
                <strong>AI Audit Feedback:</strong> {lastResult.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Catalog Registry */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900">Vendor Submissions Log</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendorProducts.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm leading-none">{p.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                    p.status === "ACCEPT" ? "bg-green-50 border border-green-200 text-green-700" :
                    p.status === "REVIEW" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                    "bg-red-50 border border-red-200 text-red-700"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Cost: <strong>₹{p.cost}</strong></span>
                  <span>Retail: <strong>₹{p.retail}</strong></span>
                  <span>Profit Margin: <strong className="text-teal-600">{p.margin}%</strong></span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-semibold">{p.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
