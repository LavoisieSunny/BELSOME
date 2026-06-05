import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types definition
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  languages: string[];
  certifications: string[];
  beforeAfter: { before: string; after: string }[];
  aiScore: number;
  reviewsCount: number;
}

export interface Salon {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  minPrice: number;
  maxPrice: number;
  peakSurge: number; // percentage, e.g. 15 for 15%
  offPeakDiscount: number; // percentage, e.g. 20 for 20%
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // mins
  image: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  salonId: string;
  salonName: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  date: string;
  timeSlot: string;
  productPreference: string[];
  originalPrice: number;
  finalPrice: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  pricingReason: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  brand: string;
  certifications: string[];
  cost: number;
  retail: number;
  margin: number;
  score: number;
  status: "ACCEPT" | "REVIEW" | "REJECT";
  explanation: string;
}

export interface ExamAttempt {
  id: string;
  candidateName: string;
  language: string;
  scenario: string;
  score: number;
  status: "HIRE" | "TRAIN" | "REJECT";
  feedback: string;
  date: string;
}

export interface WeddingProject {
  id: string;
  brideName: string;
  weddingDate: string;
  budget: number;
  bookedVendors: { role: string; name: string; cost: number; status: string }[];
  timeline: { id: string; time: string; event: string; status: string }[];
  progress: number; // percentage
}

export interface CorporateAccount {
  id: string;
  companyName: string;
  plan: "Bronze" | "Silver" | "Gold";
  totalEmployees: number;
  allocatedCredits: number;
  usedCredits: number;
}

interface BelsomeState {
  // DB Tables
  salons: Salon[];
  stylists: Stylist[];
  services: Service[];
  appointments: Appointment[];
  vendorProducts: VendorProduct[];
  examAttempts: ExamAttempt[];
  weddingProjects: WeddingProject[];
  corporateAccounts: CorporateAccount[];
  
  // App-wide preferences
  selectedPreferences: string[];
  userRole: string;
  activeCity: string;
  toasts: Toast[];

  // Actions
  addAppointment: (appointment: Omit<Appointment, "id" | "status">) => void;
  completeAppointment: (id: string) => void;
  addVendorProduct: (product: Omit<VendorProduct, "id">) => void;
  addExamAttempt: (attempt: Omit<ExamAttempt, "id" | "date">) => void;
  updateWeddingProject: (project: WeddingProject) => void;
  allocateCorporateCredits: (companyId: string, amount: number) => void;
  updateGlowSettings: (salonId: string, peakSurge: number, offPeakDiscount: number) => void;
  togglePreference: (pref: string) => void;
  changeUserRole: (role: string) => void;
  changeActiveCity: (city: string) => void;
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

// Helper to generate dynamic look image URLs
// Helper to generate dynamic look image URLs
const imgPlaceholder = (txt: string) => `https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400`;

// Centralized configurations for each city
export const CITY_CONFIGS: Record<string, {
  salons: Salon[];
  stylists: Stylist[];
  corporateAccounts: CorporateAccount[];
  appointments: Appointment[];
}> = {
  Hyderabad: {
    salons: [
      { id: "salon-1", name: "BELSOME Signature Studio", location: "Road No. 36, Jubilee Hills, Hyderabad", rating: 4.9, image: imgPlaceholder("Jubilee Hills"), minPrice: 500, maxPrice: 5000, peakSurge: 15, offPeakDiscount: 20 },
      { id: "salon-2", name: "Velvet Cut Co.", location: "DLF Cyber City, Gachibowli, Hyderabad", rating: 4.7, image: imgPlaceholder("Gachibowli"), minPrice: 400, maxPrice: 4000, peakSurge: 10, offPeakDiscount: 15 }
    ],
    stylists: [
      {
        id: "stylist-1",
        name: "Vikram Malhotra",
        specialty: "Master Hair Sculptor & Fade Specialist",
        experience: "8 Years",
        rating: 4.9,
        languages: ["English", "Hindi", "Telugu"],
        certifications: ["Sassoon Academy London", "BELSOME Diamond Stylist"],
        aiScore: 94,
        reviewsCount: 142,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-2",
        name: "Priya Rao",
        specialty: "Celebrity Groomer & Hair Colorist",
        experience: "6 Years",
        rating: 4.8,
        languages: ["English", "Telugu"],
        certifications: ["L'Oreal Professional Color Expert"],
        aiScore: 88,
        reviewsCount: 96,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-3",
        name: "Suresh K.",
        specialty: "Natural Wave Artist & Spa Therapy Specialist",
        experience: "10 Years",
        rating: 4.6,
        languages: ["Telugu", "Hindi"],
        certifications: ["Ayurvedic Beauty Therapist Certification"],
        aiScore: 82,
        reviewsCount: 78,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" }
        ]
      }
    ],
    corporateAccounts: [
      { id: "corp-1", companyName: "TechCorp Hyderabad", plan: "Silver", totalEmployees: 150, allocatedCredits: 120000, usedCredits: 48000 },
      { id: "corp-2", companyName: "FinGlobal Gachibowli", plan: "Gold", totalEmployees: 80, allocatedCredits: 160000, usedCredits: 92000 }
    ],
    appointments: [
      { id: "appt-1", customerName: "Rahul Sharma", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-1", serviceName: "Signature Haircut & Consultation", stylistId: "stylist-1", stylistName: "Vikram Malhotra", date: "2026-06-02", timeSlot: "11:00 AM", productPreference: ["Organic", "Paraben-Free"], originalPrice: 800, finalPrice: 640, status: "Completed", pricingReason: "Off-Peak Discount (20% Off)" },
      { id: "appt-2", customerName: "Ananya Reddy", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-5", serviceName: "Royal Bridal Makeover Pack", stylistId: "stylist-2", stylistName: "Priya Rao", date: "2026-06-06", timeSlot: "02:00 PM", productPreference: ["Vegan"], originalPrice: 15000, finalPrice: 17250, status: "Upcoming", pricingReason: "Peak Season Surge (15% Surge)" }
    ]
  },
  Bangalore: {
    salons: [
      { id: "salon-1", name: "BELSOME Signature Studio", location: "100 Feet Road, Indiranagar, Bangalore", rating: 4.9, image: imgPlaceholder("Indiranagar"), minPrice: 500, maxPrice: 5000, peakSurge: 15, offPeakDiscount: 20 },
      { id: "salon-2", name: "Velvet Cut Co.", location: "Outer Ring Road, Manyata Tech Park, Bangalore", rating: 4.7, image: imgPlaceholder("Manyata"), minPrice: 400, maxPrice: 4000, peakSurge: 10, offPeakDiscount: 15 }
    ],
    stylists: [
      {
        id: "stylist-1",
        name: "Arjun Reddy",
        specialty: "Master Hair Sculptor & Fade Specialist",
        experience: "8 Years",
        rating: 4.9,
        languages: ["English", "Kannada", "Telugu"],
        certifications: ["Sassoon Academy London", "BELSOME Diamond Stylist"],
        aiScore: 94,
        reviewsCount: 142,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-2",
        name: "Kavya Nair",
        specialty: "Celebrity Groomer & Hair Colorist",
        experience: "6 Years",
        rating: 4.8,
        languages: ["English", "Kannada", "Malayalam"],
        certifications: ["L'Oreal Professional Color Expert"],
        aiScore: 88,
        reviewsCount: 96,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-3",
        name: "Rohan Sen",
        specialty: "Natural Wave Artist & Spa Therapy Specialist",
        experience: "10 Years",
        rating: 4.6,
        languages: ["English", "Hindi", "Bengali"],
        certifications: ["Ayurvedic Beauty Therapist Certification"],
        aiScore: 82,
        reviewsCount: 78,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" }
        ]
      }
    ],
    corporateAccounts: [
      { id: "corp-1", companyName: "TechCorp Bangalore", plan: "Silver", totalEmployees: 150, allocatedCredits: 120000, usedCredits: 48000 },
      { id: "corp-2", companyName: "FinGlobal Whitefield", plan: "Gold", totalEmployees: 80, allocatedCredits: 160000, usedCredits: 92000 }
    ],
    appointments: [
      { id: "appt-1", customerName: "Vikram Hegde", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-1", serviceName: "Signature Haircut & Consultation", stylistId: "stylist-1", stylistName: "Arjun Reddy", date: "2026-06-02", timeSlot: "11:00 AM", productPreference: ["Organic", "Paraben-Free"], originalPrice: 800, finalPrice: 640, status: "Completed", pricingReason: "Off-Peak Discount (20% Off)" },
      { id: "appt-2", customerName: "Meera Krishnan", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-5", serviceName: "Royal Bridal Makeover Pack", stylistId: "stylist-2", stylistName: "Kavya Nair", date: "2026-06-06", timeSlot: "02:00 PM", productPreference: ["Vegan"], originalPrice: 15000, finalPrice: 17250, status: "Upcoming", pricingReason: "Peak Season Surge (15% Surge)" }
    ]
  },
  Mumbai: {
    salons: [
      { id: "salon-1", name: "BELSOME Signature Studio", location: "Carter Road, Bandra West, Mumbai", rating: 4.9, image: imgPlaceholder("Bandra"), minPrice: 500, maxPrice: 5000, peakSurge: 15, offPeakDiscount: 20 },
      { id: "salon-2", name: "Velvet Cut Co.", location: "Link Road, Andheri West, Mumbai", rating: 4.7, image: imgPlaceholder("Andheri"), minPrice: 400, maxPrice: 4000, peakSurge: 10, offPeakDiscount: 15 }
    ],
    stylists: [
      {
        id: "stylist-1",
        name: "Sameer Khan",
        specialty: "Master Hair Sculptor & Fade Specialist",
        experience: "8 Years",
        rating: 4.9,
        languages: ["English", "Hindi", "Marathi"],
        certifications: ["Sassoon Academy London", "BELSOME Diamond Stylist"],
        aiScore: 94,
        reviewsCount: 142,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-2",
        name: "Aisha Patel",
        specialty: "Celebrity Groomer & Hair Colorist",
        experience: "6 Years",
        rating: 4.8,
        languages: ["English", "Hindi", "Gujarati"],
        certifications: ["L'Oreal Professional Color Expert"],
        aiScore: 88,
        reviewsCount: 96,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-3",
        name: "Kabir Mehta",
        specialty: "Natural Wave Artist & Spa Therapy Specialist",
        experience: "10 Years",
        rating: 4.6,
        languages: ["English", "Hindi"],
        certifications: ["Ayurvedic Beauty Therapist Certification"],
        aiScore: 82,
        reviewsCount: 78,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" }
        ]
      }
    ],
    corporateAccounts: [
      { id: "corp-1", companyName: "TechCorp Mumbai", plan: "Silver", totalEmployees: 150, allocatedCredits: 120000, usedCredits: 48000 },
      { id: "corp-2", companyName: "FinGlobal Nariman Point", plan: "Gold", totalEmployees: 80, allocatedCredits: 160000, usedCredits: 92000 }
    ],
    appointments: [
      { id: "appt-1", customerName: "Aditya Shroff", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-1", serviceName: "Signature Haircut & Consultation", stylistId: "stylist-1", stylistName: "Sameer Khan", date: "2026-06-02", timeSlot: "11:00 AM", productPreference: ["Organic", "Paraben-Free"], originalPrice: 800, finalPrice: 640, status: "Completed", pricingReason: "Off-Peak Discount (20% Off)" },
      { id: "appt-2", customerName: "Riya Kapoor", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-5", serviceName: "Royal Bridal Makeover Pack", stylistId: "stylist-2", stylistName: "Aisha Patel", date: "2026-06-06", timeSlot: "02:00 PM", productPreference: ["Vegan"], originalPrice: 15000, finalPrice: 17250, status: "Upcoming", pricingReason: "Peak Season Surge (15% Surge)" }
    ]
  },
  Delhi: {
    salons: [
      { id: "salon-1", name: "BELSOME Signature Studio", location: "Inner Circle, Connaught Place, New Delhi", rating: 4.9, image: imgPlaceholder("CP"), minPrice: 500, maxPrice: 5000, peakSurge: 15, offPeakDiscount: 20 },
      { id: "salon-2", name: "Velvet Cut Co.", location: "Nelson Mandela Marg, Vasant Kunj, New Delhi", rating: 4.7, image: imgPlaceholder("VasantKunj"), minPrice: 400, maxPrice: 4000, peakSurge: 10, offPeakDiscount: 15 }
    ],
    stylists: [
      {
        id: "stylist-1",
        name: "Rahul Sharma",
        specialty: "Master Hair Sculptor & Fade Specialist",
        experience: "8 Years",
        rating: 4.9,
        languages: ["English", "Hindi", "Punjabi"],
        certifications: ["Sassoon Academy London", "BELSOME Diamond Stylist"],
        aiScore: 94,
        reviewsCount: 142,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-2",
        name: "Neha Kapoor",
        specialty: "Celebrity Groomer & Hair Colorist",
        experience: "6 Years",
        rating: 4.8,
        languages: ["English", "Hindi", "Punjabi"],
        certifications: ["L'Oreal Professional Color Expert"],
        aiScore: 88,
        reviewsCount: 96,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" }
        ]
      },
      {
        id: "stylist-3",
        name: "Amit Singh",
        specialty: "Natural Wave Artist & Spa Therapy Specialist",
        experience: "10 Years",
        rating: 4.6,
        languages: ["English", "Hindi"],
        certifications: ["Ayurvedic Beauty Therapist Certification"],
        aiScore: 82,
        reviewsCount: 78,
        beforeAfter: [
          { before: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", after: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" }
        ]
      }
    ],
    corporateAccounts: [
      { id: "corp-1", companyName: "TechCorp Delhi", plan: "Silver", totalEmployees: 150, allocatedCredits: 120000, usedCredits: 48000 },
      { id: "corp-2", companyName: "FinGlobal Gurgaon", plan: "Gold", totalEmployees: 80, allocatedCredits: 160000, usedCredits: 92000 }
    ],
    appointments: [
      { id: "appt-1", customerName: "Rohan Mehra", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-1", serviceName: "Signature Haircut & Consultation", stylistId: "stylist-1", stylistName: "Rahul Sharma", date: "2026-06-02", timeSlot: "11:00 AM", productPreference: ["Organic", "Paraben-Free"], originalPrice: 800, finalPrice: 640, status: "Completed", pricingReason: "Off-Peak Discount (20% Off)" },
      { id: "appt-2", customerName: "Simran Kaur", salonId: "salon-1", salonName: "BELSOME Signature Studio", serviceId: "serv-5", serviceName: "Royal Bridal Makeover Pack", stylistId: "stylist-2", stylistName: "Neha Kapoor", date: "2026-06-06", timeSlot: "02:00 PM", productPreference: ["Vegan"], originalPrice: 15000, finalPrice: 17250, status: "Upcoming", pricingReason: "Peak Season Surge (15% Surge)" }
    ]
  }
};

export const useBelsomeStore = create<BelsomeState>()(
  persist(
    (set) => ({
      // Initial state maps to Hyderabad configuration
      salons: CITY_CONFIGS.Hyderabad.salons,
      stylists: CITY_CONFIGS.Hyderabad.stylists,
      services: [
        { id: "serv-1", name: "Signature Haircut & Consultation", category: "Hair", price: 800, duration: 40, image: imgPlaceholder("Haircut") },
        { id: "serv-2", name: "Premium Slicked Back Undercut", category: "Hair", price: 1100, duration: 50, image: imgPlaceholder("Undercut") },
        { id: "serv-3", name: "Beard Trim & Hot Towel Hydration", category: "Beard", price: 500, duration: 30, image: imgPlaceholder("Beard") },
        { id: "serv-4", name: "Charcoal De-Tan Facial & Mask", category: "Beauty", price: 1200, duration: 45, image: imgPlaceholder("Facial") },
        { id: "serv-5", name: "Royal Bridal Makeover Pack", category: "Bridal", price: 15000, duration: 180, image: imgPlaceholder("Bridal") }
      ],
      appointments: CITY_CONFIGS.Hyderabad.appointments,
      vendorProducts: [
        { id: "prod-1", name: "BELSOME Argan Scalp Cleanser", brand: "BioGlow", certifications: ["Vegan", "Organic", "Toxin-Free"], cost: 250, retail: 650, margin: 61.5, score: 94, status: "ACCEPT", explanation: "High margin percentage and contains complete vegan certifications. Approved for automated listing." }
      ],
      examAttempts: [
        { id: "ex-1", candidateName: "Praveen Kumar", language: "Telugu", scenario: "Complaint Handling", score: 87, status: "HIRE", feedback: "Demonstrated strong empathy in Telugu language, apologized appropriately, and successfully offered a complimentary hair massage to resolve the client's scheduling conflict.", date: "2026-06-01" },
        { id: "ex-2", candidateName: "Aditi Sen", language: "English", scenario: "Upselling Objections", score: 74, status: "TRAIN", feedback: "Clear language structure but failed to address price objections head-on. Needs training in conveying service value rather than conceding immediate discount.", date: "2026-06-02" }
      ],
      weddingProjects: [
        {
          id: "wed-1",
          brideName: "Divya Reddy",
          weddingDate: "2026-11-20",
          budget: 80000,
          bookedVendors: [
            { role: "Makeup Artist", name: "Priya Rao (BELSOME)", cost: 15000, status: "Confirmed" },
            { role: "Mehendi Artist", name: "Sita Mehendi Design", cost: 8000, status: "Confirmed" },
            { role: "Hair Stylist", name: "Vikram Malhotra", cost: 12000, status: "Pending" }
          ],
          timeline: [
            { id: "time-1", time: "09:00 AM", event: "Mehendi Application Begins", status: "Completed" },
            { id: "time-2", time: "02:00 PM", event: "Hair Prep and Conditioning", status: "Upcoming" },
            { id: "time-3", time: "04:30 PM", event: "Bridal Makeup Session", status: "Upcoming" }
          ],
          progress: 40
        }
      ],
      corporateAccounts: CITY_CONFIGS.Hyderabad.corporateAccounts,

      selectedPreferences: ["Organic", "Paraben-Free"],
      userRole: "customer", // Default role
      activeCity: "Hyderabad",
      toasts: [],

      // Mutations
      addAppointment: (appointment) => set((state) => {
        const id = `appt-${state.appointments.length + 1}`;
        const newAppt: Appointment = {
          ...appointment,
          id,
          status: "Upcoming"
        };
        return {
          appointments: [newAppt, ...state.appointments]
        };
      }),

      completeAppointment: (id) => set((state) => ({
        appointments: state.appointments.map((appt) =>
          appt.id === id ? { ...appt, status: "Completed" as const } : appt
        )
      })),

      addVendorProduct: (product) => set((state) => {
        const id = `prod-${state.vendorProducts.length + 1}`;
        return {
          vendorProducts: [{ ...product, id }, ...state.vendorProducts]
        };
      }),

      addExamAttempt: (attempt) => set((state) => {
        const id = `ex-${state.examAttempts.length + 1}`;
        const date = new Date().toISOString().split("T")[0];
        return {
          examAttempts: [{ ...attempt, id, date }, ...state.examAttempts]
        };
      }),

      updateWeddingProject: (project) => set((state) => ({
        weddingProjects: state.weddingProjects.map((p) => p.id === project.id ? project : p)
      })),

      allocateCorporateCredits: (companyId, amount) => set((state) => ({
        corporateAccounts: state.corporateAccounts.map((c) =>
          c.id === companyId ? { ...c, allocatedCredits: c.allocatedCredits + amount } : c
        )
      })),

      updateGlowSettings: (salonId, peakSurge, offPeakDiscount) => set((state) => ({
        salons: state.salons.map((s) =>
          s.id === salonId ? { ...s, peakSurge, offPeakDiscount } : s
        )
      })),

      togglePreference: (pref) => set((state) => {
        const current = state.selectedPreferences;
        const next = current.includes(pref) ? current.filter((p) => p !== pref) : [...current, pref];
        return { selectedPreferences: next };
      }),

      changeUserRole: (role) => set({ userRole: role }),

      changeActiveCity: (city) => set((state) => {
        const config = CITY_CONFIGS[city] || CITY_CONFIGS["Hyderabad"];
        // Dynamically map wedding project vendors to local stylists
        const updatedWeddingProjects = state.weddingProjects.map((proj) => {
          return {
            ...proj,
            bookedVendors: proj.bookedVendors.map((vendor) => {
              if (vendor.role === "Makeup Artist" && vendor.name.includes("BELSOME")) {
                return { ...vendor, name: `${config.stylists[1].name} (BELSOME)` };
              }
              if (vendor.role === "Hair Stylist" && (vendor.name.includes("Vikram") || vendor.name.includes("Arjun") || vendor.name.includes("Sameer") || vendor.name.includes("Rahul"))) {
                return { ...vendor, name: config.stylists[0].name };
              }
              return vendor;
            })
          };
        });

        return {
          activeCity: city,
          salons: config.salons,
          stylists: config.stylists,
          corporateAccounts: config.corporateAccounts,
          appointments: config.appointments,
          weddingProjects: updatedWeddingProjects
        };
      }),

      addToast: (message, type = "info") => set((state) => {
        const id = `toast-${Math.random().toString(36).substring(2, 9)}`;
        const newToast: Toast = { id, message, type };
        
        setTimeout(() => {
          set((s) => ({
            toasts: s.toasts.filter((t) => t.id !== id)
          }));
        }, 3500);

        return {
          toasts: [...state.toasts, newToast]
        };
      }),

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }),
    { name: "belsome-store" }
  )
);
