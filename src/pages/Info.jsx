import { Link } from "react-router-dom";
import "../styles/info.css";

function Info() {
  return (
    <div className="info-page">
      {/* BACK TO HOME */}
      <header className="info-header">
        <Link to="/" className="back-home">
          <span className="back-arrow">←</span>
          Back to Homepage
        </Link>

        <div className="info-brand">AI RESUME ANALYZER</div>
      </header>

      {/* HERO */}
      <section className="info-hero">
        <p className="info-eyebrow">THE INTELLIGENCE LAYER FOR HIRING</p>

        <h1>
          Understand resumes.
          <br />
          <span>Discover potential.</span>
        </h1>

        <p className="info-intro">
          AI Resume Analyzer transforms unstructured resumes into meaningful
          candidate insights, helping hiring teams make faster and more informed
          decisions.
        </p>
      </section>

      {/* ABOUT */}
      <section id="about" className="info-section about-section">
        <div className="section-number">01</div>

        <div className="section-content">
          <p className="section-eyebrow">ABOUT</p>

          <h2>
            Hiring shouldn't begin
            <br />
            with a pile of PDFs.
          </h2>

          <p className="section-description">
            AI Resume Analyzer is designed to turn resumes into structured
            intelligence. Instead of manually reading, comparing, and filtering
            every candidate, the platform helps hiring teams understand what
            each applicant brings to the table.
          </p>

          <p className="section-description">
            Upload resumes, let the AI analyze their experience, skills and
            qualifications, and get a clearer picture of which candidates best
            match your requirements.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="info-section features-section">
        <div className="section-number">02</div>

        <div className="section-content">
          <p className="section-eyebrow">FEATURES</p>

          <h2>
            From raw resumes
            <br />
            to clear decisions.
          </h2>

          <div className="feature-list">
            <div className="feature-row">
              <span className="feature-index">01</span>
              <div>
                <h3>Resume Intelligence</h3>
                <p>
                  Extract meaningful information from uploaded resumes and
                  transform unstructured documents into useful candidate data.
                </p>
              </div>
              <span className="feature-arrow">↗</span>
            </div>

            <div className="feature-row">
              <span className="feature-index">02</span>
              <div>
                <h3>AI Candidate Matching</h3>
                <p>
                  Compare candidate profiles against the hiring requirements and
                  identify the strongest matches.
                </p>
              </div>
              <span className="feature-arrow">↗</span>
            </div>

            <div className="feature-row">
              <span className="feature-index">03</span>
              <div>
                <h3>Skill Analysis</h3>
                <p>
                  Understand technical skills, experience, qualifications and
                  other relevant candidate attributes.
                </p>
              </div>
              <span className="feature-arrow">↗</span>
            </div>

            <div className="feature-row">
              <span className="feature-index">04</span>
              <div>
                <h3>Candidate Insights</h3>
                <p>
                  Surface useful insights that make it easier to understand the
                  strengths of each applicant.
                </p>
              </div>
              <span className="feature-arrow">↗</span>
            </div>

            <div className="feature-row">
              <span className="feature-index">05</span>
              <div>
                <h3>Smart Shortlisting</h3>
                <p>
                  Reduce the time spent manually filtering resumes and focus
                  attention on the candidates who matter.
                </p>
              </div>
              <span className="feature-arrow">↗</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="info-section faq-section">
        <div className="section-number">03</div>

        <div className="section-content">
          <p className="section-eyebrow">FAQ</p>

          <h2>
            Questions,
            <br />
            answered.
          </h2>

          <div className="faq-list">
            <details>
              <summary>
                What is AI Resume Analyzer?
                <span>+</span>
              </summary>

              <p>
                It is an AI-powered platform designed to analyze, compare and
                help shortlist candidates based on information contained in
                their resumes.
              </p>
            </details>

            <details>
              <summary>
                What types of resumes can it analyze?
                <span>+</span>
              </summary>

              <p>
                The platform is designed to work with common resume formats
                including PDF and image-based documents.
              </p>
            </details>

            <details>
              <summary>
                How does candidate matching work?
                <span>+</span>
              </summary>

              <p>
                The system analyzes candidate information and compares relevant
                skills, experience and qualifications against the hiring
                requirements.
              </p>
            </details>

            <details>
              <summary>
                Can multiple resumes be compared?
                <span>+</span>
              </summary>

              <p>
                Yes. The goal of the platform is to allow hiring teams to
                analyze multiple candidates and identify the strongest matches
                efficiently.
              </p>
            </details>

            <details>
              <summary>
                Who is the platform designed for?
                <span>+</span>
              </summary>

              <p>
                It is designed primarily for hiring teams, recruiters and
                organizations that need a faster way to evaluate multiple
                candidates.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="info-final">
        <p>READY TO FIND THE RIGHT CANDIDATE?</p>

        <h2>
          Let intelligence
          <br />
          handle the first look.
        </h2>

        <Link to="/admin/login" className="info-cta">
          Get Started
          <span>↗</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="info-footer">
        <span>AI RESUME ANALYZER</span>
        <span>Built for smarter hiring.</span>
        <Link to="/">Back to Homepage ↑</Link>
      </footer>
    </div>
  );
}

export default Info;
