function LoginTable({ events }) {
  if (!events.length) {
    return <p>No login activity found.</p>;
  }

  return (
    <table border="1" width="100%" cellPadding="6">
      <thead>
        <tr>
          <th>Time</th>
          <th>IP Address</th>
          <th>Device</th>
          <th>Risk Score</th>
          <th>Decision</th>
          <th>Reasons</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e, index) => (
          <tr key={index}>
            <td>
              {e.timestamp
                ? new Date(e.timestamp).toLocaleString()
                : "N/A"}
            </td>
            <td>{e.ip_address}</td>
            <td>{e.device}</td>
            <td>
              {typeof e.risk_score === "number"
                ? e.risk_score.toFixed(2)
                : "N/A"}
            </td>
            <td>{e.decision}</td>
            <td>{e.reasons || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LoginTable;
