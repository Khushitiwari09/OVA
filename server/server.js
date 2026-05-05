/**
 * OVA Backend — Health Plan Generation Service
 *
 * Secure Express server that proxies requests to Hugging Face's
 * BioMistral-7B model. The API token never leaves the server.
 *
 * Endpoints:
 *   POST /generate-plan  → Generate a personalized health plan
 *   GET  /health          → Server health check
 *
 * Usage:
 *   1. Copy .env.example → .env and add your HF token
 *   2. npm install
 *   3. npm start (or npm run dev for hot-reload)
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { generateHealthPlan } = require("./routes/generatePlan");
const { analyzeBlood } = require("./routes/analyzeBlood");

const app = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ─────────────────────────────────────────── */

// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));

// CORS — allow the Expo dev client and production origins
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:8081", "http://localhost:19006", "exp://"],
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting — prevent abuse (30 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests. Please try again in a minute.",
  },
});
app.use("/generate-plan", limiter);
app.use("/analyze-blood", limiter);

// Request logging (lightweight)
app.use((req, _res, next) => {
  if (req.method !== "GET" || req.path !== "/health") {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path}`
    );
  }
  next();
});

/* ── Routes ────────────────────────────────────────────── */

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "OVA Health Plan API",
    timestamp: new Date().toISOString(),
  });
});

// Generate health plan
app.post("/generate-plan", generateHealthPlan);
app.post("/analyze-blood", analyzeBlood);

/* ── 404 handler ───────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found. Use POST /generate-plan",
  });
});

/* ── Global error handler ──────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({
    status: "error",
    message: "Internal server error. Please try again later.",
  });
});

/* ── Start ─────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n  ✨ OVA Backend running on http://localhost:${PORT}`);
  console.log(`  📋 POST /generate-plan  — Generate health plans`);
  console.log(`  🩸 POST /analyze-blood  — Analyze period blood data`);
  console.log(`  💚 GET  /health          — Health check\n`);

  // Verify HF token is configured
  if (!process.env.HF_API_KEY) {
    console.warn(
      "  ⚠️  WARNING: HF_API_KEY not set in .env — API calls will fail\n"
    );
  }
});

module.exports = app;
