const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./database");
const { evaluateLogin } = require("./aiengine");
const authMiddleware = require("./authMiddleware");


const router = express.Router();
const JWT_SECRET = "supersecretkey";

router.post("/login", async (req, res) => {
  const { username, password, device } = req.body;
  const ip = req.ip;
  const hour = new Date().getHours();

  console.log("==== LOGIN ATTEMPT ====");
  console.log("Username received:", username);
  console.log("Password received:", password);

  // 1️⃣ Find user
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  const user = result.rows[0];
  console.log("User from DB:", user);

  if (!user) {
    console.log("❌ User not found");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 2️⃣ Check password
  console.log("Password hash from DB:", user.password_hash);

  const passwordValid = await bcrypt.compare(password, user.password_hash);
  console.log("Password valid?", passwordValid);

  // 3️⃣ AI evaluation
  const aiResult = await evaluateLogin({
    pool,
    userId: user.id,
    ip,
    device,
    hour,
    loginSuccess: passwordValid
  });

  console.log("AI decision:", aiResult.decision);

  // 4️⃣ Decide outcome
  let actionTaken = "success";

  if (!passwordValid) {
    actionTaken = "failed";
  } else if (aiResult.decision === "blocked") {
    actionTaken = "blocked";
  }

  // 5️⃣ Store login attempt
  await pool.query(
    `
    INSERT INTO login_events
    (user_id, ip_address, device, risk_score, ai_label, decision, reasons, action_taken)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,
    [
      user.id,
      ip,
      device,
      aiResult.riskScore,
      aiResult.label,
      aiResult.decision,
      aiResult.reasons.join(", "),
      actionTaken
    ]
  );

  if (!passwordValid) {
    console.log("❌ Login failed due to password mismatch");
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  if (aiResult.decision === "blocked") {
    console.log("❌ Login blocked by AI");
    return res.status(403).json({
      message: "Login blocked by AI",
      reasons: aiResult.reasons
    });
  }

  // ✅ JWT creation
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log("✅ Login successful, JWT issued");

  res.json({
    message:
      aiResult.decision === "warn"
        ? "Login successful (suspicious activity detected)"
        : "Login successful",
    token,
    riskScore: aiResult.riskScore,
    reasons: aiResult.reasons
  });
});


router.post("/logout", authMiddleware, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Decode token to get expiry
  const decoded = jwt.decode(token);

  await pool.query(
    `
    INSERT INTO token_blacklist (token, expires_at)
    VALUES ($1, to_timestamp($2))
    `,
    [token, decoded.exp]
  );

  res.json({ message: "Logged out successfully" });
});
module.exports = router;
