import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "BELSOME Smart Grooming Platform Backend" });
});

export default app;
