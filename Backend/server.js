require("dotenv").config();
const express = require("express");
const cors = require("cors");


const requiredEnv = [
  "JWT_SECRET",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});


/* ---------- App Setup ---------- */
const authRoutes = require("./app/auth");
const dashboardRoutes = require("./app/dashboard");

const app = express();

/* ---------- CORS (Dev + Prod) ---------- */
const allowedOrigins = ["http://localhost:5173"];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

/* ---------- Routes ---------- */
app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
