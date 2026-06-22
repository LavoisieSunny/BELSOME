import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("vendor_products").select("*");

    if (error) throw error;

    const formatted = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      certifications: p.certifications,
      cost: Number(p.cost),
      retail: Number(p.retail),
      margin: Number(p.margin),
      score: Number(p.score),
      status: p.status,
      explanation: p.explanation
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getProducts:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      certifications,
      cost,
      retail,
      margin,
      score,
      status,
      explanation
    } = req.body;

    const { data, error } = await supabase
      .from("vendor_products")
      .insert({
        name,
        brand,
        certifications: certifications || [],
        cost: cost || 0,
        retail: retail || 0,
        margin: margin || 0,
        score: score || 0,
        status: status || "REVIEW",
        explanation: explanation || ""
      })
      .select()
      .single();

    if (error) throw error;

    const formatted = {
      id: data.id,
      name: data.name,
      brand: data.brand,
      certifications: data.certifications,
      cost: Number(data.cost),
      retail: Number(data.retail),
      margin: Number(data.margin),
      score: Number(data.score),
      status: data.status,
      explanation: data.explanation
    };

    return res.status(201).json(formatted);
  } catch (err: any) {
    console.error("Error in createProduct:", err);
    return res.status(500).json({ error: err.message });
  }
};
