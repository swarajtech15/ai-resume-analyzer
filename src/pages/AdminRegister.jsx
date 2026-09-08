import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin-register.css";

function AdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const { username, mobile, password, confirmPassword } = formData;

    if (!username || !mobile || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          mobile,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage("Admin account created successfully.");

      setFormData({
        username: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/admin/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Unable to create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-page">
      {/* BACK TO HOME */}
      <Link to="/" className="register-back">
        ← Back to Home
      </Link>

      <div className="register-shell">
        {/* LEFT SIDE */}
        <div className="register-intro">
          <span className="register-eyebrow">AI RESUME ANALYZER</span>

          <h1>
            Build your
            <br />
            admin workspace.
          </h1>

          <p>
            Create the administrator account that will manage resume analysis,
            candidate comparisons, and intelligent shortlisting.
          </p>

          <div className="register-status">
            <span className="status-dot"></span>
            Secure administrator registration
          </div>
        </div>

        {/* FORM */}
        <div className="register-card">
          <div className="register-heading">
            <span>ADMIN ACCESS</span>

            <h2>Create account</h2>

            <p>Set up your administrator credentials to continue.</p>
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

            {/* MOBILE */}
            <div className="form-group">
              <label htmlFor="mobile">Mobile number</label>

              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {/* ERROR */}
            {error && <div className="form-message error">{error}</div>}

            {/* SUCCESS */}
            {message && <div className="form-message success">{message}</div>}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Admin Account"}
            </button>
          </form>

          <div className="register-login">
            Already have an admin account?
            <Link to="/admin/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
