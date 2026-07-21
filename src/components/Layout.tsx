import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useSprint } from "../lib/SprintContext";

const LINKS = [
  { to: "/setup", label: "Setup" },
  { to: "/assumptions", label: "Assumptions" },
  { to: "/leverage", label: "Leverage" },
  { to: "/hypothesis", label: "Hypothesis" },
  { to: "/experiments", label: "Experiments" },
  { to: "/learnings", label: "Learnings" },
  { to: "/guide", label: "Methodology" },
  { to: "/cases", label: "Cases" },
];

export function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const { state, hydrating } = useSprint();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app-shell">
      <header className={`topnav ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap topnav-inner">
          <Link to="/" className="brand">
            GTM <span>Sprint</span>
          </Link>
          <nav className="nav-links">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="topnav-actions">
            <Link
              to={state.hypotheses.length ? "/#this-week" : "/hypothesis"}
              className="btn sm"
            >
              {state.hypotheses.length ? "This week" : "Build weekly bet"}
            </Link>
            <button
              type="button"
              className="btn sm ghost"
              onClick={() => void signOut()}
              title={user?.email ?? "Sign out"}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      {hydrating ? (
        <div className="sync-banner wrap">Syncing your sprint…</div>
      ) : null}
      <Outlet />
      <footer className="footer">
        <div className="wrap">
          Methodology adapted from the{" "}
          <a
            href="https://ultra-lab.notion.site/Experiment-Playbook-f0ab40f1a2954a78aa9beab876aa2388"
            target="_blank"
            rel="noreferrer"
          >
            Ultra Lab Experiment Playbook
          </a>
          . Sprint data syncs to your account via Supabase.
        </div>
      </footer>
    </div>
  );
}
