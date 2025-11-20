import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
    const { user, logout } = useAuth();
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav("/login", { replace: true });
    };

    return (
        <div className="header">
            <div className="header-inner">
                <div className="brand">🏥 ER Triage</div>
                <div className="nav">
                    <NavLink to="/">Randevular</NavLink>
                    {user?.role === "NURSE" && <NavLink to="/triage">Triage</NavLink>}
                    {user?.role === "DOCTOR" && <NavLink to="/doctor-notes">Doktor Notu</NavLink>}
                    <NavLink to="/detail">Detay</NavLink>
                    <span className="role">{`Rol: ${user?.role}`}</span>
                    <button className="btn" onClick={handleLogout}>Çıkış</button>
                </div>
            </div>
        </div>
    );
}
