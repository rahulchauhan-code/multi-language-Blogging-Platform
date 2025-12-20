import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CreatePost = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Technology' 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                category: formData.category, 
                content: formData.content
            };

            await api.post('/posts/publish', payload);
            navigate('/');

        } catch (error) {
            console.error("Failed to create post", error);
            if (error.response && error.response.status === 401) {
                alert("Session expired. Please login again.");
            } else {
                alert("Error creating post. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Adjusted padding-top (pt) to prevent overlap with fixed navbar
        <div className="bg-light min-vh-100 pt-5 pb-5">
            <div className="container mt-4 mb-5">
                <div className="row justify-content-center">
                    
                    {/* Responsive Column Sizing: Full width on mobile, 80% on tablet, centered on desktop */}
                    <div className="col-12 col-md-10 col-lg-8">
                        
                        <div className="card shadow-sm border-0 rounded-3">
                            {/* Responsive padding: p-3 on mobile, p-5 on desktop */}
                            <div className="card-body p-3 p-md-5">
                                <h2 className="fw-bold mb-4 text-center text-md-start">Write a New Story</h2>
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Title</label>
                                        <input 
                                            name="title" 
                                            type="text" 
                                            className="form-control form-control-lg bg-light" 
                                            placeholder="Enter your title..."
                                            required 
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Category</label>
                                        <select 
                                            name="category" 
                                            className="form-select form-select-lg bg-light" 
                                            onChange={handleChange}
                                            value={formData.category}
                                        >
                                            <option value="Technology">Technology</option>
                                            <option value="Life">Life</option>
                                            <option value="Coding">Coding</option>
                                            <option value="Travel">Travel</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Content</label>
                                        <textarea 
                                            name="content" 
                                            className="form-control bg-light" 
                                            rows="10" 
                                            placeholder="Tell your story..."
                                            required
                                            onChange={handleChange}
                                            style={{ resize: 'none' }} // Prevents breaking layout
                                        ></textarea>
                                    </div>

                                    {/* Action Buttons: Stack on mobile, inline on desktop */}
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button 
                                            type="button" 
                                            onClick={() => navigate('/')} 
                                            className="btn btn-outline-secondary px-4 py-2"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary px-5 py-2 fw-bold"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Publishing...
                                                </>
                                            ) : 'Publish Post'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;