const express = require("express");
const cors = require("cors");
const authRoutes = require("./app/auth");
const dashboardRoutes = require("./app/dashboard");

const app = express();

/* ✅ ENABLE CORS — THIS WAS MISSING */
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
