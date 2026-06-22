import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../db/supabaseClient";
import * as dotenv from "dotenv";
import * as prompts from "../prompts";

dotenv.config();

// Gemini is now the PRIMARY engine (free tier)
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

if (gemini) {
  console.log("✅ Gemini API ready (primary AI engine)");
} else {
  console.warn("⚠️  No API keys found — using mock fallback.");
}

async function executeLLM(prompt: string, fallbackMock: () => any): Promise<any> {
  // ── Gemini path (primary, free) ──
  if (gemini) {
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" }, { timeout: 8000 });
      const result = await model.generateContent(
        prompt + "\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no backticks, no extra text."
      );
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/gi, "").trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      console.warn("⚠️ Gemini API call failed, using fallback:", err.message || err);
      return fallbackMock();
    }
  }

  // ── No keys — use mock ──
  return fallbackMock();
}

async function executeLLMVision(
  prompt: string,
  imagePart: { inlineData: { data: string; mimeType: string } },
  fallbackMock: () => any
): Promise<any> {
  if (gemini) {
    try {
      // ✅ FIX 1: Use gemini-2.5-flash (latest, free, better vision support)
      const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" }, { timeout: 8000 });

      // ✅ FIX 2: Clean base64 BEFORE building the part
      let { data, mimeType } = imagePart.inlineData;
      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        data = matches[2];
      }

      const cleanImagePart = {
        inlineData: { data, mimeType }
      };

      const result = await model.generateContent([
        {
          text: prompt + "\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no backticks, no extra text."
        },
        cleanImagePart  // ✅ FIX 3: Pass as separate content part
      ]);

      const text = result.response.text();
      const cleaned = text.replace(/```json|```/gi, "").trim();
      return JSON.parse(cleaned);

    } catch (err: any) {
      console.error("❌ Gemini Vision error:", err.message || err);
      return fallbackMock();
    }
  }

  // ── No keys — use mock ──
  return fallbackMock();
}


const CITY_STYLISTS: Record<string, { stylist1: string, stylist2: string, stylist3: string }> = {
  Hyderabad: { stylist1: "Vikram Malhotra", stylist2: "Priya Rao", stylist3: "Suresh K." },
  Bangalore: { stylist1: "Arjun Reddy", stylist2: "Kavya Nair", stylist3: "Rohan Sen" },
  Mumbai: { stylist1: "Sameer Khan", stylist2: "Aisha Patel", stylist3: "Kabir Mehta" },
  Delhi: { stylist1: "Rahul Sharma", stylist2: "Neha Kapoor", stylist3: "Amit Singh" },
};

export class AIService {
  
  /**
   * Helper to perform chat completions using Gemini.
   */
  private static async executeLLM(prompt: string, fallbackMock: () => any): Promise<any> {
    return executeLLM(prompt, fallbackMock);
  }

  /**
   * Helper to perform multimodal vision completions using Gemini.
   */
  private static async executeLLMVision(
    prompt: string,
    imagePart: { inlineData: { data: string; mimeType: string } },
    fallbackMock: () => any
  ): Promise<any> {
    return executeLLMVision(prompt, imagePart, fallbackMock);
  }

  // 1. AI Grooming Concierge
  static async getGroomingConcierge(query: string, history?: any[], activeCity: string = "Hyderabad"): Promise<any> {
    const historyText = (history || [])
      .map((h: any) => `${h.role === 'user' ? 'Customer' : 'You'}: ${h.text}`)
      .join('\n');
    const prompt = prompts.CONCIERGE_PROMPT
      .replace("{history}", historyText || "None")
      .replace("{query}", query)
      .replace(/Hyderabad/g, activeCity);
    return this.executeLLM(prompt, () => {
      const q = query.toLowerCase();
      let hair = "Classic Taper Fade";
      let beard = "Short Boxed Beard";
      let service = ["Signature Haircut & Consultation", "Beard Trim & Grooming"];
      let price = "₹750 - ₹1,200";
      let reply = `Based on your request, we have curated a custom grooming recommendation. We suggest styles that offer a clean silhouette, balancing low maintenance with elegance.`;

      if (q.includes("round")) {
        hair = "Textured Quiff with High Skin Fade";
        beard = "Pointed Van Dyke Beard / Anchored Goatee";
        service = ["Volume Boost Styling", "Beard Contouring", "Glow Charcoal Facial"];
        price = "₹1,200 - ₹1,800";
        reply = `Since you mentioned a round face shape, our goal is to add vertical height and define your jaw. A high-top quiff creates structural elevation, while a pointed beard elongates the chin.`;
      } else if (q.includes("square")) {
        hair = "Soft Side-Parting with Textured Taper";
        beard = "Light 3-Day Shadow Stubble";
        service = ["Executive Scissor Cut", "Royal Hot Towel Shave"];
        price = "₹900 - ₹1,400";
        reply = `For a square face, we want to soften the strong bone structures while keeping the look clean. A soft part and stubble highlight your jawline without looking overly blocky.`;
      } else if (q.includes("heart")) {
        hair = "Classic Pompadour with Mid Drop Fade";
        beard = "Full Classic Groomed Beard";
        service = ["Signature Fade", "Full Beard Hydration treatment"];
        price = "₹1,100 - ₹1,650";
        reply = `A heart-shaped face benefits from adding volume around the lower jaw to balance a wider forehead. A classic pompadour paired with a well-groomed full beard is the perfect match.`;
      } else if (q.includes("oval") || q.includes("face")) {
        hair = "Premium Slicked Back Undercut";
        beard = "Clean Shaved / Light Stubble";
        service = ["Luxury Hair Sculpting", "Charcoal De-Tan Facial"];
        price = "₹1,100 - ₹1,600";
        reply = `An oval face is highly versatile and fits almost any style. A slicked-back undercut highlights your symmetry, paired with a facial mask to keep skin glowing.`;
      } else if (q.includes("curly") || q.includes("wavy")) {
        hair = "Messy Wavy Crop with Drop Fade";
        beard = "Clean Lined stubble";
        service = ["Curly Hair De-Frizz treatment", "Scalp Conditioning Spa"];
        price = "₹1,300 - ₹2,100";
        reply = `To style curly or wavy locks, we recommend enhancing natural volume while controlling frizz. Our deep nourishing curl spa hydrates the hair follicles to keep curls defined.`;
      } else if (q.includes("dry") || q.includes("frizz")) {
        hair = "Natural Matte Volume Crop";
        beard = "Hydrated Beard Trim & Beard Oil treatment";
        service = ["Deep Moisture Scalp Spa", "Argan Rejuvenation Therapy"];
        price = "₹1,400 - ₹2,200";
        reply = `Dry or frizzy hair needs intense moisture replacement. We suggest our Argan hydration therapy and scalp spa which repairs cuticles and leaves a soft, glossy finish.`;
      } else if (q.includes("oily") || q.includes("dandruff")) {
        hair = "Sleek Textured Crop";
        beard = "Clean Razor Shave";
        service = ["Tea Tree Anti-Dandruff Treatment", "Scalp Detoxification Therapy"];
        price = "₹1,000 - ₹1,500";
        reply = `For oily scalp or dandruff concerns, we target sebum regulation. Our Tea Tree scalp detox clears dry flakes, unclogs follicles, and controls excessive oil output.`;
      } else if (q.includes("grey") || q.includes("color") || q.includes("white")) {
        hair = "Executive Pomade Grooming";
        beard = "Silver Fox Stubble";
        service = ["Premium Grey Coverage Color", "Beard Highlights / Tinting"];
        price = "₹1,800 - ₹3,200";
        reply = `To cover greys or customize your shade, we suggest a natural dye treatment. Our organic paraben-free pigments blend seamlessly for an elegant grey coverage.`;
      } else if (q.includes("acne") || q.includes("pimple") || q.includes("skin") || q.includes("facial")) {
        hair = "Classic Ivy League Cut";
        beard = "Clean Soft Shaved";
        service = ["Soothing Aloe & Tea Tree Facial", "Neem Skin Clarification Mask"];
        price = "₹1,200 - ₹2,000";
        reply = `To address sensitive, acne-prone skin, we steer clear of heavy chemicals. BELSOME suggests our natural aloe & neem skin clarification treatment to soothe inflammation.`;
      } else if (q.includes("wedding") || q.includes("groom") || q.includes("marriage") || q.includes("event")) {
        hair = "Royal Side Part with Pomade";
        beard = "Sharp Beard Contouring & Hot Towel Treatment";
        service = ["Groom's Special Makeover Pack", "Hair Spa & Scalp Detox"];
        price = "₹2,500 - ₹4,500";
        reply = `Preparing for a wedding or gala event? We suggest a clean dapper side-part styled with a high-shine pomade and a hot towel treatment for that picture-perfect wedding day look.`;
      } else if (q.includes("meeting") || q.includes("office") || q.includes("corporate")) {
        hair = "Executive Short Crop";
        beard = "Ultra-Clean Corporate Stubble";
        service = ["Executive Express Grooming", "Quick Beard Styling"];
        price = "₹600 - ₹950";
        reply = `For professional office spaces, we prioritize sharp, low-maintenance shapes. An executive short crop and clean stubble keep you looking dapper and polished for boardroom presentations.`;
      }

      return {
        reply: `Hello! Based on your query "${query}", we have curated a custom premium profile for you. We suggest styles that look professional yet modern, fitting ${activeCity}'s style scene.`,
        hairstyle: hair,
        beard: beard,
        color: "Natural Matte Black Highlights",
        services: service,
        cost: price,
        stylistMatch: "Senior Stylist (Specialist in Face Profiling)"
      };
    });
  }

  // 2. Style DNA Quiz
  static async getStyleDNA(answers: {
    stylePref: string;
    hairLength: string;
    colorOpen: string;
    occasion: string;
    lifestyle: string;
  }, activeCity: string = "Hyderabad"): Promise<any> {
    const stylistsInfo = CITY_STYLISTS[activeCity] || CITY_STYLISTS["Hyderabad"];
    const prompt = prompts.STYLE_DNA_PROMPT
      .replace("{stylePref}", answers.stylePref)
      .replace("{hairLength}", answers.hairLength)
      .replace("{colorOpen}", answers.colorOpen)
      .replace("{occasion}", answers.occasion)
      .replace("{lifestyle}", answers.lifestyle)
      .replace(/Hyderabad/g, activeCity)
      .replace(/Vikram Malhotra/g, stylistsInfo.stylist1)
      .replace(/Priya Rao/g, stylistsInfo.stylist2)
      .replace(/Suresh K\./g, stylistsInfo.stylist3);

    return this.executeLLM(prompt, () => {
      const pref = answers.stylePref.toLowerCase();
      const length = answers.hairLength.toLowerCase();
      const color = answers.colorOpen.toLowerCase();
      const lifestyle = answers.lifestyle.toLowerCase();
      const occasion = answers.occasion.toLowerCase();

      let profileName = "Professional";
      let tagline = "Refined, clean-cut, and authoritative.";
      let description = "You prioritize a polished look that commands respect in corporate meetings and formal social circles.";

      if (pref.includes("trend") || pref.includes("street")) {
        profileName = "Trendy";
        tagline = "Bold, modern, and fashion-forward.";
        description = "You stay ahead of the styling curve, loving texture, structure, and a streetwear-infused aesthetic.";
      } else if (pref.includes("glam") || pref.includes("celeb")) {
        profileName = "Celebrity Inspired";
        tagline = "High impact, red-carpet ready.";
        description = "You love styled volume, sharp outlines, and celebrity-grade textures that make heads turn.";
      } else if (pref.includes("natur") || pref.includes("easy")) {
        profileName = "Natural";
        tagline = "Effortless, clean, and low maintenance.";
        description = "You prefer subtle styling that enhances your natural hair texture and skin flow without constant product dependency.";
      }

      // 1. Vikram Malhotra
      let scoreVikram = 70;
      let reasonVikram = "Specializes in tailored executive styling and clean fades.";
      if (pref.includes("corporate") || pref.includes("sleek")) {
        scoreVikram += 15;
        reasonVikram = "His expertise in executive styling aligns perfectly with your sleek corporate preference.";
      } else if (pref.includes("natur") || pref.includes("easy")) {
        scoreVikram += 10;
        reasonVikram = "Highly rated for clean, low-maintenance cuts matching your natural styling goals.";
      } else if (pref.includes("trend") || pref.includes("street")) {
        scoreVikram += 5;
        reasonVikram = "His precision work is excellent for structured cuts and clean fades.";
      }
      
      if (length.includes("buzz") || length.includes("fade")) scoreVikram += 10;
      else if (length.includes("short")) scoreVikram += 8;
      else if (length.includes("medium")) scoreVikram += 5;
      else if (length.includes("long")) scoreVikram -= 5;

      if (color.includes("natural") || color.includes("dark")) scoreVikram += 5;
      else if (color.includes("grey") || color.includes("coverage")) scoreVikram += 5;
      else if (color.includes("subtle") || color.includes("highlight")) scoreVikram += 2;
      else if (color.includes("bold") || color.includes("bleach")) scoreVikram -= 5;

      if (lifestyle.includes("desk") || lifestyle.includes("executive")) scoreVikram += 5;
      if (lifestyle.includes("active") || lifestyle.includes("athlete")) scoreVikram += 5;

      if (occasion.includes("meeting") || occasion.includes("professional")) scoreVikram += 5;
      if (occasion.includes("daily") || occasion.includes("vibe")) scoreVikram += 3;

      scoreVikram = Math.max(50, Math.min(99, scoreVikram));

      // 2. Priya Rao
      let scorePriya = 70;
      let reasonPriya = "Acclaimed expert in modern fashion trends and volume textures.";
      if (pref.includes("glam") || pref.includes("celeb")) {
        scorePriya += 15;
        reasonPriya = "Her background in celebrity grooming perfectly matches your high-glam aspirations.";
      } else if (pref.includes("trend") || pref.includes("street")) {
        scorePriya += 12;
        reasonPriya = "Her expertise in runway styling matches your bold, trendsetting preference.";
      } else if (pref.includes("corporate") || pref.includes("sleek")) {
        scorePriya += 5;
        reasonPriya = "Great at creating clean, dapper looks for corporate events and professional shoots.";
      } else if (pref.includes("natur") || pref.includes("easy")) {
        scorePriya -= 5;
        reasonPriya = "Provides modern cuts, though she typically focuses on high-impact styles.";
      }

      if (length.includes("medium")) scorePriya += 8;
      else if (length.includes("long")) scorePriya += 8;
      else if (length.includes("short")) scorePriya += 5;

      if (color.includes("bold") || color.includes("bleach")) {
        scorePriya += 10;
        reasonPriya = "As a certified L'Oreal Color Expert, she is the ultimate choice for your bold color choice.";
      } else if (color.includes("subtle") || color.includes("highlight")) {
        scorePriya += 8;
        reasonPriya = "Specializes in tailored highlights and balayage matching your style preferences.";
      } else if (color.includes("natural") || color.includes("dark")) scorePriya -= 5;

      if (lifestyle.includes("social") || lifestyle.includes("pr")) scorePriya += 5;
      if (lifestyle.includes("creative") || lifestyle.includes("freelance")) scorePriya += 5;

      if (occasion.includes("wedding") || occasion.includes("festive")) scorePriya += 8;
      if (occasion.includes("night") || occasion.includes("club")) scorePriya += 6;

      scorePriya = Math.max(50, Math.min(99, scorePriya));

      // 3. Suresh K.
      let scoreSuresh = 65;
      let reasonSuresh = "Top rated for organic styling and low-maintenance textures.";
      if (pref.includes("natur") || pref.includes("easy")) {
        scoreSuresh += 18;
        reasonSuresh = "His organic approach and Ayurvedic treatments align with your natural grooming preferences.";
      } else if (pref.includes("corporate") || pref.includes("sleek")) {
        scoreSuresh += 5;
        reasonSuresh = "Excellent for neat, classic shapes and soothing executive treatments.";
      } else if (pref.includes("trend") || pref.includes("street")) {
        scoreSuresh -= 5;
        reasonSuresh = "Prefers organic flow, but can deliver clean textures for casual daily wear.";
      } else if (pref.includes("glam") || pref.includes("celeb")) {
        scoreSuresh -= 10;
        reasonSuresh = "Best suited for natural, effortless styling rather than high-glam structures.";
      }

      if (length.includes("long")) scoreSuresh += 10;
      else if (length.includes("medium")) scoreSuresh += 6;
      else if (length.includes("short")) scoreSuresh += 4;
      else if (length.includes("buzz") || length.includes("fade")) scoreSuresh -= 2;

      if (color.includes("grey") || color.includes("coverage")) {
        scoreSuresh += 10;
        reasonSuresh = "His gentle organic grey coverage treatments are ideal for hair health.";
      } else if (color.includes("natural") || color.includes("dark")) {
        scoreSuresh += 8;
        reasonSuresh = "Strong proponent of chemical-free care to keep natural hair dark and strong.";
      } else if (color.includes("subtle") || color.includes("highlight")) {
        scoreSuresh += 2;
      } else if (color.includes("bold") || color.includes("bleach")) {
        scoreSuresh -= 10;
      }

      if (lifestyle.includes("creative") || lifestyle.includes("freelance")) scoreSuresh += 5;
      if (lifestyle.includes("active") || lifestyle.includes("athlete")) scoreSuresh += 5;
      if (lifestyle.includes("desk") || lifestyle.includes("executive")) scoreSuresh += 2;

      if (occasion.includes("daily") || occasion.includes("vibe")) scoreSuresh += 8;
      if (occasion.includes("meeting") || occasion.includes("professional")) scoreSuresh += 4;

      scoreSuresh = Math.max(50, Math.min(99, scoreSuresh));

      // Resolve ties so it looks neat
      if (scoreVikram === scorePriya) scoreVikram += 1;
      if (scoreVikram === scoreSuresh) scoreVikram += 1;
      if (scorePriya === scoreSuresh) scorePriya += 1;

      const stylistsInfo = CITY_STYLISTS[activeCity] || CITY_STYLISTS["Hyderabad"];
      const matches = [
        { name: stylistsInfo.stylist1, specialty: "Master Hair Sculptor & Fade Specialist", matchPercentage: scoreVikram, reasoning: reasonVikram },
        { name: stylistsInfo.stylist2, specialty: "Celebrity Groomer & Hair Colorist", matchPercentage: scorePriya, reasoning: reasonPriya },
        { name: stylistsInfo.stylist3, specialty: "Natural Wave Artist & Spa Therapy Specialist", matchPercentage: scoreSuresh, reasoning: reasonSuresh }
      ];

      // Sort by matchPercentage descending
      matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

      return {
        profileName,
        tagline,
        description,
        hairSuggestion: "Textured Crop with a High Skin Fade",
        beardSuggestion: "Meticulously Groomed Medium Stubble",
        colorSuggestion: "Subtle Sun-Kissed Ash Brown highlights to add depth",
        matchReasoning: `Your preference for ${answers.stylePref} styling and a ${answers.lifestyle} lifestyle aligns perfectly with a ${profileName} profile. This balance offers low maintenance during weekdays while remaining striking during ${answers.occasion} occasions.`,
        stylistMatches: matches
      };
    });
  }

  // 3. Be Next Hero / Style Extractor
  static async getBeNextHero(inputData: string, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.BE_NEXT_HERO_PROMPT
      .replace("{inputData}", inputData)
      .replace(/Hyderabad/g, activeCity);
    return this.executeLLM(prompt, () => {
      const inp = inputData.toLowerCase();
      let celeb = "Ranbir Kapoor";
      let hair = "Textured Volume Crop with Drop Fade";
      let beard = "Perfectly Lined Heavy Stubble";
      let confidence = 94;
      let face = "Square / Strong Jawline";
      let skin = "Warm Golden Tan";
      let acc = ["Black Matte Aviators (Zara)", "Sleek Stainless Chain (H&M)"];
      let servicesList = ["Signature Razor Fade", "Beard Sculpting", "Deep Conditioning Oil Spa"];

      if (inp.includes("allu") || inp.includes("pushpa") || inp.includes("telugu") || inp.includes("tollywood")) {
        celeb = "Allu Arjun";
        hair = "Messy Flow Groomed Waves with Temp Fade";
        beard = "Dense Groomed Beard";
        confidence = 98;
        face = "Round / Soft Jawline";
        skin = "Warm Golden Tan";
        acc = ["Gold Hexagon Sunglasses (Zara)", "Silver Band Bracelet (H&M)"];
        servicesList = ["Messy Flow Scissors Trim", "Deep Nourishing Beard Massage", "Gold Skin Radiance Treatment"];
      } else if (inp.includes("kohli") || inp.includes("cricket") || inp.includes("sports") || inp.includes("virat")) {
        celeb = "Virat Kohli";
        hair = "Spiky Quiff with Razor Line Disconnect";
        beard = "Thick Contoured Beard";
        confidence = 96;
        face = "Square / Chiseled jaw";
        skin = "Warm Golden Tan";
        acc = ["Black Matte Aviators (Zara)", "Sports Chrono Watch (H&M)"];
        servicesList = ["Premium Spiky Fade", "Beard Sculpting & Hydration", "Hair Spa"];
      } else if (inp.includes("ranveer") || inp.includes("eccentric") || inp.includes("long")) {
        celeb = "Ranveer Singh";
        hair = "Slicked Back Long Undercut Pony";
        beard = "Imperial Beard and Mustache";
        confidence = 92;
        face = "Oval / Distinct Cheeks";
        skin = "Warm Golden Tan";
        acc = ["Designer Rounded Sunglasses (Zara)", "Emerald Lapel Pin (H&M)"];
        servicesList = ["Long Hair Styling & Trim", "Beard Styling & Mustache Wax", "Hair Gloss Treatment"];
      } else if (inp.includes("shahrukh") || inp.includes("srk") || inp.includes("khan") || inp.includes("romance")) {
        celeb = "Shah Rukh Khan";
        hair = "Messy Shaggy Flow with Classic Taper";
        beard = "Clean Lined Stubble";
        confidence = 97;
        face = "Heart / Sharp Chin";
        skin = "Fair / Warm Tone";
        acc = ["Classic Black Wayfarers (Zara)", "Platinum Wristwatch (H&M)"];
        servicesList = ["Classic Scissors Cut", "Hot Towel Shave & Scrub", "Luxury De-Tan Spa"];
      } else if (inp.includes("timoth") || inp.includes("chalamet") || inp.includes("hollywood") || inp.includes("indie")) {
        celeb = "Timothée Chalamet";
        hair = "Messy Curled French Crop";
        beard = "Clean Shaven";
        confidence = 95;
        face = "Square / Angular Jaw";
        skin = "Fair Pale Tone";
        acc = ["Minimal Silver Earring (H&M)", "Retro Acetate Frames (Zara)"];
        servicesList = ["Volume Curl Texturizing", "Organic Hydrating Facial", "Scalp Spa"];
      } else {
        // Dynamic fallback for any typed query
        const cleanName = inputData.replace(/http[s]?:\/\/[^\s]+/, "").trim();
        if (cleanName.length > 2) {
          celeb = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        }
        confidence = 85 + (celeb.length % 15);
      }

      return {
        celebrityMatch: celeb,
        matchConfidence: confidence,
        hairstyle: hair,
        beard: beard,
        hairColor: "Deep Espresso Dark Highlights",
        faceShape: face,
        skinTone: skin,
        accessories: acc,
        services: servicesList,
        duration: "75 mins",
        cost: "₹1,800 - ₹2,800"
      };
    });
  }

  // 4. Full Look Finder
  static async getLookFinder(styleProfile: string, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.LOOK_FINDER_PROMPT
      .replace("{styleProfile}", styleProfile)
      .replace(/Hyderabad/g, activeCity);
    return this.executeLLM(prompt, () => {
      const p = styleProfile.toLowerCase();
      let outfit = "Sleek Corporate Noir";
      let shirt = "Premium Fitted Charcoal Oxford Shirt (Zara)";
      let trousers = "Slim-Fit Ankle-Length Chinos (Uniqlo)";
      let shoes = "Loafers in Dark Suede Brown (Zara)";
      let watch = "Minimalist Silver Chronograph with Dark Dial (H&M)";
      let acc = ["Leather Belt (Zara)", "Signature Sandalwood cologne note"];

      if (p.includes("trendy") || p.includes("street") || p.includes("allu arjun") || p.includes("messy flow")) {
        outfit = `${activeCity} Street Vibe`;
        shirt = "Oversized Printed Cuban Collar Shirt (H&M)";
        trousers = "Relaxed-Fit Pleated Cargo Trousers (Zara)";
        shoes = "Vibe Chunky Retro Trainers (Zara)";
        watch = "Sporty Matte Black Smartwatch with Neon Accents (Uniqlo)";
        acc = ["Metallic Chain Link Bracelet (Zara)", "Citrus-Bergamot Summer Fragrance"];
      } else if (p.includes("celebrity") || p.includes("glam") || p.includes("wedding") || p.includes("ranveer singh") || p.includes("shah rukh")) {
        outfit = "Modern Indo-Western Fusion";
        shirt = "Asymmetric Raw Silk Bandhgala Kurta (Manyavar)";
        trousers = "Tapered Draped Jodhpuri Trousers (Manyavar)";
        shoes = "Handcrafted Leather Juttis in Black Patent Gold (Manyavar)";
        watch = "Luxury Gold Bezel Watch with Crocodile Leather Strap (Zara)";
        acc = ["Emerald Styled Brooch (Manyavar)", "Premium Oudh & Amber Cologne"];
      } else if (p.includes("virat kohli") || p.includes("spiky quiff")) {
        outfit = "Athletique Premium Casual";
        shirt = "Fitted Bomber Jacket & Premium Knit Tee (Zara)";
        trousers = "Tapered Cotton Jogger Pants (Uniqlo)";
        shoes = "Clean White Luxe Sneakers (Zara)";
        watch = "Rugged Chrono Watch (H&M)";
        acc = ["Sleek Shield Sunglasses (Zara)", "Fresh Sporty Fragrance"];
      } else if (p.includes("timoth") || p.includes("french crop")) {
        outfit = "Parisian Indie Smart";
        shirt = "Oversized French Linen Knit Crewneck (Uniqlo)";
        trousers = "Relaxed Cropped Pleated Trousers (Zara)";
        shoes = "Retro High-Top Leather Boots (H&M)";
        watch = "Vintage Tank Gold Case Watch (Zara)";
        acc = ["Silk Patterned Scarf (Zara)", "Amber Vetiver Wood Cologne"];
      }

      return {
        outfitType: outfit,
        shirt,
        trousers,
        shoes,
        watch,
        accessories: acc,
        styleTips: [
          "Keep the shirt rolled slightly at the forearms to draw attention to your wrist accessory.",
          "Match the color depth of your footwear with your belt to lock in a premium silhouette."
        ]
      };
    });
  }

  // 5. AI Procurement Agent
  static async getProcurementAnalysis(params: {
    name: string;
    brand: string;
    certifications: string;
    cost: number;
    retail: number;
    budget: number;
    prefBrands: string;
    marginGoal: number;
  }, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.PROCUREMENT_PROMPT
      .replace("{name}", params.name)
      .replace("{brand}", params.brand)
      .replace("{certifications}", params.certifications)
      .replace("{cost}", String(params.cost))
      .replace("{retail}", String(params.retail))
      .replace("{budget}", String(params.budget))
      .replace("{prefBrands}", params.prefBrands)
      .replace("{marginGoal}", String(params.marginGoal))
      .replace(/Hyderabad/g, activeCity);

    return this.executeLLM(prompt, () => {
      // Calculate margins
      const profit = params.retail - params.cost;
      const margin = (profit / params.retail) * 100;
      
      let score = 85;
      let status = "REVIEW";
      let safetyCert = "Standard Safety Inspected";
      let explanation = "This product offers adequate margins, but requires a formal review of its chemical composition list before automated bulk procurement can execute.";

      const certs = params.certifications.toLowerCase();
      const hasGreenCerts = certs.includes("organic") || certs.includes("vegan") || certs.includes("toxin") || certs.includes("paraben-free");

      if (margin >= params.marginGoal && hasGreenCerts) {
        score = 94;
        status = "ACCEPT";
        safetyCert = "Organic, Paraben-Free Certified Clean Beauty";
        explanation = "Excellent profit margins exceeding the target goals, paired with eco-conscious certifications. Automated acceptance approved for instant stock listing.";
      } else if (margin < 30 || params.cost > params.budget) {
        score = 35;
        status = "REJECT";
        safetyCert = "Lacks certified natural ingredients or organic verification";
        explanation = "The product does not meet the salon owner's target profitability requirements, and pricing represents a risk for the allocated seasonal inventory budget.";
      }

      return {
        score,
        status,
        marginAnalysis: `Profit Margin: ${margin.toFixed(1)}% (Profit: ₹${profit} per unit). Owner target is ${params.marginGoal}%.`,
        safetyCert,
        stockRecommendation: status === "ACCEPT" ? "Bulk Order: 150 units" : status === "REVIEW" ? "Sample Order: 15 units" : "Do not order",
        explanation
      };
    });
  }

  // 6. AI Staff Behavioral Exam
  static async evaluateBehavioralExam(params: {
    scenario: string;
    language: string;
    response: string;
  }, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.BEHAVIORAL_EXAM_PROMPT
      .replace("{scenario}", params.scenario)
      .replace("{language}", params.language)
      .replace("{response}", params.response)
      .replace(/Hyderabad/g, activeCity);

    return this.executeLLM(prompt, () => {
      const resp = params.response.toLowerCase();
      let score = 72;
      let status = "TRAIN";
      let emp = "Acknowledged complaint but moved slightly too fast to details.";
      let tone = "Courteous, but lacked warmth in Telugu/Hindi phrasing.";
      let resolution = "Proposed standard refund; failed to offer secondary compensation.";
      let upsell = "No upselling or retention hook attempted.";

      if (resp.includes("sorry") || resp.includes("apologize") || resp.includes("maaf") || resp.includes("kshaminchandi")) {
        score += 10;
      }
      if (resp.includes("free") || resp.includes("discount") || resp.includes("complimentary") || resp.includes("gift")) {
        score += 12;
        resolution = "Excellent. Offered immediate service correction along with a complimentary voucher.";
      }
      if (resp.includes("next time") || resp.includes("recommend") || resp.includes("try our")) {
        score += 6;
        upsell = "Successfully pivoted to introduce our VIP hair treatments for retention.";
      }

      if (score >= 85) {
        status = "HIRE";
      } else if (score < 50) {
        status = "REJECT";
      }

      return {
        overallScore: Math.min(score, 100),
        status,
        feedback: {
          empathy: resp.length > 50 ? "Candidate showed strong active listening and ownership of the salon's mistake." : "Brief response. Needs more emotional validation of client concerns.",
          tone: "Professional, clean, and respectful tone.",
          clarity: `Good command of language structure in ${params.language}.`,
          resolution,
          upsell
        },
        composureRating: score >= 80 ? "Exemplary Calmness" : score >= 60 ? "Stable under pressure" : "Impatient / Defensive",
        recommendedCourses: [
          "BELSOME Client Retention Secrets Course",
          "Advanced Verbal Crisis Management Training"
        ]
      };
    });
  }

  // 7. Selfie Face Shape Analysis
  static async analyzeSelfie(image: string, mimeType: string, filename?: string, clientAnalysis?: any, activeCity: string = "Hyderabad"): Promise<any> {
    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType
      }
    };
    
    // We clean the base64 string if it contains the data prefix
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let base64Data = image;
    let cleanMimeType = mimeType;
    if (matches && matches.length === 3) {
      cleanMimeType = matches[1];
      base64Data = matches[2];
      imagePart.inlineData.data = base64Data;
      imagePart.inlineData.mimeType = cleanMimeType;
    }

    return this.executeLLMVision(prompts.SELFIE_PROMPT.replace(/Hyderabad/g, activeCity), imagePart, () => {
      if (clientAnalysis) {
        return clientAnalysis;
      }

      const name = (filename || "oval-medium-pomp-stubble").toLowerCase();
      let faceShape: "oval" | "round" | "square" | "heart" = "oval";
      if (name.includes("round")) faceShape = "round";
      else if (name.includes("square")) faceShape = "square";
      else if (name.includes("heart")) faceShape = "heart";
      
      let skinTone = "#F5C29A";
      if (name.includes("fair")) skinTone = "#FCD5B5";
      else if (name.includes("tan") || name.includes("brown")) skinTone = "#E8B085";
      else if (name.includes("deep") || name.includes("dark")) skinTone = "#D09060";

      let hairStyleId = "classic-pomp";
      if (name.includes("buzz") || name.includes("crew") || name.includes("flat") || name.includes("crop")) {
        hairStyleId = "buzz-cut";
      } else if (name.includes("fade") || name.includes("taper")) {
        hairStyleId = "taper-fade";
      } else if (name.includes("quiff") || name.includes("spiky") || name.includes("hawk")) {
        hairStyleId = "textured-quiff";
      }

      let beardStyleId = "medium-stubble";
      if (name.includes("clean") || name.includes("shave")) {
        beardStyleId = "clean-shave";
      } else if (name.includes("full") || name.includes("beard")) {
        beardStyleId = "classic-full";
      }

      return {
        faceShape,
        skinTone,
        hairStyleId,
        beardStyleId,
        accessory: "none",
        hairColor: "#1A1A1A",
        confidence: 85
      };
    });
  }

  // 8. Dynamic Pricing Revenue Forecast & Recommendation
  static async getPricingForecast(peakSurge: number, offPeakDiscount: number, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.PRICING_FORECAST_PROMPT
      .replace("{peakSurge}", peakSurge.toString())
      .replace("{offPeakDiscount}", offPeakDiscount.toString())
      .replace(/Hyderabad/g, activeCity);

    return this.executeLLM(prompt, () => {
      const baseRevenue = 154000;
      
      // Peak surge attrition factor
      const attritionFactor = peakSurge > 25 ? Math.max(0.4, 1 - (peakSurge - 25) * 0.06) : 1;
      const surgeGains = Math.round(baseRevenue * 0.38 * (peakSurge / 100) * attritionFactor);

      // Off-peak volume uplift
      const volumeUpliftFactor = 1 + (offPeakDiscount * 0.018);
      const newOffPeakBookingsRatio = 0.20 * volumeUpliftFactor;
      const offPeakDiscountLoss = Math.round(baseRevenue * 0.20 * (offPeakDiscount / 100) * volumeUpliftFactor);
      const offPeakVolumeUplift = Math.round(baseRevenue * (newOffPeakBookingsRatio - 0.20));

      const netImpact = surgeGains - offPeakDiscountLoss + offPeakVolumeUplift;
      const projectedRevenue = baseRevenue + netImpact;

      let surgeStatus = "OPTIMAL";
      let offPeakStatus = "OPTIMAL";
      const recs: string[] = [];

      const premiumArea = activeCity === "Bangalore" ? "Indiranagar" :
                          activeCity === "Mumbai" ? "Bandra" :
                          activeCity === "Delhi" ? "Connaught Place" :
                          "Jubilee Hills";

      if (peakSurge > 25) {
        surgeStatus = "TOO_HIGH";
        recs.push(`At +${peakSurge}%, surge pricing is in the high-attrition zone. Premium clients in ${premiumArea} may perceive this as price-gouging, leading to a projected booking drop of ${Math.round((1 - attritionFactor) * 100)}%.`);
      } else if (peakSurge < 15) {
        surgeStatus = "TOO_LOW";
        recs.push(`A +${peakSurge}% peak surge is conservative. Weekend occupancy remains at 95%+, meaning you are leaving high-margin revenue on the table. We recommend raising this to at least +15%.`);
      } else {
        recs.push(`Your +${peakSurge}% peak hour surge factor is well-calibrated, maximizing weekend yield without triggering negative review sentiment.`);
      }

      if (offPeakDiscount > 25) {
        offPeakStatus = "TOO_HIGH";
        recs.push(`A -${offPeakDiscount}% off-peak discount leads to margin dilution. While it increases occupancy by ${Math.round((volumeUpliftFactor - 1) * 100)}%, the average ticket value drops too low to cover stylist overhead.`);
      } else if (offPeakDiscount < 15) {
        offPeakStatus = "TOO_LOW";
        recs.push(`Your -${offPeakDiscount}% off-peak discount is too low to incentivize mid-week bookings. Raise it to 15-20% to drive more volume during quiet hours.`);
      } else {
        recs.push(`Your -${offPeakDiscount}% off-peak discount rate is optimal, successfully shifting low-priority bookings to quiet weekdays.`);
      }

      return {
        projectedRevenue,
        surgeGains,
        offPeakDiscountLoss,
        offPeakVolumeUplift,
        netImpact,
        recommendationText: recs.join(" "),
        surgeStatus,
        offPeakStatus
      };
    });
  }

  // 9. Generate WhatsApp Sharing Message
  static async getShareMessage(bookingData: {
    customerName: string;
    serviceName: string;
    stylistName: string;
    salonName: string;
    date: string;
    timeSlot: string;
    finalPrice: number;
  }, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.SHARE_MESSAGE_PROMPT
      .replace("{customerName}", bookingData.customerName)
      .replace("{serviceName}", bookingData.serviceName)
      .replace("{stylistName}", bookingData.stylistName)
      .replace("{salonName}", bookingData.salonName)
      .replace("{date}", bookingData.date)
      .replace("{timeSlot}", bookingData.timeSlot)
      .replace("{finalPrice}", bookingData.finalPrice.toString())
      .replace(/Hyderabad/g, activeCity);

    return this.executeLLM(prompt, () => {
      const cleanName = bookingData.customerName.replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const referralCode = `${cleanName}${randomId}BELSOME`;
      const retentionHook = "Give ₹200, Get ₹200";

      const shareMessage = `Hey! ✂️ I just booked my next grooming session at *BELSOME (${bookingData.salonName})*! \n\nI'm getting a *${bookingData.serviceName}* styled by the expert *${bookingData.stylistName}* on ${bookingData.date} at ${bookingData.timeSlot}. \n\nWant to upgrade your look too? Use my referral code *${referralCode}* to get *₹200 off* your first booking! ✨ Let's glow up! 🤵🌟`;

      return {
        shareMessage,
        referralCode,
        retentionHook
      };
    });
  }

  // 10. AI BELSOME Trust Score
  static async getBelsomeScore(params: {
    salonName: string;
    procurementQuality: number;
    staffExamScores: number;
    bookingCompletionRate: number;
    customerRating: number;
  }, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.BELSOME_SCORE_PROMPT
      .replace("{salonName}", params.salonName)
      .replace("{procurementQuality}", String(params.procurementQuality))
      .replace("{staffExamScores}", String(params.staffExamScores))
      .replace("{bookingCompletionRate}", String(params.bookingCompletionRate))
      .replace("{customerRating}", String(params.customerRating))
      .replace(/Hyderabad/g, activeCity);

    return this.executeLLM(prompt, () => {
      // Calculate overall score using formula
      const rScore = params.customerRating * 20;
      const score = Math.round(
        (params.procurementQuality + params.staffExamScores + params.bookingCompletionRate + rScore) / 4
      );

      let level = "Accredited Premium";
      if (score >= 90) level = "Elite Trust";
      else if (score >= 80) level = "Gold Standard";
      else if (score < 65) level = "Development Needed";

      return {
        score,
        level,
        summary: `AI Audit for ${params.salonName} shows a trust rating of ${score}/100. Operational metrics indicate solid customer loyalty combined with high exam compliance across the styling team in ${activeCity}.`,
        breakdown: {
          procurement: {
            score: Math.round(params.procurementQuality),
            feedback: `Procurement quality is rated at ${Math.round(params.procurementQuality)}% due to consistent clean beauty audits and eco-friendly packaging selection.`
          },
          staff: {
            score: Math.round(params.staffExamScores),
            feedback: `Staff certification compliance stands at ${Math.round(params.staffExamScores)}% representing highly trained stylists passing the behavioral exams.`
          },
          bookings: {
            score: Math.round(params.bookingCompletionRate),
            feedback: `The booking completion rate of ${Math.round(params.bookingCompletionRate)}% showcases low cancellation rates and high punctuality.`
          },
          rating: {
            score: Math.round(rScore),
            feedback: `Customer satisfaction remains high at ${params.customerRating.toFixed(1)}/5.0, reflecting strong overall salon reputation.`
          }
        },
        recommendations: [
          `Audit remaining low-scoring procurement proposals to transition to 100% certified clean vendors.`,
          `Enroll team members in the BELSOME Client Retention Secrets course to bolster customer retention scores.`,
          `Introduce off-peak booking promotions during morning weekdays to maintain slot fulfillment and lift completion rates.`
        ]
      };
    });
  }

  // 11. AI Wedding Day Planner
  static async getWeddingPlanner(params: {
    date: string;
    familyCount: number;
    ceremonyType: string;
  }, activeCity: string = "Hyderabad"): Promise<any> {
    const prompt = prompts.WEDDING_PLANNER_PROMPT
      .replace("{date}", params.date)
      .replace("{familyCount}", String(params.familyCount))
      .replace("{ceremonyType}", params.ceremonyType)
      .replace(/Hyderabad/g, activeCity);

    const stylistsInfo = CITY_STYLISTS[activeCity] || CITY_STYLISTS["Hyderabad"];

    return this.executeLLM(prompt, () => {
      // Mock Fallback
      const family = Number(params.familyCount) || 3;
      const totalCost = 15000 + (family * 2500);
      const timeline = [
        { id: "evt-1", time: "07:30 AM", event: `Bride makeup preparation at BELSOME by ${stylistsInfo.stylist2}`, status: "Upcoming" },
        { id: "evt-2", time: "09:00 AM", event: `Bride hair styling and final touches by ${stylistsInfo.stylist2}`, status: "Upcoming" },
        { id: "evt-3", time: "10:00 AM", event: `Groom haircut & beard grooming by ${stylistsInfo.stylist1}`, status: "Upcoming" }
      ];

      for (let i = 1; i <= family; i++) {
        const time = `${10 + Math.floor(i / 2)}:${(i % 2) * 30 || "00"} AM`;
        const stylist = i % 2 === 0 ? stylistsInfo.stylist3 : stylistsInfo.stylist1;
        timeline.push({
          id: `evt-${3 + i}`,
          time,
          event: `Family Member ${i} styling & standard trim by ${stylist}`,
          status: "Upcoming"
        });
      }

      timeline.push({
        id: `evt-${4 + family}`,
        time: "12:30 PM",
        event: "Final coordinator walk-through and styling inspection",
        status: "Upcoming"
      });

      const assignments = [
        `Bride: Royal Bridal Makeover Pack by ${stylistsInfo.stylist2} - ₹15,000`,
        `Groom: Executive Styling & Hair Sculpting by ${stylistsInfo.stylist1} - ₹2,500`
      ];

      for (let i = 1; i <= family; i++) {
        const stylist = i % 2 === 0 ? stylistsInfo.stylist3 : stylistsInfo.stylist1;
        assignments.push(`Family Member ${i}: Standard Party Styling by ${stylist} - ₹2,500`);
      }

      return {
        timeline,
        assignments,
        roster: [stylistsInfo.stylist1, stylistsInfo.stylist2, stylistsInfo.stylist3],
        totalCost,
        b2bPitch: `AI Bridal Planner optimizes BELSOME salon inventory by cluster-assigning ${family} family guest slots alongside lead bride treatments, maximizing high-ticket booking margins by 42% on ${params.date}. Automated stylist load balancing reduces transition gaps to under 10 minutes.`
      };
    });
  }

  // 12. AI Price Reasoning
  static async generatePriceReasoning(params: {
    salonId: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    originalPrice: number;
    finalPrice: number;
  }, activeCity: string = "Hyderabad"): Promise<any> {
    // 1. Query salon surge/discount settings
    let peakSurge = 15;
    let offPeakDiscount = 20;
    let salonName = "BELSOME Signature Studio";

    try {
      const { data: salon, error: salonError } = await supabase
        .from("salons")
        .select("name, peak_surge, off_peak_discount")
        .eq("id", params.salonId)
        .maybeSingle();

      if (!salonError && salon) {
        salonName = salon.name;
        peakSurge = Number(salon.peak_surge) || 0;
        offPeakDiscount = Number(salon.off_peak_discount) || 0;
      }
    } catch (err) {
      console.warn("Failed to fetch salon info for price reasoning:", err);
    }

    // 2. Query booking density count for that slot
    let bookingCount = 0;
    try {
      const { data: appointments, error: apptsError } = await supabase
        .from("appointments")
        .select("id")
        .eq("salon_id", params.salonId)
        .eq("date", params.date)
        .eq("time_slot", params.timeSlot);

      if (!apptsError && appointments) {
        bookingCount = appointments.length;
      }
    } catch (err) {
      console.warn("Failed to fetch booking density for price reasoning:", err);
    }

    const prompt = prompts.PRICING_REASONING_PROMPT
      .replace("{salonName}", salonName)
      .replace("{date}", params.date)
      .replace("{timeSlot}", params.timeSlot)
      .replace("{bookingCount}", String(bookingCount))
      .replace("{originalPrice}", String(params.originalPrice))
      .replace("{finalPrice}", String(params.finalPrice))
      .replace("{peakSurge}", String(peakSurge))
      .replace("{offPeakDiscount}", String(offPeakDiscount))
      .replace(/Hyderabad/g, activeCity);

    const fallbackMock = () => {
      const isSurge = params.finalPrice > params.originalPrice;
      const isDiscount = params.finalPrice < params.originalPrice;
      
      const reasons = [];
      if (isSurge) {
        reasons.push(`High demand slot: ${bookingCount} active bookings confirmed for ${params.timeSlot} on ${params.date}.`);
        reasons.push(`Dynamic peak hour surge of +${peakSurge}% applied to balance stylist occupancy.`);
        reasons.push(`Surcharge supports 20-min seating SLA guarantee.`);
      } else if (isDiscount) {
        reasons.push(`Smart scheduling discount: booking scheduled during off-peak morning hours.`);
        reasons.push(`Happy hour price reduction of -${offPeakDiscount}% applied dynamically.`);
        reasons.push(`Saving of ₹${params.originalPrice - params.finalPrice} automatically credited.`);
      } else {
        reasons.push(`Standard reservation baseline rate of ₹${params.originalPrice}.`);
        reasons.push(`Moderate booking density (${bookingCount} clients) in this slot.`);
        reasons.push(`No active peak surge or off-peak promotional rates apply.`);
      }
      return { reasoning: reasons };
    };

    return this.executeLLM(prompt, fallbackMock);
  }
}

