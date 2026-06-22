import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getAttempts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("exam_attempts").select("*");

    if (error) throw error;

    const formatted = (data || []).map((e: any) => ({
      id: e.id,
      candidateName: e.candidate_name,
      language: e.language,
      scenario: e.scenario,
      score: Number(e.score),
      status: e.status,
      feedback: e.feedback,
      date: e.date
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getAttempts:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const createAttempt = async (req: Request, res: Response) => {
  try {
    const {
      candidateName,
      language,
      scenario,
      score,
      status,
      feedback,
      date
    } = req.body;

    const { data, error } = await supabase
      .from("exam_attempts")
      .insert({
        candidate_name: candidateName,
        language,
        scenario,
        score: score || 0,
        status: status || "TRAIN",
        feedback: feedback || "",
        date: date || new Date().toISOString().split("T")[0]
      })
      .select()
      .single();

    if (error) throw error;

    const formatted = {
      id: data.id,
      candidateName: data.candidate_name,
      language: data.language,
      scenario: data.scenario,
      score: Number(data.score),
      status: data.status,
      feedback: data.feedback,
      date: data.date
    };

    return res.status(201).json(formatted);
  } catch (err: any) {
    console.error("Error in createAttempt:", err);
    return res.status(500).json({ error: err.message });
  }
};
