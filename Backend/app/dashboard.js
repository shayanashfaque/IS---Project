const express = require("express");
const pool = require("./database");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

router.get("/dashboard/logins", authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  const result = await pool.query(
    "SELECT * FROM login_events WHERE user_id = $1 ORDER BY timestamp DESC",
    [userId]
  );

  res.json(result.rows);
});

module.exports = router;
