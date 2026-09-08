import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin-login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const { username, password } = formData;

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Store authentication token
      localStorage.setItem("adminToken", data.token);

      // Move to dashboard
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Link to="/" className="login-back">
        ← Back to Home
      </Link>

      <div className="login-shell">
        {/* LEFT SIDE */}

        <div className="login-intro">
          <span className="login-eyebrow">AI RESUME ANALYZER</span>

          <h1>
            Welcome back
            <br />
            to your workspace.
          </h1>

          <p>
            Sign in to manage resumes, compare candidates, and access your
            intelligent hiring workspace.
          </p>

          <div className="login-status">
            <span className="status-dot"></span>
            Secure administrator access
          </div>
        </div>

        {/* LOGIN CARD */}

        <div className="login-card">
          <div className="login-heading">
            <span>ADMIN ACCESS</span>

            <h2>Sign in</h2>

            <p>Enter your administrator credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* USERNAME */}

            <div className="form-group">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            {/* PASSWORD */}

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            {/* ERROR */}

            {error && <div className="login-message error">{error}</div>}

            {/* SUBMIT */}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-register">
            Don't have an admin account?
            <Link to="/admin/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
