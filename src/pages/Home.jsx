import { Link } from "react-router-dom";
import "../styles/home.css";

const VIDEO_URL = "/videos/hero-background.mp4";

function Home() {
  return (
    <div className="stage">
      {/* =========================
          HERO VIDEO
      ========================= */}

      <div className="plate">
        <video
          className="plate-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      {/* =========================
          HEADER
      ========================= */}

      <header className="topbar">
        {/* BRAND */}
        <Link to="/" className="brand" aria-label="AI Resume Analyzer Home">
          <svg viewBox="0 0 31.5 48.5" aria-hidden="true">
            <defs>
              <linearGradient
                id="brandGradient"
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
              fill="url(#brandGradient)"
            />

            <rect x=".5" y="18.5" width="9" height="10" fill="#fdfdfd" />

            <rect x="22" y="19.5" width="9.5" height="9.5" fill="#fdfdfd" />
          </svg>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="links" aria-label="Primary navigation">
          <a href="/info#about">About</a>
          <a href="/info#features">Features</a>
          <a href="/info#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* DESKTOP CTA */}
        <Link to="/admin/login" className="pill pill-nav">
          <span>Get Started</span>
        </Link>

        {/* MOBILE BURGER */}
        <button
          className="burger"
          id="burger"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
        >
          <i></i>
          <i></i>
        </button>
      </header>

      {/* =========================
          MOBILE MENU
      ========================= */}

      <nav className="menu" id="menu" aria-hidden="true">
        <div className="menu-inner">
          <p className="menu-eyebrow">AI RESUME ANALYZER</p>

          <ul className="menu-list">
            <li>
              <a href="/info#about">About</a>
            </li>

            <li>
              <a href="/info#features">Features</a>
            </li>

            <li>
              <a href="/info#faq">FAQ</a>
            </li>

            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          <div className="menu-foot">
            <Link to="/admin/login" className="pill menu-cta">
              Get Started
            </Link>

            <Link to="/admin/login" className="ghost">
              View Capabilities
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================
          HERO CONTENT
      ========================= */}

      <main className="hero">
        <h1 className="headline">
          <span>The Next Layer</span>
          <span>of Hiring Intelligence</span>
        </h1>

        <p className="sub">
          <span>An AI-powered platform to help teams analyze,</span>
          <span>compare, and shortlist candidates with confidence.</span>
        </p>

        <div className="actions">
          <Link to="/admin/login" className="pill pill-cta">
            <span>Get Started</span>
          </Link>

          <a href="/info#features" className="ghost">
            View Capabilities
          </a>
        </div>
      </main>

      {/* =========================
          BOTTOM PARTNER / CAPABILITY STRIP
      ========================= */}
      <div className="logos">
        <Link to="/admin/login" className="lg lg1">
          <svg viewBox="0 0 30 31" aria-hidden="true">
            <rect
              x="2"
              y="2"
              width="26"
              height="27"
              rx="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
            />

            <circle cx="19.5" cy="10.5" r="5.1" fill="#050505" />

            <circle cx="19.5" cy="10.5" r="2.2" fill="currentColor" />
          </svg>

          <span>Resume Data</span>
        </Link>

        <Link to="/admin/login" className="lg lg2">
          <svg viewBox="0 0 25 30" aria-hidden="true">
            <path
              d="M8 1.5V28.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M16.5 1.5
         C21 1.5 23.5 5 23.5 9.5
         C23.5 14 20.5 16.5 16.5 16.5
         C12.5 16.5 10 13.5 10 9
         C10 4.5 12.5 1.5 16.5 1.5Z"
              fill="currentColor"
            />

            <circle cx="16.5" cy="20.5" r="6" fill="#050505" />
          </svg>

          <span>
            AI Matching<span className="logo-dot"></span>
          </span>
        </Link>

        <Link to="/admin/login" className="lg lg3">
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <circle
              cx="14"
              cy="14"
              r="12.35"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.1"
            />

            <path
              d="M8 14
         C10 8.5 18 8 20 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M20 14
         C18 19.5 10 20 8 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <span>Candidate Insights</span>
        </Link>

        <Link to="/admin/login" className="lg lg4">
          <svg viewBox="0 0 28 25.5" aria-hidden="true">
            <path
              d="M2 14
         C5 13 7 8 10 9
         C13 10 14 15 18 14
         C21 13 22 8 26 9
         L26 18
         L2 18Z"
              fill="currentColor"
            />

            <path
              d="M3 21
         C8 18 11 23 15 21
         C19 19 21 23 25 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>

          <span>Smart Shortlisting</span>
        </Link>
      </div>
      {/* =========================
          ACCESSIBILITY / HIDDEN
      ========================= */}

      <section id="about" className="sr-only">
        AI Resume Analyzer helps hiring teams analyze resumes, understand
        candidate qualifications, compare applicants, and identify strong
        candidates using artificial intelligence.
      </section>

      <section id="faq" className="sr-only">
        AI Resume Analyzer FAQ.
      </section>

      <section id="contact" className="sr-only">
        Contact AI Resume Analyzer.
      </section>
    </div>
  );
}

export default Home;
