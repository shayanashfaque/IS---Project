import { useEffect, useState } from "react";
import { fetchLoginEvents } from "../api/api";
import LoginTable from "./LoginTable";
import Charts from "./Charts";

function Dashboard({ onLogout }) {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchLoginEvents();
        setEvents(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    let data = [...events];

    if (decisionFilter !== "all") {
      data = data.filter(e => e.decision === decisionFilter);
    }

    if (dateFilter) {
      data = data.filter(
        e => new Date(e.timestamp) >= new Date(dateFilter)
      );
    }

    setFiltered(data);
  }, [decisionFilter, dateFilter, events]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Security Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card">
        <h3>Filters</h3>
        <div className="filters">
          <select
            value={decisionFilter}
            onChange={e => setDecisionFilter(e.target.value)}
          >
            <option value="all">All Decisions</option>
            <option value="allow">Allow</option>
            <option value="warn">Warn</option>
            <option value="block">Block</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <h3>Security Analytics</h3>
        <Charts events={filtered} />
      </div>

      <div className="card">
        <h3>Login Activity</h3>
        <LoginTable events={filtered} />
      </div>
    </div>
  );
}

export default Dashboard;
