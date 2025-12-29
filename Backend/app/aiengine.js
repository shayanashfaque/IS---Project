async function evaluateLogin({
  pool,
  userId,
  ip,
  device,
  hour
}) {
  const reasons = [];
  let riskScore = 0;

  /* ---------- New IP ---------- */
  const ipCheck = await pool.query(
    "SELECT 1 FROM login_events WHERE user_id=$1 AND ip_address=$2 LIMIT 1",
    [userId, ip]
  );

  if (ipCheck.rowCount === 0) {
    riskScore += 0.3;
    reasons.push("New IP address");
  }

  /* ---------- New Device ---------- */
  const deviceCheck = await pool.query(
    "SELECT 1 FROM login_events WHERE user_id=$1 AND device=$2 LIMIT 1",
    [userId, device]
  );

  if (deviceCheck.rowCount === 0) {
    riskScore += 0.2;
    reasons.push("New device");
  }

  /* ---------- Failed Attempts ---------- */
  const failed = await pool.query(
    `
    SELECT COUNT(*) FROM login_events
    WHERE user_id=$1
      AND action_taken='failed'
      AND timestamp > NOW() - INTERVAL '15 minutes'
    `,
    [userId]
  );

  if (parseInt(failed.rows[0].count) > 2) {
    riskScore += 0.4;
    reasons.push("Multiple failed login attempts");
  }

  /* ---------- Rapid Attempts ---------- */
  const rapid = await pool.query(
    `
    SELECT COUNT(*) FROM login_events
    WHERE user_id=$1
      AND timestamp > NOW() - INTERVAL '2 minutes'
    `,
    [userId]
  );

  if (parseInt(rapid.rows[0].count) > 3) {
    riskScore += 0.3;
    reasons.push("Rapid repeated login attempts");
  }

  /* ---------- Time Anomaly ---------- */
  if (hour < 6 || hour > 23) {
    riskScore += 0.2;
    reasons.push("Unusual login time");
  }

  /* ---------- Final Decision ---------- */
  let decision = "allow";
  let label = "normal";

  if (riskScore >= 0.7) {
    decision = "blocked";
    label = "intruder";
  } else if (riskScore >= 0.4) {
    decision = "warn";
    label = "suspicious";
  }

  return {
    riskScore: Math.min(riskScore, 1),
    decision,
    label,
    reasons
  };
}

module.exports = { evaluateLogin };
