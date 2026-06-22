import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getWeddingProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch the project and outer join its relations
    const { data: project, error: projectError } = await supabase
      .from("wedding_projects")
      .select("*, wedding_booked_vendors(*), wedding_timeline(*)")
      .eq("id", id)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) {
      return res.status(404).json({ error: "Wedding project not found" });
    }

    const formatted = {
      id: project.id,
      brideName: project.bride_name,
      weddingDate: project.wedding_date,
      budget: Number(project.budget),
      progress: Number(project.progress),
      bookedVendors: (project.wedding_booked_vendors || []).map((v: any) => ({
        role: v.role,
        name: v.name,
        cost: Number(v.cost),
        status: v.status
      })),
      timeline: (project.wedding_timeline || []).map((t: any) => ({
        id: t.id,
        time: t.time,
        event: t.event,
        status: t.status
      }))
    };

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getWeddingProjectById:", err);
    return res.status(500).json({ error: err.message });
  }
};
