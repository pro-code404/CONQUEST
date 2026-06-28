import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.js";
import { resolveAuthenticatedPath } from "./routing.js";

export function AuthenticatedRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Loading session…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={resolveAuthenticatedPath(user)} replace />;
}
