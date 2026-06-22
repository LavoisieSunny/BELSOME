import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";
import stylistsRoutes from "./routes/stylists.routes";
import salonsRoutes from "./routes/salons.routes";
import servicesRoutes from "./routes/services.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import vendorProductsRoutes from "./routes/vendor-products.routes";
import examAttemptsRoutes from "./routes/exam-attempts.routes";
import weddingProjectsRoutes from "./routes/wedding-projects.routes";
import corporateAccountsRoutes from "./routes/corporate-accounts.routes";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",   // Vite dev port Belsome
    "http://localhost:5173",   // Vite dev default
    "http://localhost:4173",   // Vite preview
    process.env.FRONTEND_URL || "http://localhost:3000"
  ]
}));
app.use(express.json());

// API mounting
app.use("/api/ai", aiRoutes);
app.use("/api/stylists", stylistsRoutes);
app.use("/api/salons", salonsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/vendor-products", vendorProductsRoutes);
app.use("/api/exam-attempts", examAttemptsRoutes);
app.use("/api/wedding-projects", weddingProjectsRoutes);
app.use("/api/corporate-accounts", corporateAccountsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "BELSOME Smart Grooming Platform Backend" });
});

export default app;
