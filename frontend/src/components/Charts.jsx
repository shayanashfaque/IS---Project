import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function Charts({ events }) {
  if (!events.length) return null;

  // Sort events by time
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  /* ---------- Line Chart: Risk Score ---------- */
  const lineData = {
    labels: sorted.map(e =>
      new Date(e.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Risk Score",
        data: sorted.map(e => e.risk_score),
        tension: 0.3
      }
    ]
  };

  /* ---------- Bar Chart: Decisions ---------- */
  const decisionCounts = {
    allow: 0,
    warn: 0,
    blocked: 0   // ✅ FIX
  };

  sorted.forEach(e => {
    if (decisionCounts[e.decision] !== undefined) {
      decisionCounts[e.decision]++;
    }
  });

  const barData = {
    labels: ["allow", "warn", "blocked"],
    datasets: [
      {
        label: "Login Decisions",
        data: [
          decisionCounts.allow,
          decisionCounts.warn,
          decisionCounts.blocked
        ]
      }
    ]
  };

  return (
    <>
      <h3>Risk Score Over Time</h3>
      <Line data={lineData} />

      <h3>AI Decision Distribution</h3>
      <Bar data={barData} />
    </>
  );
}

export default Charts;
