import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export function Login() {
  const { configured, user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const err =
      mode === "signin"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);
    setBusy(false);
    if (err) {
      if (err.toLowerCase().includes("check your email")) {
        setInfo(err);
        setMode("signin");
      } else {
        setError(err);
      }
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand">
          GTM <span>Sprint</span>
        </div>
        <h1>{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="auth-lede">
          Your weekly acquisition bets sync to your account. Sign in to continue.
        </p>

        {!configured && (
          <div className="watch-out">
            <strong>Supabase not configured</strong>
            <p>
              Add <code>VITE_SUPABASE_URL</code> and{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> in Vercel env vars (and locally
              in <code>.env</code>), then redeploy. See <code>SUPABASE.md</code>.
            </p>
          </div>
        )}

        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@startup.com"
              disabled={!configured || busy}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={!configured || busy}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}
          <button className="btn" type="submit" disabled={!configured || busy}>
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button type="button" className="linkish" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="linkish" onClick={() => setMode("signin")}>
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="auth-foot">Email + password via Supabase Auth.</p>
      </div>
    </div>
  );
}
