import { Request, Response } from "express";
import { AIService } from "../services/ai.service";

export class AIController {

  static async concierge(req: Request, res: Response) {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Missing required parameter: query" });
      }
      const data = await AIService.getGroomingConcierge(query);
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async styleDNA(req: Request, res: Response) {
    try {
      const { stylePref, hairLength, colorOpen, occasion, lifestyle } = req.body;
      if (!stylePref || !hairLength || !colorOpen || !occasion || !lifestyle) {
        return res.status(400).json({ error: "Missing required style DNA parameters" });
      }
      const data = await AIService.getStyleDNA({ stylePref, hairLength, colorOpen, occasion, lifestyle });
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async beNextHero(req: Request, res: Response) {
    try {
      const { inputData } = req.body;
      if (!inputData) {
        return res.status(400).json({ error: "Missing required parameter: inputData" });
      }
      const data = await AIService.getBeNextHero(inputData);
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async lookFinder(req: Request, res: Response) {
    try {
      const { styleProfile } = req.body;
      if (!styleProfile) {
        return res.status(400).json({ error: "Missing required parameter: styleProfile" });
      }
      const data = await AIService.getLookFinder(styleProfile);
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async procurement(req: Request, res: Response) {
    try {
      const { name, brand, certifications, cost, retail, budget, prefBrands, marginGoal } = req.body;
      if (!name || !brand || !certifications || cost === undefined || retail === undefined || budget === undefined || !prefBrands || marginGoal === undefined) {
        return res.status(400).json({ error: "Missing required parameters for procurement evaluation" });
      }
      const data = await AIService.getProcurementAnalysis({
        name, brand, certifications, cost, retail, budget, prefBrands, marginGoal
      });
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async behavioralExam(req: Request, res: Response) {
    try {
      const { scenario, language, response } = req.body;
      if (!scenario || !language || !response) {
        return res.status(400).json({ error: "Missing required parameters for staff exam assessment" });
      }
      const data = await AIService.evaluateBehavioralExam({ scenario, language, response });
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
