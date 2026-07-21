import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export function ProtectedRoute() {
  const { configured, loading, user } = useAuth();
  const location = useLocation();

  if (!configured) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand auth-brand">
            GTM <span>Sprint</span>
          </div>
          <p className="auth-lede">Loading your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
