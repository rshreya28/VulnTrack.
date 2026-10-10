
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const emptyForm = {
  rootCause: "",
  solutionImplemented: "",
  technicalChanges: "",
  testingPerformed: "",
  additionalNotes: ""
};

function UpdateRemediation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vulnerability, setVulnerability] = useState(null);
  const [remediation, setRemediation] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/vulnerabilities/${id}`
        );

        if (cancelled) return;

        const item = response.data;
        setVulnerability(item);

        try {
          const result = await api.get(
            `/developer/remediation/${id}`
          );

          if (cancelled) return;

          const existing = result.data;
          setRemediation(existing);

          setForm({
            rootCause: existing.rootCause || "",
            solutionImplemented:
              existing.solutionImplemented || "",
            technicalChanges:
              existing.technicalChanges || "",
            testingPerformed:
              existing.testingPerformed || "",
            additionalNotes:
              existing.additionalNotes || ""
          });
        } catch (err) {
          if (cancelled) return;

          // A new assignment has no remediation yet.
          if (
            err.response?.status === 404 &&
            item.status === "ASSIGNED"
          ) {
            setRemediation(null);
            setForm(emptyForm);
          } else {
            setError(
              err.response?.data?.message ||
              err.response?.data?.error ||
              "Unable to load remediation details."
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load vulnerability."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const status = vulnerability?.status;

  const canEdit = [
    "ASSIGNED",
    "IN_PROGRESS",
    "REOPENED"
  ].includes(status);

  const isReopened = status === "REOPENED";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canEdit || submitting) return;

    setError("");

    const required = [
      "rootCause",
      "solutionImplemented",
      "technicalChanges",
      "testingPerformed"
    ];

    if (
      required.some(
        (field) => !form[field].trim()
      )
    ) {
      setError(
        "Complete all four required remediation fields."
      );
      return;
    }

    try {
      setSubmitting(true);

      await api.put(
        `/developer/remediation/${id}`,
        form
      );

      alert(
        isReopened
          ? "Improved fix resubmitted for verification."
          : "Fix submitted for Analyst verification."
      );

      navigate("/developer");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to submit remediation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <p>Loading remediation...</p>
          </main>
        </div>
      </>
    );
  }

  if (!vulnerability) {
    return (
      <>
        <Navbar />
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <div className="error-message">
              {error || "Vulnerability not found."}
            </div>
            <button
              type="button"
              onClick={() => navigate("/developer")}
            >
              Back to Dashboard
            </button>
          </main>
        </div>
      </>
    );
  }

  const fields = [
    {
      name: "rootCause",
      label: "Root Cause",
      placeholder:
        "Explain what caused the vulnerability..."
    },
    {
      name: "solutionImplemented",
      label: "Solution Implemented",
      placeholder:
        "Explain the security solution implemented..."
    },
    {
      name: "technicalChanges",
      label: "Technical Changes",
      placeholder:
        "Describe the code or configuration changes..."
    },
    {
      name: "testingPerformed",
      label: "Testing Performed",
      placeholder:
        "Explain how you retested the vulnerability..."
    },
    {
      name: "additionalNotes",
      label: "Additional Notes",
      placeholder:
        "Optional supporting details..."
    }
  ];

  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-heading">
            <div>
              <h1>
                {isReopened
                  ? "Improve & Resubmit Fix"
                  : canEdit
                  ? "Update Remediation"
                  : "Remediation Details"}
              </h1>

              <p>
                Review the vulnerability and its
                remediation information.
              </p>
            </div>

            <button
              type="button"
              className="vt-refresh-btn"
              onClick={() => navigate("/developer")}
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="vulnerability-detail-card">
            <div className="detail-title-row">
              <div>
                <span className="issue-number">
                  Vulnerability #{vulnerability.id}
                </span>

                <h2>{vulnerability.title}</h2>
              </div>

              <span
                className={`badge ${
                  vulnerability.severity?.toLowerCase() || ""
                }`}
              >
                {vulnerability.severity}
              </span>
            </div>

            <div className="detail-grid">
              <div>
                <span>Status</span>
                <strong>{status}</strong>
              </div>

              <div>
                <span>Affected System</span>
                <strong>
                  {vulnerability.affectedSystem || "-"}
                </strong>
              </div>

              <div>
                <span>Vulnerability Type</span>
                <strong>
                  {vulnerability.vulnerabilityType || "-"}
                </strong>
              </div>

              <div>
                <span>Reported By</span>
                <strong>
                  {vulnerability.reportedByName || "-"}
                </strong>
              </div>
            </div>

            <div className="detail-block">
              <h3>Description</h3>
              <p>
                {vulnerability.description || "-"}
              </p>
            </div>

            <div className="detail-block">
              <h3>Steps to Reproduce</h3>
              <p>
                {vulnerability.stepsToReproduce || "-"}
              </p>
            </div>

            <div className="detail-block">
              <h3>Evidence</h3>
              <p>
                {vulnerability.evidence || "-"}
              </p>
            </div>

            <div className="analyst-recommendation">
              <h3>Analyst Recommended Fix</h3>
              <p>
                {vulnerability.recommendedFix || "-"}
              </p>
            </div>
          </div>

          {isReopened && (
            <div className="vt-feedback vt-feedback-large">
              <h2>Analyst Feedback — Changes Required</h2>

              <p>
                The previous fix was not accepted.
                Review the comments below before
                resubmitting.
              </p>

              <h4>Reason for Reopening</h4>
              <p>
                {remediation?.reviewReason ||
                  "No reason available."}
              </p>

              <h4>Required Changes / Suggestions</h4>
              <p>
                {remediation?.analystFeedback ||
                  "No written feedback available."}
              </p>
            </div>
          )}

          {!canEdit && (
            <div className="vt-info">
              {status === "CLOSED"
                ? "This vulnerability is closed. The remediation is read-only."
                : "The fix is awaiting Analyst verification. Editing is disabled."}
            </div>
          )}

          <form
            className="remediation-form-card"
            onSubmit={handleSubmit}
          >
            <div className="remediation-heading">
              <h2>
                {canEdit
                  ? "Developer Remediation"
                  : "Submitted Remediation"}
              </h2>

              <p>
                {canEdit
                  ? "Document your solution and security testing."
                  : "Previously submitted remediation details."}
              </p>
            </div>

            {fields.map((field) => (
              <div
                className="form-group"
                key={field.name}
              >
                <label htmlFor={field.name}>
                  {field.label}
                  {field.name !== "additionalNotes" &&
                    canEdit &&
                    " *"}
                </label>

                <textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={4}
                  disabled={!canEdit || submitting}
                />
              </div>
            ))}

            {canEdit && (
              <div className="remediation-submit-area">
                <div className="submission-info">
                  <strong>
                    Ready for Analyst Verification?
                  </strong>

                  <p>
                    Submission changes the status
                    to REMEDIATED.
                  </p>
                </div>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={submitting || Boolean(error)}
                >
                  {submitting
                    ? "Submitting..."
                    : isReopened
                    ? "Resubmit Improved Fix"
                    : "Submit Fix for Verification"}
                </button>
              </div>
            )}

            {remediation?.fixedAt && (
              <p className="vt-date">
                Last submitted:{" "}
                {new Date(
                  remediation.fixedAt
                ).toLocaleString()}
              </p>
            )}
          </form>
        </main>
      </div>
    </>
  );
}

export default UpdateRemediation;
