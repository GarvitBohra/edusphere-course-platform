import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { BookOpen, CheckSquare, Square, Play, CheckCircle2, ChevronRight, Award, Trophy } from 'lucide-react';

const StudyView = () => {
  const { courseId } = useParams();
  const { authFetch, showToast } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch syllabus and progression state
  const fetchData = async () => {
    try {
      // 1. Fetch course details
      const courseRes = await fetch(`${API_URL}/courses/${courseId}`);
      const courseData = await courseRes.json();
      if (!courseRes.ok) throw new Error(courseData.message);
      setCourse(courseData);

      // 2. Fetch student progress
      const progressRes = await authFetch(`/enrollments/progress/${courseId}`);
      const progressData = await progressRes.json();
      if (!progressRes.ok) throw new Error(progressData.message);
      setEnrollment(progressData);

      // Set first lesson active by default if not set
      if (courseData.curriculum?.length > 0 && courseData.curriculum[0].lessons?.length > 0) {
        setActiveLesson(courseData.curriculum[0].lessons[0]);
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error loading study workspace', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  // Handle marking a lesson complete / incomplete
  const handleToggleLesson = async (lessonId, currentCompleted) => {
    try {
      const res = await authFetch(`/enrollments/progress/${courseId}/lesson/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !currentCompleted }),
      });
      const data = await res.json();

      if (res.ok) {
        setEnrollment(data.enrollment);
        
        // Trigger congratulations if progress just hit 100%
        if (!currentCompleted && data.enrollment.progress === 100) {
          setShowCelebration(true);
        }
        
        showToast(
          !currentCompleted ? 'Lesson marked complete! ★' : 'Lesson marked incomplete',
          'success'
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loader" style={{ width: '45px', height: '45px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '999px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Please enroll in this course before opening the study viewer.</p>
        <Link to={`/course/${courseId}`} className="btn btn-primary">Course Details</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', minHeight: 'calc(100vh - 80px)' }} className="study-layout">
      
      {/* LEFT SIDEBAR: Modules & Lessons */}
      <aside style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 80px)',
        padding: '24px 16px'
      }} className="study-sidebar">
        
        <div style={{ marginBottom: '24px' }}>
          <Link to="/dashboard" style={{ fontSize: '12px', color: 'var(--accent)', display: 'block', marginBottom: '8px' }}>
            ← Back to Dashboard
          </Link>
          <h2 style={{ fontSize: '16px', fontWeight: '800', lineHeight: '1.4', color: 'var(--text-primary)' }}>
            {course.title}
          </h2>
          
          {/* Progress Banner */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
              <span>Course Progression</span>
              <span>{enrollment.progress}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${enrollment.progress}%`, height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {course.curriculum?.map((mod, midx) => (
            <div key={midx}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {mod.title}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {mod.lessons.map((les) => {
                  const isCompleted = enrollment.completedLessons.includes(les._id);
                  const isActive = activeLesson?._id === les._id;

                  return (
                    <div
                      key={les._id}
                      onClick={() => setActiveLesson(les)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--border-radius-sm)',
                        cursor: 'pointer',
                        display: 'grid',
                        gridTemplateColumns: '24px 1fr',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                        transition: 'all var(--transition-fast)'
                      }}
                      className="lesson-row"
                    >
                      {/* Completion check box */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLesson(les._id, isCompleted);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: isCompleted ? 'var(--success)' : 'var(--text-muted)',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {isCompleted ? <CheckCircle2 size={16} fill="var(--success-glow)" /> : <Square size={16} />}
                      </button>

                      <span style={{
                        fontSize: '13px',
                        fontWeight: isActive ? '600' : '400',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {les.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT CONTENT DISPLAY: Lesson viewer */}
      <main style={{
        padding: '40px 60px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 80px)'
      }} className="study-main">
        {activeLesson ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Lesson Title header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>{activeLesson.title}</h1>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Estimated Duration: {activeLesson.duration}</span>
              </div>

              {/* Complete lesson button */}
              <button
                onClick={() => handleToggleLesson(activeLesson._id, enrollment.completedLessons.includes(activeLesson._id))}
                className={`btn btn-sm ${enrollment.completedLessons.includes(activeLesson._id) ? 'btn-outline' : 'btn-accent'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {enrollment.completedLessons.includes(activeLesson._id) ? 'Mark Incomplete' : 'Complete Lesson ✓'}
              </button>
            </div>

            {/* Video Player placeholder frame */}
            {activeLesson.videoUrl && (
              <div className="card" style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                backgroundColor: '#000',
                marginBottom: '40px',
                overflow: 'hidden'
              }}>
                <video
                  src={activeLesson.videoUrl}
                  controls
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            )}

            {/* Rich text lesson contents */}
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-primary)' }}>Lesson Guidelines</h3>
              <div style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.8',
                fontSize: '15px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--border-radius-md)',
                padding: '24px'
              }} className="lesson-content-box">
                {activeLesson.content || 'This lesson contains video components. Watch the playback controls above.'}
              </div>
            </div>
            
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <BookOpen size={48} style={{ marginBottom: '16px' }} />
            <h3>No Active Lesson</h3>
            <p>Please select a lesson from the curriculum sidebar checklist to begin study.</p>
          </div>
        )}
      </main>

      {/* 100% COMPLETION CELEBRATION MODAL */}
      {showCelebration && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '24px'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--accent)',
            padding: '40px 30px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 24px auto',
              boxShadow: '0 8px 24px var(--primary-glow)'
            }}>
              <Trophy size={40} />
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '12px', fontFamily: 'var(--font-title)' }}>
              Course Completed!
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
              Congratulations! You have successfully completed 100% of the lessons in <strong>{course.title}</strong>. Your verifiable graduation certificate is now unlocked.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/dashboard" className="btn btn-primary" onClick={() => setShowCelebration(false)}>
                Claim My Certificate <Award size={16} />
              </Link>
              <button onClick={() => setShowCelebration(false)} className="btn btn-outline">
                Back to study viewer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .study-layout {
            grid-template-columns: 1fr !important;
          }
          .study-sidebar {
            width: 100%;
            max-height: 250px !important;
            border-right: none;
            border-bottom: 1px solid var(--glass-border);
          }
          .study-main {
            padding: 30px 20px !important;
          }
        }
        .lesson-row:hover {
          background-color: var(--bg-tertiary) !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StudyView;
