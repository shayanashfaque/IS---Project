require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

/* Create tables if not exist */
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_events (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      device TEXT,
      risk_score FLOAT,
      ai_label TEXT,
      action_taken TEXT
    );
  `);
}

initDB();

module.exports = pool;
