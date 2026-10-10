
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import VulnerabilityChart from "../../components/VulnerabilityChart";

function AdminDashboard() {
  const navigate = useNavigate();

  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [vulnerabilityResponse, userResponse] =
        await Promise.all([
          api.get("/vulnerabilities"),
          api.get("/admin/users")
        ]);

      setVulnerabilities(vulnerabilityResponse.data || []);
      setUsers(userResponse.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load Admin Dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const total = vulnerabilities.length;

  const unassigned = vulnerabilities.filter(
    (v) => !v.assignedToId
  );

  const assigned = vulnerabilities.filter(
    (v) => Boolean(v.assignedToId)
  );

  const critical = vulnerabilities.filter(
    (v) => v.severity?.toUpperCase() === "CRITICAL"
  ).length;

  const open = vulnerabilities.filter(
    (v) => !["CLOSED", "VERIFIED"].includes(v.status)
  ).length;

  const closed = vulnerabilities.filter(
    (v) => v.status === "CLOSED"
  ).length;

  const awaitingReview = vulnerabilities.filter(
    (v) => v.status === "REMEDIATED"
  ).length;

  const reopened = vulnerabilities.filter(
    (v) => v.status === "REOPENED"
  ).length;

  const developers = users.filter(
    (user) =>
      String(user.role || "")
        .toUpperCase()
        .includes("DEVELOPER")
  );

  const workload = developers.map((developer) => {
    const developerIssues = assigned.filter(
      (v) => String(v.assignedToId) === String(developer.id)
    );

    const active = developerIssues.filter(
      (v) =>
        ["ASSIGNED", "IN_PROGRESS", "REOPENED"].includes(
          v.status
        )
    ).length;

    return {
      ...developer,
      total: developerIssues.length,
      active,
      review: developerIssues.filter(
        (v) => v.status === "REMEDIATED"
      ).length,
      closed: developerIssues.filter(
        (v) => v.status === "CLOSED"
      ).length
    };
  });

  const filtered = vulnerabilities.filter((v) => {
    let matchesFilter = true;

    if (filter === "UNASSIGNED") {
      matchesFilter = !v.assignedToId;
    } else if (filter === "ASSIGNED") {
      matchesFilter = Boolean(v.assignedToId);
    } else if (filter !== "ALL") {
      matchesFilter = v.status === filter;
    }

    const keyword = search.trim().toLowerCase();

    const matchesSearch =
      !keyword ||
      String(v.id).includes(keyword) ||
      (v.title || "").toLowerCase().includes(keyword) ||
      (v.affectedSystem || "").toLowerCase().includes(keyword) ||
      (v.assignedToName || "").toLowerCase().includes(keyword);

    return matchesFilter && matchesSearch;
  });

  const getProgress = (status) => {
    switch (status) {
      case "OPEN":
        return "Waiting for assignment";
      case "ASSIGNED":
        return "Assigned to developer";
      case "IN_PROGRESS":
        return "Developer working on fix";
      case "REMEDIATED":
        return "Waiting for Analyst review";
      case "REOPENED":
        return "Fix rejected - changes required";
      case "VERIFIED":
        return "Verified";
      case "CLOSED":
        return "Verified and closed";
      default:
        return status || "Unknown";
    }
  };

  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-heading">
            <div>
              <h1>Admin Dashboard</h1>
              <p>
                Monitor vulnerabilities, developer assignments
                and remediation progress.
              </p>
            </div>

            <button
              type="button"
              className="vt-refresh-btn"
              onClick={loadDashboard}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="stats-grid">
            <StatCard
              title="Total Vulnerabilities"
              value={total}
            />
            <StatCard
              title="Unassigned"
              value={unassigned.length}
            />
            <StatCard
              title="Assigned"
              value={assigned.length}
            />
            <StatCard
              title="Open Issues"
              value={open}
            />
            <StatCard
              title="Awaiting Review"
              value={awaitingReview}
            />
            <StatCard
              title="Reopened"
              value={reopened}
            />
            <StatCard
              title="Closed"
              value={closed}
            />
            <StatCard
              title="Critical"
              value={critical}
            />
            <StatCard
              title="System Users"
              value={users.length}
            />
          </div>

          <div className="vt-admin-actions">
            <div>
              <h2>Assignment Overview</h2>
              <p>
                {unassigned.length} vulnerabilities still need
                a developer.
              </p>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/admin/assign")}
            >
              Manage Assignments
            </button>
          </div>

          <VulnerabilityChart
            vulnerabilities={vulnerabilities}
          />

          <div className="table-card vt-admin-section">
            <div className="card-heading">
              <h3>Developer Workload</h3>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Developer</th>
                    <th>Total Assigned</th>
                    <th>Active Work</th>
                    <th>Awaiting Review</th>
                    <th>Closed</th>
                  </tr>
                </thead>

                <tbody>
                  {workload.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        No developers available.
                      </td>
                    </tr>
                  ) : (
                    workload.map((developer) => (
                      <tr key={developer.id}>
                        <td>
                          <strong>{developer.name}</strong>
                        </td>
                        <td>{developer.total}</td>
                        <td>{developer.active}</td>
                        <td>{developer.review}</td>
                        <td>{developer.closed}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card vt-admin-section">
            <div className="card-heading">
              <h3>Vulnerability Progress Tracking</h3>
            </div>

            <div className="vt-admin-filters">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter vulnerabilities"
              >
                <option value="ALL">All Vulnerabilities</option>
                <option value="UNASSIGNED">Unassigned</option>
                <option value="ASSIGNED">All Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REMEDIATED">Awaiting Review</option>
                <option value="REOPENED">Reopened</option>
                <option value="CLOSED">Closed</option>
              </select>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, title, system or developer"
                aria-label="Search vulnerabilities"
              />
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Developer</th>
                    <th>Progress</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">Loading...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        No matching vulnerabilities.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((v) => (
                      <tr key={v.id}>
                        <td>#{v.id}</td>
                        <td>
                          <strong>{v.title}</strong>
                          <div className="small-muted">
                            {v.affectedSystem || "-"}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              v.severity?.toLowerCase() || ""
                            }`}
                          >
                            {v.severity}
                          </span>
                        </td>
                        <td>{v.status}</td>
                        <td>
                          {v.assignedToName || "Unassigned"}
                        </td>
                        <td>{getProgress(v.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;
