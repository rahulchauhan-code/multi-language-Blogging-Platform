import React from 'react';
import './PostCard.css'; // Optional: for the hover animation

const PostCard = ({ post }) => {
    
    // Helper for safe date formatting
    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className="card h-100 mb-4 shadow-sm border-0 post-card-hover">
            <div className="card-body d-flex flex-column">
                
                {/* Header: Author Info & Category */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                        {/* Avatar */}
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" 
                             style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
                            {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        
                        {/* Name & Date */}
                        <div className="ms-3">
                            <h6 className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: '150px' }}>
                                {post.authorName || 'Unknown Author'}
                            </h6>
                            <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                                {formatDate(post.created_at)}
                            </small>
                        </div>
                    </div>

                    {/* Category Badge */}
                    <span className="badge bg-light text-primary border border-primary rounded-pill px-3">
                        {post.catogery || 'General'}
                    </span>
                </div>

                {/* Content */}
                <h5 className="card-title fw-bold text-dark text-truncate-2">
                    {post.title}
                </h5>
                
                <p className="card-text text-secondary flex-grow-1" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: '1.6'
                }}>
                    {post.content}
                </p>

                {/* Optional: Read More link (Visually distinct) */}
                <div className="mt-3">
                    <small className="text-primary fw-bold">Read Article &rarr;</small>
                </div>
            </div>
        </div>
    );
};

export default PostCard;