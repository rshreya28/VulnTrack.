import {
  Navigate
} from "react-router-dom";

function Dashboard() {

  const role =
    localStorage.getItem("role");

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "ANALYST") {
    return <Navigate to="/analyst" replace />;
  }

  if (role === "DEVELOPER") {
    return <Navigate to="/developer" replace />;
  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );
}

export default Dashboard;