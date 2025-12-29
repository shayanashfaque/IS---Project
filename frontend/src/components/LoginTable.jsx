function LoginTable({ events }) {
  // Guard: events must be an array
  if (!Array.isArray(events)) {
    return <p>No login data available.</p>;
  }

  // Empty state
  if (events.length === 0) {
    return <p>No login events recorded.</p>;
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
        {events.map((event, index) => (
          <tr key={index}>
            <td>
              {event.timestamp
                ? new Date(event.timestamp).toLocaleString()
                : "-"}
            </td>
            <td>{event.ip_address || "-"}</td>
            <td>{event.device || "-"}</td>
            <td>
              {typeof event.risk_score === "number"
                ? event.risk_score.toFixed(2)
                : "-"}
            </td>
            <td>{event.decision || "-"}</td>
            <td>{event.reasons || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LoginTable;
