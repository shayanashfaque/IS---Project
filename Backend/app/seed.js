const pool = require("./database");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    // Hash passwords
    const password1 = await bcrypt.hash("Test1234!", 10);
    const password2 = await bcrypt.hash("Demo123!", 10);

    // Insert users
    await pool.query(`
      INSERT INTO users (id, username, password_hash, email)
      VALUES
      (1, 'testuser', $1, 'testuser@example.com'),
      (2, 'demouser', $2, 'demouser@example.com')
      ON CONFLICT (id) DO NOTHING
    `, [password1, password2]);

    // Insert login events
    await pool.query(`
      INSERT INTO login_events
      (user_id, ip_address, device, risk_score, ai_label, decision, reasons, action_taken)
      VALUES
      (1, '192.168.1.50', 'Windows Chrome', 0.1, 'normal', 'allow', 'First login', 'success'),
      (1, '203.0.113.45', 'Unknown Device', 0.8, 'suspicious', 'warn', 'New IP detected', 'success'),
      (2, '10.0.0.5', 'Mac Safari', 0.2, 'normal', 'allow', 'First login', 'success')
      ON CONFLICT DO NOTHING
    `);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seed();
