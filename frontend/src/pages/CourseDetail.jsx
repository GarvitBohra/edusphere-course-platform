import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { Star, ShieldAlert, BookOpen, Clock, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch, showToast } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch course, reviews, and check enrollment status
  const fetchData = async () => {
    try {
      // 1. Fetch course details
      const courseRes = await fetch(`${API_URL}/courses/${id}`);
      const courseData = await courseRes.json();
      if (!courseRes.ok) throw new Error(courseData.message);
      setCourse(courseData);

      // Initialize all modules expanded by default
      const defaultExpanded = {};
      courseData.curriculum?.forEach((mod, idx) => {
        defaultExpanded[idx] = true;
      });
      setExpandedModules(defaultExpanded);

      // 2. Fetch reviews
      const reviewsRes = await fetch(`${API_URL}/reviews/${id}`);
      const reviewsData = await reviewsRes.json();
      if (reviewsRes.ok) setReviews(reviewsData);

      // 3. Check enrollment if user logged in
      if (user && user.role === 'student') {
        const enrollRes = await authFetch(`/enrollments/progress/${id}`);
        if (enrollRes.ok) {
          setIsEnrolled(true);
        }
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error fetching course details', 'error');
    } finally {
      setLoading(false);
      setEnrollmentLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Enroll logic (Simulates checkout)
  const handleEnroll = async () => {
    if (!user) {
      showToast('Please sign in to enroll and start learning!', 'info');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      showToast('Instructors and admins cannot enroll as students.', 'warning');
      return;
    }

    setEnrollmentLoading(true);
    try {
      const res = await authFetch(`/enrollments/enroll/${id}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok) {
        setIsEnrolled(true);
        showToast('Successfully enrolled! Welcome to the course.', 'success');
        navigate(`/study/${id}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmitLoading(true);
    try {
      const res = await authFetch(`/reviews/${id}`, {
        method: 'POST',
        body: JSON.stringify({ rating: userRating, comment: userComment }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('Review submitted successfully!', 'success');
        setUserComment('');
        // Reload reviews and course rating stats
        fetchData();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loader" style={{ width: '45px', height: '45px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '999px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
        <h2>Course Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The course you are trying to view does not exist.</p>
        <Link to="/catalog" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  // Count lessons helper
  let totalLessons = 0;
  course.curriculum?.forEach((mod) => {
    totalLessons += mod.lessons.length;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* 1. HERO BANNER HEADER */}
      <section style={{
        background: 'linear-gradient(to right, #0d1222, #1b233a)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '60px 0',
        color: '#fff'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }} className="details-header-grid">
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <span className="badge badge-accent">{course.category}</span>
              <span className="badge badge-primary">{course.level}</span>
            </div>
            
            <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: '1.3', marginBottom: '20px', fontFamily: 'var(--font-title)' }}>
              {course.title}
            </h1>
            
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              {course.shortDescription}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {/* Instructor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={course.instructor?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${course.instructor?.name}`}
                  alt="Instructor"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--primary)' }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  By <strong>{course.instructor?.name}</strong>
                </span>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{course.rating || '4.5'}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({course.ratingsCount || '0'} reviews)</span>
              </div>
            </div>
          </div>

          {/* Details visual preview sidebar */}
          <div style={{ display: 'flex', justifyContent: 'center' }} className="details-header-card">
            <div className="card" style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: 'var(--bg-secondary)',
              position: 'relative',
              top: '40px',
              zIndex: 10
            }}>
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                alt={course.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Price:</span>
                  <span style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-title)' }}>
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} color="var(--primary)" /> {course.curriculum?.length || 0} Modules ({totalLessons} lessons)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--accent)" /> Lifetime Access
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--success)" /> Verifiable Certificate
                  </div>
                </div>

                {isEnrolled ? (
                  <Link to={`/study/${id}`} className="btn btn-accent" style={{ width: '100%' }}>
                    Go to Study Space
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrollmentLoading}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {enrollmentLoading ? 'Checking...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSE DETAILS SYLLABUS & REVIEWS */}
      <section style={{ padding: '80px 0 0 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px' }} className="details-body-grid">
          {/* Left Area: Syllabus */}
          <div>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>About This Course</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px' }}>{course.description}</p>
            </div>

            {/* Curriculum Accordion */}
            <div style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Syllabus & Curriculum</h2>
              
              {course.curriculum?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Syllabus is currently being drafted by the instructor.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {course.curriculum?.map((mod, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--border-radius-md)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleModule(index)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          padding: '18px 24px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          textAlign: 'left',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{mod.title}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {expandedModules[index] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </button>

                      {/* Accordion Content */}
                      {expandedModules[index] && (
                        <div style={{
                          padding: '0 24px 18px 24px',
                          borderTop: '1px solid var(--glass-border)',
                          backgroundColor: 'var(--bg-primary)'
                        }}>
                          {mod.lessons.map((les, lidx) => (
                            <div
                              key={les._id || lidx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 0',
                                borderBottom: lidx === mod.lessons.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                fontSize: '14px',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BookOpen size={14} color="var(--text-muted)" /> {les.title}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{les.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Reviews & Feedback</h2>

              {/* Review submit form (if enrolled student) */}
              {isEnrolled && (
                <form
                  onSubmit={handleReviewSubmit}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '24px',
                    marginBottom: '40px'
                  }}
                >
                  <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Leave a Rating</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Score (1-5 stars)</label>
                    <select
                      value={userRating}
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="form-control"
                      style={{ maxWidth: '120px' }}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea
                      placeholder="Share your thoughts about this course curriculum..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="form-control"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" disabled={submitLoading} className="btn btn-primary btn-sm">
                    {submitLoading ? 'Saving...' : 'Submit Feedback'}
                  </button>
                </form>
              )}

              {/* Reviews Display */}
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No reviews yet. Be the first to enroll and evaluate!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '20px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        {/* User profile */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={rev.user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${rev.user?.name}`}
                            alt="reviewer avatar"
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{rev.user?.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < rev.rating ? '#f59e0b' : 'none'}
                              color={i < rev.rating ? '#f59e0b' : 'var(--text-muted)'}
                            />
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Placeholder Sidebar offset */}
          <div style={{ display: 'none' }} />
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 968px) {
          .details-header-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .details-header-card {
            justify-content: flex-start !important;
          }
          .details-header-card .card {
            top: 0px !important;
            max-width: 100% !important;
          }
          .details-body-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseDetail;
