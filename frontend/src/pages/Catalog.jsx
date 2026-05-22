import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { Search, Filter, RefreshCw } from 'lucide-react';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Trigger query search to backend
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchText) queryParams.set('search', searchText);
      if (category) queryParams.set('category', category);
      if (level) queryParams.set('level', level);
      if (sort) queryParams.set('sort', sort);

      const res = await fetch(`${API_URL}/courses?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching catalog courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync params with state & trigger search
  useEffect(() => {
    fetchCourses();
  }, [category, level, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchText, category, level, sort });
    fetchCourses();
  };

  const handleResetFilters = () => {
    setSearchText('');
    setCategory('');
    setLevel('');
    setSort('newest');
    setSearchParams({});
    // Delay slightly to trigger fetch
    setTimeout(() => {
      fetchCourses();
    }, 50);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Explore Masterclasses</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Advance your career by learning structured technologies at your own pace.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }} className="catalog-layout">
        {/* Sidebar Filters */}
        <aside style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '24px',
          height: 'fit-content'
        }} className="catalog-sidebar">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '16px' }}>
              <Filter size={16} /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          {/* Search bar inside sidebar */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '24px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="form-control"
              style={{ paddingRight: '40px' }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Category Filter */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-primary)' }}>Category</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Development', 'AI & Data Science', 'Design'].map((cat) => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={category === cat}
                    onChange={() => setCategory(category === cat ? '' : cat)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-primary)' }}>Skill Level</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={level === lvl}
                    onChange={() => setLevel(level === lvl ? '' : lvl)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  {lvl}
                </label>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-primary)' }}>Sort By</h4>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-control"
              style={{ fontSize: '13px' }}
            >
              <option value="newest">Newest Released</option>
              <option value="popular">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Main Grid View */}
        <main>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
              <div className="loader" style={{ width: '45px', height: '45px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: 'var(--border-radius-full)', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : courses.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '60px 40px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No Courses Found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                We couldn't find any courses matching your specific search filters.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Showing <strong>{courses.length}</strong> course(s)
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="catalog-grid">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
          .catalog-sidebar {
            width: 100%;
          }
        }
        @media (max-width: 600px) {
          .catalog-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Catalog;
