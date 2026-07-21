import { useState } from "react";
import { Link } from "react-router-dom";
import { PHASES } from "../lib/content";
import { METHOD_CHAPTERS, QUALITY_CHECKS } from "../lib/methodology";

export function Guide() {
  const [openId, setOpenId] = useState<string>(METHOD_CHAPTERS[0].id);

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Methodology library</div>
        <h1>Read up as you sprint</h1>
        <p>
          Distilled from the Ultra Lab Experiment Playbook — why experimentation
          works, how assumptions become hypotheses, and how to decide after a
          test. For visual stories of Dropbox, Zappos, Buffer, and more, open{" "}
          <Link to="/cases" style={{ textDecoration: "underline" }}>
            Company cases
          </Link>
          .
        </p>
      </div>

      <div className="grid-2 guide-layout">
        <nav className="card chapter-nav" aria-label="Methodology chapters">
          <div className="kicker">Chapters</div>
          <ul className="chapter-list">
            {METHOD_CHAPTERS.map((ch, i) => (
              <li key={ch.id}>
                <button
                  type="button"
                  className={openId === ch.id ? "on" : ""}
                  onClick={() => setOpenId(ch.id)}
                >
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  {ch.title}
                </button>
              </li>
            ))}
          </ul>
          <div className="chapter-jump">
            <div className="why-label">Jump into the program</div>
            <div className="stack" style={{ marginTop: 8 }}>
              {PHASES.map((p) => (
                <Link key={p.id} to={p.path} className="btn ghost sm">
                  {p.step} {p.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <article className="card method-article">
          {METHOD_CHAPTERS.map((ch) =>
            ch.id === openId ? (
              <div key={ch.id}>
                <div className="kicker">Chapter</div>
                <h2>{ch.title}</h2>
                {ch.body.map((para) => (
                  <p key={para} className="method-para">
                    {para}
                  </p>
                ))}
                {"quote" in ch && ch.quote && (
                  <blockquote className="method-quote">{ch.quote}</blockquote>
                )}
                {"examples" in ch && ch.examples && (
                  <div className="example-stack" style={{ marginTop: 20 }}>
                    <div className="why-label">Worked examples</div>
                    {ch.examples.map((ex) => (
                      <div key={ex.label} className="example-card">
                        <div className="example-label">{ex.label}</div>
                        <div className="example-row">
                          <span className="example-tag">Assumption</span>
                          <p>{ex.assumption}</p>
                        </div>
                        <div className="example-row">
                          <span className="example-tag hyp">Hypothesis</span>
                          <p>{ex.hypothesis}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {ch.id === "craft" && (
                  <div className="quality-grid" style={{ marginTop: 20 }}>
                    {QUALITY_CHECKS.map((q) => (
                      <div key={q.id} className="quality-item">
                        <div className="pill">{q.title}</div>
                        <p className="quality-good">
                          <span>Good</span> {q.good}
                        </p>
                        <p className="quality-bad">
                          <span>Weak</span> {q.bad}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {ch.id === "craft" && (
                  <div style={{ marginTop: 20 }}>
                    <Link to="/hypothesis" className="btn">
                      Open hypothesis builder
                    </Link>
                  </div>
                )}
              </div>
            ) : null,
          )}
        </article>
      </div>
    </div>
  );
}
