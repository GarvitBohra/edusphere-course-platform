import React from 'react';
import { Link } from 'react-router-dom';
import { Star, User, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    shortDescription,
    category,
    level,
    price,
    thumbnail,
    rating,
    ratingsCount,
    instructor,
  } = course;

  // Render rating stars helper
  const renderStars = (ratingVal) => {
    const stars = [];
    const roundedRating = Math.round(ratingVal || 4.5);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill={i <= roundedRating ? '#f59e0b' : 'none'}
          color={i <= roundedRating ? '#f59e0b' : 'var(--text-muted)'}
        />
      );
    }
    return stars;
  };

  return (
    <Link to={`/course/${_id}`} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Thumbnail Frame */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
          alt={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)'
          }}
          className="card-thumbnail"
        />
        
        {/* Overlay Level Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
          <span className="badge badge-primary">{level}</span>
        </div>

        {/* Overlay Category Badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
          <span className="badge badge-accent">{category}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          lineHeight: '1.4',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '44px'
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '38px'
        }}>
          {shortDescription}
        </p>

        {/* Star Rating Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {renderStars(rating)}
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {rating || '4.5'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            ({ratingsCount || '0'})
          </span>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--glass-border)', margin: 'auto 0 12px 0' }} />

        {/* Footer info: Instructor and Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Instructor Detail */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={instructor?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${instructor?.name || 'Sarah'}`}
              alt="instructor avatar"
              style={{ width: '28px', height: '28px', borderRadius: 'var(--border-radius-full)', backgroundColor: 'var(--bg-tertiary)' }}
            />
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {instructor?.name || 'Instructor'}
            </span>
          </div>

          {/* Pricing Info */}
          <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
            {price === 0 ? 'Free' : `$${price}`}
          </div>
        </div>
      </div>

      <style>{`
        .card:hover .card-thumbnail {
          transform: scale(1.05);
        }
      `}</style>
    </Link>
  );
};

export default CourseCard;
