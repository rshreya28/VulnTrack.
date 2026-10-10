import {
  NavLink
} from "react-router-dom";

function Sidebar() {

  const role =
    localStorage.getItem("role");

  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        Navigation
      </div>

      {role === "ADMIN" && (
        <>
          <NavLink to="/admin">
            Dashboard
          </NavLink>

          <NavLink to="/admin/users">
            Manage Users
          </NavLink>

          <NavLink to="/admin/assign">
            Assign Vulnerabilities
          </NavLink>
        </>
      )}

      {role === "ANALYST" && (
        <>
          <NavLink to="/analyst">
            Dashboard
          </NavLink>

          <NavLink to="/analyst/report">
            Report Vulnerability
          </NavLink>

          <NavLink to="/analyst/verify">
            Verify Fixes
          </NavLink>
        </>
      )}

      {role === "DEVELOPER" && (
        <>
          <NavLink to="/developer">
            Dashboard
          </NavLink>
        </>
      )}

    </aside>
  );
}

export default Sidebar;