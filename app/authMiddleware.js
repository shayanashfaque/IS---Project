const jwt = require("jsonwebtoken");
const pool = require("./database");

const JWT_SECRET = "supersecretkey";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  // Check blacklist
  const blacklisted = await pool.query(
    "SELECT 1 FROM token_blacklist WHERE token = $1",
    [token]
  );

  if (blacklisted.rowCount > 0) {
    return res.status(401).json({ error: "Token revoked" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

module.exports = authMiddleware;
