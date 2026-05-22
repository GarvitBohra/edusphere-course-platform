import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { Sparkles, Play, Award, Shield, Users, Layers } from 'lucide-react';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/courses?sort=popular`);
        const data = await res.json();
        if (res.ok) {
          // Take the top 3 courses for Featured section
          setCourses(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching courses: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '100px 0 140px 0',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
      }}>
        {/* Abstract Glowing Dots */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: 'var(--primary-glow)', filter: 'blur(100px)', borderRadius: 'var(--border-radius-full)', zIndex: -1 }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '250px', height: '250px', background: 'var(--accent-glow)', filter: 'blur(100px)', borderRadius: 'var(--border-radius-full)', zIndex: -1 }} />

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }} className="hero-grid">
          {/* Hero Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--border-radius-full)', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: '24px' }}>
              <Sparkles size={14} color="#818cf8" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#818cf8', fontFamily: 'var(--font-title)' }}>REDISCOVER KNOWLEDGE</span>
            </div>
            
            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              lineHeight: '1.15',
              letterSpacing: '-1.5px',
              marginBottom: '24px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-title)'
            }} className="hero-title">
              Master the Skills to <span style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Shape Your Future</span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '36px',
              maxWidth: '560px'
            }}>
              Join EduSphere to study premium masterclasses created by industry experts. Track your progress dynamically and earn verifiable completion certificates.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/catalog" className="btn btn-primary glow-effect" style={{ padding: '14px 28px', fontSize: '15px' }}>
                Explore Courses <Play size={14} fill="#fff" />
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
                Join Free
              </Link>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }} className="hero-visual">
            <div style={{
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                background: 'linear-gradient(135deg, var(--accent), var(--primary))',
                width: '60px',
                height: '60px',
                borderRadius: 'var(--border-radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px var(--accent-glow)',
                transform: 'rotate(15deg)'
              }}>
                <Award size={28} />
              </div>
              
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80"
                alt="student workspace"
                style={{ width: '100%', borderRadius: 'var(--border-radius-md)', marginBottom: '16px', filter: 'brightness(0.95)' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Next Masterclass</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Full-Stack Web BootCamp</div>
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--border-radius-sm)', fontSize: '11px', fontWeight: '700' }}>
                  ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderY: '1px solid var(--glass-border)', padding: '50px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px',
            textAlign: 'center'
          }} className="stats-grid">
            <div>
              <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)', marginBottom: '4px' }}>12k+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enrolled Students</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)', marginBottom: '4px' }}>150+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Expert Instructors</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)', marginBottom: '4px' }}>4.8★</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Average Ratings</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)', marginBottom: '4px' }}>99%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Completion Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-title)', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Featured Curriculums
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Begin your journey with our top-rated, highly comprehensive courses.
              </p>
            </div>
            <Link to="/catalog" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View Catalog
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: 'var(--border-radius-full)', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No courses found. Please run the backend database seeding script.
            </div>
          ) : (
            <div className="grid-3">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY US / BENEFITS */}
      <section style={{ padding: '80px 0 120px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Immersive Learning Experience
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '580px', margin: '0 auto' }}>
              We build tools and student workspaces to make learning as interactive and smooth as possible.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }} className="grid-3">
            {/* Card 1 */}
            <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Expert Instructors</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Learn from industry veterans who have built projects for top Silicon Valley and Global tech groups.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)', width: '50px', height: '50px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Modular Study Viewer</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Break down complex technologies lesson by lesson with interactive content navigation and checkbox updates.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: '50px', height: '50px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Verifiable Achievements</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Earn a beautiful custom completion certificate immediately upon reaching 100% course progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 968px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .hero-title {
            font-size: 40px !important;
          }
          .hero-grid div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-visual {
            display: none !important;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
