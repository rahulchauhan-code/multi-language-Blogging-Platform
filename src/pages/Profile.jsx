// pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import PostCard from '../components/PostCard';

const Profile = () => {
    const { userId } = useParams();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Extracts language from URL query string (?lang=hi) or defaults to English
    const lang = new URLSearchParams(location.search).get('lang') || 'en';

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Fetch User Details
                const userRes = await api.get(`/user/${userId}`);
                setUser(userRes.data);

                // 2. Fetch User's Posts (Metadata) & All Content with translation parameter
                const [metaRes, contentRes] = await Promise.all([
                    api.get(`/posts/user/${userId}?lang=${lang}`), 
                    api.get(`/post_contents/?lang=${lang}`) 
                ]);

                // 3. Merge Metadata with translated Content
                const fullPosts = metaRes.data.map(meta => {
                    // Match content to metadata using postId
                    const content = contentRes.data.find(c => c.postid === meta.postId) || {};
                    
                    return {
                        id: content.id || meta.postId,
                        postId: meta.postId,
                        title: content.title || "Untitled",
                        content: content.content || "",
                        // Backend uses 'catogery' typo
                        category: meta.catogery || "General", 
                        status: meta.status,
                        created_at: meta.created_at,
                        authorName: userRes.data.username 
                    };
                });

                // Sort by newest first
                fullPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setPosts(fullPosts);

            } catch (error) {
                console.error("Error loading profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfileData();
        }
    }, [userId, lang]); // Dependency on userId and lang triggers re-fetch on language change

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center pt-5 mt-5 min-vh-100 d-flex flex-column justify-content-center">
                <h3 className="text-muted">User not found</h3>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 pt-5 pb-5">
            <div className="container mt-4">
                
                {/* --- Profile Header Card --- */}
                <div className="card shadow border-0 mb-5 overflow-hidden rounded-4">
                    
                    {/* Colored Banner */}
                    <div className="bg-primary bg-gradient" style={{ height: '160px' }}></div>
                    
                    <div className="card-body px-4 pb-4">
                        <div className="row">
                            {/* Avatar & Name Section */}
                            <div className="col-12 col-md-auto text-center text-md-start" style={{ marginTop: '-80px' }}>
                                <div className="d-inline-block p-1 bg-white rounded-circle shadow-sm">
                                    <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center display-4 fw-bold" 
                                         style={{ width: '130px', height: '130px', border: '4px solid white' }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </div>
                            </div>

                            {/* User Info Text */}
                            <div className="col-12 col-md text-center text-md-start mt-3 mt-md-0 pt-md-2">
                                <h2 className="fw-bold mb-0 text-dark">{user.name}</h2>
                                <p className="text-muted mb-3">@{user.username}</p>
                            </div>
                        </div>

                        {/* Bio & Contact Grid */}
                        <div className="row mt-4 g-4 border-top pt-4">
                            <div className="col-md-7">
                                <h6 className="text-uppercase text-primary fw-bold small mb-2">About</h6>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                                    {user.bio || "This user hasn't written a bio yet."}
                                </p>
                            </div>
                            <div className="col-md-5">
                                <h6 className="text-uppercase text-primary fw-bold small mb-2">Contact</h6>
                                <div className="d-flex align-items-center text-secondary">
                                    <span className="me-2">📧</span>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Posts Grid Section --- */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h3 className="fw-bold m-0">Published Posts</h3>
                    <span className="badge bg-light text-dark border rounded-pill px-3">
                        {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                    </span>
                </div>

                {posts.length > 0 ? (
                    <div className="row g-4">
                        {posts.map(post => (
                            <div className="col-12 col-md-6" key={post.id || post.postId}>
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 border rounded-4 bg-white shadow-sm">
                        <div className="display-1 mb-3">📭</div>
                        <h5 className="text-muted fw-normal">No posts yet.</h5>
                        <p className="text-secondary small">When this user writes something, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;