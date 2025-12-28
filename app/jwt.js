const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey"; // move to .env later
const JWT_EXPIRES_IN = "1h";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken
};
