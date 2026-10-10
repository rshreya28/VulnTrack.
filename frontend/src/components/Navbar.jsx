import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const name =
    localStorage.getItem("name") || "User";

  const role =
    localStorage.getItem("role") || "";

  const logout = () => {

    localStorage.clear();

    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-brand">
        <div className="brand-icon">V</div>

        <div>
          <h2>VulnTrack</h2>
          <span>Vulnerability Management</span>
        </div>
      </div>

      <div className="navbar-user">

        <div>
          <strong>{name}</strong>
          <span>{role}</span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;