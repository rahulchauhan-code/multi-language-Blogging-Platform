import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css'; // Make sure to create this file

const Footer = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Do not show footer on Login or Register pages
    if (!user || location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    // Helper to check active state
    const isActive = (path) => location.pathname === path;

    return (
        <div className="footer-container fixed-bottom">
            <div className="footer-content shadow-lg">
                
                {/* 1. Home Button */}
                <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                    <div className="icon">🏠</div>
                    <span className="label">Home</span>
                </Link>

                {/* 2. Create Post Button (Featured) */}
                <Link to="/create-post" className={`nav-item create-post ${isActive('/create-post') ? 'active' : ''}`}>
                    <div className="plus-icon">⊕</div>
                </Link>

                {/* 3. Profile Button */}
                <Link to={`/profile/${user.userId}`} className={`nav-item ${isActive(`/profile/${user.userId}`) ? 'active' : ''}`}>
                    <div className="icon">👤</div>
                    <span className="label">Profile</span>
                </Link>

            </div>
        </div>
    );
};

export default Footer;