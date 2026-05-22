import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Trophy, Clock, Play, Award, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user, authFetch, showToast } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal for displaying certificate details
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await authFetch('/enrollments/my-courses');
        const data = await res.json();
        if (res.ok) {
          setEnrollments(data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error(error);
        showToast(error.message || 'Error fetching dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loader" style={{ width: '45px', height: '45px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '999px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Calculate metrics
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const certificates = enrollments.filter((e) => e.completed).map((e) => ({
    courseId: e.course._id,
    courseTitle: e.course.title,
    instructorName: e.course.instructor?.name,
    completionDate: new Date(e.updatedAt).toLocaleDateString(),
    id: `CERT-${e._id.substring(0, 8).toUpperCase()}`,
  }));

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      
      {/* Welcome Block */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ready to resume your active learning path?</p>
        </div>
        <Link to="/catalog" className="btn btn-primary btn-sm">Explore More Courses</Link>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '48px'
      }} className="metrics-grid">
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', width: '56px', height: '56px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{totalCourses}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enrolled Courses</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: '56px', height: '56px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{completedCourses}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Completed Courses</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)', width: '56px', height: '56px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{certificates.length}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Verifiable Achievements</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is active courses, Right is certificates list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '40px' }} className="dashboard-layout">
        
        {/* Active Enrolled Courses */}
        <section>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Active Courses</h2>
          
          {totalCourses === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '60px 40px',
              textAlign: 'center'
            }}>
              <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>No Enrollments Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                Browse our masterclasses catalog to enroll in full-stack programming, machine learning, and UI design courses.
              </p>
              <Link to="/catalog" className="btn btn-primary">Browse Courses</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {enrollments.map((enr) => {
                const { _id, course, progress, completed } = enr;
                return (
                  <div key={_id} className="card" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', overflow: 'hidden' }} className="enroll-card">
                    {/* Thumbnail */}
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '140px' }}
                    />

                    {/* Progress Detail */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span className="badge badge-accent" style={{ fontSize: '10px' }}>{course.category}</span>
                        {completed && <span className="badge badge-success" style={{ fontSize: '10px' }}>100% COMPLETE</span>}
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        {course.title}
                      </h3>

                      {/* Progress Bar slider */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flexGrow: 1, height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--accent))', borderRadius: 'var(--border-radius-full)', transition: 'width 0.4s ease' }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', minWidth: '35px', textAlign: 'right' }}>
                          {progress}%
                        </span>
                      </div>

                      {/* CTA study */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          By {course.instructor?.name || 'Sarah'}
                        </span>
                        
                        <Link to={`/study/${course._id}`} className={`btn btn-sm ${completed ? 'btn-outline' : 'btn-primary'}`}>
                          {completed ? 'Review Curriculum' : <><Play size={10} fill="#fff" /> Resume Study</>}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Certificates & Achievements */}
        <aside>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Certificates</h2>
          
          {certificates.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '30px 20px',
              textAlign: 'center'
            }}>
              <Award size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', marginBottom: '6px' }}>No Achievements</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                Complete all lessons in an enrolled course to unlock your degree.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="card"
                  onClick={() => setSelectedCertificate(cert)}
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(6, 182, 212, 0.05)',
                    border: '1px solid rgba(6, 182, 212, 0.15)'
                  }}
                >
                  <div style={{ color: 'var(--accent)' }}>
                    <Award size={28} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {cert.courseTitle}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Unlocked: {cert.completionDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* VERIFIABLE CERTIFICATE MODAL */}
      {selectedCertificate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '24px'
        }}
        onClick={() => setSelectedCertificate(null)}
        >
          {/* Certificate Board layout */}
          <div
            className="card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '750px',
              backgroundColor: '#fff',
              border: '12px double #b5a46d', /* Elegant gold double border */
              color: '#0f172a',
              padding: '60px 40px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Seal / Badge */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', color: '#b5a46d' }}>
              <Trophy size={48} />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedCertificate(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#64748b'
              }}
            >
              ✕
            </button>

            <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontStyle: 'italic', letterSpacing: '2px', color: '#64748b', display: 'block', marginBottom: '24px' }}>
              CERTIFICATE OF COMPLETION
            </span>

            <span style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              THIS IS PROUDLY PRESENTED TO
            </span>

            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '36px', fontWeight: '800', color: '#1e1b4b', borderBottom: '2px solid #e2e8f0', display: 'inline-block', paddingBottom: '12px', marginBottom: '24px' }}>
              {user?.name}
            </h2>

            <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#475569', lineHeight: '1.8', maxWidth: '540px', margin: '0 auto 36px auto' }}>
              for successfully finishing all lessons and modules, fulfilling the required project deliverables, and demonstrating absolute mastery in the study of
            </p>

            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#4f46e5', marginBottom: '40px' }}>
              {selectedCertificate.courseTitle}
            </h3>

            {/* Signature Block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '540px', margin: '0 auto', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '14px', color: '#1e1b4b', display: 'block', marginBottom: '4px' }}>
                  {selectedCertificate.instructorName}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Lead Course Instructor
                </span>
              </div>
              
              <div>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', display: 'block', marginBottom: '4px' }}>
                  {selectedCertificate.completionDate}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Completion Date
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#b5a46d', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  {selectedCertificate.id}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Verification ID
                </span>
              </div>
            </div>

            {/* Print button */}
            <div style={{ marginTop: '40px' }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ backgroundColor: '#1e1b4b' }}>
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 968px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
          .metrics-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .enroll-card {
            grid-template-columns: 1fr !important;
          }
          .enroll-card img {
            height: 120px !important;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
