import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({
  children,
}) {
  const { user, token } = useAuth();

  if (!user && !token) {
    return <Navigate to="/" />;
  }

  return children;
}