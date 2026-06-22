import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getCorporateAccounts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("corporate_accounts").select("*");

    if (error) throw error;

    const formatted = (data || []).map((c: any) => ({
      id: c.id,
      companyName: c.company_name,
      plan: c.plan,
      totalEmployees: c.total_employees,
      allocatedCredits: Number(c.allocated_credits),
      usedCredits: Number(c.used_credits),
      city: c.city
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getCorporateAccounts:", err);
    return res.status(500).json({ error: err.message });
  }
};
