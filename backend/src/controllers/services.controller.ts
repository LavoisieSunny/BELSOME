import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getServices = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("services").select("*");

    if (error) throw error;

    const formatted = (data || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      price: Number(s.price),
      duration: s.duration,
      image: s.image
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getServices:", err);
    return res.status(500).json({ error: err.message });
  }
};
