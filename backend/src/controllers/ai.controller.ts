import { Request, Response } from "express";
import { AIService } from "../services/ai.service";

export class AIController {

  private static getActiveCity(req: Request): string {
    return (req.headers["x-active-city"] || req.body.activeCity || "Hyderabad") as string;
  }

  static async concierge(req: Request, res: Response) {
    try {
      const { query, history } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Missing required parameter: query" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getGroomingConcierge(query, history, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[concierge] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async styleDNA(req: Request, res: Response) {
    try {
      const { stylePref, hairLength, colorOpen, occasion, lifestyle } = req.body;
      if (!stylePref || !hairLength || !colorOpen || !occasion || !lifestyle) {
        return res.status(400).json({ error: "Missing required style DNA parameters" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getStyleDNA({ stylePref, hairLength, colorOpen, occasion, lifestyle }, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[styleDNA] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async beNextHero(req: Request, res: Response) {
    try {
      const { inputData } = req.body;
      if (!inputData) {
        return res.status(400).json({ error: "Missing required parameter: inputData" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getBeNextHero(inputData, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[beNextHero] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async lookFinder(req: Request, res: Response) {
    try {
      const { styleProfile } = req.body;
      if (!styleProfile) {
        return res.status(400).json({ error: "Missing required parameter: styleProfile" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getLookFinder(styleProfile, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[lookFinder] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async procurement(req: Request, res: Response) {
    try {
      const { name, brand, certifications, cost, retail, budget, prefBrands, marginGoal } = req.body;
      if (!name || !brand || !certifications || cost === undefined || retail === undefined || budget === undefined || !prefBrands || marginGoal === undefined) {
        return res.status(400).json({ error: "Missing required parameters for procurement evaluation" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getProcurementAnalysis({
        name, brand, certifications, cost, retail, budget, prefBrands, marginGoal
      }, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[procurement] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async behavioralExam(req: Request, res: Response) {
    try {
      const { scenario, language, response } = req.body;
      if (!scenario || !language || !response) {
        return res.status(400).json({ error: "Missing required parameters for staff exam assessment" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.evaluateBehavioralExam({ scenario, language, response }, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[behavioralExam] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async analyzeSelfie(req: Request, res: Response) {
    try {
      const { image, mimeType, filename, clientAnalysis } = req.body;
      if (!image || !mimeType) {
        return res.status(400).json({ error: "Missing required parameters: image and mimeType" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.analyzeSelfie(image, mimeType, filename, clientAnalysis, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[analyzeSelfie] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async pricingForecast(req: Request, res: Response) {
    try {
      const { peakSurge, offPeakDiscount } = req.body;
      if (peakSurge === undefined || offPeakDiscount === undefined) {
        return res.status(400).json({ error: "Missing required parameters: peakSurge and offPeakDiscount" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getPricingForecast(Number(peakSurge), Number(offPeakDiscount), activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[pricingForecast] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async generateShareMessage(req: Request, res: Response) {
    try {
      const { customerName, serviceName, stylistName, salonName, date, timeSlot, finalPrice } = req.body;
      if (!customerName || !serviceName || !stylistName || !salonName || !date || !timeSlot || finalPrice === undefined) {
        return res.status(400).json({ error: "Missing required booking details for share message generation" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getShareMessage({
        customerName,
        serviceName,
        stylistName,
        salonName,
        date,
        timeSlot,
        finalPrice: Number(finalPrice)
      }, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[generateShareMessage] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async belsomeScore(req: Request, res: Response) {
    try {
      const { salonName, procurementQuality, staffExamScores, bookingCompletionRate, customerRating } = req.body;
      if (!salonName || procurementQuality === undefined || staffExamScores === undefined || bookingCompletionRate === undefined || customerRating === undefined) {
        return res.status(400).json({ error: "Missing required parameters for BELSOME score calculation" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getBelsomeScore({
        salonName,
        procurementQuality: Number(procurementQuality),
        staffExamScores: Number(staffExamScores),
        bookingCompletionRate: Number(bookingCompletionRate),
        customerRating: Number(customerRating)
      }, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[belsomeScore] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async weddingPlanner(req: Request, res: Response) {
    try {
      const { date, familyCount, ceremonyType } = req.body;
      if (!date || familyCount === undefined || !ceremonyType) {
        return res.status(400).json({ error: "Missing required parameters for wedding day planning" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.getWeddingPlanner({
        date,
        familyCount: Number(familyCount),
        ceremonyType
      }, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[weddingPlanner] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }

  static async priceReasoning(req: Request, res: Response) {
    try {
      const { salonId, serviceId, date, timeSlot, originalPrice, finalPrice } = req.body;
      if (!salonId || !serviceId || !date || !timeSlot || originalPrice === undefined || finalPrice === undefined) {
        return res.status(400).json({ error: "Missing required price reasoning parameters" });
      }
      const activeCity = AIController.getActiveCity(req);
      const data = await AIService.generatePriceReasoning({
        salonId,
        serviceId,
        date,
        timeSlot,
        originalPrice: Number(originalPrice),
        finalPrice: Number(finalPrice)
      }, activeCity);
      return res.json(data);
    } catch (error: any) {
      console.error("[priceReasoning] AI error:", error?.message);
      return res.status(500).json({
        error: error?.message ?? "AI service unavailable. Check your GEMINI_API_KEY in backend/.env"
      });
    }
  }
}
