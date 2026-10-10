import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../api/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "ANALYST",
      department: ""
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      await api.post(
        "/auth/register",
        form
      );

      setMessage(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card register-card">

        <h1>Create Account</h1>

        <p className="auth-description">
          Join the VulnTrack platform
        </p>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength="6"
            required
          />

          <label>Role</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="ANALYST">
              Security Analyst
            </option>

            <option value="DEVELOPER">
              Developer
            </option>
          </select>

          <label>Department</label>

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Example: Security Operations"
          />

          <button
            type="submit"
            className="primary-btn full-btn"
          >
            Register
          </button>

        </form>

        <p className="auth-link">
          Already registered?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;