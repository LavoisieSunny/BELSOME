import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { customerName, salonId } = req.query;
    let queryBuilder = supabase.from("appointments").select("*");

    if (customerName) {
      queryBuilder = queryBuilder.eq("customer_name", String(customerName));
    }
    if (salonId) {
      queryBuilder = queryBuilder.eq("salon_id", String(salonId));
    }

    // Sort by date desc
    const { data, error } = await queryBuilder.order("date", { ascending: false });

    if (error) throw error;

    const formatted = (data || []).map((a: any) => ({
      id: a.id,
      customerName: a.customer_name,
      salonId: a.salon_id,
      salonName: a.salon_name,
      serviceId: a.service_id,
      serviceName: a.service_name,
      stylistId: a.stylist_id,
      stylistName: a.stylist_name,
      date: a.date,
      timeSlot: a.time_slot,
      productPreference: a.product_preference,
      originalPrice: Number(a.original_price),
      finalPrice: Number(a.final_price),
      status: a.status,
      pricingReason: a.pricing_reason,
      city: a.city
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in getAppointments:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      salonId,
      salonName,
      serviceId,
      serviceName,
      stylistId,
      stylistName,
      date,
      timeSlot,
      productPreference,
      originalPrice,
      finalPrice,
      pricingReason,
      city
    } = req.body;

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        customer_name: customerName,
        salon_id: salonId,
        salon_name: salonName,
        service_id: serviceId,
        service_name: serviceName,
        stylist_id: stylistId,
        stylist_name: stylistName,
        date,
        time_slot: timeSlot,
        product_preference: productPreference || [],
        original_price: originalPrice || 0,
        final_price: finalPrice || 0,
        status: "Upcoming",
        pricing_reason: pricingReason || "Standard Rate",
        city: city || "Hyderabad"
      })
      .select()
      .single();

    if (error) throw error;

    const formatted = {
      id: data.id,
      customerName: data.customer_name,
      salonId: data.salon_id,
      salonName: data.salon_name,
      serviceId: data.service_id,
      serviceName: data.service_name,
      stylistId: data.stylist_id,
      stylistName: data.stylist_name,
      date: data.date,
      timeSlot: data.time_slot,
      productPreference: data.product_preference,
      originalPrice: Number(data.original_price),
      finalPrice: Number(data.final_price),
      status: data.status,
      pricingReason: data.pricing_reason,
      city: data.city
    };

    return res.status(201).json(formatted);
  } catch (err: any) {
    console.error("Error in createAppointment:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Upcoming', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value provided" });
    }

    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const formatted = {
      id: data.id,
      customerName: data.customer_name,
      salonId: data.salon_id,
      salonName: data.salon_name,
      serviceId: data.service_id,
      serviceName: data.service_name,
      stylistId: data.stylist_id,
      stylistName: data.stylist_name,
      date: data.date,
      timeSlot: data.time_slot,
      productPreference: data.product_preference,
      originalPrice: Number(data.original_price),
      finalPrice: Number(data.final_price),
      status: data.status,
      pricingReason: data.pricing_reason,
      city: data.city
    };

    return res.json(formatted);
  } catch (err: any) {
    console.error("Error in updateAppointmentStatus:", err);
    return res.status(500).json({ error: err.message });
  }
};
