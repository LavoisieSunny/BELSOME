import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors({ origin: "*" })); // Allow frontend Vite client to talk to backend
app.use(express.json());

// API mounting
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "BELSOME Smart Grooming Platform Backend" });
});

export default app;
