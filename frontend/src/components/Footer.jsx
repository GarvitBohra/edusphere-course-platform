import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '60px 0 30px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '40px'
        }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--border-radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                E
              </div>
              <span style={{
                fontFamily: 'var(--font-title)',
                fontWeight: '800',
                fontSize: '20px',
                color: 'var(--text-primary)'
              }}>
                EduSphere
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '300px' }}>
              Empowering learners around the globe with highly premium, industry-crafted curriculum and immersive study dashboards.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>Explore</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Link to="/catalog" className="footer-link">All Courses</Link>
              <Link to="/catalog?category=Development" className="footer-link">Development</Link>
              <Link to="/catalog?category=AI" className="footer-link">Data Science & AI</Link>
              <Link to="/catalog?category=Design" className="footer-link">UI/UX Design</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/register" className="footer-link">Create Account</Link>
              <a href="#" className="footer-link">Partner Program</a>
              <a href="#" className="footer-link">Enterprise Solutions</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Cookie Preferences</a>
              <a href="#" className="footer-link">Contact Support</a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} EduSphere Inc. All rights reserved. Made for learning.
          </span>
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer' }} className="footer-link">English</span>
            <span style={{ cursor: 'pointer' }} className="footer-link">USD ($)</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          transition: color var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--accent);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
