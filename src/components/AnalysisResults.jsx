function getFitClass(fit) {
  const normalized = String(fit || "").toLowerCase();

  return `fit-pill fit-${normalized || "low"}`;
}

function AnalysisResults({ results = [] }) {
  if (!results.length) {
    return null;
  }

  return (
    <div className="analysis-results">
      <div className="results-summary">
        <div className="results-summary-card">
          <span>Total ranked</span>
          <strong>{results.length}</strong>
        </div>

        <div className="results-summary-card">
          <span>Top score</span>
          <strong>{results[0]?.score ?? 0}</strong>
        </div>

        <div className="results-summary-card">
          <span>Top fit</span>
          <strong>{results[0]?.fit || "Low"}</strong>
        </div>
      </div>

      <div className="results-list">
        {results.map((candidate, index) => (
          <article
            className={
              index === 0 ? "candidate-card candidate-card-top" : "candidate-card"
            }
            key={`${candidate.fileName}-${index}`}
          >
            <div className="candidate-card-header">
              <div className="candidate-title-block">
                <span className="candidate-rank">#{index + 1}</span>

                <div>
                  <h3>{candidate.fileName}</h3>

                  <p>{candidate.summary}</p>
                </div>
              </div>

              <div className="candidate-score-block">
                <div className="candidate-score">{candidate.score}</div>

                <span className={getFitClass(candidate.fit)}>{candidate.fit}</span>
              </div>
            </div>

            <div className="candidate-body">
              <div className="candidate-column">
                <h4>Strengths</h4>

                {candidate.strengths?.length ? (
                  <ul className="detail-list">
                    {candidate.strengths.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-detail">No major strengths were identified.</p>
                )}
              </div>

              <div className="candidate-column">
                <h4>Gaps</h4>

                {candidate.gaps?.length ? (
                  <ul className="detail-list detail-list-muted">
                    {candidate.gaps.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-detail">No notable gaps were identified.</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AnalysisResults;
