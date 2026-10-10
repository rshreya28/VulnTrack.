import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../api/api";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: ""
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response =
        await api.post(
          "/auth/login",
          form
        );

      const data = response.data;

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.setItem(
        "name",
        data.name
      );

      localStorage.setItem(
        "email",
        data.email
      );

      if (data.role === "ADMIN") {
        navigate("/admin");
      }

      else if (data.role === "ANALYST") {
        navigate("/analyst");
      }

      else if (data.role === "DEVELOPER") {
        navigate("/developer");
      }

      else {
        navigate("/dashboard");
      }

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          V
        </div>

        <h1>VulnTrack</h1>

        <p className="auth-description">
          Secure vulnerability tracking and
          remediation platform
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            className="primary-btn full-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-link">
          Need an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;