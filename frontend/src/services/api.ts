const BACKEND_URL = "http://localhost:5000/api/ai";

export class ApiService {
  
  static getBuyUrl(item: string, brandOverride?: string): string {
    const combined = `${item} ${brandOverride || ""}`.toLowerCase();
    let brand = brandOverride || "";
    if (!brand) {
      const match = item.match(/\(([^)]+)\)/);
      if (match) {
        brand = match[1];
      }
    }
    
    const cleanItem = item.replace(/\(.*?\)/g, "").trim();
    const query = `${cleanItem} ${brand}`.trim();
    const lowerBrand = brand.toLowerCase();
    
    if (lowerBrand.includes("zara")) {
      return `https://www.zara.com/in/en/search?searchTerm=${encodeURIComponent(cleanItem)}`;
    }
    if (lowerBrand.includes("h&m") || lowerBrand.includes("h & m")) {
      return `https://www2.hm.com/en_in/search.html?q=${encodeURIComponent(cleanItem)}`;
    }
    if (lowerBrand.includes("uniqlo")) {
      return `https://www.uniqlo.com/in/en/search/?q=${encodeURIComponent(cleanItem)}`;
    }
    if (lowerBrand.includes("manyavar")) {
      return `https://www.manyavar.com/en-in/search?q=${encodeURIComponent(cleanItem)}`;
    }
    
    if (combined.includes("zara")) {
      return `https://www.zara.com/in/en/search?searchTerm=${encodeURIComponent(cleanItem)}`;
    }
    if (combined.includes("h&m") || combined.includes("h & m")) {
      return `https://www2.hm.com/en_in/search.html?q=${encodeURIComponent(cleanItem)}`;
    }
    if (combined.includes("uniqlo")) {
      return `https://www.uniqlo.com/in/en/search/?q=${encodeURIComponent(cleanItem)}`;
    }
    if (combined.includes("manyavar")) {
      return `https://www.manyavar.com/en-in/search?q=${encodeURIComponent(cleanItem)}`;
    }
    
    return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
  }
  
  private static async request(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Server returned status ${response.status}`);
    } catch (error) {
      console.warn(`Backend connection failed for /${endpoint}, using client-side mock logic.`, error);
      return this.getClientSideMock(endpoint, data);
    }
  }

  static async askConcierge(query: string) {
    return this.request("concierge", { query });
  }

  static async submitStyleDNA(answers: {
    stylePref: string;
    hairLength: string;
    colorOpen: string;
    occasion: string;
    lifestyle: string;
  }) {
    return this.request("style-dna", answers);
  }

  static async extractHeroStyle(inputData: string) {
    return this.request("be-next-hero", { inputData });
  }

  static async getFullLook(styleProfile: string) {
    return this.request("look-finder", { styleProfile });
  }

  static async analyzeProcurement(catalogData: {
    name: string;
    brand: string;
    certifications: string;
    cost: number;
    retail: number;
    budget: number;
    prefBrands: string;
    marginGoal: number;
  }) {
    return this.request("procurement", catalogData);
  }

  static async evaluateBehavioral(examData: {
    scenario: string;
    language: string;
    response: string;
  }) {
    return this.request("behavioral-exam", examData);
  }

  // Client-side fallback logic representing the exact matching intelligence of the backend.
  private static getClientSideMock(endpoint: string, data: any): any {
    switch (endpoint) {
      case "concierge": {
        const q = data.query.toLowerCase();
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
          reply: `[Demo Fallback] ${reply}`,
          hairstyle: hair,
          beard: beard,
          color: "Natural Matte Black Highlights",
          services: service,
          cost: price,
          stylistMatch: "Senior Stylist (Specialist in Face Profiling)"
        };
      }

      case "style-dna": {
        const pref = data.stylePref.toLowerCase();
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

        return {
          profileName,
          tagline,
          description,
          hairSuggestion: "Textured Crop with a High Skin Fade",
          beardSuggestion: "Meticulously Groomed Medium Stubble",
          colorSuggestion: "Subtle Sun-Kissed Ash Brown highlights to add depth",
          matchReasoning: `Your preference for ${data.stylePref} styling and a ${data.lifestyle} lifestyle aligns perfectly with a ${profileName} profile. This balance offers low maintenance during weekdays while remaining striking during ${data.occasion} occasions.`,
          stylistMatches: [
            { name: "Vikram Malhotra", specialty: "Master Hair Sculptor", matchPercentage: 97, reasoning: "Specializes in tailored executive styling and sharp fades." },
            { name: "Priya Rao", specialty: "Celebrity Groomer", matchPercentage: 92, reasoning: "Acclaimed expert in modern fashion trends and volume textures." },
            { name: "Suresh K.", specialty: "Natural Wave Artist", matchPercentage: 86, reasoning: "Top rated for organic styling and low-maintenance textures." }
          ]
        };
      }

      case "be-next-hero": {
        const inp = data.inputData.toLowerCase();
        let celeb = "Ranbir Kapoor";
        let hair = "Textured Volume Crop with Drop Fade";
        let beard = "Perfectly Lined Heavy Stubble";
        let confidence = 94;
        let face = "Square / Strong Jawline";
        let skin = "Warm Golden Tan";
        let acc = ["Black Matte Aviators (ZARA)", "Sleek Stainless Chain (H&M)"];
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
          const cleanName = data.inputData.replace(/http[s]?:\/\/[^\s]+/, "").trim();
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
      }

      case "look-finder": {
        const p = data.styleProfile.toLowerCase();
        let outfit = "Sleek Corporate Noir";
        let shirt = "Premium Fitted Charcoal Oxford Shirt (Zara)";
        let trousers = "Slim-Fit Ankle-Length Chinos (Uniqlo)";
        let shoes = "Loafers in Dark Suede Brown (Zara)";
        let watch = "Minimalist Silver Chronograph with Dark Dial (H&M)";
        let acc = ["Leather Belt (Zara)", "Signature Sandalwood cologne note"];

        if (p.includes("trendy") || p.includes("street") || p.includes("allu arjun") || p.includes("messy flow")) {
          outfit = "Hyderabad Street Vibe";
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
      }

      case "procurement": {
        const profit = data.retail - data.cost;
        const margin = (profit / data.retail) * 100;
        
        let score = 85;
        let status = "REVIEW";
        let safetyCert = "Standard Safety Inspected";
        let explanation = "[Demo Fallback] Product shows reasonable margins, but requires audit of green certifications.";

        const certs = data.certifications.toLowerCase();
        const hasGreenCerts = certs.includes("organic") || certs.includes("vegan") || certs.includes("toxin") || certs.includes("paraben");

        if (margin >= data.marginGoal && hasGreenCerts) {
          score = 94;
          status = "ACCEPT";
          safetyCert = "Organic, Paraben-Free Certified Clean Beauty";
          explanation = "[Demo Fallback] Exceptional margin combined with clean ingredient profile. Accepted automatically.";
        } else if (margin < 30 || data.cost > data.budget) {
          score = 35;
          status = "REJECT";
          safetyCert = "Fails to meet clean standards or margin targets";
          explanation = "[Demo Fallback] Cost structure is unprofitable or budget is exceeded. Rejected.";
        }

        return {
          score,
          status,
          marginAnalysis: `Profit Margin: ${margin.toFixed(1)}% (Profit: ₹${profit} per unit). Target: ${data.marginGoal}%.`,
          safetyCert,
          stockRecommendation: status === "ACCEPT" ? "Bulk Order: 150 units" : status === "REVIEW" ? "Sample Order: 15 units" : "Do not order",
          explanation
        };
      }

      case "behavioral-exam": {
        const resp = data.response.toLowerCase();
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
            empathy: resp.length > 50 ? "[Demo Fallback] Good empathetic listening skills detected." : "[Demo Fallback] Response was short. Candidate needs to acknowledge customer pain points more fully.",
            tone: "Polite and calm tone.",
            clarity: `Spoke clearly in ${data.language}.`,
            resolution,
            upsell
          },
          composureRating: score >= 80 ? "Exemplary Calmness" : score >= 60 ? "Stable under pressure" : "Impatient / Defensive",
          recommendedCourses: [
            "BELSOME Client Retention Secrets Course",
            "Advanced Verbal Crisis Management Training"
          ]
        };
      }

      default:
        return { message: "Mock endpoint not found." };
    }
  }
}
