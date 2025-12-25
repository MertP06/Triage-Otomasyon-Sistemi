import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NavBar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <div className="brand-icon">🏥</div>
                <span className="brand-text">Acil Servis</span>
            </div>

            <div className="navbar-links">
                <Link to="/" className={isActive('/') ? 'active' : ''}>
                    Dashboard
                </Link>
                <Link to="/appointments" className={isActive('/appointments') ? 'active' : ''}>
                    Randevular
                </Link>
                <Link to="/patient-history" className={isActive('/patient-history') ? 'active' : ''}>
                    Hasta Geçmişi
                </Link>
                <a href="/waiting-room" target="_blank" rel="noopener noreferrer">
                    Bekleme Ekranı ↗
                </a>
            </div>

            <div className="navbar-user">
                <span className="user-role">
                    {user.role === 'NURSE' ? '👩‍⚕️ Triyaj Sorumlusu' : '👨‍⚕️ Doktor'}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                    Çıkış Yap
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
