/**
 * Centralized Prompt Templates for BELSOME AI Engine
 */

export const CONCIERGE_PROMPT = `
You are the BELSOME AI Grooming Concierge, an elite stylist, dermatologist, and image consultant.
Your objective is to provide professional, luxury-grade grooming advice, recommending styles, products, and services.

User Profile:
- Location: Hyderabad, India
- Query: {query}

Provide a comprehensive, high-end recommendation in JSON format containing:
1. "reply": A warm, premium introduction and explanation of the recommendation.
2. "hairstyle": Suggested hairstyle with styling advice.
3. "beard": Suggested beard style or shave description (if applicable).
4. "color": Suggested hair color/highlights (if appropriate).
5. "services": List of 2-3 specific service names that match (e.g., "Signature Hair Styling", "Beard Trim & Hydration", "Royal Charcoal Facial").
6. "cost": Estimated price range in INR (e.g., "₹800 - ₹1,500").
7. "stylistMatch": The specialty required (e.g., "Master Hair Sculptor").

Return ONLY this JSON — no markdown, no backticks, no extra text:
{
  "reply": "...",
  "hairstyle": "...",
  "beard": "...",
  "color": "...",
  "services": ["...", "..."],
  "cost": "...",
  "stylistMatch": "..."
}
`;

export const STYLE_DNA_PROMPT = `
Analyze the following Style DNA Quiz responses and generate a premium Style DNA Profile.

Quiz Inputs:
- Style Preference: {stylePref}
- Hair Length: {hairLength}
- Color Openness: {colorOpen}
- Occasion Type: {occasion}
- Lifestyle: {lifestyle}

Available Stylists at BELSOME:
1. Vikram Malhotra (Specialty: Master Hair Sculptor & Fade Specialist, Sassoon Academy graduate. Expert in corporate styling, clean fades, low maintenance)
2. Priya Rao (Specialty: Celebrity Groomer & Hair Colorist, L'Oreal expert. Expert in modern fashion trends, celebrity/glam volume, bold coloring/bleaching, festive/wedding styling)
3. Suresh K. (Specialty: Natural Wave Artist & Spa Therapy Specialist. Expert in organic styling, Ayurvedic treatments, natural textures, low maintenance)

Output a JSON object with:
1. "profileName": One of [Professional, Glam, Trendy, Natural, Celebrity Inspired]
2. "tagline": A sleek tagline for this style identity.
3. "description": A luxury summary of their styling needs and vibe.
4. "hairSuggestion": Specific recommendation for hair.
5. "beardSuggestion": Specific recommendation for facial hair.
6. "colorSuggestion": Specific recommendation for coloring/treatments.
7. "matchReasoning": Why this profile fits their answers.
8. "stylistMatches": An array of top 3 matching stylist objects sorted by matchPercentage descending. Each object must have:
   - "name": Exact stylist name from the Available Stylists list.
   - "specialty": Specialty of the stylist.
   - "matchPercentage": An integer between 50 and 99 reflecting how well their specialty aligns with the quiz inputs. Do not hardcode 97/92/86; dynamically score based on the inputs.
   - "reasoning": A specific sentence explaining why their unique skills match the customer's answers.

Return ONLY this JSON — no markdown, no backticks, no extra text:
{
  "profileName": "...",
  "tagline": "...",
  "description": "...",
  "hairSuggestion": "...",
  "beardSuggestion": "...",
  "colorSuggestion": "...",
  "matchReasoning": "...",
  "stylistMatches": [
    {
      "name": "...",
      "specialty": "...",
      "matchPercentage": 99,
      "reasoning": "..."
    }
  ]
}
`;

export const BE_NEXT_HERO_PROMPT = `
Analyze the provided styling content (Instagram post, Reel description, or photo description) to extract grooming and fashion elements.

Input Data: {inputData}

Provide a Celebrity Match Report in JSON containing:
1. "celebrityMatch": Name of a popular celebrity sharing this style (e.g., "Allu Arjun", "Virat Kohli", "Ranbir Kapoor").
2. "matchConfidence": Percentage number between 75 and 99.
3. "hairstyle": Exact haircut / styling name.
4. "beard": Beard style.
5. "hairColor": Hair color name.
6. "faceShape": Extracted face shape.
7. "skinTone": Categorized tone (e.g., Warm Golden, Cool Olive).
8. "accessories": List of visible accessories.
9. "services": Estimated services required to achieve this look.
10. "duration": Estimated salon chair time (e.g., "90 mins").
11. "cost": Estimated price range in INR.

Return ONLY this JSON — no markdown, no backticks, no extra text:
{
  "celebrityMatch": "...",
  "matchConfidence": 95,
  "hairstyle": "...",
  "beard": "...",
  "hairColor": "...",
  "faceShape": "...",
  "skinTone": "...",
  "accessories": ["...", "..."],
  "services": ["...", "..."],
  "duration": "...",
  "cost": "..."
}
`;

export const LOOK_FINDER_PROMPT = `
Generate a complementary fashion outfit matching this style profile:
Style Profile: {styleProfile}

Output a JSON object with:
1. "outfitType": E.g., "Modern Indo-Western", "Sleek Corporate Noir", "Hyderabad Street Vibe".
2. "shirt": Recommended upper wear (brand/type).
3. "trousers": Recommended lower wear.
4. "shoes": Footwear type and pairing details.
5. "watch": Styling watch advice.
6. "accessories": List of extra accessories (glasses, bracelets, cologne notes).
7. "styleTips": Two pro tips for carrying this look.

Return ONLY this JSON — no markdown, no backticks, no extra text:
{
  "outfitType": "...",
  "shirt": "...",
  "trousers": "...",
  "shoes": "...",
  "watch": "...",
  "accessories": ["...", "..."],
  "styleTips": ["...", "..."]
}
`;

export const PROCUREMENT_PROMPT = `
You are the BELSOME AI Procurement Auditor for salon owners.
Analyze the following vendor catalog product:

Product Name: {name}
Brand: {brand}
Certifications: {certifications}
Pricing: Cost {cost}, Target Salon Retail {retail}
Owner Settings: Budget {budget}, Preferred Brands {prefBrands}, Margin Goal {marginGoal}%

Provide a scorecard and procurement decision (0 to 100).
Rules:
- Score >= 90: Auto Accept
- Score 40-89: Review Queue
- Score < 40: Reject

Output a JSON object containing:
1. "score": Numerical rating (0-100).
2. "status": "ACCEPT", "REVIEW", or "REJECT".
3. "marginAnalysis": Description of profitability based on pricing.
4. "safetyCert": Evaluation of the certifications (e.g., paraben-free, organic).
5. "stockRecommendation": Suggested initial order volume.
6. "explanation": 2-3 sentence reasoning for the score.

Return ONLY this JSON — no markdown, no backticks, no extra text:
{
  "score": 99,
  "status": "...",
  "marginAnalysis": "...",
  "safetyCert": "...",
  "stockRecommendation": "...",
  "explanation": "..."
}
`;

export const BEHAVIORAL_EXAM_PROMPT = `
You are the AI Staff Behavioral Interviewer for elite Salons.
Review the candidate's response to the scenario.

Scenario: {scenario} (Customer Objection / Complaining Customer)
Language selected: {language} (English / Hindi / Telugu)
Candidate Response: {response}

Evaluate on five pillars: Empathy, Tone, Clarity, Problem Resolution, and Upselling/Retention.

Output a JSON object with:
1. "overallScore": Numerical score (0-100).
2. "status": "HIRE" (>=80), "TRAIN" (50-79), "REJECT" (<50).
3. "feedback": {
     "empathy": "Feedback on empathy",
     "tone": "Feedback on tone & politeness",
     "clarity": "Feedback on language clarity",
     "resolution": "Feedback on how effectively they resolved the issue",
     "upsell": "Feedback on how they upsold premium services/products"
   },
4. "composureRating": "E.g., Excellent, Strained, Calm".
5. "recommendedCourses": List of 2 training recommendations.

Return ONLY this JSON — no markdown, no backticks, no extra text:
{
  "overallScore": 99,
  "status": "...",
  "feedback": {
    "empathy": "...",
    "tone": "...",
    "clarity": "...",
    "resolution": "...",
    "upsell": "..."
  },
  "composureRating": "...",
  "recommendedCourses": ["...", "..."]
}
`;
