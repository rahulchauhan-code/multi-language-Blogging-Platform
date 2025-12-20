import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        // Clear error when user starts typing again
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(credentials.email, credentials.password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
            {/* Card Wrapper: 100% width on mobile, max 450px on desktop */}
            <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
                
                {/* Responsive Padding: p-4 on mobile, p-sm-5 on larger screens */}
                <div className="card-body p-4 p-sm-5">
                    
                    {/* Header Section */}
                    <div className="text-center mb-4">
                        <h1 className="h4 fw-bold text-primary mb-2">BlogPlatform</h1>
                        <h2 className="h5 text-secondary fw-normal">Welcome Back!</h2>
                    </div>
                    
                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-danger text-center py-2" role="alert">
                            <small>{error}</small>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-muted">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                className="form-control form-control-lg bg-light"
                                placeholder="name@example.com"
                                required
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-muted">Password</label>
                            <input
                                name="password"
                                type="password"
                                className="form-control form-control-lg bg-light"
                                placeholder="••••••••"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg w-100 fw-bold mb-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Section */}
                    <div className="text-center border-top pt-4 mt-2">
                        <p className="mb-2 text-muted small">Don't have an account yet?</p>
                        <Link to="/register" className="btn btn-outline-secondary w-100 fw-medium">
                            Create New Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;