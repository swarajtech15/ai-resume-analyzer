import { Link } from "react-router-dom";
import { useState } from "react";
import AnalysisResults from "../components/AnalysisResults";
import { API_BASE_URL } from "../services/api";
import "../styles/admin-dashboard.css";

function getFileBadge(fileName) {
  const lowerName = String(fileName || "").toLowerCase();

  if (lowerName.endsWith(".docx")) {
    return "DOCX";
  }

  return "PDF";
}

function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [files, setFiles] = useState([]);
  const [requirement, setRequirement] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setResults([]);
    setError("");
  };

  const handleRequirementChange = (event) => {
    setRequirement(event.target.value);
  };

  const handleAnalyze = async () => {
    setError("");

    if (loading) {
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one resume.");
      return;
    }

    if (!requirement.trim()) {
      setError("Please describe the role or requirement before analyzing.");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("resumes", file);
    });

    formData.append("requirement", requirement.trim());

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Resume analysis failed.");
      }

      setResults(Array.isArray(data.candidates) ? data.candidates : []);
    } catch (err) {
      setResults([]);
      setError(err.message || "Unable to analyze resumes right now.");
    } finally {
      setLoading(false);
    }
  };

  const uploadLabel = files.length === 1 ? "1 file" : `${files.length} files`;
  const rankedCount = results.length;
  const statusLabel = loading ? "Analyzing" : results.length ? "Complete" : "Ready";
  const statusHint = loading
    ? "AI engine is reviewing the resumes"
    : results.length
      ? "Ranked recommendations are ready"
      : "AI engine waiting";

  const navigation = [
    {
      name: "Dashboard",
      icon: "⌂",
    },
    {
      name: "Resume Analysis",
      icon: "◫",
    },
    {
      name: "Candidates",
      icon: "◎",
    },
  ];

  return (
    <main className="dashboard">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <svg viewBox="0 0 31.5 48.5" aria-hidden="true">
            <defs>
              <linearGradient
                id="dashboardBrandGradient"
                x1="8"
                y1="0"
                x2="34.1"
                y2="28.9"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#9e9e9e" />
                <stop offset=".28" stopColor="#a6a6a6" />
                <stop offset=".34" stopColor="#a3a3a3" />
                <stop offset=".40" stopColor="#3a3a3a" />
                <stop offset=".55" stopColor="#414141" />
                <stop offset=".60" stopColor="#7a7a7a" />
                <stop offset=".68" stopColor="#8e8e8e" />
                <stop offset=".80" stopColor="#a9a9a9" />
                <stop offset=".95" stopColor="#c4c4c4" />
                <stop offset="1" stopColor="#cccccc" />
              </linearGradient>
            </defs>

            <path
              d="M21.5 0
                 L21.5 19.5
                 L31.5 19.5
                 L31.5 29
                 L10 48.5
                 L10 28.5
                 L0.5 28.5
                 L0.5 18.5
                 Z"
              fill="url(#dashboardBrandGradient)"
            />

            <rect x=".5" y="18.5" width="9" height="10" fill="#fdfdfd" />

            <rect x="22" y="19.5" width="9.5" height="9.5" fill="#fdfdfd" />
          </svg>

          <span>AI Resume Analyzer</span>
        </Link>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="dashboard-nav">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={
                activeNav === item.name
                  ? "dashboard-nav-item active"
                  : "dashboard-nav-item"
              }
              onClick={() => setActiveNav(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>

              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link to="/admin/settings" className="dashboard-nav-item">
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </Link>

          <Link to="/admin/login" className="dashboard-nav-item logout">
            <span className="nav-icon">↪</span>
            <span>Log out</span>
          </Link>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <section className="dashboard-main">
        {/* TOPBAR */}

        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-eyebrow">ADMINISTRATOR WORKSPACE</p>

            <h1>Resume Intelligence</h1>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>Admin account</span>
            </div>
          </div>
        </header>

        {/* STATS */}

        <section className="dashboard-stats">
          <div className="stat">
            <span>RESUMES</span>
            <strong>{files.length}</strong>
            <small>Uploaded this session</small>
          </div>

          <div className="stat">
            <span>ANALYSIS</span>
            <strong>{rankedCount}</strong>
            <small>Completed</small>
          </div>

          <div className="stat">
            <span>CANDIDATES</span>
            <strong>{rankedCount}</strong>
            <small>Currently ranked</small>
          </div>

          <div className="stat">
            <span>STATUS</span>
            <strong className={loading ? "status-working" : "status-ready"}>
              {statusLabel}
            </strong>
            <small>{statusHint}</small>
          </div>
        </section>

        {/* WORKSPACE */}

        <section className="analysis-workspace">
          {/* UPLOAD */}

          <div className="upload-section">
            <div className="section-heading">
              <div>
                <p>01 — RESUME INPUT</p>

                <h2>Upload resumes</h2>
              </div>

              <span className="file-count">{uploadLabel}</span>
            </div>

            <label className="upload-zone">
              <input
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />

              <div className="upload-symbol">↑</div>

              <h3>Drop resumes here</h3>

              <p>or click to browse your computer</p>

              <span className="upload-formats">PDF · DOCX</span>
            </label>

            {/* FILE LIST */}

            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, index) => (
                  <div className="file-item" key={`${file.name}-${index}`}>
                    <div className="file-icon">{getFileBadge(file.name)}</div>

                    <div className="file-information">
                      <strong>{file.name}</strong>

                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>

                    <span className="file-ready">Ready</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* JOB REQUIREMENT */}

          <div className="requirement-section">
            <div className="section-heading">
              <div>
                <p>02 — ROLE REQUIREMENT</p>

                <h2>What are you hiring for?</h2>
              </div>
            </div>

            <textarea
              className="requirement-input"
              placeholder="Describe the role, required skills, experience, qualifications, or anything the AI should prioritize..."
              value={requirement}
              onChange={handleRequirementChange}
            />

            <div className="requirement-hint">
              <span>AI</span>

              <p>
                The information here will guide candidate ranking and
                recommendations.
              </p>
            </div>

            <button
              className="analyze-button"
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              <span>{loading ? "Analyzing..." : "Analyze candidates"}</span>

              <span>{loading ? "…" : "→"}</span>
            </button>
          </div>
        </section>

        {/* RESULTS */}

        <section className="results-section">
          <div className="results-header">
            <div>
              <p>03 — AI RESULTS</p>

              <h2>Candidate recommendations</h2>
            </div>

            <span>
              {loading
                ? "Analyzing with local Ollama"
                : results.length
                  ? `${results.length} ranked candidates`
                  : "Waiting for analysis"}
            </span>
          </div>

          {error && <div className="dashboard-alert">{error}</div>}

          {loading ? (
            <div className="analysis-loading">
              <div className="loading-icon">AI</div>
              <div className="loading-copy">
                <h3>Analyzing resumes with Ollama</h3>
                <p>
                  The local llama3.2:3b model is comparing each resume against
                  your job requirement.
                </p>
              </div>
            </div>
          ) : results.length ? (
            <AnalysisResults results={results} />
          ) : (
            <div className="empty-results">
              <div className="empty-icon">✦</div>

              <h3>No candidates analyzed yet</h3>

              <p>
                Upload resumes and define your hiring requirements to begin
                AI-powered analysis.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;
