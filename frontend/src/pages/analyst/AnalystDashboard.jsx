import {
  useEffect,
  useState
} from "react";

import api from "../../api/api";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import VulnerabilityChart from "../../components/VulnerabilityChart";

function AnalystDashboard() {

  const [vulnerabilities,
    setVulnerabilities] =
    useState([]);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {

    try {

      const response =
        await api.get(
          "/analyst/my-reports"
        );

      setVulnerabilities(
        response.data
      );

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Unable to load reports"
      );
    }
  };

  const critical =
    vulnerabilities.filter(
      v =>
        v.severity === "CRITICAL"
    ).length;

  const closed =
    vulnerabilities.filter(
      v =>
        v.status === "CLOSED"
    ).length;

  const pending =
    vulnerabilities.filter(
      v =>
        v.status === "REMEDIATED"
    ).length;

  return (
    <>
      <Navbar />

      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <div className="page-heading">
            <div>
              <h1>
                Analyst Dashboard
              </h1>

              <p>
                Report and monitor security
                vulnerabilities.
              </p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="stats-grid">

            <StatCard
              title="My Reports"
              value={vulnerabilities.length}
            />

            <StatCard
              title="Critical"
              value={critical}
            />

            <StatCard
              title="Pending Verification"
              value={pending}
            />

            <StatCard
              title="Closed"
              value={closed}
            />

          </div>

          <VulnerabilityChart
            vulnerabilities={
              vulnerabilities
            }
          />

          <div className="table-card">

            <h3>My Vulnerabilities</h3>

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Developer</th>
                </tr>
              </thead>

              <tbody>

                {vulnerabilities.map(
                  vulnerability => (

                  <tr
                    key={
                      vulnerability.id
                    }
                  >
                    <td>
                      #{vulnerability.id}
                    </td>

                    <td>
                      {vulnerability.title}
                    </td>

                    <td>
                      <span
                        className={`badge ${vulnerability.severity?.toLowerCase()}`}
                      >
                        {vulnerability.severity}
                      </span>
                    </td>

                    <td>
                      {vulnerability.status}
                    </td>

                    <td>
                      {
                        vulnerability.assignedToName ||
                        "Not assigned"
                      }
                    </td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>
    </>
  );
}

export default AnalystDashboard;