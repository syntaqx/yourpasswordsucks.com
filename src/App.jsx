import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Monitor, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { siGithub } from "simple-icons";

function getStrength(score) {
  if (score >= 4) return { level: "excellent", label: "Hard to guess" };
  if (score >= 3) return { level: "strong", label: "Looking good" };
  if (score >= 2) return { level: "fair", label: "Getting stronger" };
  return { level: "weak", label: "Room to strengthen" };
}

export default function App() {
  const passwordInput = useRef(null);
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState("auto");
  const [analysis, setAnalysis] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const hasPassword = password.length > 0;
  const strength = analysis ? getStrength(analysis.score) : null;
  const meterValue = analysis ? analysis.score * 25 : 0;
  const effectiveBits = analysis ? analysis.guessesLog10 * Math.log2(10) : 0;

  useEffect(() => {
    let cancelled = false;

    if (!hasPassword) {
      setAnalysis(null);
      setIsChecking(false);
      setAnalysisFailed(false);
      return undefined;
    }

    setIsChecking(true);
    setAnalysisFailed(false);

    import("./passwordEstimator.js")
      .then(({ estimatePassword }) => {
        if (!cancelled) setAnalysis(estimatePassword(password));
      })
      .catch(() => {
        if (!cancelled) {
          setAnalysis(null);
          setAnalysisFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hasPassword, password]);

  let feedback = "Enter a password for a private estimate and practical tips.";
  let feedbackTone = "";
  if (analysisFailed) {
    feedback = "The local checker couldn't load. Reload the page and try again.";
    feedbackTone = "warning";
  } else if (isChecking && !analysis) {
    feedback = "Checking words, patterns, and keyboard walks…";
  } else if (analysis?.feedback.warning) {
    feedback = `Worth noting: ${analysis.feedback.warning}`;
    feedbackTone = "warning";
  } else if (analysis?.score >= 3) {
    feedback = "Nice work. Keep it unique to this account.";
    feedbackTone = "good";
  } else if (analysis?.feedback.suggestions.length) {
    feedback = `A useful next step: ${analysis.feedback.suggestions.join(" ")}`;
  } else if (analysis) {
    feedback = "Try a few unrelated words, or use a password manager to make a unique one.";
  }

  function clearPassword() {
    setPassword("");
    setIsVisible(false);
    passwordInput.current?.focus();
  }

  return (
    <main className="stage" data-theme={theme}>
      <article className="app-window" aria-labelledby="app-title">
        <header className="window-titlebar">
          <div className="window-name">
            <span className="app-mark" aria-hidden="true">Y!</span>
            <span>Private password check</span>
          </div>
          <div className="theme-switch" role="group" aria-label="Color theme">
            <button type="button" aria-pressed={theme === "auto"} onClick={() => setTheme("auto")} title="Use system theme">
              <Monitor aria-hidden="true" /><span>Auto</span>
            </button>
            <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")} title="Use light theme">
              <Sun aria-hidden="true" /><span>Light</span>
            </button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} title="Use dark theme">
              <Moon aria-hidden="true" /><span>Dark</span>
            </button>
          </div>
        </header>

        <div className="app-content">
          <div className="app-heading">
            <div>
              <p className="app-kicker">A private password check</p>
              <h1 id="app-title">Make your password <span>stronger.</span></h1>
              <p className="app-intro">Check a password privately. Get a useful next step—no judgment.</p>
            </div>
          </div>

          <label className="field-label" htmlFor="password-input">Try a password</label>
          <div className="input-wrap">
            <input
              ref={passwordInput}
              id="password-input"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Enter your password"
              aria-describedby="privacy-note math-note"
            />
            <div className="input-actions">
              <button
                className="icon-button"
                type="button"
                onClick={() => setIsVisible((visible) => !visible)}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
              >
                {isVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
              {hasPassword && (
                <button className="icon-button" type="button" onClick={clearPassword} aria-label="Clear password">
                  <X aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <section className="results" aria-label="Password strength results" aria-busy={isChecking}>
            <div className="result-heading">
              <span>Strength estimate</span>
              <span className="strength-label">
                {strength?.label ?? (isChecking ? "Checking..." : "Waiting for input...")}
              </span>
            </div>
            <div
              className="meter-track"
              role="meter"
              aria-label="Estimated password strength"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={meterValue}
            >
              <div className="meter-fill" data-level={strength?.level ?? "weak"} style={{ width: `${meterValue}%` }} />
            </div>
            <p className="feedback" data-tone={feedbackTone} aria-live="polite">{feedback}</p>

            <div className="stats">
              <div className="stat">
                <span className="stat-label">Effective guess bits</span>
                <output className="stat-value">{analysis ? `${effectiveBits.toFixed(1)} bits` : "—"}</output>
              </div>
              <div className="stat">
                <span className="stat-label">Offline crack estimate</span>
                <div className="crack-estimates">
                  <div className="crack-estimate">
                    <span>Fast hash</span>
                    <output className="stat-value">
                      {analysis ? analysis.crackTimes.offlineFastHashingXPerSecond.display : "—"}
                    </output>
                  </div>
                  <div className="crack-estimate">
                    <span>Slow hash</span>
                    <output className="stat-value">
                      {analysis ? analysis.crackTimes.offlineSlowHashingXPerSecond.display : "—"}
                    </output>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="math-note" id="math-note" aria-labelledby="math-title">
            <h2 id="math-title"><span>How the estimate works</span></h2>
            <code className="main-equation">effective bits ≈ log₂(estimated guesses)</code>
            <p>
              A pattern matcher estimates the guesses; bits are the base-2 log of that estimate.
              Common words, dates, repeats, and keyboard walks count against you.
            </p>
            <p className="classic-equation">
              <code>H = length × log₂(charset size)</code> is the classic formula for truly random strings.
              It assumes every character is picked uniformly at random. Real passwords don&apos;t work
              that way, so we use the pattern estimate above. Offline times show illustrative
              fast-hash (10 billion guesses per second) and slow-hash (10,000 guesses per second) scenarios.
              Real attack costs vary with hardware and password-hashing settings; these are not
              predictions for a specific site.
            </p>
          </section>

          <div className="privacy-note" id="privacy-note">
            <ShieldCheck aria-hidden="true" />
            <span>All checking happens in this tab. Nothing gets sent, saved, or logged.</span>
          </div>
        </div>

        <footer className="window-statusbar">
          <span>Checked in your browser</span>
          <a href="https://github.com/syntaqx/yourpasswordsucks.com" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg>
            Source
          </a>
        </footer>
      </article>
    </main>
  );
}
