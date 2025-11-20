import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children, allow = ["NURSE", "DOCTOR"] }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (!allow.includes(user.role)) return <Navigate to="/" replace />;
    return children;
}
