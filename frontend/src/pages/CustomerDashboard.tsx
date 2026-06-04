import React, { useState } from "react";
import { useBelsomeStore } from "../store/belsomeStore";
import { ApiService } from "../services/api";
import { 
  MapPin, ShoppingBag, Timer, CheckCircle, RefreshCcw, ShieldCheck, Scissors, Sliders,
  Calendar, Sparkles, Play, Award, Star, Upload, Tag, Download, Share2, Copy, Check
} from "lucide-react";

interface StyleItem {
  id: string;
  name: string;
  base: string;
  category: string;
  scale?: number;
  yOffset?: number;
  tip?: string;
}

const HAIRSTYLES_LIST: StyleItem[] = [
  { id: "clean-hair", name: "Clean / Shaved", base: "none", category: "Classic", tip: "A neat clean look highlighting your face shape." },
  // Fades
  { id: "buzz-cut", name: "Buzz Cut", base: "buzz", category: "Fades", scale: 0.98, yOffset: 2, tip: "Ultra-short, low-maintenance cut, ideal for active lifestyles." },
  { id: "crew-cut", name: "Crew Cut", base: "buzz", category: "Fades", scale: 1.0, yOffset: 1, tip: "Classic military-inspired style with slightly more length on top." },
  { id: "high-tight", name: "High & Tight", base: "buzz", category: "Fades", scale: 0.97, yOffset: 3, tip: "Clean look with shaved sides and a tiny patch on top." },
  { id: "taper-fade", name: "Classic Taper Fade", base: "buzz", category: "Fades", scale: 1.0, yOffset: 0, tip: "Gradient fade from long at the temples to short at the base." },
  { id: "drop-fade", name: "Drop Fade", base: "buzz", category: "Fades", scale: 0.99, yOffset: 2, tip: "The fade line falls behind the ear, creating a clean curved look." },
  { id: "skin-fade", name: "High Skin Fade", base: "buzz", category: "Fades", scale: 0.96, yOffset: 4, tip: "High contrast cut tapering down to bare skin." },
  { id: "temp-fade", name: "Temple Fade", base: "buzz", category: "Fades", scale: 0.99, yOffset: 1, tip: "Sleek fade focused strictly around the temples." },
  { id: "burst-fade", name: "Burst Fade", base: "buzz", category: "Fades", scale: 1.0, yOffset: 2, tip: "Circular fade bursting around the ear." },
  { id: "bald-fade", name: "Bald Fade", base: "buzz", category: "Fades", scale: 0.95, yOffset: 3, tip: "High fade blending seamlessly into the skin." },
  { id: "flat-top", name: "Flat Top", base: "buzz", category: "Fades", scale: 1.02, yOffset: -2, tip: "Structured high-top with a flat upper level." },
  // Classics
  { id: "classic-pomp", name: "Classic Pompadour", base: "pompadour", category: "Classic", scale: 1.0, yOffset: 0, tip: "High-volume swept back look, styled with high-shine pomade." },
  { id: "slick-back", name: "Slicked Back", base: "undercut", category: "Classic", scale: 0.98, yOffset: 2, tip: "Timeless combed-back style offering an executive look." },
  { id: "comb-over", name: "Comb Over", base: "sidepart", category: "Classic", scale: 1.0, yOffset: 1, tip: "Classic gentleman style combed over to one side." },
  { id: "executive-scissor", name: "Executive Scissor Cut", base: "sidepart", category: "Classic", scale: 1.02, yOffset: -1, tip: "Natural scissor-cut layers tailored for boardroom meetings." },
  { id: "ivy-league", name: "Ivy League", base: "sidepart", category: "Classic", scale: 0.99, yOffset: 2, tip: "Clean parted cut, popular in Ivy League legacy catalogs." },
  { id: "caesar-cut", name: "Caesar Cut", base: "buzz", category: "Classic", scale: 0.98, yOffset: 3, tip: "Short horizontally cut fringe named after Julius Caesar." },
  { id: "french-crop", name: "French Crop", base: "buzz", category: "Classic", scale: 1.0, yOffset: 2, tip: "Short cut with a prominent blunt cropped fringe." },
  { id: "regulation-cut", name: "Regulation Cut", base: "sidepart", category: "Classic", scale: 0.98, yOffset: 1, tip: "Strict military crop with a clean side part." },
  { id: "butch-cut", name: "Butch Cut", base: "buzz", category: "Classic", scale: 0.96, yOffset: 3, tip: "Short uniform cut all around, slightly longer than a buzz." },
  { id: "burr-cut", name: "Burr Cut", base: "buzz", category: "Classic", scale: 0.95, yOffset: 4, tip: "Almost completely shaved look using a #1 clipper guard." },
  // Quiffs & Pomps
  { id: "high-fade-quiff", name: "High Fade Quiff", base: "quiff", category: "Volume", scale: 1.03, yOffset: -1, tip: "Modern quiff with shaved sides for high visual contrast." },
  { id: "textured-quiff", name: "Textured Quiff", base: "quiff", category: "Volume", scale: 1.0, yOffset: 0, tip: "Messy, piecey quiff with lots of movement and matte finish." },
  { id: "messy-fringe", name: "Messy Fringe", base: "quiff", category: "Volume", scale: 0.98, yOffset: 3, tip: "Casual styling with volume swept forward over the forehead." },
  { id: "modern-shag", name: "Modern Shag", base: "quiff", category: "Volume", scale: 1.05, yOffset: -3, tip: "Retro layered cut with messy textured volume." },
  { id: "wolf-cut", name: "Wolf Cut", base: "quiff", category: "Volume", scale: 1.04, yOffset: -2, tip: "Trendy hybrid of a shag and a subtle mullet." },
  { id: "ducktail-pomp", name: "Ducktail Pompadour", base: "pompadour", category: "Volume", scale: 1.02, yOffset: -1, tip: "Classic 1950s look converging into a point at the back." },
  { id: "faux-hawk", name: "Faux Hawk", base: "quiff", category: "Volume", scale: 1.02, yOffset: -2, tip: "Sides are short while the center points upwards." },
  { id: "mohawk-classic", name: "Mohawk Classic", base: "quiff", category: "Volume", scale: 1.05, yOffset: -4, tip: "Striking strip of vertical hair running down the center." },
  { id: "liberty-spikes", name: "Liberty Spikes", base: "quiff", category: "Volume", scale: 1.08, yOffset: -5, tip: "Punk-inspired long thick spikes pointing outwards." },
  { id: "octopus-cut", name: "Octopus Cut", base: "quiff", category: "Volume", scale: 1.05, yOffset: -2, tip: "Shaggy layers resembling octopus tentacles." },
  // Undercuts
  { id: "textured-undercut", name: "Textured Undercut", base: "undercut", category: "Undercuts", scale: 1.0, yOffset: 0, tip: "Short sides with highly textured messy layers on top." },
  { id: "discon-undercut", name: "Disconnected Undercut", base: "undercut", category: "Undercuts", scale: 1.02, yOffset: -1, tip: "Sharp division line between shaved sides and long top hair." },
  { id: "slick-undercut", name: "Slicked Back Undercut", base: "undercut", category: "Undercuts", scale: 0.99, yOffset: 1, tip: "Slick combed-back hair with disconnected buzzed sides." },
  { id: "hard-part", name: "Hard Part Undercut", base: "sidepart", category: "Undercuts", scale: 1.0, yOffset: 1, tip: "A razor-cut side line highlighting the hair division." },
  { id: "curtains-eboy", name: "Curtains / E-Boy", base: "sidepart", category: "Undercuts", scale: 0.98, yOffset: 3, tip: "90s middle part framing both sides of the face." },
  { id: "side-swept-undercut", name: "Side Swept Undercut", base: "sidepart", category: "Undercuts", scale: 1.01, yOffset: 0, tip: "Undercut styling with long hair swept to one side." },
  { id: "comb-over-fade", name: "Comb Over Fade", base: "sidepart", category: "Undercuts", scale: 1.0, yOffset: 1, tip: "Classic combo of a taper fade and side-swept comb over." },
  { id: "textured-crop-fade", name: "Textured Crop Fade", base: "buzz", category: "Undercuts", scale: 1.0, yOffset: 2, tip: "Textured crop top with high skin faded sides." },
  // Long & Flows
  { id: "long-waves", name: "Long Waves", base: "long", category: "Long", scale: 1.0, yOffset: 0, tip: "Free-flowing wavy locks offering an effortless look." },
  { id: "surf-flow", name: "Surf Flow", base: "long", category: "Long", scale: 1.02, yOffset: -1, tip: "Medium length messy waves, popular in coastal styling." },
  { id: "man-bun", name: "Man Bun", base: "long", category: "Long", scale: 0.95, yOffset: 3, tip: "Long hair tied into a neat round bun at the crown." },
  { id: "top-knot", name: "Top Knot", base: "long", category: "Long", scale: 0.94, yOffset: 4, tip: "Undercut sides with long hair tied into a knot on top." },
  { id: "skater-flow", name: "Skater Flow", base: "long", category: "Long", scale: 1.03, yOffset: -2, tip: "Casual chin-length layers falling naturally." },
  { id: "pageboy-cut", name: "Pageboy Cut", base: "long", category: "Long", scale: 1.04, yOffset: -1, tip: "Retro long bob styling curling slightly inward." },
  { id: "mullet-classic", name: "Mullet Classic", base: "long", category: "Long", scale: 1.05, yOffset: -2, tip: "Business in the front, styling party in the back." },
  { id: "dreadlocks", name: "Dreadlocks", base: "long", category: "Long", scale: 1.02, yOffset: -1, tip: "Sculpted locks of protective rope-like hair layers." },
  // Curly & Textures
  { id: "curly-crop", name: "Curly Crop with Drop Fade", base: "curly", category: "Curly", scale: 1.0, yOffset: 0, tip: "Curly texture on top with clean skin-faded sides." },
  { id: "wavy-taper", name: "Wavy Taper Fade", base: "curly", category: "Curly", scale: 1.02, yOffset: -1, tip: "Natural waves styled with a clean temple taper." },
  { id: "afro-classic", name: "Afro Classic", base: "curly", category: "Curly", scale: 1.06, yOffset: -3, tip: "High-volume spherical cloud of natural curls." },
  { id: "twist-out", name: "Twist Out", base: "curly", category: "Curly", scale: 1.03, yOffset: -1, tip: "Highly defined curl spirals created by unraveling twists." },
  { id: "cornrows-braids", name: "Cornrows Braids", base: "curly", category: "Curly", scale: 0.97, yOffset: 2, tip: "Sleek protective braids running flat against the scalp." },
  { id: "braided-rows", name: "Braided Rows", base: "curly", category: "Curly", scale: 0.99, yOffset: 1, tip: "Individual braided strands extending backwards." }
];

const BEARDS_LIST: StyleItem[] = [
  { id: "clean-shave", name: "Clean Shaven", base: "none", category: "Shaved", tip: "A perfectly smooth skin finish." },
  // Stubbles
  { id: "light-stubble", name: "Light 3-Day Shadow", base: "stubble", category: "Stubble", tip: "Subtle stubble outlining the jawline." },
  { id: "medium-stubble", name: "Medium Stubble", base: "stubble", category: "Stubble", tip: "Well-defined short stubble, very popular and easy." },
  { id: "heavy-stubble", name: "Heavy Stubble", base: "stubble", category: "Stubble", tip: "Thick dense stubble offering a rugged look." },
  { id: "rap-industry", name: "Rap Industry Stubble", base: "stubble", category: "Stubble", tip: "Meticulously lined thin stubble along the jaw edge." },
  { id: "scruffy-beard", name: "Scruffy Beard", base: "stubble", category: "Stubble", tip: "Slightly unkempt but styled medium-short beard." },
  // Full Beards
  { id: "boxed-beard", name: "Short Boxed Beard", base: "full", category: "Full Beard", tip: "Groomed corporate full beard with neat cheek lines." },
  { id: "classic-full", name: "Classic Full Beard", base: "full", category: "Full Beard", tip: "Standard full beard with natural growing lines." },
  { id: "garibaldi", name: "Garibaldi Beard", base: "full", category: "Full Beard", tip: "Wide, rounded full beard up to 20cm in length." },
  { id: "verdi", name: "Verdi Beard", base: "full", category: "Full Beard", tip: "Short full beard styled with a handlebar mustache." },
  { id: "ducktail-beard", name: "Ducktail Beard", base: "full", category: "Full Beard", tip: "Full beard trimmed to resemble a pointed ducktail." },
  { id: "bandholz", name: "Bandholz Beard", base: "full", category: "Full Beard", tip: "Massive, long full beard and mustache left to grow naturally." },
  { id: "hipster-beard", name: "Hipster Beard", base: "full", category: "Full Beard", tip: "Long, dense beard paired with styled mustache waves." },
  { id: "lumberjack", name: "Lumberjack Beard", base: "full", category: "Full Beard", tip: "Rugged, thick beard projecting a strong profile." },
  { id: "corporate-beard", name: "Corporate Beard", base: "full", category: "Full Beard", tip: "Trimmed to a uniform length of 1/2 inch for office spaces." },
  // Goatees & Anchors
  { id: "circle-beard", name: "Circle Beard (Goatee)", base: "goatee", category: "Goatee", tip: "Mustache and chin beard connected in a circular loop." },
  { id: "anchor-beard", name: "Anchor Beard", base: "goatee", category: "Goatee", tip: "Pointed beard tracking the jawline, paired with a mustache." },
  { id: "balbo", name: "Balbo Beard", base: "goatee", category: "Goatee", tip: "Three-section beard: mustache, chin tuft, and separate jaw wings." },
  { id: "van-dyke", name: "Van Dyke Beard", base: "goatee", category: "Goatee", tip: "Floating mustache paired with a separate pointed chin goatee." },
  { id: "extended-goatee", name: "Extended Goatee", base: "goatee", category: "Goatee", tip: "Goatee extending backwards along the jawline." },
  { id: "ducktail-goatee", name: "Ducktail Goatee", base: "goatee", category: "Goatee", tip: "Pointed goatee styled without cheek hair." },
  { id: "petite-goatee", name: "Petite Goatee", base: "goatee", category: "Goatee", tip: "Small patch of beard centered on the chin." },
  { id: "sparrow-beard", name: "Sparrow Beard", base: "goatee", category: "Goatee", tip: "Braided chin goatee inspired by Jack Sparrow." },
  { id: "winnfield", name: "Winnfield Goatee", base: "goatee", category: "Goatee", tip: "Thin mustache curving down past the mouth to a chin patch." },
  // Mutton Chops
  { id: "mutton-chops", name: "Mutton Chops", base: "muttonchops", category: "Chops", tip: "Thick sideburns extending down to the corners of the mouth." },
  { id: "friendly-chops", name: "Friendly Mutton Chops", base: "muttonchops", category: "Chops", tip: "Mutton chops connected by a mustache." },
  { id: "hulihee", name: "Hulihee Beard", base: "muttonchops", category: "Chops", tip: "Flared, long friendly mutton chops styled outwards." },
  { id: "sideburns-goatee", name: "Goatee and Sideburns", base: "goatee", category: "Chops", tip: "Thick sideburns paired with a separate chin goatee." },
  // Mustaches
  { id: "handlebar", name: "Handlebar Mustache", base: "mustache", category: "Mustache", tip: "Mustache with upward curved tips styled with wax." },
  { id: "fu-manchu", name: "Fu Manchu Mustache", base: "mustache", category: "Mustache", tip: "Thin mustache growing downwards past the chin." },
  { id: "horseshoe", name: "Horseshoe Mustache", base: "mustache", category: "Mustache", tip: "Mustache resembling a horseshoe, extending down to the jaw." },
  { id: "chevron", name: "Chevron Mustache", base: "mustache", category: "Mustache", tip: "Thick mustache covering the entire upper lip." },
  { id: "pencil-stache", name: "Pencil Mustache", base: "mustache", category: "Mustache", tip: "Thin, closely clipped line of hair above the upper lip." },
  { id: "walrus-stache", name: "Walrus Mustache", base: "mustache", category: "Mustache", tip: "Thick bushy mustache hanging over the bottom lip." },
  { id: "english-stache", name: "English Mustache", base: "mustache", category: "Mustache", tip: "Long mustache pulled straight out to the sides." },
  { id: "dali-stache", name: "Dali Mustache", base: "mustache", category: "Mustache", tip: "Narrow mustache with sharp points curved straight up." },
  { id: "brush-stache", name: "Painter's Brush", base: "mustache", category: "Mustache", tip: "Thick mustache with rounded outer corners." },
  { id: "lampshade", name: "Lampshade Mustache", base: "mustache", category: "Mustache", tip: "Mustache cropped into a trapezoidal shape." },
  { id: "zappa", name: "Zappa Mustache", base: "mustache", category: "Mustache", tip: "Thick mustache paired with a distinct wide soul patch." },
  { id: "toothbrush", name: "Toothbrush Mustache", base: "mustache", category: "Mustache", tip: "Small centered patch of mustache, popular in early 1900s." },
  // Others / Classic Combs
  { id: "chin-curtain", name: "Chin Curtain", base: "full", category: "Other", tip: "Beard growing along the jawline, completely without mustache." },
  { id: "chin-strap", name: "Chin Strap Beard", base: "stubble", category: "Other", tip: "Thin line of beard running along the edge of the jaw." },
  { id: "soul-patch", name: "Soul Patch", base: "goatee", category: "Other", tip: "Small patch of hair centered below the lower lip." },
  { id: "goat-patch", name: "Goat Patch", base: "goatee", category: "Other", tip: "Elongated strip of chin hair." },
  { id: "klingon-beard", name: "Klingon Beard", base: "full", category: "Other", tip: "Downward angled mustache connecting to a chin strap." },
  { id: "old-dutch", name: "Old Dutch Beard", base: "full", category: "Other", tip: "Large full flared beard styled without a mustache." },
  { id: "neck-beard", name: "Neck Beard", base: "full", category: "Other", tip: "Beard grown exclusively below the jawline on the neck." },
  { id: "imperial-combo", name: "Imperial Beard & Mustache", base: "full", category: "Other", tip: "Full beard combined with an imperial waxed mustache." },
  { id: "anchor-combo", name: "Anchor & Mustache Combo", base: "goatee", category: "Other", tip: "Anchor beard paired with a classic pencil mustache." },
  { id: "french-fork", name: "French Fork Beard", base: "full", category: "Other", tip: "Full beard split down the center into two sections." }
];

const getCelebrityImage = (name: string, inputLink?: string) => {
  if (inputLink && (inputLink.startsWith("http") || inputLink.startsWith("data:"))) {
    return inputLink;
  }
  const clean = name.toLowerCase();
  if (clean.includes("virat") || clean.includes("kohli")) {
    return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400";
  }
  if (clean.includes("allu") || clean.includes("arjun") || clean.includes("pushpa")) {
    return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400";
  }
  if (clean.includes("ranbir") || clean.includes("kapoor")) {
    return "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400";
  }
  if (clean.includes("shah") || clean.includes("rukh") || clean.includes("srk") || clean.includes("khan")) {
    return "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400";
  }
  if (clean.includes("timoth") || clean.includes("chalamet")) {
    return "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400";
  }
  if (clean.includes("ranveer") || clean.includes("singh")) {
    return "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400";
  }
  return "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400";
};

export default function CustomerDashboard() {
  const { salons, stylists, services, appointments, addAppointment, selectedPreferences, togglePreference, addToast } = useBelsomeStore();
  const [activeTab, setActiveTab] = useState<"book" | "quiz" | "canvas" | "hero" | "express" | "portfolios">("book");

  // Interactive Styling Canvas State
  const [canvasFaceShape, setCanvasFaceShape] = useState<"oval" | "round" | "square" | "heart">("oval");
  const [canvasSkinTone, setCanvasSkinTone] = useState("#F5C29A");
  const [selectedHairId, setSelectedHairId] = useState<string>("classic-pomp");
  const [selectedBeardId, setSelectedBeardId] = useState<string>("medium-stubble");
  const [canvasHairColor, setCanvasHairColor] = useState("#1A1A1A");
  const [canvasHairScale, setCanvasHairScale] = useState(1.0);
  const [canvasHairY, setCanvasHairY] = useState(0);
  const [canvasAccessory, setCanvasAccessory] = useState<"none" | "glasses" | "sunglasses" | "earrings" | "turban">("none");

  // Uploaded photo scanner state
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Search & Filter state for 50+ styles
  const [hairSearch, setHairSearch] = useState("");
  const [hairFilterCat, setHairFilterCat] = useState("All");
  const [beardSearch, setBeardSearch] = useState("");
  const [beardFilterCat, setBeardFilterCat] = useState("All");

  // Derive canvasHair and canvasBeard dynamically
  const activeHairItem = HAIRSTYLES_LIST.find(h => h.id === selectedHairId) || HAIRSTYLES_LIST[0];
  const activeBeardItem = BEARDS_LIST.find(b => b.id === selectedBeardId) || BEARDS_LIST[0];

  const canvasHair = activeHairItem.base;
  const canvasBeard = activeBeardItem.base;

  const handleHairSelect = (hairId: string) => {
    const hair = HAIRSTYLES_LIST.find(h => h.id === hairId);
    if (!hair) return;
    setSelectedHairId(hairId);
    setCanvasHairScale(hair.scale ?? 1.0);
    setCanvasHairY(hair.yOffset ?? 0);
  };

  const handleBeardSelect = (beardId: string) => {
    const beard = BEARDS_LIST.find(b => b.id === beardId);
    if (!beard) return;
    setSelectedBeardId(beardId);
  };

  const handleTryStyleMatch = (hairName: string, beardName: string) => {
    const hn = hairName.toLowerCase();
    let hairId = "clean-hair";
    if (hn.includes("quiff")) hairId = "textured-quiff";
    else if (hn.includes("undercut")) hairId = "textured-undercut";
    else if (hn.includes("part") || hn.includes("comb")) hairId = "comb-over";
    else if (hn.includes("fade") || hn.includes("taper")) hairId = "taper-fade";
    else if (hn.includes("crop") || hn.includes("buzz")) hairId = "buzz-cut";
    else if (hn.includes("flow") || hn.includes("wave")) hairId = "long-waves";
    else if (hn.includes("pompadour") || hn.includes("pomp")) hairId = "classic-pomp";
    else if (hn.includes("curly") || hn.includes("afro")) hairId = "curly-crop";
    
    const bn = beardName.toLowerCase();
    let beardId = "clean-shave";
    if (bn.includes("stubble") || bn.includes("shadow")) beardId = "medium-stubble";
    else if (bn.includes("full") || bn.includes("lumberjack")) beardId = "classic-full";
    else if (bn.includes("goatee") || bn.includes("anchor") || bn.includes("valbo")) beardId = "circle-beard";
    else if (bn.includes("mustache") || bn.includes("stache") || bn.includes("handlebar")) beardId = "chevron";
    else if (bn.includes("chop") || bn.includes("mutton")) beardId = "friendly-chops";
    
    handleHairSelect(hairId);
    handleBeardSelect(beardId);
  };

  const canvasHairFill = (color: string) => {
    if (color === "#7C3AED") return "url(#purpleHairGrad)";
    if (color === "#B45309") return "url(#bronzeHairGrad)";
    return color;
  };

  const canvasBeardColor = (color: string) => {
    if (color === "#7C3AED") return "#4C1D95"; // Darker purple for beard
    if (color === "#B45309") return "#78350F"; // Darker bronze
    return color;
  };

  const exportAvatarSvg = () => {
    const svgElement = document.querySelector("#avatar-svg");
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `BELSOME_Avatar_${canvasFaceShape}_${canvasHair}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const [avatarScanning, setAvatarScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [avatarScanResult, setAvatarScanResult] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarScanning(true);
    setScanMessage("Uploading portrait photo...");
    setAvatarScanResult(null);
    setError(null);
    addToast("📸 Selfie uploaded! Running AI facial geometry scan...", "info");

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setUploadedImageSrc(dataUrl);

        try {
          setScanMessage("Detecting jawline & cheekbone coordinates...");
          
          // Make real-time backend API vision request
          const result = await ApiService.analyzeSelfie(dataUrl, file.type, file.name);

          await new Promise(resolve => setTimeout(resolve, 800));
          setScanMessage("Calculating chin aspect ratio & face shape...");

          await new Promise(resolve => setTimeout(resolve, 800));
          setScanMessage("Matching best hair and beard styles...");

          await new Promise(resolve => setTimeout(resolve, 800));

          if (result.faceShape) {
            setCanvasFaceShape(result.faceShape as any);
          }
          if (result.skinTone) {
            setCanvasSkinTone(result.skinTone);
          }
          if (result.hairStyleId) {
            handleHairSelect(result.hairStyleId);
          }
          if (result.beardStyleId) {
            handleBeardSelect(result.beardStyleId);
          }
          if (result.accessory) {
            setCanvasAccessory(result.accessory as any);
          }
          if (result.hairColor) {
            setCanvasHairColor(result.hairColor);
          }

          setAvatarScanResult(
            `AI Vision Scan Complete: Detected ${result.faceShape} face shape (Confidence: ${result.confidence || 95}%)`
          );
          addToast(`✨ Selfie Scan Complete: Detected ${result.faceShape} face shape!`, "success");
        } catch (err: any) {
          console.error("Selfie analysis failed:", err);
          setAvatarScanResult(`Failed to analyze selfie: ${err.message || err}`);
          addToast("❌ Selfie analysis failed.", "error");
        } finally {
          setAvatarScanning(false);
          setScanMessage("");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const getAIFeedback = () => {
    if (canvasHair === "none" && canvasBeard === "none") {
      return {
        score: 95,
        verdict: "Classic Clean Slate",
        tips: "A clean shaven look highlights your natural bone structure. Excellent for formal events and corporate presentations."
      };
    }
    if (canvasFaceShape === "round") {
      if (canvasHair === "quiff" || canvasHair === "pompadour") {
        return {
          score: 98,
          verdict: "Elite Proportions",
          tips: "Superb alignment. Height from the " + canvasHair + " offsets cheek width, visually slimming the face. A sharp goatee or stubble adds jaw length."
        };
      }
      return {
        score: 74,
        verdict: "Low Vertical Contrast",
        tips: "Round faces benefit from volume on top. Consider a textured quiff or pompadour to elongate your features."
      };
    }
    if (canvasFaceShape === "square") {
      if (canvasHair === "sidepart" || canvasHair === "undercut") {
        return {
          score: 96,
          verdict: "Chiseled Balance",
          tips: "Stunning. The " + canvasHair + " frames your square face perfectly. A light stubble complements the robust jaw without hiding your bone structure."
        };
      }
      return {
        score: 80,
        verdict: "Heavy Blocky Edges",
        tips: "Square faces have strong features. Try a side-part to soften the temples, or keep sides short with an undercut."
      };
    }
    if (canvasFaceShape === "heart") {
      if (canvasBeard === "full" || canvasBeard === "goatee") {
        return {
          score: 97,
          verdict: "Proportional Harmony",
          tips: "Perfect. A " + canvasBeard + " fills in the narrow chin width characteristic of heart face shapes. Pair with a medium volume cut like a pompadour."
        };
      }
      return {
        score: 76,
        verdict: "Unbalanced Jawline",
        tips: "A heart face has a wider forehead and narrow chin. Try adding a stubble or goatee to add visual weight to your jawline."
      };
    }
    return {
      score: 95,
      verdict: "Symmetrical Ideal",
      tips: "Oval faces are highly versatile. Any style fits. Pair the " + canvasHair + " with a groomed " + canvasBeard + " for maximum impact."
    };
  };

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSalon, setSelectedSalon] = useState(salons[0].id);
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [selectedStylist, setSelectedStylist] = useState(stylists[0].id);
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [bookingTime, setBookingTime] = useState("11:30 AM");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // AI WhatsApp Share Message State
  const [shareMessage, setShareMessage] = useState("");
  const [retentionHook, setRetentionHook] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [passRefId, setPassRefId] = useState("");

  React.useEffect(() => {
    if (!confirmedBooking) {
      setShareMessage("");
      setRetentionHook("");
      setPassRefId("");
      return;
    }
    
    let active = true;
    setShareLoading(true);

    const formattedDate = (confirmedBooking.date || "").replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setPassRefId(`BEL-${formattedDate}-${randomSuffix}`);
    
    ApiService.generateShareMessage({
      customerName: confirmedBooking.customerName,
      serviceName: confirmedBooking.serviceName,
      stylistName: confirmedBooking.stylistName,
      salonName: confirmedBooking.salonName,
      date: confirmedBooking.date,
      timeSlot: confirmedBooking.timeSlot,
      finalPrice: confirmedBooking.finalPrice
    }).then((res) => {
      if (active) {
        setShareMessage(res.shareMessage);
        setRetentionHook(res.retentionHook);
      }
    }).catch((err) => {
      console.error(err);
      if (active) {
        const referralCode = `BELSOME-${Math.floor(1000 + Math.random() * 9000)}`;
        setShareMessage(`Hey! ✂️ I just booked my next grooming session at *BELSOME (${confirmedBooking.salonName})*! \n\nI'm getting a *${confirmedBooking.serviceName}* styled by the expert *${confirmedBooking.stylistName}* on ${confirmedBooking.date} at ${confirmedBooking.timeSlot}. \n\nWant to upgrade your look too? Use my referral code *${referralCode}* to get *₹200 off* your first booking! ✨ Let's glow up! 🤵🌟`);
        setRetentionHook("Give ₹200, Get ₹200");
      }
    }).finally(() => {
      if (active) {
        setShareLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [confirmedBooking]);

  // Style DNA Quiz State
  const [quizStep, setQuizStep] = useState(0); // 0 = start, 1-5 = questions, 6 = result
  const [quizAnswers, setQuizAnswers] = useState({
    stylePref: "Trendy & Bold",
    hairLength: "Medium Length",
    colorOpen: "Subtle highlights",
    lifestyle: "Desk Executive",
    occasion: "Daily Vibe"
  });
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  // Be Next Hero State
  const [heroInput, setHeroInput] = useState("");
  const [heroResult, setHeroResult] = useState<any>(null);
  const [lookResult, setLookResult] = useState<any>(null);
  const [heroLoading, setHeroLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Express Track State
  const [expressActive, setExpressActive] = useState(false);
  const [expressCountdown, setExpressCountdown] = useState(1200); // 20 minutes
  const [expressTimerId, setExpressTimerId] = useState<any>(null);
  const [expressSlaFailed, setExpressSlaFailed] = useState(false);
  const [expressCoupon, setExpressCoupon] = useState("");

  const calculateDynamicPrice = (servicePrice: number, dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    
    const isAm = timeStr.toLowerCase().includes("am");
    let hour = parseInt(timeStr.split(":")[0]);
    if (!isAm && hour !== 12) hour += 12;
    if (isAm && hour === 12) hour = 0;

    let multiplier = 1.0;
    let reason = "Standard Rate";

    if (day >= 1 && day <= 4 && hour >= 10 && hour < 14) {
      multiplier = 0.8;
      reason = "Off-Peak Discount (20% Off)";
    }
    else if (day === 0 || day === 5 || day === 6 || hour >= 17) {
      multiplier = 1.15;
      reason = "Peak Demand Surge (15% Surge)";
    }

    return {
      originalPrice: servicePrice,
      finalPrice: Math.round(servicePrice * multiplier),
      reason
    };
  };

  const currentServiceObj = services.find((s) => s.id === selectedService) || services[0];
  const priceCalculation = calculateDynamicPrice(currentServiceObj.price, bookingDate, bookingTime);

  const handleBookingConfirm = () => {
    setBookingLoading(true);
    const stylistObj = stylists.find((s) => s.id === selectedStylist) || stylists[0];
    const salonObj = salons.find((s) => s.id === selectedSalon) || salons[0];

    const appointmentPayload = {
      customerName: "Rohan K. (You)",
      salonId: selectedSalon,
      salonName: salonObj.name,
      serviceId: selectedService,
      serviceName: currentServiceObj.name,
      stylistId: selectedStylist,
      stylistName: stylistObj.name,
      date: bookingDate,
      timeSlot: bookingTime,
      productPreference: selectedPreferences,
      originalPrice: priceCalculation.originalPrice,
      finalPrice: priceCalculation.finalPrice,
      pricingReason: priceCalculation.reason
    };

    // Simulate small saving delay for premium UX feel and complete double-click protection
    setTimeout(() => {
      addAppointment(appointmentPayload);
      setConfirmedBooking(appointmentPayload);
      addToast(`🎉 Appointment confirmed at ${salonObj.name}!`, "success");
      
      // Reset booking form state so dapper user can book again cleanly
      setSelectedSalon(salons[0].id);
      setSelectedService(services[0].id);
      setSelectedStylist(stylists[0].id);
      setBookingDate(new Date().toISOString().split("T")[0]);
      setBookingTime("11:30 AM");

      setBookingStep(5);
      setBookingLoading(false);
    }, 600);
  };

  const handleQuizSubmit = async () => {
    setQuizLoading(true);
    setQuizError(null);
    addToast("🧬 Running AI Style DNA matching...", "info");
    try {
      const dna = await ApiService.submitStyleDNA(quizAnswers);
      setQuizResult(dna);
      setQuizStep(6);
      addToast("✨ Style DNA Passport generated!", "success");
    } catch (e) {
      console.error(e);
      setQuizError("AI is unavailable. Make sure the backend is running.");
      addToast("❌ Failed to generate Style DNA.", "error");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleHeroExtract = async (link?: string) => {
    const input = link || heroInput;
    if (!input.trim()) return;

    setHeroLoading(true);
    setHeroError(null);
    addToast("🎬 Extracting style from celebrity image...", "info");
    try {
      const response = await ApiService.extractHeroStyle(input);
      setHeroResult(response);
      
      const look = await ApiService.getFullLook(response.celebrityMatch + " " + response.hairstyle);
      setLookResult(look);
      addToast(`✨ Look matched: ${response.celebrityMatch} - ${response.hairstyle}!`, "success");
    } catch (e) {
      console.error(e);
      setHeroError("AI is unavailable. Make sure the backend is running.");
      addToast("❌ Style extraction failed.", "error");
    } finally {
      setHeroLoading(false);
    }
  };

  const startExpressTrack = () => {
    setExpressActive(true);
    setExpressSlaFailed(false);
    setExpressCoupon("");
    setExpressCountdown(1200);
    addToast("⏱️ BELSOME 20-Min SLA track activated!", "warning");

    const interval = setInterval(() => {
      setExpressCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setExpressTimerId(interval);
  };

  const triggerSlaFailure = () => {
    if (expressTimerId) clearInterval(expressTimerId);
    setExpressCountdown(0);
    setExpressSlaFailed(true);
    setExpressCoupon("EXPRESSFAIL20");
    addToast("🚨 SLA breached! ₹200 failure refund coupon generated.", "error");
  };

  const downloadLookCard = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-panel p-4 rounded-xl space-y-1 border border-slate-200/60 shadow-sm bg-white">
          <h3 className="text-xs font-mono text-slate-400 uppercase px-3 pb-2 font-bold tracking-wider">Customer Actions</h3>
          {[
            { id: "book", label: "Book Appointment", icon: Calendar },
            { id: "quiz", label: "Style DNA Quiz", icon: Sparkles },
            { id: "canvas", label: "Interactive Canvas", icon: Scissors },
            { id: "hero", label: "Be Next Hero", icon: Play },
            { id: "express", label: "Express Track SLA", icon: Timer },
            { id: "portfolios", label: "Stylist Portfolios", icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setConfirmedBooking(null);
                  setBookingStep(1);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-50 border border-purple-100 text-purple-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Preferences Quick Check */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200/60 shadow-sm bg-white space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-display">
            <ShoppingBag className="w-4 h-4 text-pink-600" />
            Product Preference
          </h4>
          <p className="text-[10px] text-slate-500 leading-normal font-semibold">
            BELSOME checks salon chemical inventory before matches. Saved preferences:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["Organic", "Vegan", "Toxin-Free", "Paraben-Free", "Fragrance-Free"].map((pref) => {
              const selected = selectedPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`px-2.5 py-1 rounded text-[10px] border transition-all font-semibold ${
                    selected
                      ? "bg-pink-50 border-pink-200 text-pink-700 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        {activeTab === "book" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 shadow-sm bg-white space-y-6">
            {/* Redesigned Booking Timeline Nodes */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900">Smart Appointment Booking</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">BELSOME automated scheduling engine</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-purple-50 border border-purple-100 text-purple-700 font-mono font-bold shadow-sm uppercase tracking-wider">
                  STEP {bookingStep} of 4
                </span>
              </div>
              
              {/* Horizontal Timeline Tracker */}
              <div className="relative flex items-center justify-between mt-6 px-4">
                {/* Background connector line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 left-4 h-0.5 bg-brand-primary -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: `${((bookingStep - 1) / 3) * 100}%` }}
                />

                {[
                  { step: 1, label: "Service", desc: "Select care" },
                  { step: 2, label: "Stylist", desc: "Choose artist" },
                  { step: 3, label: "Schedule", desc: "Select time" },
                  { step: 4, label: "Review", desc: "Calculate price" }
                ].map((node) => {
                  const isActive = node.step === bookingStep;
                  const isCompleted = node.step < bookingStep;
                  return (
                    <div 
                      key={node.step} 
                      onClick={() => {
                        if (node.step < bookingStep) {
                          setBookingStep(node.step);
                        }
                      }}
                      className={`relative flex flex-col items-center z-10 cursor-pointer group`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                          isActive 
                            ? "bg-brand-primary border-brand-primary text-white ring-4 ring-purple-100 shadow-md scale-110"
                            : isCompleted
                            ? "bg-purple-100 border-purple-200 text-purple-700"
                            : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-350"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4 text-purple-700" /> : node.step}
                      </div>
                      <span className={`text-[11px] font-bold mt-2 ${isActive ? "text-brand-primary" : isCompleted ? "text-purple-700" : "text-slate-500"}`}>
                        {node.label}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold hidden sm:inline leading-none mt-0.5">
                        {node.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Select Service */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-xs text-purple-700 uppercase tracking-wider font-mono">Select Salon & Service</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((serv) => (
                    <div
                      key={serv.id}
                      onClick={() => {
                        setSelectedService(serv.id);
                        setBookingStep(2);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 bg-white ${
                        selectedService === serv.id
                          ? "bg-purple-50/50 border-brand-primary shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/30"
                      }`}
                    >
                      <img src={serv.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">{serv.category}</span>
                        <h5 className="font-bold text-sm text-slate-800 leading-tight">{serv.name}</h5>
                        <p className="text-xs text-purple-700 font-bold mt-1">₹{serv.price} • {serv.duration} mins</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Stylist */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-inner">
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Schedule Date Selector</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Change booking date to check live stylist availability calendars</p>
                  </div>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      addToast(`📅 Date updated: ${e.target.value}. Checking stylist schedules...`, "info");
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none shadow-sm cursor-pointer"
                  />
                </div>

                <h4 className="font-semibold text-xs text-purple-700 dark:text-purple-400 uppercase tracking-wider font-mono">Select Stylist & Slot</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stylists.map((sty) => {
                    const stylistAppts = appointments.filter(
                      (a) => a.stylistId === sty.id && a.date === bookingDate && a.status !== "Cancelled"
                    );
                    const bookedSlots = stylistAppts.map((a) => a.timeSlot);
                    const totalSlots = ["09:00 AM", "11:30 AM", "01:30 PM", "03:00 PM", "05:30 PM", "07:00 PM"];
                    
                    let availabilityText = "🟢 6/6 Slots Free";
                    let availabilityColor = "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/40";
                    
                    if (bookedSlots.length === totalSlots.length) {
                      availabilityText = "🔴 Fully Booked";
                      availabilityColor = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40";
                    } else if (bookedSlots.length > 0) {
                      availabilityText = `🟡 ${totalSlots.length - bookedSlots.length}/6 Slots Free`;
                      availabilityColor = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40";
                    }

                    return (
                      <div
                        key={sty.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col gap-3.5 bg-white dark:bg-slate-950 ${
                          selectedStylist === sty.id
                            ? "bg-purple-50/50 dark:bg-purple-950/10 border-brand-primary dark:border-purple-600 shadow-sm"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50/30 dark:hover:bg-slate-900/30"
                        }`}
                      >
                        <div 
                          className="flex items-start gap-4 cursor-pointer"
                          onClick={() => {
                            setSelectedStylist(sty.id);
                            setBookingStep(3);
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 uppercase text-sm shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner">
                            {sty.name.charAt(0)}
                          </div>
                          <div className="flex-grow space-y-1">
                            <div className="flex justify-between items-center">
                              <h5 className="font-bold text-sm text-slate-800 dark:text-slate-250 leading-none">{sty.name}</h5>
                              <span className="text-[10px] bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">
                                AI Exam: {sty.aiScore}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-semibold">{sty.specialty}</p>
                            <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-slate-400">
                              <div className="flex items-center gap-2">
                                <span>Exp: <strong className="text-slate-700 dark:text-slate-300">{sty.experience}</strong></span>
                                <span>•</span>
                                <span className="text-amber-600 font-bold flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-500" /> {sty.rating}</span>
                              </div>
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded border font-mono font-bold ${availabilityColor}`}>
                                {availabilityText}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Availability Time Slot Grid */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                          <span className="text-[8.5px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">
                            Daily Availability Calendar ({bookingDate})
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {totalSlots.map((slot) => {
                              const isBooked = bookedSlots.includes(slot);
                              return (
                                <button
                                  key={slot}
                                  disabled={isBooked}
                                  onClick={() => {
                                    setSelectedStylist(sty.id);
                                    setBookingTime(slot);
                                    addToast(`⚡ Express Path: Selected ${sty.name} at ${slot}!`, "success");
                                    setBookingStep(4);
                                  }}
                                  className={`py-1.5 rounded-lg border text-center transition-all ${
                                    isBooked
                                      ? "bg-slate-50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 line-through cursor-not-allowed opacity-45"
                                      : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-primary dark:hover:bg-purple-600 hover:text-white dark:hover:text-white hover:border-brand-primary dark:hover:border-purple-600 hover:shadow-sm text-[10px] font-bold"
                                  }`}
                                >
                                  {slot.replace(" ", "\u00A0")}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setBookingStep(1)} className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 pt-2 block font-semibold">← Back to services</button>
              </div>
            )}

            {/* Step 3: Date, Time & Product Preference Warning */}
            {bookingStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-purple-700 uppercase">Select Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  {/* Time Slots Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-purple-700 uppercase block">Select Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00 AM", "11:30 AM", "01:30 PM", "03:00 PM", "05:30 PM", "07:00 PM"].map((slot) => {
                        const calculated = calculateDynamicPrice(currentServiceObj.price, bookingDate, slot);
                        const isDiscount = calculated.finalPrice < calculated.originalPrice;
                        const isSurge = calculated.finalPrice > calculated.originalPrice;

                        return (
                          <button
                            key={slot}
                            onClick={() => setBookingTime(slot)}
                            className={`p-2.5 rounded-lg border text-center transition-all ${
                              bookingTime === slot
                                ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/10"
                                : "bg-slate-50 border-slate-200 hover:border-slate-350 hover:bg-slate-100 text-slate-700 font-semibold"
                            }`}
                          >
                            <span className="block text-xs font-bold">{slot}</span>
                            <span className={`text-[8px] font-mono font-bold block mt-1 ${
                              isDiscount ? "text-green-600" : isSurge ? "text-amber-600" : "text-slate-400"
                            }`}>
                              {isDiscount ? "-20% Off" : isSurge ? "+15% Surge" : "Standard"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Preference Alert Box */}
                {selectedPreferences.length > 0 && (
                  <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 flex items-start gap-3 text-pink-800">
                    <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold">Preference Verification Match</h5>
                      <p className="text-[10px] text-pink-600 leading-relaxed font-semibold mt-1">
                        BELSOME verified stock list. Stylist will strictly utilize **{selectedPreferences.join(" / ")}** certified products during your appointment session.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={() => setBookingStep(2)} className="text-xs text-slate-400 hover:text-slate-700 font-semibold">← Back to stylist</button>
                  <button
                    onClick={() => setBookingStep(4)}
                    className="px-5 py-2.5 rounded-lg bg-brand-primary text-white font-bold text-xs tracking-wider uppercase hover:opacity-90 shadow-sm"
                  >
                    Review Price Summary →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review Summary & Dynamic Price Display */}
            {bookingStep === 4 && (
              <div className="space-y-6">
                <h4 className="font-semibold text-xs text-purple-700 uppercase tracking-wider font-mono">Dynamic Price Calculation</h4>
                
                <div className="glass-panel p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Selected Service:</span>
                    <span className="font-bold text-slate-800">{currentServiceObj.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Scheduled Time:</span>
                    <span className="font-bold text-slate-800">{bookingDate} • {bookingTime}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Assigned Stylist:</span>
                    <span className="font-bold text-slate-800">
                      {stylists.find((s) => s.id === selectedStylist)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Eco Preferences:</span>
                    <span className="font-bold text-pink-600">
                      {selectedPreferences.length > 0 ? selectedPreferences.join(", ") : "Standard Products"}
                    </span>
                  </div>
                  
                  <div className="h-px bg-slate-200 my-2" />

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 block font-mono font-bold leading-none">Pricing Reason</span>
                      <span className={`text-[10px] font-bold ${
                        priceCalculation.finalPrice < priceCalculation.originalPrice ? "text-green-600" : "text-amber-600"
                      }`}>
                        {priceCalculation.reason}
                      </span>
                    </div>
                    <div className="text-right">
                      {priceCalculation.finalPrice !== priceCalculation.originalPrice && (
                        <span className="text-xs text-slate-400 line-through block leading-none">₹{priceCalculation.originalPrice}</span>
                      )}
                      <span className="text-xl font-extrabold text-slate-900 font-mono">₹{priceCalculation.finalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button onClick={() => setBookingStep(3)} className="text-xs text-slate-400 hover:text-slate-700 font-semibold">← Edit schedule</button>
                  <button
                    onClick={handleBookingConfirm}
                    disabled={bookingLoading}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-xs tracking-wider uppercase hover:opacity-90 disabled:opacity-50 shadow-md shadow-brand-primary/10 flex items-center gap-1.5"
                  >
                    {bookingLoading && <RefreshCcw className="w-3.5 h-3.5 animate-spin" />}
                    {bookingLoading ? "Confirming..." : "Confirm & Book Now"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Booking Confirmation */}
            {bookingStep === 5 && confirmedBooking && (
              <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-display font-extrabold text-2xl text-slate-900">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                  Your appointment booking has been registered in our Zustand database and is visible on both the Owner and Stylist dashboards.
                </p>

                {/* BELSOME VIP Boarding Pass Ticket */}
                <div id="booking-boarding-pass" className="relative bg-slate-950 border border-amber-500/30 rounded-2xl p-6 text-white text-left space-y-6 shadow-2xl overflow-hidden mt-4">
                  {/* Gold Foil Top Border */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />
                  
                  {/* Left & Right Ticket Punch Cutouts */}
                  <div className="absolute top-[64%] -left-3.5 w-7 h-7 rounded-full bg-slate-50 border-r border-amber-500/20 -translate-y-1/2 z-10" />
                  <div className="absolute top-[64%] -right-3.5 w-7 h-7 rounded-full bg-slate-50 border-l border-amber-500/20 -translate-y-1/2 z-10" />

                  {/* Header Branding */}
                  <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">BELSOME VIP BOARDING PASS</span>
                      </div>
                      <h4 className="font-display font-extrabold text-lg text-white">{confirmedBooking.salonName}</h4>
                    </div>
                    <span className="text-[8px] bg-amber-500/10 border border-amber-500/35 text-amber-400 font-mono font-bold px-2 py-0.5 rounded">
                      PRIORITY GATE
                    </span>
                  </div>

                  {/* Ticket Details Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-semibold text-slate-350">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Passenger</span>
                      <strong className="text-white text-sm">{confirmedBooking.customerName.replace(" (You)", "")}</strong>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Crew / Stylist</span>
                      <strong className="text-amber-355 text-sm">{confirmedBooking.stylistName}</strong>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Class / Service</span>
                      <strong className="text-white text-sm">{confirmedBooking.serviceName}</strong>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider">SLA Cover</span>
                      <strong className="text-purple-400 text-sm font-bold">20-Min Express SLA</strong>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Departure Date</span>
                      <strong className="text-white text-sm font-mono">{confirmedBooking.date}</strong>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Boarding Time</span>
                      <strong className="text-white text-sm font-mono">{confirmedBooking.timeSlot}</strong>
                    </div>
                  </div>

                  {/* Dashed Tear Line */}
                  <div className="border-dashed border-t border-slate-800/80 my-2 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    
                    {/* QR Code and Pricing */}
                    <div className="space-y-3 flex-grow">
                      <div>
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Price Paid (All Inclusive)</span>
                        <strong className="text-2xl text-white font-mono font-black">₹{confirmedBooking.finalPrice}</strong>
                      </div>
                      
                      {/* Barcode representation */}
                      <div className="space-y-1">
                        <div className="flex gap-0.5 items-end h-6 opacity-60">
                          {[1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 2, 3, 1, 4, 1, 2, 3].map((w, idx) => (
                            <div key={idx} className="bg-white h-full" style={{ width: `${w}px` }} />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 block">
                          REF ID: {passRefId}
                        </span>
                      </div>
                    </div>

                    {/* QR Code element */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-800 shadow-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&color=09090b&data=${encodeURIComponent(JSON.stringify({
                          bookingId: `BEL-booking-${Math.floor(100000 + Math.random() * 900000)}`,
                          client: confirmedBooking.customerName,
                          service: confirmedBooking.serviceName,
                          salon: confirmedBooking.salonName,
                          date: confirmedBooking.date,
                          time: confirmedBooking.timeSlot,
                          stylist: confirmedBooking.stylistName,
                          price: `₹${confirmedBooking.finalPrice}`
                        }))}`}
                        alt="Booking QR Code Pass"
                        className="w-[105px] h-[105px]"
                      />
                      <span className="text-[7.5px] font-mono font-extrabold text-slate-800 uppercase tracking-widest">SCAN AT SALON</span>
                    </div>

                  </div>
                </div>

                {/* AI WhatsApp Share Panel */}
                <div className="p-5 bg-gradient-to-br from-purple-50/50 to-pink-50/30 border border-purple-100 rounded-xl text-left space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-650 animate-pulse" />
                      <span className="text-[10px] text-purple-750 font-mono font-bold uppercase tracking-wider">AI Viral Share Hook</span>
                    </div>
                    {retentionHook && (
                      <span className="text-[9px] bg-pink-50 border border-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">
                        🎁 {retentionHook}
                      </span>
                    )}
                  </div>

                  {shareLoading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-3 space-y-2 h-[100px]">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-11/12" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-10/12" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                      </div>
                      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
                    </div>
                  ) : shareMessage ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea
                          readOnly
                          value={shareMessage}
                          rows={4}
                          className="w-full bg-white/85 border border-purple-100 rounded-lg p-3 text-[11px] text-slate-755 font-semibold focus:outline-none focus:border-purple-300 resize-none shadow-inner leading-relaxed"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareMessage);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition-all flex items-center justify-center shadow-sm"
                          title="Copy message"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const encodedText = encodeURIComponent(shareMessage);
                            window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
                          }}
                          className="w-full py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Share via WhatsApp
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs text-slate-400 font-semibold">
                      Failed to load AI share invitation.
                    </div>
                  )}
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      const windowUrl = "about:blank";
                      const uniqueName = new Date().getTime();
                      const windowName = "PrintWindow_" + uniqueName;
                      const printWindow = window.open(windowUrl, windowName, "left=5000,top=5000,width=0,height=0");
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>BELSOME VIP Booking Pass</title>
                              <style>
                                body { background: #fff; margin: 0; padding: 20px; font-family: system-ui, sans-serif; display: flex; justify-content: center; }
                                #booking-boarding-pass { 
                                  background: #09090b; color: #fff; border: 1px solid #d97706; padding: 24px; border-radius: 16px; width: 380px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;
                                }
                                .flex { display: flex; }
                                .justify-between { justify-content: space-between; }
                                .items-start { align-items: flex-start; }
                                .items-center { align-items: center; }
                                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                                .font-mono { font-family: monospace; }
                                .text-amber-400 { color: #fbbf24; }
                                .text-amber-300 { color: #fcd34d; }
                                .text-slate-350 { color: #cbd5e1; }
                                .text-slate-500 { color: #64748b; }
                                .border-dashed { border-top: 1.5px dashed #334155; margin-top: 16px; padding-top: 16px; }
                                .barcode { display: flex; gap: 1px; height: 24px; margin-top: 4px; }
                                .barcode-line { background: #white; height: 100%; }
                                .qr-box { padding: 8px; background: #fff; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }
                                .text-slate-800 { color: #1e293b; }
                                .h-1 { height: 4px; background: linear-gradient(to right, #d97706, #f59e0b, #d97706); position: absolute; top: 0; left: 0; right: 0; }
                              </style>
                            </head>
                            <body>
                              <div id="booking-boarding-pass">
                                <div class="h-1"></div>
                                <div class="flex justify-between items-start" style="border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px;">
                                  <div>
                                    <div class="flex items-center" style="gap: 6px; font-size: 10px; font-weight: bold; color: #fbbf24;">VIP BOARDING PASS</div>
                                    <h3 style="margin: 4px 0 0 0; font-size: 18px;">${confirmedBooking.salonName}</h3>
                                  </div>
                                  <span style="font-size: 8px; background: rgba(245, 158, 11, 0.1); border: 1.5px solid #d97706; padding: 2px 6px; border-radius: 4px; color: #fbbf24; font-weight: bold;">PRIORITY GATE</span>
                                </div>
                                <div class="grid" style="font-size: 12px; margin-bottom: 16px;">
                                  <div><span style="font-size: 8px; color: #64748b; display: block;">PASSENGER</span><strong>${confirmedBooking.customerName.replace(" (You)", "")}</strong></div>
                                  <div><span style="font-size: 8px; color: #64748b; display: block;">CREW / STYLIST</span><strong style="color: #fcd34d;">${confirmedBooking.stylistName}</strong></div>
                                  <div><span style="font-size: 8px; color: #64748b; display: block;">CLASS / SERVICE</span><strong>${confirmedBooking.serviceName}</strong></div>
                                  <div><span style="font-size: 8px; color: #64748b; display: block;">SLA COVER</span><strong style="color: #c084fc;">20-Min SLA</strong></div>
                                  <div><span style="font-size: 8px; color: #64748b; display: block;">DEPARTURE DATE</span><strong class="font-mono">${confirmedBooking.date}</strong></div>
                                  <div><span style="font-size: 8px; color: #64748b; display: block;">BOARDING TIME</span><strong class="font-mono">${confirmedBooking.timeSlot}</strong></div>
                                </div>
                                <div class="flex justify-between items-center border-dashed">
                                  <div>
                                    <span style="font-size: 8px; color: #64748b; display: block;">PRICE PAID (NET)</span>
                                    <strong style="font-size: 24px; font-weight: 900;">₹${confirmedBooking.finalPrice}</strong>
                                    <div style="font-size: 8px; color: #64748b; margin-top: 8px;">REF ID: ${passRefId}</div>
                                  </div>
                                  <div class="qr-box">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&color=09090b&data=${encodeURIComponent(JSON.stringify({
                                      bookingId: `BEL-booking-${Math.floor(100000 + Math.random() * 900000)}`,
                                      client: confirmedBooking.customerName,
                                      service: confirmedBooking.serviceName,
                                      salon: confirmedBooking.salonName,
                                      date: confirmedBooking.date,
                                      time: confirmedBooking.timeSlot,
                                      stylist: confirmedBooking.stylistName,
                                      price: `₹${confirmedBooking.finalPrice}`
                                    }))}" style="width: 100px; height: 100px;" />
                                    <span style="font-size: 7px; color: #1e293b; font-weight: bold; margin-top: 4px; font-family: monospace;">SCAN AT COUNTER</span>
                                  </div>
                                </div>
                              </div>
                              <script>
                                window.onload = function() {
                                  window.print();
                                  setTimeout(function() { window.close(); }, 500);
                                }
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}
                    className="flex-1 px-5 py-2.5 rounded-lg bg-purple-55 border border-purple-200 text-purple-700 text-xs font-bold tracking-wider uppercase hover:bg-purple-100 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Print Pass
                  </button>
                  
                  <button
                    onClick={() => {
                      setBookingStep(1);
                      setConfirmedBooking(null);
                    }}
                    className="flex-1 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase border border-slate-200 shadow-sm"
                  >
                    Book Another Service
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Style DNA Quiz */}
        {activeTab === "quiz" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 shadow-sm bg-white space-y-6">
            {quizStep === 0 && (
              <div className="text-center py-10 space-y-6 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-3xl text-slate-900">Visual Style DNA Onboarding</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Take our 5-question visual styling assessment. BELSOME AI will match your profile DNA with the top 3 stylists in Hyderabad.
                  </p>
                </div>
                <button
                  onClick={() => setQuizStep(1)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary font-bold text-xs tracking-wider uppercase hover:opacity-90 shadow-md shadow-brand-primary/10 text-white"
                >
                  Start Style Assessment
                </button>
              </div>
            )}

            {/* Quiz Questions */}
            {quizStep >= 1 && quizStep <= 5 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-700 font-mono font-bold">QUESTION {quizStep} OF 5</span>
                  <span className="text-slate-500 font-semibold">{Math.round((quizStep / 5) * 100)}% Complete</span>
                </div>

                {quizStep === 1 && (
                  <QuizQuestionCard
                    title="What represents your primary style aesthetic?"
                    options={[
                      { id: "Trendy & Bold", label: "Trendy / Bold Streetwear", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200" },
                      { id: "Sleek Corporate", label: "Sleek Executive / Dapper", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200" },
                      { id: "Glam / Celeb", label: "High Glam / Celebrity", img: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=200" },
                      { id: "Natural Easy", label: "Natural Low-Maintenance", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" }
                    ]}
                    selected={quizAnswers.stylePref}
                    onSelect={(val) => {
                      setQuizAnswers({ ...quizAnswers, stylePref: val });
                      setQuizStep(2);
                    }}
                  />
                )}

                {quizStep === 2 && (
                  <QuizQuestionCard
                    title="What is your current or target hair length?"
                    options={[
                      { id: "Buzz / Fade", label: "Ultra Short / Fade", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200" },
                      { id: "Short crop", label: "Short Crop / Textured Crop", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
                      { id: "Medium Length", label: "Medium Quiff / Side-Part Flow", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
                      { id: "Long flow", label: "Long Flow / Top-Knot Ponytail", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" }
                    ]}
                    selected={quizAnswers.hairLength}
                    onSelect={(val) => {
                      setQuizAnswers({ ...quizAnswers, hairLength: val });
                      setQuizStep(3);
                    }}
                  />
                )}

                {quizStep === 3 && (
                  <QuizQuestionCard
                    title="What is your openness towards hair coloring or highlights?"
                    options={[
                      { id: "Natural dark only", label: "Stay Classic Natural Dark", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" },
                      { id: "Subtle highlights", label: "Subtle Warm Ash Highlights", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200" },
                      { id: "Bold bleach colors", label: "Bold Bleach / Platinum / Accent Stripes", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200" },
                      { id: "Organic grey coverage", label: "Gentle Grey Coverage Treatments", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" }
                    ]}
                    selected={quizAnswers.colorOpen}
                    onSelect={(val) => {
                      setQuizAnswers({ ...quizAnswers, colorOpen: val });
                      setQuizStep(4);
                    }}
                  />
                )}

                {quizStep === 4 && (
                  <QuizQuestionCard
                    title="Which best describes your daily lifestyle?"
                    options={[
                      { id: "Active Athlete", label: "High Activity / Sports / Fitness", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200" },
                      { id: "Desk Executive", label: "Desk Executive / Tech Professional", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" },
                      { id: "Creative Freelance", label: "Creative Artist / Design Freelance", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
                      { id: "Socialite / PR", label: "Social PR / Client Facing Sales", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" }
                    ]}
                    selected={quizAnswers.lifestyle}
                    onSelect={(val) => {
                      setQuizAnswers({ ...quizAnswers, lifestyle: val });
                      setQuizStep(5);
                    }}
                  />
                )}

                {quizStep === 5 && (
                  <QuizQuestionCard
                    title="What principal event type are you preparing for?"
                    options={[
                      { id: "Wedding / Festive", label: "Grand Wedding / Festive Season", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=200" },
                      { id: "Daily Vibe", label: "Everyday Vibe Maintenance", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200" },
                      { id: "Professional Meeting", label: "Executive Presentations / Interviews", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200" },
                      { id: "Night Out / Clubbing", label: "Weekend Clubbing / Concerts", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=200" }
                    ]}
                    selected={quizAnswers.occasion}
                    onSelect={async (val) => {
                      const updated = { ...quizAnswers, occasion: val };
                      setQuizAnswers(updated);
                      setQuizStep(6);
                      setQuizLoading(true);
                      setQuizError(null);
                      addToast("🧬 Running AI Style DNA matching...", "info");
                      try {
                        const res = await ApiService.submitStyleDNA(updated);
                        setQuizResult(res);
                        addToast("✨ Style DNA Passport generated!", "success");
                      } catch (e) {
                        console.error(e);
                        setQuizError("AI is unavailable. Make sure the backend is running.");
                        addToast("❌ Failed to generate Style DNA.", "error");
                      } finally {
                        setQuizLoading(false);
                      }
                    }}
                  />
                )}

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setQuizStep((p) => p - 1)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                  >
                    ← Back
                  </button>
                  <span className="text-xs text-slate-400 font-mono font-bold">BELSOME AI Profiler</span>
                </div>
              </div>
            )}

            {/* Quiz Result Display */}
            {quizStep === 6 && (
              <div className="space-y-6">
                {quizError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                    {quizError}
                  </div>
                )}
                {quizLoading ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6 shadow-2xl overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400/40 via-amber-300/40 to-amber-500/40" />
                      <div className="space-y-3">
                        <div className="h-4 bg-amber-950/40 border border-amber-500/10 rounded w-44" />
                        <div className="h-7 bg-slate-900 rounded w-64" />
                        <div className="h-4 bg-slate-900 rounded w-48" />
                      </div>
                      <div className="space-y-2 border-l-2 border-amber-500/20 pl-3">
                        <div className="h-3 bg-slate-900 rounded w-full" />
                        <div className="h-3 bg-slate-900 rounded w-11/12" />
                        <div className="h-3 bg-slate-900 rounded w-5/6" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 h-24 flex flex-col justify-between">
                            <div className="h-2.5 bg-slate-800 rounded w-20" />
                            <div className="h-3.5 bg-slate-850 rounded w-28" />
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-2">
                        <div className="h-3 bg-slate-850 rounded w-28" />
                        <div className="h-3 bg-slate-850 rounded w-full" />
                        <div className="h-3 bg-slate-850 rounded w-5/6" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48" />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4 flex flex-col justify-between h-40">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <div className="h-4 bg-slate-250 dark:bg-slate-800 rounded w-24" />
                                <div className="h-3.5 bg-slate-250 dark:bg-slate-800 rounded w-12" />
                              </div>
                              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                              <div className="space-y-1.5 pt-1">
                                <div className="h-2.5 bg-slate-150 dark:bg-slate-855 rounded w-full" />
                                <div className="h-2.5 bg-slate-150 dark:bg-slate-855 rounded w-5/6" />
                              </div>
                            </div>
                            <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : quizResult ? (
                  <div className="space-y-6">
                    {/* Style DNA Passport Card */}
                    <div className="relative rounded-2xl border-2 border-amber-500/20 bg-slate-950 p-6 space-y-6 shadow-2xl text-white overflow-hidden">
                      {/* Gold foil header line */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
                      
                      {/* High-tech glow and background details */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                      
                      {/* Barcode/HUD details */}
                      <div className="absolute top-6 right-6 flex flex-col items-end opacity-45 font-mono text-[8px] text-slate-400">
                        <span>PASSPORT ID: B-{quizResult.profileName.substring(0,3).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</span>
                        <span>ISSUED: 2026-06-03</span>
                        <div className="h-6 w-24 bg-white mt-1 border-l-4 border-black" style={{ backgroundImage: "repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px)" }} />
                      </div>

                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-[9px] tracking-widest uppercase font-bold">
                          BELSOME STYLE DNA PASSPORT
                        </span>
                        <h3 className="font-display font-black text-3xl text-white tracking-wide mt-2">{quizResult.profileName} Identity</h3>
                        <p className="text-xs text-amber-300 font-bold font-mono tracking-wider">{quizResult.tagline}</p>
                      </div>

                      <p className="text-xs text-slate-350 leading-relaxed max-w-xl font-medium border-l-2 border-amber-500/40 pl-3">
                        {quizResult.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 shadow-inner flex flex-col justify-between min-h-[80px]">
                          <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-wider">Hair Suggestion</span>
                          <span className="font-bold text-white mt-1.5 block leading-tight">{quizResult.hairSuggestion}</span>
                        </div>
                        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 shadow-inner flex flex-col justify-between min-h-[80px]">
                          <span className="text-[9px] text-pink-400 font-mono font-bold uppercase tracking-wider">Beard Suggestion</span>
                          <span className="font-bold text-white mt-1.5 block leading-tight">{quizResult.beardSuggestion}</span>
                        </div>
                        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 shadow-inner flex flex-col justify-between min-h-[80px]">
                          <span className="text-[9px] text-purple-400 font-mono font-bold uppercase tracking-wider">Color Suggestion</span>
                          <span className="font-bold text-white mt-1.5 block leading-tight">{quizResult.colorSuggestion}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-xs leading-relaxed text-slate-300 font-semibold flex items-start gap-2.5 shadow-sm">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block mb-1 font-mono text-[10px] tracking-wider uppercase">DNA Alignment Reasoning:</strong>
                          {quizResult.matchReasoning}
                        </div>
                      </div>
                    </div>

                    {/* Matched Stylists */}
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-base text-slate-900">Top 3 Stylist Personas for You</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {quizResult.stylistMatches.map((m: any, idx: number) => (
                          <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-3 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 rounded-full blur-md" />
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-sm text-slate-800">{m.name}</h5>
                                <span className="text-xs text-brand-secondary font-mono font-bold">{m.matchPercentage}% Match</span>
                              </div>
                              <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono inline-block font-bold">
                                {m.specialty}
                              </span>
                              <p className="text-[11px] text-slate-500 leading-normal font-semibold">{m.reasoning}</p>
                            </div>
                            <button
                              onClick={() => {
                                const matchedSty = stylists.find((s) => s.name.toLowerCase().includes(m.name.split(" ")[0].toLowerCase()));
                                if (matchedSty) {
                                  setSelectedStylist(matchedSty.id);
                                }
                                setActiveTab("book");
                                setBookingStep(3);
                              }}
                              className="w-full mt-2 py-2 rounded-lg bg-slate-100 hover:bg-brand-primary hover:text-white text-slate-700 text-[10px] font-bold tracking-wider uppercase transition-all border border-slate-200"
                            >
                              Book This Stylist
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => {
                          setQuizStep(0);
                          setQuizResult(null);
                        }}
                        className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
                      >
                        <RefreshCcw className="w-3 h-3" /> Reset Assessment Quiz
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
             {/* Be Next Hero & Look Finder */}
        {activeTab === "hero" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 shadow-sm bg-white space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-700 fill-purple-700/10" />
                  Be Next Hero — Celebrity Outfit & Style Matcher
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Paste an image link, Instagram URL, or enter a celebrity name to extract their hairstyle and purchase their clothes online.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-purple-50 border border-purple-100 text-purple-700 font-mono font-bold shadow-sm uppercase tracking-wider">
                Vogue Vision AI v2.0
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-150">
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Paste Instagram Post URL, Image Link, or Celebrity Name (e.g., Virat Kohli dapper look)"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-primary w-full shadow-sm"
              />
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleHeroExtract()}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs tracking-wider uppercase hover:opacity-90 shadow-sm transition-all shrink-0"
                >
                  Analyze & Shop
                </button>
                <button
                  onClick={() => handleHeroExtract("Uploaded Photo: High fade crop")}
                  className="px-3 py-2.5 rounded-xl bg-slate-105 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm transition-all"
                  title="Upload Image"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Gallery of style icons when empty */}
            {!heroResult && !heroLoading && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                  <h4 className="font-display font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Style Hero Inspiration Lookbook
                  </h4>
                  <span className="text-[10px] text-purple-700 font-mono font-bold">Select a preset to scan & match style instantly</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Virat Kohli",
                      role: "Cricket Captain / Athleisure Vibe",
                      hair: "Spiky Razor Quiff",
                      beard: "Thick Contoured Beard",
                      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
                      query: "Virat Kohli spiky quiff",
                      badge: "96% Vibe Match"
                    },
                    {
                      name: "Allu Arjun",
                      role: "Tollywood Style Icon / Messy Waves",
                      hair: "Messy Flow Wave Cut",
                      beard: "Dense Groomed Beard",
                      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
                      query: "Allu Arjun messy flow",
                      badge: "98% Vibe Match"
                    },
                    {
                      name: "Ranbir Kapoor",
                      role: "Classic Corporate Dapper",
                      hair: "Textured Volume Crop",
                      beard: "Perfect Heavy Stubble",
                      img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400",
                      query: "Ranbir Kapoor dapper quiff",
                      badge: "94% Vibe Match"
                    },
                    {
                      name: "Shah Rukh Khan",
                      role: "King of Bollywood Romance",
                      hair: "Shaggy Layered Flow",
                      beard: "Clean Lined Stubble",
                      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
                      query: "Shah Rukh Khan messy flow",
                      badge: "97% Vibe Match"
                    },
                    {
                      name: "Timothée Chalamet",
                      role: "Hollywood Casual Indie",
                      hair: "Loose Messy French Crop",
                      beard: "Clean Shaven",
                      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
                      query: "Timothee Chalamet french crop",
                      badge: "95% Vibe Match"
                    },
                    {
                      name: "Ranveer Singh",
                      role: "High-Fashion Fusion Glam",
                      hair: "Slicked Long Undercut",
                      beard: "Imperial Mustache",
                      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400",
                      query: "Ranveer Singh long undercut",
                      badge: "92% Vibe Match"
                    }
                  ].map((hero) => (
                    <div
                      key={hero.name}
                      onClick={() => {
                        setHeroInput(hero.query);
                        handleHeroExtract(hero.query);
                      }}
                      className="group relative rounded-xl overflow-hidden border border-slate-200/80 bg-white cursor-pointer hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img 
                          src={hero.img} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                          alt={hero.name} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        <span className="absolute top-2 right-2 bg-purple-700/90 text-white font-mono font-bold text-[8.5px] px-2 py-0.5 rounded shadow-sm">
                          {hero.badge}
                        </span>
                        <div className="absolute bottom-2 left-3 right-3 text-white">
                          <h5 className="font-display font-extrabold text-sm leading-tight">{hero.name}</h5>
                          <p className="text-[10px] text-gray-300 font-semibold leading-normal">{hero.role}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50/50 border-t border-slate-100 space-y-1.5 text-[11px] font-semibold text-slate-600">
                        <div className="flex justify-between">
                          <span>Hairstyle:</span>
                          <strong className="text-slate-800">{hero.hair}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Facial Hair:</span>
                          <strong className="text-slate-800">{hero.beard}</strong>
                        </div>
                        <div className="pt-2 text-center border-t border-slate-100">
                          <span className="inline-block text-[9.5px] font-bold text-purple-750 uppercase tracking-wider bg-purple-50 border border-purple-100 px-2 py-0.5 rounded group-hover:bg-purple-100 transition-all">
                            Scan Style & Shop Outfit
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {heroError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold animate-fade-in">
                {heroError}
              </div>
            )}
            {heroLoading ? (
              <div className="space-y-8 animate-pulse border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40 p-4 space-y-4 flex flex-col justify-between h-[340px]">
                    <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-855 p-2.5 pb-5 rounded shadow-sm flex flex-col items-center">
                      <div className="w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="mt-3.5 h-3 bg-slate-250 dark:bg-slate-800 rounded w-24" />
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                      <div className="space-y-1">
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                        <div className="h-3.5 bg-slate-250 dark:bg-slate-800 rounded w-20" />
                      </div>
                      <div className="space-y-1 flex flex-col items-end">
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                        <div className="h-3 bg-slate-250 dark:bg-slate-800 rounded w-14" />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between">
                      <div className="h-5 bg-slate-255 dark:bg-slate-800 rounded w-44" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-slate-255 dark:bg-slate-800 rounded w-72" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-48" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                          <div className="h-4 bg-slate-250 dark:bg-slate-750 rounded w-36" />
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                        <div className="h-4 bg-slate-250 dark:bg-slate-750 rounded w-28" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-28" />
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-36" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="h-5 bg-slate-255 dark:bg-slate-800 rounded w-72" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-96" />
                    </div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-36" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-850 rounded w-12" />
                        <div className="h-4.5 bg-slate-255 dark:bg-slate-800 rounded w-24" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-16" />
                        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <div className="h-3 bg-slate-255 dark:bg-slate-800 rounded w-48" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-855 rounded w-full" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-855 rounded w-11/12" />
                  </div>
                </div>
              </div>
            ) : heroResult && lookResult ? (
              <div className="space-y-8 animate-fade-in border-t border-slate-100 pt-4">
                {/* Extracted Styling Report */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Polaroid Frame Container */}
                  <div className="md:col-span-1 glass-panel rounded-xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col bg-white p-4 justify-between min-h-[300px] relative">
                    <div className="green-scan-line" />
                    
                    {/* Polaroid Styled Border */}
                    <div className="bg-slate-50 border border-slate-150 p-2.5 pb-5 rounded shadow-sm relative overflow-hidden flex flex-col items-center">
                      <div className="relative w-full aspect-[4/5] bg-slate-200 rounded overflow-hidden shadow-inner">
                        <img 
                          src={getCelebrityImage(heroResult.celebrityMatch, heroInput)} 
                          className="w-full h-full object-cover" 
                          alt="Analyzed target" 
                        />
                        <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[8px] font-mono font-bold tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          AI VISION SCANNING ACTIVE
                        </div>
                      </div>
                      <div className="mt-3.5 font-mono font-bold text-[9px] text-slate-400 uppercase tracking-widest text-center leading-none">
                        BELSOME AI STYLER
                      </div>
                    </div>
                    
                    {/* Match Score Stats */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 font-mono block leading-none">AI CONFIDENCE</span>
                        <strong className="text-slate-800 text-[11px] font-extrabold">{heroResult.matchConfidence}% Match</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-mono block leading-none">FACE CLASSIFIER</span>
                        <strong className="text-purple-750 text-[10px] font-mono font-bold uppercase">{heroResult.faceShape.split(" / ")[0]}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Extract Specifications */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="inline-block px-2.5 py-0.5 rounded bg-purple-50 border border-purple-100 text-purple-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                        Celebrity Styling Match Report
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">ID: B-HERO-{heroResult.matchConfidence}</span>
                    </div>

                    <div>
                      <h4 className="font-display font-black text-2xl text-slate-900 leading-none">{heroResult.celebrityMatch}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">Matched profile highlights: {heroResult.faceShape}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">Suggested Hairstyle</span>
                        <strong className="text-slate-800 text-sm">{heroResult.hairstyle}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">Suggested Beard</span>
                        <strong className="text-slate-800 text-sm">{heroResult.beard}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">Skin Tone Extraction</span>
                        <strong className="text-slate-800 text-sm">{heroResult.skinTone}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">Accessorization Match</span>
                        <strong className="text-slate-800 text-sm">{heroResult.accessories.map((a: string) => a.replace(/\(.*?\)/g, "").trim()).join(", ")}</strong>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px] font-bold">Estimated Duration & Cost</span>
                        <span className="text-slate-800 font-bold">{heroResult.duration} • {heroResult.cost}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            // Map hero results to canvas state
                            const face = (heroResult.faceShape?.toLowerCase().includes("round") ? "round" :
                                          heroResult.faceShape?.toLowerCase().includes("square") ? "square" :
                                          heroResult.faceShape?.toLowerCase().includes("heart") ? "heart" : "oval") as any;
                            
                            setCanvasFaceShape(face);
                            handleTryStyleMatch(heroResult.hairstyle, heroResult.beard);
                            setCanvasHairScale(1.0);
                            setCanvasHairY(0);
                            setActiveTab("canvas");
                          }}
                          className="px-4 py-2 rounded-lg bg-purple-55 border border-purple-200 text-purple-700 font-bold text-xs uppercase tracking-wider hover:bg-purple-100 transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <Sliders className="w-3.5 h-3.5" /> Try In Simulator
                        </button>
                        <button
                          onClick={() => {
                            const matchedServ = services.find((s) => s.name.toLowerCase().includes("haircut")) || services[0];
                            setSelectedService(matchedServ.id);
                            setActiveTab("book");
                            setBookingStep(3);
                          }}
                          className="px-4 py-2 rounded-lg bg-brand-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm text-center"
                        >
                          Book Extracted Style
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outfit Shopping Section */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-purple-600" />
                        Match Wardrobe — Purchase Clothes Online
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Direct search queries mapped for Zara, H&M, Uniqlo, and Manyavar to buy items matching the celebrity outfit.</p>
                    </div>
                    <button
                      onClick={downloadLookCard}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {downloadSuccess ? "Look Card Saved!" : "Download Style Card"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <LookCardItem 
                      label="Upperwear" 
                      title={lookResult.shirt} 
                      brand={lookResult.shirt.match(/\(([^)]+)\)/)?.[1] || "Zara Match"}
                      buyUrl={ApiService.getBuyUrl(lookResult.shirt)}
                    />
                    <LookCardItem 
                      label="Trousers" 
                      title={lookResult.trousers} 
                      brand={lookResult.trousers.match(/\(([^)]+)\)/)?.[1] || "Uniqlo Match"} 
                      buyUrl={ApiService.getBuyUrl(lookResult.trousers)}
                    />
                    <LookCardItem 
                      label="Footwear" 
                      title={lookResult.shoes} 
                      brand={lookResult.shoes.match(/\(([^)]+)\)/)?.[1] || "Zara Match"} 
                      buyUrl={ApiService.getBuyUrl(lookResult.shoes)}
                    />
                    <LookCardItem 
                      label="Watch" 
                      title={lookResult.watch} 
                      brand={lookResult.watch.match(/\(([^)]+)\)/)?.[1] || "H&M Match"} 
                      buyUrl={ApiService.getBuyUrl(lookResult.watch)}
                    />
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-650 space-y-2 font-semibold shadow-inner">
                    <strong className="text-slate-800 block font-mono text-[9px] uppercase tracking-wider font-extrabold text-purple-800">
                      Grooming & Outfit Integration Tips
                    </strong>
                    {lookResult.styleTips.map((tip: string, index: number) => (
                      <p key={index} className="flex gap-2.5 items-start leading-relaxed">
                        <span className="text-purple-600 font-bold mt-0.5">•</span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Quick manual reset action */}
            {heroResult && (
              <div className="flex justify-center border-t border-slate-100 pt-4">
                <button
                  onClick={() => {
                    setHeroResult(null);
                    setLookResult(null);
                    setHeroInput("");
                  }}
                  className="text-xs text-purple-750 hover:text-purple-900 font-bold flex items-center gap-1 px-3 py-1.5 rounded bg-slate-50 border border-slate-200 shadow-sm transition-all"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Reset Vision Extractor / Try New Celebrity
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interactive Styling Canvas */}
        {activeTab === "canvas" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 shadow-sm bg-white space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-purple-700" />
                  AI Grooming & Style Simulator
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Visualize and fine-tune hairstyles, beards, and accessories on your virtual face shape.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-purple-50 border border-purple-100 text-purple-700 font-mono font-bold shadow-sm uppercase tracking-wider animate-pulse">
                BELSOME Engine v1.5
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Simulator Display Column */}
              <div className="md:col-span-5 flex flex-col">
                <div className="flex flex-col items-center justify-between p-6 rounded-2xl relative overflow-hidden min-h-[440px] hud-panel hud-panel-glow">
                  {/* HUD Corners */}
                  <div className="hud-corner hud-corner-tl" />
                  <div className="hud-corner hud-corner-tr" />
                  <div className="hud-corner hud-corner-bl" />
                  <div className="hud-corner hud-corner-br" />

                  {/* Laser scan line overlay */}
                  {(uploadedImageSrc || avatarScanning) && <div className="green-scan-line" />}

                  {avatarScanning && (
                    <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
                      <div className="bg-slate-900 border border-emerald-500/30 px-3 py-2 rounded-xl shadow-lg flex flex-col items-center gap-1.5 text-center max-w-[200px] animate-pulse text-white">
                        <RefreshCcw className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          {scanMessage}
                        </span>
                      </div>
                    </div>
                  )}

                  {avatarScanResult && (
                    <div className="absolute top-12 left-4 right-4 bg-emerald-950/90 border border-emerald-500/30 text-emerald-350 px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-md z-10 animate-fade-in border-l-4 border-l-emerald-500">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{avatarScanResult}</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-1 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>

                  {/* Pulsing indicator */}
                  {uploadedImageSrc ? (
                    <div className="absolute top-2.5 left-14 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[8.5px] font-mono font-bold tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1.5 z-10 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      AI SCAN ALIGNMENT ACTIVE
                    </div>
                  ) : (
                    <div className="absolute top-2.5 left-14 bg-slate-900/80 border border-slate-700 text-slate-400 text-[8.5px] font-mono font-bold tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1.5 z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      MANUAL SIMULATOR MODE
                    </div>
                  )}

                  <div className="absolute top-2.5 right-3 text-[9px] font-mono font-bold text-slate-350 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded shadow-sm z-10">
                    HUD AVATAR PREVIEW
                  </div>

                {/* SVG Render Container */}
                <div className="w-full flex items-center justify-center py-4 flex-1">
                  <svg id="avatar-svg" viewBox="0 0 400 400" className="w-full max-w-[280px] h-auto drop-shadow-xl select-none">
                    <defs>
                      <linearGradient id="purpleHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#6d28d9" />
                      </linearGradient>
                      <linearGradient id="bronzeHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                    </defs>

                    {/* Background Soft Glow */}
                    <circle cx="200" cy="200" r="160" fill="#7C3AED" opacity="0.03" />
                    
                    {/* Neck */}
                    <path 
                      d="M170,260 L170,330 L230,330 L230,260 Z" 
                      fill={canvasSkinTone} 
                    />
                    <path 
                      d="M170,260 C170,260 200,285 230,260 Z" 
                      fill="black" 
                      opacity="0.1" 
                    />
                    
                    {/* Ears */}
                    <path d="M125,160 C110,160 110,195 125,195 Z" fill={canvasSkinTone} stroke="rgba(15,23,42,0.15)" strokeWidth="1" />
                    <path d="M275,160 C290,160 290,195 275,195 Z" fill={canvasSkinTone} stroke="rgba(15,23,42,0.15)" strokeWidth="1" />

                    {/* Earring Studs Accessory */}
                    {canvasAccessory === "earrings" && (
                      <g>
                        <circle cx="118" cy="178" r="3.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
                        <circle cx="282" cy="178" r="3.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
                      </g>
                    )}

                    {/* Face Shape */}
                    <path 
                      d={
                        canvasFaceShape === "round" 
                          ? "M125,160 C125,75 275,75 275,160 C275,235 240,295 200,295 C160,295 125,235 125,160 Z"
                          : canvasFaceShape === "square"
                          ? "M125,150 C125,80 275,80 275,150 C275,215 255,285 200,285 C145,285 125,215 125,150 Z"
                          : canvasFaceShape === "heart"
                          ? "M128,150 C118,70 282,70 272,150 C262,220 220,305 200,310 C180,305 138,220 128,150 Z"
                          : "M130,160 C130,80 270,80 270,160 C270,245 200,315 200,315 C200,315 130,245 130,160 Z" // Oval
                      } 
                      fill={canvasSkinTone}
                      stroke="rgba(15,23,42,0.08)"
                      strokeWidth="2"
                    />

                    {/* Eyebrows */}
                    <path d="M148,152 Q163,144 178,149" stroke="#2D3748" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />
                    <path d="M222,149 Q237,144 252,152" stroke="#2D3748" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />

                    {/* Eyes */}
                    <ellipse cx="163" cy="160" rx="9" ry="4.5" fill="#1A202C" />
                    <ellipse cx="237" cy="160" rx="9" ry="4.5" fill="#1A202C" />
                    <circle cx="165" cy="158" r="2.5" fill="white" />
                    <circle cx="239" cy="158" r="2.5" fill="white" />

                    {/* Nose */}
                    <path d="M200,152 L200,205 Q200,210 194,210" stroke="#4A5568" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />

                    {/* Mouth */}
                    <path d="M182,238 Q200,252 218,238" stroke="#4A5568" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />

                    {/* Beard Overlay (Under hair) */}
                    {canvasBeard !== "none" && (
                      <g fill={canvasBeardColor(canvasHairColor)} opacity={canvasBeard === "stubble" ? "0.35" : "0.95"}>
                        {canvasBeard === "stubble" && (
                          <path 
                            d={
                              canvasFaceShape === "round"
                                ? "M125,180 C125,240 240,300 200,300 C160,300 125,240 125,180 Z"
                                : canvasFaceShape === "square"
                                ? "M125,170 C125,225 255,290 200,290 C145,290 125,225 125,170 Z"
                                : canvasFaceShape === "heart"
                                ? "M128,170 C128,230 220,310 200,315 C180,310 128,230 128,170 Z"
                                : "M130,180 C130,250 200,320 200,320 C200,320 270,250 270,180 C270,215 255,280 200,305 C145,280 130,215 130,180 Z" // Oval
                            }
                            stroke={canvasHairColor}
                            strokeWidth="4"
                            strokeDasharray="2,3"
                            fill="none"
                          />
                        )}
                        {canvasBeard === "goatee" && (
                          <g fill={canvasBeardColor(canvasHairColor)}>
                            {/* Mustache */}
                            <path d="M174,228 Q200,222 226,228 Q200,238 174,228 Z" />
                            {/* Chin Tuft */}
                            <path d="M185,245 Q200,285 200,300 Q200,285 215,245 Q200,255 185,245 Z" />
                          </g>
                        )}
                        {canvasBeard === "full" && (
                          <g fill={canvasBeardColor(canvasHairColor)}>
                            {/* Full Jaw Coverage */}
                            <path 
                              d={
                                canvasFaceShape === "round"
                                  ? "M125,170 C120,255 160,315 200,315 C240,315 280,255 275,170 C265,200 255,230 200,240 C145,230 135,200 125,170 Z"
                                  : canvasFaceShape === "square"
                                  ? "M125,160 C120,245 155,305 200,305 C245,305 280,245 275,160 C265,190 255,225 200,235 C145,225 135,190 125,160 Z"
                                  : canvasFaceShape === "heart"
                                  ? "M128,160 C120,240 160,320 200,325 C240,320 280,240 272,160 C262,190 255,220 200,235 C145,220 138,190 128,160 Z"
                                  : "M130,170 C122,255 160,325 200,325 C240,325 278,255 270,170 C262,205 252,235 200,245 C148,235 138,205 130,170 Z" // Oval
                              }
                            />
                            {/* Mustache Overlay */}
                            <path d="M170,225 Q200,218 230,225 Q200,237 170,225 Z" />
                          </g>
                        )}
                        {canvasBeard === "mustache" && (
                          <g fill={canvasBeardColor(canvasHairColor)}>
                            <path d="M165,228 Q200,220 235,228 Q220,240 200,232 Q180,240 165,228 Z" />
                          </g>
                        )}
                        {canvasBeard === "muttonchops" && (
                          <g fill={canvasBeardColor(canvasHairColor)}>
                            {/* Left Chop */}
                            <path d="M125,160 C125,160 142,160 148,180 C155,200 155,225 140,245 C132,235 126,200 125,160 Z" />
                            {/* Right Chop */}
                            <path d="M275,160 C275,160 258,160 252,180 C245,200 245,225 260,245 C268,235 274,200 275,160 Z" />
                          </g>
                        )}
                      </g>
                    )}

                    {/* Hairstyle Overlay with interactive scaling & offset */}
                    {canvasHair !== "none" && (
                      <g 
                        style={{
                          transform: `translate(200px, 140px) scale(${canvasHairScale}) translate(-200px, -140px) translate(0px, ${canvasHairY}px)`,
                          transformOrigin: "200px 140px",
                          transition: "transform 0.15s ease-out"
                        }}
                      >
                        {/* Sideburns */}
                        <path d="M128,130 L131,170 L136,160 Z" fill={canvasHairColor} />
                        <path d="M272,130 L269,170 L264,160 Z" fill={canvasHairColor} />

                        {canvasHair === "pompadour" && (
                          <path 
                            d="M125,130 Q118,25 200,5 Q282,25 275,130 C282,140 270,140 264,130 C258,105 248,70 200,65 C152,70 142,105 136,130 C130,140 118,140 125,130 Z" 
                            fill={canvasHairFill(canvasHairColor)} 
                          />
                        )}

                        {canvasHair === "quiff" && (
                          <path 
                            d="M122,125 Q130,35 165,25 Q188,48 212,18 Q238,28 278,125 C270,135 264,125 258,105 Q220,60 190,65 Q160,60 142,105 C136,125 130,135 122,125 Z" 
                            fill={canvasHairFill(canvasHairColor)} 
                          />
                        )}

                        {canvasHair === "undercut" && (
                          <g>
                            {/* Short buzzed sides underlay */}
                            <path d="M126,125 L130,172 L137,172 L134,125 Z" fill={canvasHairColor} opacity="0.4" />
                            <path d="M274,125 L270,172 L263,172 L266,125 Z" fill={canvasHairColor} opacity="0.4" />
                            {/* Combed back top */}
                            <path 
                              d="M126,120 Q138,65 200,55 Q262,65 274,120 C267,120 256,95 200,92 C144,95 133,120 126,120 Z" 
                              fill={canvasHairFill(canvasHairColor)} 
                            />
                          </g>
                        )}

                        {canvasHair === "sidepart" && (
                          <g>
                            {/* Left sweep */}
                            <path d="M125,125 Q130,78 172,72 C172,72 162,110 136,125 Z" fill={canvasHairFill(canvasHairColor)} opacity="0.9" />
                            {/* Right sweep (major part) */}
                            <path 
                              d="M172,72 Q220,28 275,120 C269,130 258,90 200,85 C180,85 172,72 172,72 Z" 
                              fill={canvasHairFill(canvasHairColor)} 
                            />
                          </g>
                        )}

                        {canvasHair === "buzz" && (
                          <path 
                            d="M130,132 C125,75 145,60 200,60 C255,60 275,75 270,132 C265,135 255,130 255,120 C255,95 240,80 200,80 C160,80 145,95 145,120 C145,130 135,135 130,132 Z" 
                            fill={canvasHairFill(canvasHairColor)} 
                          />
                        )}

                        {canvasHair === "long" && (
                          <path 
                            d="M130,120 C130,60 160,35 200,35 C240,35 270,60 270,120 C275,170 285,240 260,260 C248,220 255,160 255,135 C255,95 240,70 200,70 C160,70 145,95 145,135 C145,160 152,220 140,260 C115,240 125,170 130,120 Z" 
                            fill={canvasHairFill(canvasHairColor)} 
                          />
                        )}

                        {canvasHair === "curly" && (
                          <path 
                            d="M125,130 C118,110 108,95 118,75 C108,55 128,35 160,35 C170,20 190,15 200,20 C210,15 230,20 240,35 C272,35 292,55 282,75 C292,95 282,110 275,130 C272,135 264,125 258,105 C252,65 242,60 200,58 C158,60 148,65 142,105 C136,125 128,135 125,130 Z" 
                            fill={canvasHairFill(canvasHairColor)} 
                          />
                        )}
                      </g>
                    )}

                    {/* Glasses Accessory Overlay (Above eyes & hair sideburns) */}
                    {canvasAccessory === "glasses" && (
                      <g stroke="#1e293b" strokeWidth="3" fill="none" opacity="0.9">
                        <circle cx="163" cy="160" r="16" />
                        <circle cx="237" cy="160" r="16" />
                        <path d="M179,160 L221,160" />
                        <path d="M147,160 L132,154" />
                        <path d="M253,160 L268,154" />
                      </g>
                    )}

                    {/* Sunglasses Accessory Overlay */}
                    {canvasAccessory === "sunglasses" && (
                      <g fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.95">
                        <path d="M145,152 C145,152 165,148 180,154 C180,154 180,172 163,172 C146,172 145,152 145,152 Z" />
                        <path d="M255,152 C255,152 235,148 220,154 C220,154 220,172 237,172 C254,172 255,152 255,152 Z" />
                        <path d="M180,154 L220,154" stroke="#cbd5e1" strokeWidth="2" />
                        <path d="M145,154 L132,150" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M255,154 L268,150" stroke="#cbd5e1" strokeWidth="1.5" />
                      </g>
                    )}

                    {/* Wedding Turban Safa Overlay (Placed at the very top of head) */}
                    {canvasAccessory === "turban" && (
                      <g opacity="0.98">
                        {/* Base cloth wrapping */}
                        <path d="M120,115 C118,65 160,30 200,42 C240,30 282,65 280,115 C272,105 260,92 200,88 C140,92 128,105 120,115 Z" fill="#DC2626" />
                        {/* Secondary silk gold layers */}
                        <path d="M128,102 C134,72 164,52 200,58 C236,52 266,72 272,102 C266,92 256,82 200,78 C144,82 134,92 128,102 Z" fill="#F59E0B" />
                        {/* Feather jewel kalgi */}
                        <path d="M200,58 Q205,32 200,20 Q195,32 200,58 Z" fill="#DC2626" />
                        <circle cx="200" cy="60" r="5.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
                      </g>
                    )}
                  </svg>
                </div>

                  <div className="w-full flex items-center justify-between text-[10px] text-emerald-450 font-mono font-bold bg-slate-900 border border-emerald-500/20 px-3 py-2 rounded-lg shadow-sm">
                    <span>Face: <strong className="text-white uppercase">{canvasFaceShape}</strong></span>
                    <span>Hair: <strong className="text-white uppercase">{activeHairItem.name}</strong></span>
                    <span>Beard: <strong className="text-white uppercase">{activeBeardItem.name}</strong></span>
                    <span>Acc: <strong className="text-white uppercase">{canvasAccessory}</strong></span>
                  </div>
                </div>

                {/* Uploaded Reference Card */}
                {uploadedImageSrc && (
                  <div className="w-full bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 shadow-lg relative overflow-hidden mt-4 animate-fade-in hud-panel hud-panel-glow">
                    {/* Scanning laser line overlay */}
                    <div className="green-scan-line" />
                    
                    {/* HUD Corners */}
                    <div className="hud-corner hud-corner-tl" />
                    <div className="hud-corner hud-corner-tr" />
                    <div className="hud-corner hud-corner-bl" />
                    <div className="hud-corner hud-corner-br" />
                    
                    <div className="absolute top-2.5 left-3 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/20 px-2 py-0.5 rounded shadow-sm uppercase flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AI Reference Portrait
                    </div>
                    
                    <div className="absolute top-2.5 right-3 text-[9.5px] font-mono text-slate-400">
                      SCAN ACTIVE
                    </div>
                    
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center mt-6">
                      <img
                        src={uploadedImageSrc}
                        className="w-full h-full object-cover opacity-90"
                        alt="AI Grooming Reference"
                      />
                    </div>

                    <div className="mt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>Jawline Align: <strong className="text-emerald-400">98%</strong></span>
                      <span>Contrast: <strong className="text-emerald-400">Optimal</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Panel Column */}
              <div className="md:col-span-7 space-y-6">
                
                {/* AI Vibe Advisor widget */}
                {(() => {
                  const feedback = getAIFeedback();
                  return (
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-2 shadow-sm animate-fade-in">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5 font-display">
                          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                          BELSOME AI Styling Advisor
                        </span>
                        <span className="text-[10px] bg-purple-100 border border-purple-200 text-purple-750 px-2 py-0.5 rounded-full font-mono font-bold">
                          Match Score: {feedback.score}%
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-none">Vibe Verdict: <span className="text-purple-700 font-mono">{feedback.verdict}</span></p>
                      <p className="text-[10.5px] text-slate-550 leading-relaxed font-semibold mt-1">
                        {feedback.tips}
                      </p>
                    </div>
                  );
                })()}

                {/* Section 1: Face Shape & Skin */}
                <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-mono font-bold text-purple-800 uppercase tracking-wider">1. Face Geometry & Tone</h4>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="avatar-scan-file"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <button
                        onClick={() => document.getElementById("avatar-scan-file")?.click()}
                        className="px-2.5 py-1 rounded bg-purple-50 border border-purple-200 text-purple-755 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm"
                        title="Upload a photo to automatically analyze your face shape geometry"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        AI Scan & Match Photo
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["oval", "round", "square", "heart"].map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setCanvasFaceShape(shape as any)}
                        className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                          canvasFaceShape === shape
                            ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-655"
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>

                  {/* Skin Tone Selector */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-semibold text-slate-550">Skin Tone:</span>
                    <div className="flex gap-2">
                      {[
                        { code: "#FCD5B5", name: "Fair" },
                        { code: "#F5C29A", name: "Medium" },
                        { code: "#E8B085", name: "Tan" },
                        { code: "#D09060", name: "Deep" }
                      ].map((t) => (
                        <button
                          key={t.code}
                          type="button"
                          onClick={() => setCanvasSkinTone(t.code)}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            canvasSkinTone === t.code ? "ring-2 ring-purple-600 scale-110 shadow-sm" : "border-slate-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: t.code }}
                          title={t.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2: Redesigned Searchable Hairstyle Selector */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-mono font-bold text-purple-800 uppercase tracking-wider">2. Choose Hairstyle (50+ options)</h4>
                    <span className="text-[9px] bg-purple-100 text-purple-850 px-2 py-0.5 rounded font-mono font-bold">
                      {HAIRSTYLES_LIST.length} Styles
                    </span>
                  </div>
                  
                  {/* Search Bar */}
                  <input
                    type="text"
                    value={hairSearch}
                    onChange={(e) => setHairSearch(e.target.value)}
                    placeholder="🔍 Search hair cuts, fades, crops..."
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-primary placeholder-slate-400 font-semibold shadow-sm"
                  />

                  {/* Category Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {["All", "Fades", "Classic", "Volume", "Undercuts", "Long", "Curly"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setHairFilterCat(cat)}
                        className={`px-2.5 py-1 rounded text-[10px] border transition-all font-bold whitespace-nowrap ${
                          hairFilterCat === cat
                            ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* List of Styles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {HAIRSTYLES_LIST.filter((h) => {
                      const matchesSearch = h.name.toLowerCase().includes(hairSearch.toLowerCase()) || 
                                            h.tip?.toLowerCase().includes(hairSearch.toLowerCase());
                      const matchesCat = hairFilterCat === "All" || h.category === hairFilterCat;
                      return matchesSearch && matchesCat;
                    }).map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleHairSelect(style.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1 group relative overflow-hidden ${
                          selectedHairId === style.id
                            ? "bg-purple-50/80 border-purple-400 ring-1 ring-purple-400"
                            : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-355"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-xs text-slate-800 leading-tight group-hover:text-purple-700 transition-colors">
                            {style.name}
                          </span>
                          <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold">
                            {style.category}
                          </span>
                        </div>
                        {style.tip && (
                          <span className="text-[9px] text-slate-400 leading-tight mt-0.5 font-semibold group-hover:text-slate-500 transition-colors">
                            {style.tip}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Hair Color Selector */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200/50">
                    <span className="text-[11px] font-semibold text-slate-550">Hair Accent Color:</span>
                    <div className="flex gap-2">
                      {[
                        { code: "#1A1A1A", name: "Black" },
                        { code: "#4A2E1B", name: "Dark Brown" },
                        { code: "#B45309", name: "Bronze Gold" },
                        { code: "#7C3AED", name: "Amethyst Purple" }
                      ].map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setCanvasHairColor(c.code)}
                          className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                            canvasHairColor === c.code ? "ring-2 ring-purple-650 scale-110 shadow-sm" : "border-slate-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.code }}
                          title={c.name}
                        >
                          {canvasHairColor === c.code && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Redesigned Searchable Beard Selector */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-mono font-bold text-purple-800 uppercase tracking-wider">3. Choose Facial Hair (50 options)</h4>
                    <span className="text-[9px] bg-purple-100 text-purple-855 px-2 py-0.5 rounded font-mono font-bold">
                      {BEARDS_LIST.length} Styles
                    </span>
                  </div>
                  
                  {/* Search Bar */}
                  <input
                    type="text"
                    value={beardSearch}
                    onChange={(e) => setBeardSearch(e.target.value)}
                    placeholder="🔍 Search stubble, goatee, mustache..."
                    className="w-full bg-white border border-slate-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-primary placeholder-slate-400 font-semibold shadow-sm"
                  />

                  {/* Category Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {["All", "Stubble", "Full Beard", "Goatee", "Chops", "Mustache", "Other"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setBeardFilterCat(cat)}
                        className={`px-2.5 py-1 rounded text-[10px] border transition-all font-bold whitespace-nowrap ${
                          beardFilterCat === cat
                            ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* List of Styles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {BEARDS_LIST.filter((b) => {
                      const matchesSearch = b.name.toLowerCase().includes(beardSearch.toLowerCase()) || 
                                            b.tip?.toLowerCase().includes(beardSearch.toLowerCase());
                      const matchesCat = beardFilterCat === "All" || b.category === beardFilterCat;
                      return matchesSearch && matchesCat;
                    }).map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleBeardSelect(style.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1 group relative overflow-hidden ${
                          selectedBeardId === style.id
                            ? "bg-purple-50/80 border-purple-400 ring-1 ring-purple-400"
                            : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-355"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-xs text-slate-800 leading-tight group-hover:text-purple-700 transition-colors">
                            {style.name}
                          </span>
                          <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold">
                            {style.category}
                          </span>
                        </div>
                        {style.tip && (
                          <span className="text-[9px] text-slate-400 leading-tight mt-0.5 font-semibold group-hover:text-slate-500 transition-colors">
                            {style.tip}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 4: Accessory Add-ons */}
                <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-mono font-bold text-purple-800 uppercase tracking-wider">4. Accessory Accents</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: "none", label: "None" },
                      { id: "glasses", label: "Glasses" },
                      { id: "sunglasses", label: "Shades" },
                      { id: "earrings", label: "Earrings" },
                      { id: "turban", label: "Safa Turban" }
                    ].map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setCanvasAccessory(acc.id as any)}
                        className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          canvasAccessory === acc.id
                            ? "bg-purple-650 border-purple-650 text-white shadow-sm"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-655"
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 5: Fine Tuning Sliders */}
                <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                  <h4 className="text-xs font-mono font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" /> Fine Tuning Offsets
                  </h4>
                  
                  {/* Slider 1: Hair Size Scale */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-605">
                      <span>Hair Volume / Scale:</span>
                      <span className="font-mono">{Math.round(canvasHairScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.85"
                      max="1.25"
                      step="0.01"
                      value={canvasHairScale}
                      onChange={(e) => setCanvasHairScale(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                    />
                  </div>

                  {/* Slider 2: Hair Position Y */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-605">
                      <span>Hair Height Alignment (Y-offset):</span>
                      <span className="font-mono">{canvasHairY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={canvasHairY}
                      onChange={(e) => setCanvasHairY(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const matchedServ = services.find((s) => s.name.toLowerCase().includes(canvasHair === "none" ? "shave" : "haircut")) || services[0];
                      setSelectedService(matchedServ.id);
                      setActiveTab("book");
                      setBookingStep(3);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-md shadow-brand-primary/10 transition-all text-center"
                  >
                    Book This Style & Cut
                  </button>
                  <button
                    type="button"
                    onClick={exportAvatarSvg}
                    className="px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-750 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Export Vector
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset to defaults
                      setSelectedHairId("classic-pomp");
                      setSelectedBeardId("medium-stubble");
                      setCanvasFaceShape("oval");
                      setCanvasSkinTone("#F5C29A");
                      setCanvasHairColor("#1A1A1A");
                      setCanvasHairScale(1.0);
                      setCanvasHairY(0);
                      setCanvasAccessory("none");
                      setUploadedImageSrc(null);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Reset
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Express Track */}
        {activeTab === "express" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 shadow-sm bg-white space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-slate-900">Express Track 20-Min Grooming SLA</h3>
              <p className="text-xs text-slate-500 font-semibold">Need grooming fast? Get instant slot placement with our 20-minute seating guarantee or get a refund coupon.</p>
            </div>

            {!expressActive ? (
              <div className="text-center py-10 space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto shadow-sm">
                  <Timer className="w-8 h-8 text-amber-500" />
                </div>
                <h4 className="font-display font-bold text-lg text-slate-800">Queue Placement SLA Activation</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  We check salon availability, stylist distances, and queue waiting lines to seat you within 20 minutes of checking in.
                </p>
                <button
                  onClick={startExpressTrack}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary font-bold text-xs tracking-wider uppercase hover:opacity-90 shadow-md shadow-brand-primary/10 transition-all w-full text-white"
                >
                  I Need Grooming Fast (Check In)
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Redesigned SLA Express Ticket Stub */}
                <div className="relative border border-purple-150 rounded-2xl bg-white shadow-lg overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-dashed divide-purple-250">
                  {/* Left/Right Perforated holes */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#F8FAFC] border border-slate-200 -translate-y-1/2 z-20 hidden md:block" />
                  <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#F8FAFC] border border-slate-200 -translate-y-1/2 z-20 hidden md:block" />

                  {/* Left Stub: The countdown timer */}
                  <div className="p-6 flex flex-col justify-center items-center text-center gap-2 md:w-2/5 bg-gradient-to-b from-purple-50/20 to-white">
                    <span className="text-[9px] text-purple-700 font-mono uppercase font-bold tracking-widest">SLA Countdown</span>
                    <h4 className="font-display font-extrabold text-4xl text-slate-900 tracking-widest font-mono animate-pulse-glow">
                      {Math.floor(expressCountdown / 60)}:{(expressCountdown % 60).toString().padStart(2, "0")}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase font-mono">Time Remaining</span>
                  </div>

                  {/* Middle Stub: The Queue Details */}
                  <div className="p-6 flex-1 flex flex-col justify-center gap-3 text-xs text-slate-650 font-semibold bg-white">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Ticket Type:</span>
                      <span className="text-purple-750 font-bold font-mono tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase animate-pulse">
                        EXPRESS SLA PASS
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Queue Position:</span>
                      <strong className="text-slate-850 font-bold">1st in line (Priority Seating)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned Stylist:</span>
                      <strong className="text-slate-850 font-bold">Vikram Malhotra</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Waiting:</span>
                      <strong className="text-emerald-600 font-bold">Under 3 mins</strong>
                    </div>
                  </div>

                  {/* Right Stub: Actions */}
                  <div className="p-6 flex flex-col justify-center gap-2 md:w-1/4 bg-slate-50/50">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block text-center font-bold">
                      Control Desk
                    </span>
                    <button
                      type="button"
                      onClick={triggerSlaFailure}
                      className="w-full py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] text-red-700 font-bold tracking-wider uppercase transition-all shadow-sm"
                    >
                      Simulate Fail
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpressActive(false)}
                      className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] text-slate-700 font-bold tracking-wider uppercase transition-all"
                    >
                      Cancel Pass
                    </button>
                  </div>
                </div>

                {/* Queue visual tracker */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Arrived at Studio</span>
                    <span className="text-purple-700 font-bold">Queue Optimization</span>
                    <span>Seated at Chair</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-brand-primary h-full transition-all" style={{ width: expressSlaFailed ? "50%" : "85%" }} />
                  </div>
                </div>

                {/* Fail Message & Automatic Coupon */}
                {expressSlaFailed && (
                  <div className="p-5 rounded-xl bg-red-50 border border-red-150 space-y-3 text-red-800 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 shadow-inner">
                        <Tag className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">SLA Seating Duration Exceeded</h4>
                        <p className="text-[11px] text-red-600 leading-normal font-semibold">
                          We apologize for the delay. Under our BELSOME 20-minute seating guarantee program, you have been issued a complimentary coupon.
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-red-200" />
                    <div className="flex items-center justify-between text-xs">
                      <span>Promo Coupon Code: <strong className="font-mono text-slate-900 tracking-widest text-sm bg-white border border-slate-250 px-2.5 py-1 rounded shadow-sm">{expressCoupon}</strong></span>
                      <span className="text-[10px] text-red-700 font-bold font-mono">20% Off Next Booking Session</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Portfolios Pinterest lookbook */}
        {activeTab === "portfolios" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Stylist Portfolios lookbook</h3>
                <p className="text-xs text-slate-500 font-semibold">Explore before-and-after transformations from our elite partner stylists.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold shadow-sm">
                Jubilee Hills Registry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {stylists.map((sty) => (
                <div key={sty.id} className="glass-panel rounded-xl overflow-hidden border border-slate-200 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 leading-tight">{sty.name}</h4>
                      <span className="text-[10px] text-purple-700 font-bold">{sty.specialty}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-amber-600 font-bold flex items-center justify-end gap-0.5"><Star className="w-3.5 h-3.5 fill-amber-500" /> {sty.rating}</span>
                      <span className="text-[9px] text-slate-400 font-semibold block">{sty.reviewsCount} reviews</span>
                    </div>
                  </div>

                  {/* Before / After Gallery Showcase */}
                  <div className="p-4 bg-slate-50/30 flex flex-col items-center justify-center gap-3">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wider font-bold">Before / After Gallery Showcase</span>
                    <div className="flex gap-2 w-full justify-center">
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 w-1/2 shadow-sm">
                        <img src={sty.beforeAfter[0].before} className="w-full h-32 object-cover" alt="" />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest text-gray-250 font-bold">BEFORE</span>
                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 w-1/2 shadow-sm">
                        <img src={sty.beforeAfter[0].after} className="w-full h-32 object-cover" alt="" />
                        <span className="absolute bottom-1.5 right-1.5 bg-brand-primary px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest text-white font-bold">AFTER</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 bg-slate-50/30 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1 text-[9px]">
                      {sty.certifications.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-purple-50 border border-purple-100 text-purple-700 font-mono font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-semibold">AI Behavioral Exam: <strong className="text-slate-800 font-bold">{sty.aiScore}%</strong></span>
                      <button
                        onClick={() => {
                          setSelectedStylist(sty.id);
                          setActiveTab("book");
                          setBookingStep(1);
                        }}
                        className="px-3 py-1.5 rounded bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponents helper
function QuizQuestionCard({ title, options, selected, onSelect }: {
  title: string;
  options: { id: string; label: string; img: string }[];
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-display font-bold text-xl text-slate-900">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`glass-panel rounded-xl overflow-hidden cursor-pointer border transition-all shadow-sm ${
              selected === opt.id
                ? "bg-purple-50/50 border-brand-primary shadow-md scale-105"
                : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50"
            }`}
          >
            <img src={opt.img} className="w-full h-24 object-cover" alt="" />
            <div className="p-3 text-center">
              <span className="text-[11px] font-bold text-slate-700 block leading-tight">{opt.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LookCardItem({ label, title, brand, buyUrl }: { label: string; title: string; brand: string; buyUrl?: string }) {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-200 bg-white space-y-3 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
      <div className="space-y-1.5">
        <span className="text-[8px] text-purple-700 font-mono block uppercase tracking-wider font-bold">{label}</span>
        <h5 className="font-bold text-xs text-slate-850 leading-normal">{title}</h5>
        <span className="text-[9.5px] text-slate-405 font-mono font-semibold block">{brand}</span>
      </div>
      {buyUrl && (
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 px-3 rounded bg-purple-50 hover:bg-purple-100 text-[10px] text-purple-750 font-bold font-mono text-center flex items-center justify-center gap-1 border border-purple-200 transition-all cursor-pointer shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" /> Shop Item
        </a>
      )}
    </div>
  );
}
