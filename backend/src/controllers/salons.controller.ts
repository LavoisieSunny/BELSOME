import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getSalons = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("salons").select("*");

    if (error) throw error;

    const formatted = (data || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      location: s.location,
      rating: Number(s.rating),
      image: s.image,
      minPrice: Number(s.min_price),
      maxPrice: Number(s.max_price),
      peakSurge: Number(s.peak_surge),
      offPeakDiscount: Number(s.off_peak_discount),
      city: s.city
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getSalons:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getSalonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Salon not found" });
    }

    const formatted = {
      id: data.id,
      name: data.name,
      location: data.location,
      rating: Number(data.rating),
      image: data.image,
      minPrice: Number(data.min_price),
      maxPrice: Number(data.max_price),
      peakSurge: Number(data.peak_surge),
      offPeakDiscount: Number(data.off_peak_discount),
      city: data.city
    };

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getSalonById:", err);
    return res.status(500).json({ error: err.message });
  }
};
