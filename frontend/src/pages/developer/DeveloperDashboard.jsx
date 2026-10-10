
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";

function DeveloperDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [tab, setTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssigned = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/developer/assigned");
      const vulnerabilities = response.data || [];

      setItems(vulnerabilities);

      // Fetch analyst feedback for reopened vulnerabilities.
      const reopened = vulnerabilities.filter(
        (item) => item.status === "REOPENED"
      );

      const results = await Promise.all(
        reopened.map(async (item) => {
          try {
            const res = await api.get(
              `/developer/remediation/${item.id}`
            );
            return [item.id, res.data];
          } catch {
            return [item.id, null];
          }
        })
      );

      setFeedback(Object.fromEntries(results));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load assigned vulnerabilities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssigned();
  }, []);

  const active = items.filter((item) =>
    ["ASSIGNED", "IN_PROGRESS", "REOPENED"].includes(
      item.status
    )
  );

  const awaiting = items.filter(
    (item) =>
      item.status === "REMEDIATED" ||
      item.status === "VERIFIED"
  );

  const closed = items.filter(
    (item) => item.status === "CLOSED"
  );

  const reopenedCount = items.filter(
    (item) => item.status === "REOPENED"
  ).length;

  const visibleItems =
    tab === "active"
      ? active
      : tab === "review"
      ? awaiting
      : closed;

  const openDetails = (id) => {
    navigate(`/developer/remediation/${id}`);
  };

  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-heading">
            <div>
              <h1>Developer Dashboard</h1>
              <p>
                Manage assigned vulnerabilities, review
                analyst feedback and track completed fixes.
              </p>
            </div>

            <button
              type="button"
              className="vt-refresh-btn"
              onClick={loadAssigned}
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
              title="Total Assigned"
              value={items.length}
            />
            <StatCard
              title="Active Work"
              value={active.length}
            />
            <StatCard
              title="Awaiting Review"
              value={awaiting.length}
            />
            <StatCard
              title="Closed"
              value={closed.length}
            />
          </div>

          {reopenedCount > 0 && (
            <div className="vt-alert">
              <strong>
                {reopenedCount} vulnerability(s) reopened
              </strong>
              <p>
                The Security Analyst requested changes.
                Review the feedback and resubmit your fixes.
              </p>
            </div>
          )}

          <div className="vt-tabs">
            <button
              type="button"
              className={tab === "active" ? "selected" : ""}
              onClick={() => setTab("active")}
            >
              Active Work ({active.length})
            </button>

            <button
              type="button"
              className={tab === "review" ? "selected" : ""}
              onClick={() => setTab("review")}
            >
              Awaiting Review ({awaiting.length})
            </button>

            <button
              type="button"
              className={tab === "closed" ? "selected" : ""}
              onClick={() => setTab("closed")}
            >
              Closed History ({closed.length})
            </button>
          </div>

          {loading ? (
            <div className="empty-card">
              Loading vulnerabilities...
            </div>
          ) : (
            <div className="issue-grid">
              {visibleItems.length === 0 && (
                <div className="empty-card">
                  {tab === "active"
                    ? "No active vulnerabilities."
                    : tab === "review"
                    ? "No fixes awaiting review."
                    : "No closed vulnerabilities yet."}
                </div>
              )}

              {visibleItems.map((item) => {
                const review = feedback[item.id];
                const isReopened =
                  item.status === "REOPENED";

                return (
                  <div
                    className="issue-card"
                    key={item.id}
                  >
                    <div className="issue-top">
                      <h3>{item.title}</h3>

                      <span
                        className={`badge ${
                          item.severity?.toLowerCase() || ""
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <p>{item.description}</p>

                    <div className="issue-details">
                      <span>
                        <strong>Status:</strong>{" "}
                        {item.status}
                      </span>

                      <span>
                        <strong>System:</strong>{" "}
                        {item.affectedSystem || "-"}
                      </span>

                      <span>
                        <strong>Reported by:</strong>{" "}
                        {item.reportedByName || "-"}
                      </span>
                    </div>

                    {isReopened && (
                      <div className="vt-feedback">
                        <h4>Analyst Review Feedback</h4>

                        {review?.reviewReason ? (
                          <p>
                            <strong>Reason:</strong>{" "}
                            {review.reviewReason}
                          </p>
                        ) : null}

                        <p>
                          <strong>Required Changes:</strong>
                        </p>

                        <p>
                          {review?.analystFeedback ||
                            "Open the remediation page to review the latest feedback."}
                        </p>
                      </div>
                    )}

                    {item.status === "REMEDIATED" && (
                      <div className="vt-info">
                        Fix submitted. Waiting for
                        Analyst verification.
                      </div>
                    )}

                    {item.status === "CLOSED" && (
                      <div className="vt-success">
                        Verified and closed by the Analyst.
                      </div>
                    )}

                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => openDetails(item.id)}
                    >
                      {isReopened
                        ? "View Feedback & Fix Again"
                        : item.status === "ASSIGNED" ||
                          item.status === "IN_PROGRESS"
                        ? "Work on Fix"
                        : item.status === "CLOSED"
                        ? "View Remediation History"
                        : "View Submitted Solution"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default DeveloperDashboard;
