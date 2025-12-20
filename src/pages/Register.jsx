import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        bio: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error on type
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/user/create', formData);
            
            if (response.status === 201 || response.status === 200) {
                alert("Registration successful! Please login.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Registration failed", err);
            setError('Registration failed. Username or Email might already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3 py-5">
            {/* Wider card than login (550px) to accommodate side-by-side fields */}
            <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '550px', width: '100%' }}>
                <div className="card-body p-4 p-sm-5">
                    
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h1 className="h4 fw-bold text-primary mb-2">BlogPlatform</h1>
                        <h2 className="h5 text-secondary fw-normal">Create Account</h2>
                    </div>

                    {error && (
                        <div className="alert alert-danger text-center py-2 mb-4" role="alert">
                            <small>{error}</small>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-muted">Full Name</label>
                            <input 
                                name="name" 
                                type="text" 
                                className="form-control form-control-lg bg-light" 
                                placeholder="John Doe"
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        {/* Row: Stacks on mobile, Side-by-side on desktop */}
                        <div className="row g-3 mb-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Username</label>
                                <input 
                                    name="username" 
                                    type="text" 
                                    className="form-control form-control-lg bg-light" 
                                    placeholder="@johndoe"
                                    required 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Email</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    className="form-control form-control-lg bg-light" 
                                    placeholder="john@example.com"
                                    required 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-muted">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                className="form-control form-control-lg bg-light" 
                                placeholder="Create a strong password"
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        {/* Bio */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-muted">Bio (Optional)</label>
                            <textarea 
                                name="bio" 
                                className="form-control bg-light" 
                                rows="2" 
                                placeholder="Tell us a little about yourself..."
                                onChange={handleChange}
                                style={{ resize: 'none' }}
                            ></textarea>
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
                                    Creating Account...
                                </>
                            ) : 'Register'}
                        </button>

                        {/* Login Link */}
                        <div className="text-center border-top pt-3">
                            <span className="text-muted small">Already have an account? </span>
                            <Link to="/login" className="text-decoration-none fw-bold ms-1">Login here</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;