import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, BookOpen, LayoutDashboard, Award, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/login');
  };

  return (
    <header className="glass-header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            width: '40px',
            height: '40px',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '20px',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            E
          </div>
          <span style={{
            fontFamily: 'var(--font-title)',
            fontWeight: '800',
            fontSize: '22px',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(to right, var(--text-primary), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            EduSphere
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="desktop-nav">
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }} className="nav-link">
            <BookOpen size={16} /> Browse Courses
          </Link>

          {user && (
            <>
              {user.role === 'student' && (
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }} className="nav-link">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              {user.role === 'instructor' && (
                <Link to="/instructor" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }} className="nav-link">
                  <LayoutDashboard size={16} /> Instructor Area
                </Link>
              )}
            </>
          )}

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: 'var(--border-radius-md)'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Auth Section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                  alt="avatar"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--border-radius-full)',
                    border: '2px solid var(--primary)',
                    padding: '2px'
                  }}
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '55px',
                  width: '220px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ padding: '10px', borderBottom: '1px solid var(--glass-border)', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</div>
                  </div>
                  
                  {user.role === 'student' && (
                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileDropdown(false)}
                      style={{ padding: '8px 10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--border-radius-sm)' }}
                      className="dropdown-item"
                    >
                      <LayoutDashboard size={14} /> My Dashboard
                    </Link>
                  )}
                  {user.role === 'instructor' && (
                    <Link
                      to="/instructor"
                      onClick={() => setShowProfileDropdown(false)}
                      style={{ padding: '8px 10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--border-radius-sm)' }}
                      className="dropdown-item"
                    >
                      <LayoutDashboard size={14} /> Instructor Area
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--error)',
                      width: '100%',
                      borderRadius: 'var(--border-radius-sm)'
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
          className="mobile-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 90
        }}>
          <Link to="/catalog" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
            <BookOpen size={18} /> Browse Courses
          </Link>
          {user && user.role === 'student' && (
            <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          )}
          {user && user.role === 'instructor' && (
            <Link to="/instructor" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <LayoutDashboard size={18} /> Instructor Area
            </Link>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Appearance</span>
            <button
              onClick={toggleTheme}
              style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '8px 16px', borderRadius: 'var(--border-radius-md)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              {theme === 'dark' ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
            {user ? (
              <button
                onClick={handleLogout}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: 'var(--error)',
                  padding: '12px',
                  width: '100%',
                  borderRadius: 'var(--border-radius-md)',
                  fontWeight: '600',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/login" onClick={() => setIsOpen(false)} style={{ flex: 1 }} className="btn btn-outline">Sign In</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} style={{ flex: 1 }} className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS overrides specifically for custom components logic */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        .nav-link:hover, .dropdown-item:hover {
          color: var(--primary) !important;
          background-color: var(--bg-tertiary);
        }
        .dropdown-item {
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
      `}</style>
    </header>
  );
};

export default Navbar;
