// pages/Home.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Get language from URL
    const queryParams = new URLSearchParams(location.search);
    const lang = queryParams.get('lang') || 'en';

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // Pass lang to backend endpoints
                const [postsMetaRes, postsContentRes, usersRes] = await Promise.all([
                    api.get(`/posts/?lang=${lang}`),
                    api.get(`/post_contents/?lang=${lang}`),
                    api.get('/user/')
                ]);

                const postsMeta = postsMetaRes.data;
                const postsContent = postsContentRes.data;
                const users = usersRes.data;

                const userMap = {};
                users.forEach(u => { userMap[u.userId] = u.name || u.username; });

                const mergedPosts = postsContent.map(content => {
                    const meta = postsMeta.find(p => p.postId === content.postid) || {};
                    return {
                        id: content.id,
                        postId: content.postid,
                        title: content.title,
                        content: content.content,
                        category: meta.catogery || 'General', // Corrected to match backend 'catogery'
                        status: meta.status,
                        created_at: meta.created_at,
                        authorName: userMap[meta.authorId] || 'Unknown User',
                        authorId: meta.authorId
                    };
                });

                mergedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setPosts(mergedPosts);
            } catch (error) {
                console.error("Failed to load feed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [lang]); // Re-fetch data whenever 'lang' changes

    return (
        <div className="bg-light min-vh-100 d-flex flex-column pt-5 mt-3 pb-5 mb-5">
            <div className="container flex-grow-1">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7">
                        <div className="text-center mb-4 mt-3">
                            <h1 className="fw-bold text-dark mb-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                                Latest Updates
                            </h1>
                            <p className="text-muted">Explore stories translated to your preferred language.</p>
                        </div>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5">
                                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {posts.length > 0 ? (
                                    posts.map(post => <PostCard key={post.id} post={post} />)
                                ) : (
                                    <div className="text-center text-muted py-5 bg-white rounded shadow-sm">
                                        <h4>No stories yet 📝</h4>
                                        <p className="mb-0">Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;