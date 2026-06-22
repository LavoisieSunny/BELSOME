import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getStylists = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("stylists")
      .select("*, stylist_before_after(*)");

    if (error) throw error;

    const formatted = (data || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      specialty: s.specialty,
      experience: s.experience,
      rating: Number(s.rating),
      languages: s.languages,
      certifications: s.certifications,
      aiScore: Number(s.ai_score),
      reviewsCount: s.reviews_count,
      city: s.city,
      beforeAfter: (s.stylist_before_after || []).map((ba: any) => ({
        before: ba.before_url,
        after: ba.after_url
      }))
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getStylists:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getStylistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("stylists")
      .select("*, stylist_before_after(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Stylist not found" });
    }

    const formatted = {
      id: data.id,
      name: data.name,
      specialty: data.specialty,
      experience: data.experience,
      rating: Number(data.rating),
      languages: data.languages,
      certifications: data.certifications,
      aiScore: Number(data.ai_score),
      reviewsCount: data.reviews_count,
      city: data.city,
      beforeAfter: (data.stylist_before_after || []).map((ba: any) => ({
        before: ba.before_url,
        after: ba.after_url
      }))
    };

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getStylistById:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const createStylist = async (req: Request, res: Response) => {
  try {
    const {
      name,
      specialty,
      experience,
      rating,
      languages,
      certifications,
      aiScore,
      reviewsCount,
      city,
      beforeAfter
    } = req.body;

    const { data, error } = await supabase
      .from("stylists")
      .insert({
        name,
        specialty,
        experience,
        rating: rating || 5.0,
        languages: languages || [],
        certifications: certifications || [],
        ai_score: aiScore || 80.0,
        reviews_count: reviewsCount || 0,
        city
      })
      .select()
      .single();

    if (error) throw error;

    // Handle beforeAfter if provided
    let beforeAfterResult = [];
    if (beforeAfter && Array.isArray(beforeAfter) && beforeAfter.length > 0) {
      const inserts = beforeAfter.map((ba: any) => ({
        stylist_id: data.id,
        before_url: ba.before,
        after_url: ba.after
      }));
      const { data: baData, error: baError } = await supabase
        .from("stylist_before_after")
        .insert(inserts)
        .select();

      if (baError) throw baError;
      beforeAfterResult = baData || [];
    }

    const formatted = {
      id: data.id,
      name: data.name,
      specialty: data.specialty,
      experience: data.experience,
      rating: Number(data.rating),
      languages: data.languages,
      certifications: data.certifications,
      aiScore: Number(data.ai_score),
      reviewsCount: data.reviews_count,
      city: data.city,
      beforeAfter: beforeAfterResult.map((ba: any) => ({
        before: ba.before_url,
        after: ba.after_url
      }))
    };

    return res.status(201).json(formatted);
  } catch (err: any) {
    console.error("Error in createStylist:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getStylistSuccessRate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lookGoal } = req.query;

    if (!lookGoal || typeof lookGoal !== "string") {
      return res.status(400).json({ error: "Missing required query parameter: lookGoal" });
    }

    // 1. Fetch stylist to get overall rating and fallback values
    const { data: stylist, error: stylistError } = await supabase
      .from("stylists")
      .select("rating, name, ai_score, reviews_count")
      .eq("id", id)
      .maybeSingle();

    if (stylistError) throw stylistError;
    if (!stylist) {
      return res.status(404).json({ error: "Stylist not found" });
    }

    // 2. Fetch completed appointments for this stylist
    const { data: appointments, error: apptsError } = await supabase
      .from("appointments")
      .select("id, service_id, service_name, status")
      .eq("stylist_id", id)
      .eq("status", "Completed");

    if (apptsError) throw apptsError;

    const totalCompleted = appointments ? appointments.length : 0;

    if (totalCompleted === 0) {
      return res.json({
        successRate: Number(stylist.ai_score),
        basedOnCount: Number(stylist.reviews_count),
        reasoning: [
          `No completed database bookings found for ${stylist.name} yet.`,
          `Using historical baseline rating of ${Number(stylist.rating).toFixed(1)}/5.`
        ]
      });
    }

    // 3. Fetch all services to build ID-to-category map
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("id, category");

    if (servicesError) throw servicesError;

    const serviceMap = new Map<string, string>();
    if (services) {
      services.forEach((s: any) => {
        serviceMap.set(s.id, s.category);
      });
    }

    // 4. Calculate heuristics
    let matchingCount = 0;
    appointments.forEach((appt: any) => {
      const cat = serviceMap.get(appt.service_id) || "";
      if (isCategoryMatch(cat, lookGoal)) {
        matchingCount++;
      }
    });

    const matchPct = totalCompleted > 0 ? (matchingCount / totalCompleted) : 0;
    const categoryPoints = matchPct * 40;

    const ratingVal = Number(stylist.rating) || 5.0;
    const ratingPoints = (ratingVal / 5) * 30;

    const volumePoints = Math.min(matchingCount * 3, 30);

    const successRate = Math.min(Math.max(Math.round(categoryPoints + ratingPoints + volumePoints), 0), 100);

    // 5. Generate reasoning bullets
    const categoryPct = Math.round(matchPct * 100);
    
    let categoryDesc = "relevant";
    const goalLower = lookGoal.toLowerCase();
    if (goalLower.includes("bridal") || goalLower.includes("glow")) categoryDesc = "bridal/makeup/beauty";
    else if (goalLower.includes("professional") || goalLower.includes("cut")) categoryDesc = "haircut";
    else if (goalLower.includes("curly") || goalLower.includes("sleek")) categoryDesc = "hair styling";
    else if (goalLower.includes("grey") || goalLower.includes("coverage")) categoryDesc = "hair color/restyle";
    else if (goalLower.includes("grooming") || goalLower.includes("reset")) categoryDesc = "hair/beard";

    const volumeLabel = matchingCount >= 10 ? "Strong volume" : matchingCount >= 5 ? "Good volume" : "Moderate volume";

    const reasoning = [
      `${categoryPct}% category match: ${matchingCount} of ${totalCompleted} recent bookings were ${categoryDesc} services.`,
      `Average client rating of ${ratingVal.toFixed(1)}/5 across completed bookings.`,
      `${volumeLabel}: ${matchingCount} completed bookings in this category.`
    ];

    return res.json({
      successRate,
      basedOnCount: totalCompleted,
      reasoning
    });
  } catch (err: any) {
    console.error("Error in getStylistSuccessRate:", err);
    return res.status(500).json({ error: err.message });
  }
};

const isCategoryMatch = (serviceCategory: string, lookGoal: string): boolean => {
  const cat = serviceCategory.toLowerCase();
  const goal = lookGoal.toLowerCase();
  
  if (goal.includes("bridal") || goal.includes("glow")) {
    return cat.includes("bridal") || cat.includes("makeup") || cat.includes("beauty");
  }
  if (goal.includes("professional cut") || goal.includes("clean professional")) {
    return cat.includes("hair");
  }
  if (goal.includes("curly") || goal.includes("sleek") || goal.includes("straight")) {
    return cat.includes("hair");
  }
  if (goal.includes("grey") || goal.includes("coverage") || goal.includes("restyle")) {
    return cat.includes("hair");
  }
  if (goal.includes("grooming") || goal.includes("reset") || goal.includes("men")) {
    return cat.includes("hair") || cat.includes("beard");
  }
  return false;
};

