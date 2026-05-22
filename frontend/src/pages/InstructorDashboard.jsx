import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, DollarSign, Plus, Trash2, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';

const InstructorDashboard = () => {
  const { authFetch, showToast } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);
  
  // Modal toggle state for Course Creator Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Stepped Form Wizard States
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Development');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [coursePrice, setCoursePrice] = useState(49);
  const [courseShortDesc, setCourseShortDesc] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');

  // Curriculum Builder structure
  // [{ title: "Mod 1", lessons: [{ title: "Les 1", duration: "10 mins", content: "text", videoUrl: "" }] }]
  const [modules, setModules] = useState([
    {
      title: 'Module 1: Foundation Outline',
      lessons: [{ title: 'Lesson 1: Introduction Overview', duration: '10 mins', content: 'In this lesson, we will explore the core foundational structures.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }],
    },
  ]);

  // Load instructor courses and metric statistics
  const fetchDashboardData = async () => {
    try {
      // 1. Fetch courses
      const coursesRes = await authFetch('/courses/instructor/my-courses');
      const coursesData = await coursesRes.json();
      if (coursesRes.ok) setCourses(coursesData);

      // 2. Fetch stats
      const statsRes = await authFetch('/courses/instructor/dashboard-stats');
      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(statsData);

    } catch (error) {
      console.error(error);
      showToast('Error loading instructor stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Module actions helpers
  const handleAddModule = () => {
    setModules([...modules, { title: `Module ${modules.length + 1}: Title Here`, lessons: [] }]);
  };

  const handleRemoveModule = (index) => {
    const updated = [...modules];
    updated.splice(index, 1);
    setModules(updated);
  };

  const handleModuleTitleChange = (index, value) => {
    const updated = [...modules];
    updated[index].title = value;
    setModules(updated);
  };

  // Lesson actions helpers
  const handleAddLesson = (moduleIdx) => {
    const updated = [...modules];
    updated[moduleIdx].lessons.push({
      title: 'Lesson Title',
      duration: '10 mins',
      content: 'Write detailed lesson guidelines here...',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    });
    setModules(updated);
  };

  const handleRemoveLesson = (moduleIdx, lessonIdx) => {
    const updated = [...modules];
    updated[moduleIdx].lessons.splice(lessonIdx, 1);
    setModules(updated);
  };

  const handleLessonChange = (moduleIdx, lessonIdx, field, value) => {
    const updated = [...modules];
    updated[moduleIdx].lessons[lessonIdx][field] = value;
    setModules(updated);
  };

  // Submit wizard payload
  const handlePublishCourse = async () => {
    try {
      const res = await authFetch('/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: courseTitle,
          category: courseCategory,
          level: courseLevel,
          price: Number(coursePrice),
          shortDescription: courseShortDesc,
          description: courseDesc,
          thumbnail: courseThumbnail,
          curriculum: modules,
        }),
      });
      
      const data = await res.json();

      if (res.ok) {
        showToast('Course successfully published! ★', 'success');
        setShowWizard(false);
        // Reset inputs
        setCourseTitle('');
        setCourseShortDesc('');
        setCourseDesc('');
        setCourseThumbnail('');
        setModules([{ title: 'Module 1: Foundation Outline', lessons: [{ title: 'Lesson 1: Introduction Overview', duration: '10 mins', content: 'In this lesson, we will explore...', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]);
        setWizardStep(1);
        
        // Refresh dashboard tables
        fetchDashboardData();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loader" style={{ width: '45px', height: '45px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '999px', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Instructor Area</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your curriculums and view enrolled analytics.</p>
        </div>
        <button onClick={() => setShowWizard(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Draft New Course
        </button>
      </div>

      {/* Metrics Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }} className="stats-grid">
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', width: '56px', height: '56px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.totalCourses}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Courses Offered</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)', width: '56px', height: '56px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.totalStudents}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enrolled Students</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: '56px', height: '56px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>${stats.totalEarnings}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Simulated Earnings</div>
          </div>
        </div>
      </div>

      {/* Courses List Table */}
      <section>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>Published Curriculums</h2>
        
        {courses.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '60px 40px',
            textAlign: 'center'
          }}>
            <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No Courses Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
              Publish your first structured masterclass using our advanced step-by-step course builder.
            </p>
            <button onClick={() => setShowWizard(true)} className="btn btn-primary">Publish Course</button>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="courses-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>COURSE TITLE</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>CATEGORY</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>PRICE</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>LEVEL</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>RATING</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {c.title}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {c.category}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      ${c.price}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px' }}>
                      <span className="badge badge-primary">{c.level}</span>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-primary)' }}>
                      ★ {c.rating || '4.8'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* STEPPED COURSE BUILDER WIZARD MODAL */}
      {showWizard && (
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
          zIndex: 1000,
          padding: '24px'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '780px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            
            {/* Modal Header */}
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Course Creation Wizard</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Step {wizardStep} of 3</span>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Stepped Wizard Progress Indicator */}
            <div style={{
              display: 'flex',
              padding: '16px 30px',
              backgroundColor: 'rgba(255,255,255,0.01)',
              borderBottom: '1px solid var(--glass-border)',
              gap: '20px'
            }}>
              {['1. Basic Metadata', '2. Syllabus Structure', '3. Publish Confirmation'].map((label, idx) => (
                <div key={label} style={{
                  flex: 1,
                  fontSize: '12px',
                  fontWeight: '700',
                  color: wizardStep === idx + 1 ? 'var(--accent)' : wizardStep > idx + 1 ? 'var(--success)' : 'var(--text-muted)',
                  borderBottom: wizardStep === idx + 1 ? '2px solid var(--accent)' : wizardStep > idx + 1 ? '2px solid var(--success)' : '2px solid transparent',
                  paddingBottom: '8px'
                }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Modal Body Scroll Container */}
            <div style={{ padding: '30px', overflowY: 'auto', flexGrow: 1 }}>
              
              {/* STEP 1: Basic Course Parameters */}
              {wizardStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Course Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Masterclass React & State Architectures"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="stats-grid">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        value={courseCategory}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-control"
                      >
                        <option value="Development">Development</option>
                        <option value="AI & Data Science">AI & Data Science</option>
                        <option value="Design">Design</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Target Difficulty Level</label>
                      <select
                        value={courseLevel}
                        onChange={(e) => setCourseLevel(e.target.value)}
                        className="form-control"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Price (USD)</label>
                      <input
                        type="number"
                        min="0"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(Number(e.target.value))}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thumbnail URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... (leave blank for default)"
                      value={courseThumbnail}
                      onChange={(e) => setCourseThumbnail(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <input
                      type="text"
                      placeholder="A short punchy catchphrase explaining the course..."
                      value={courseShortDesc}
                      onChange={(e) => setCourseShortDesc(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Course Overview</label>
                    <textarea
                      placeholder="Explain what technologies, outcomes, and syllabus items students will study in detail..."
                      value={courseDesc}
                      onChange={(e) => setCourseDesc(e.target.value)}
                      className="form-control"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>
              )}

              {/* STEP 2: Curriculum Module & Lesson Builder */}
              {wizardStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Construct Course Curriculum Outline</h4>
                    <button onClick={handleAddModule} className="btn btn-outline btn-sm">
                      + Add Module
                    </button>
                  </div>

                  {modules.map((mod, modIdx) => (
                    <div
                      key={modIdx}
                      style={{
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--border-radius-md)',
                        padding: '20px',
                        backgroundColor: 'rgba(255,255,255,0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => handleModuleTitleChange(modIdx, e.target.value)}
                          className="form-control"
                          style={{ fontWeight: '700', fontSize: '14px' }}
                          required
                        />
                        <button
                          onClick={() => handleRemoveModule(modIdx)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Lessons Grid list inside modules */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', borderLeft: '2px solid var(--glass-border)' }}>
                        {mod.lessons.map((les, lesIdx) => (
                          <div
                            key={lesIdx}
                            style={{
                              backgroundColor: 'var(--bg-primary)',
                              padding: '16px',
                              borderRadius: 'var(--border-radius-sm)',
                              border: '1px dashed var(--glass-border)'
                            }}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 30px', gap: '12px', marginBottom: '10px' }}>
                              <input
                                type="text"
                                placeholder="Lesson Title"
                                value={les.title}
                                onChange={(e) => handleLessonChange(modIdx, lesIdx, 'title', e.target.value)}
                                className="form-control"
                                style={{ fontSize: '13px', padding: '8px' }}
                                required
                              />
                              <input
                                type="text"
                                placeholder="Duration"
                                value={les.duration}
                                onChange={(e) => handleLessonChange(modIdx, lesIdx, 'duration', e.target.value)}
                                className="form-control"
                                style={{ fontSize: '13px', padding: '8px' }}
                              />
                              <button
                                onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <input
                              type="text"
                              placeholder="Video URL (e.g. mp4 link)"
                              value={les.videoUrl}
                              onChange={(e) => handleLessonChange(modIdx, lesIdx, 'videoUrl', e.target.value)}
                              className="form-control"
                              style={{ fontSize: '12px', padding: '6px', marginBottom: '8px' }}
                            />

                            <textarea
                              placeholder="Detailed lesson description..."
                              value={les.content}
                              onChange={(e) => handleLessonChange(modIdx, lesIdx, 'content', e.target.value)}
                              className="form-control"
                              style={{ fontSize: '12px', padding: '8px' }}
                              rows="2"
                            ></textarea>
                          </div>
                        ))}

                        <button onClick={() => handleAddLesson(modIdx)} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', borderStyle: 'dashed', fontSize: '11px' }}>
                          + Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3: Review Publishing */}
              {wizardStep === 3 && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Ready to Publish?</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 32px auto' }}>
                    You have drafted a course titled <strong>"{courseTitle}"</strong> containing <strong>{modules.length} modules</strong>. Once published, it will be instantly listed in the courses catalog.
                  </p>

                  <div className="card" style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.01)', textAlign: 'left', maxWidth: '480px', margin: '0 auto' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Course Summary</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{courseTitle}</div>
                    <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600', marginBottom: '12px' }}>{courseCategory} • {courseLevel}</div>
                    <div style={{ fontSize: '18px', fontWeight: '800' }}>Price: ${coursePrice}</div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div style={{
              padding: '20px 30px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.01)'
            }}>
              <button
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} /> Back
              </button>

              {wizardStep < 3 ? (
                <button
                  disabled={wizardStep === 1 && (!courseTitle || !courseShortDesc || !courseDesc)}
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={handlePublishCourse} className="btn btn-accent btn-sm">
                  Publish Masterclass
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .courses-table {
            display: block;
            overflow-x: auto;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default InstructorDashboard;
