// components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Navbar as BsNavbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Map language codes to display names
    const languages = {
        en: 'English',
        hi: 'Hindi',
        es: 'Spanish',
        fr: 'French'
    };

    const [selectedLang, setSelectedLang] = useState({ code: 'en', name: 'English' });

    // Sync state with URL on load
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const langCode = queryParams.get('lang') || 'en';
        setSelectedLang({ code: langCode, name: languages[langCode] || 'English' });
    }, [location.search]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLanguageChange = (code, name) => {
        const params = new URLSearchParams(location.search);
        params.set('lang', code);
        navigate(`${location.pathname}?${params.toString()}`);
    };

    if (!user) return null;

    return (
        <BsNavbar bg="white" expand="lg" className="shadow-sm fixed-top">
            <Container>
                <BsNavbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
                    BlogPlatform
                </BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-2 gap-lg-3 py-3 py-lg-0">
                        <NavDropdown 
                            title={`🌐 ${selectedLang.name}`} 
                            id="language-nav-dropdown"
                            className="text-secondary"
                        >
                            <NavDropdown.Item onClick={() => handleLanguageChange('en', 'English')}>English</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange('hi', 'Hindi')}>Hindi (हिन्दी)</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange('es', 'Spanish')}>Spanish (Español)</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleLanguageChange('fr', 'French')}>French (Français)</NavDropdown.Item>
                        </NavDropdown>
                        <span className="text-secondary text-center">
                            Hello, <strong className="text-dark">{user.username}</strong>
                        </span>
                        <Button variant="danger" size="sm" onClick={handleLogout} className="w-100 w-lg-auto px-3 rounded-pill">
                            Logout
                        </Button>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;