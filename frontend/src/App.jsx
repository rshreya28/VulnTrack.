import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AssignVulnerability from "./pages/admin/AssignVulnerability";

import AnalystDashboard from "./pages/analyst/AnalystDashboard";
import ReportVulnerability from "./pages/analyst/ReportVulnerability";
import VerifyFix from "./pages/analyst/VerifyFix";
import RemediationReview from "./pages/analyst/RemediationReview";

import DeveloperDashboard from "./pages/developer/DeveloperDashboard";
import UpdateRemediation from "./pages/developer/UpdateRemediation";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/assign"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AssignVulnerability />
            </ProtectedRoute>
          }
        />

        {/* ANALYST */}

        <Route
          path="/analyst"
          element={
            <ProtectedRoute allowedRoles={["ANALYST"]}>
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyst/report"
          element={
            <ProtectedRoute allowedRoles={["ANALYST"]}>
              <ReportVulnerability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyst/verify"
          element={
            <ProtectedRoute allowedRoles={["ANALYST"]}>
              <VerifyFix />
            </ProtectedRoute>
          }
        />

        <Route path="/analyst/review/:id" element={<ProtectedRoute allowedRoles={["ANALYST"]}><RemediationReview /></ProtectedRoute>} />

        {/* DEVELOPER */}

        <Route
          path="/developer"
          element={
            <ProtectedRoute allowedRoles={["DEVELOPER"]}>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/developer/remediation/:id"
          element={
            <ProtectedRoute allowedRoles={["DEVELOPER"]}>
              <UpdateRemediation />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;