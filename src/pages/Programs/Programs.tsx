import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import buildingImage from '../../MUST images/building4.jpg';
import './Programs.css';

interface Programme {
  name: string;
  level: 'Undergraduate' | 'Postgraduate';
  duration: string;
  description: string;
  school: string;
  schoolAcronym: string;
}

interface School {
  name: string;
  fullName: string;
  acronym: string;
  programmes: Programme[];
  departments: number;
  description: string;
}

interface FilterState {
  search: string;
  level: string;
  school: string;
  subjectArea: string;
}

const PROGRAM_CATEGORIES = [
  'Full Economic Fee-Paying',
  'Mature Entry',
  'ODEL',
  'Weekend',
  'Postgraduate',
  'PhD',
];

const categoryLabels: Record<string, string> = {
  'Full Economic Fee-Paying': 'Full Economic Fee-Paying Undergraduate',
  'Mature Entry': 'Mature Entry',
  'ODEL': 'Open Distance and E-Learning (ODEL)',
  'Weekend': 'Weekend Undergraduate',
  'Postgraduate': 'Postgraduate (Master’s)',
  'PhD': 'PhD Programmes',
};

const categoryColors: Record<string, string> = {
  'Full Economic Fee-Paying': '#1976d2',
  'Mature Entry': '#388e3c',
  'ODEL': '#0288d1',
  'Weekend': '#fbc02d',
  'Postgraduate': '#8e24aa',
  'PhD': '#263238',
};

const badgeColors: Record<string, string> = {
  'Full Economic Fee-Paying': 'badge-primary',
  'Mature Entry': 'badge-secondary',
  'ODEL': 'badge-info',
  'Weekend': 'badge-warning',
  'Postgraduate': 'badge-success',
  'PhD': 'badge-dark',
};

const Programs: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: '',
    school: '',
    subjectArea: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(PROGRAM_CATEGORIES[0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Replace the schools/programmes array with the official list
  const officialProgrammes = [
    // Full Economic Fee-Paying Undergraduate Admissions
    {
      name: 'Bachelor of Engineering (Hons) in Biomedical Engineering',
      level: 'Undergraduate',
      duration: '5 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Engineering (Hons) in Chemical Engineering',
      level: 'Undergraduate',
      duration: '5 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Engineering (Hons) in Manufacturing Engineering',
      level: 'Undergraduate',
      duration: '5 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Engineering (Hons) in Metallurgy and Materials Engineering',
      level: 'Undergraduate',
      duration: '5 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Engineering (Hons) in Polymer and Textile Engineering',
      level: 'Undergraduate',
      duration: '5 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Engineering (Hons) in Sustainable Energy Engineering',
      level: 'Undergraduate',
      duration: '5 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Medical Microbiology',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Medical Imaging (Diagnostic Radiography)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Medical Imaging (Diagnostic Ultrasound)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Immunology',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Sports Science',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Food Science and Technology',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Sciences Education',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Mathematical Sciences',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Earth Sciences (Geology)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Meteorology and Climate Science',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Disaster Risk Management',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Geo-Information and Earth Observation Science',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Petroleum Resources (Oil and Gas)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Water Quality and Management',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Science in Computer Systems and Security',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Business Information Technology',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'Weekend'],
    },
    {
      name: 'Bachelor of Arts in Indigenous Knowledge Systems and Practices',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Arts in African Musicology',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry'],
    },
    {
      name: 'Bachelor of Arts in Language, Communication and Culture',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Arts in Cultural Economy',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'Weekend'],
    },
    {
      name: 'Bachelor of Arts in Archiving and Records Management',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['Full Economic Fee-Paying', 'Mature Entry', 'Weekend'],
    },
    // ODEL
    {
      name: 'Bachelor of Science in Sciences Education (Physics)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Sciences Education (Mathematics)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Sciences Education (Biology)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Sciences Education (Chemistry)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Sciences Education (Geography)',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Arts in Language Education',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['ODEL', 'Weekend'],
    },
    {
      name: 'Bachelor of Science in Business Management and Entrepreneurship',
      level: 'Undergraduate',
      duration: '4 Years',
      categories: ['ODEL', 'Weekend'],
    },
    // Postgraduate (Master’s)
    {
      name: 'Master of Science in Medical Microbiology',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Diagnostic Ultrasound',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Infection and Immunity',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'MSc in Disaster Risk Management',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in One Health',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Innovation',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Entrepreneurship',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Business Leadership',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Strategic Family Business',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Mathematical Modelling',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Engineering in Applied Chemical Engineering',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Computer Science (by Research)',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Data Science',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Information Technology (by Research)',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Engineering in Biomedical Engineering',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Science in Biodiversity Informatics',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    {
      name: 'Master of Arts in Music',
      level: 'Postgraduate',
      duration: '2 Years',
      categories: ['Postgraduate'],
    },
    // PhD
    {
      name: 'PhD in Applied Mathematics',
      level: 'PhD',
      duration: '3-4 Years',
      categories: ['PhD'],
    },
    {
      name: 'PhD in Business Leadership',
      level: 'PhD',
      duration: '3-5 Years',
      categories: ['PhD'],
    },
    {
      name: 'PhD in One Health',
      level: 'PhD',
      duration: '3 Years',
      categories: ['PhD'],
    },
    {
      name: 'PhD in Strategic Studies',
      level: 'PhD',
      duration: '1 Year',
      categories: ['PhD'],
    },
    {
      name: 'PhD in Innovation and Development',
      level: 'PhD',
      duration: '3 Years',
      categories: ['PhD'],
    },
  ];

  // Helper function to extract all programmes from all schools
  const allProgrammes = useMemo(() => {
    return officialProgrammes;
  }, [officialProgrammes]);

  // Get unique values for filter options
  const uniqueSchools = useMemo(() => {
    return Array.from(new Set(officialProgrammes.map(programme => programme.name)));
  }, [officialProgrammes]);

  const subjectAreas = useMemo(() => {
    return [
      'Engineering',
      'Computer Science & IT',
      'Medical & Health Sciences',
      'Environmental Sciences',
      'Mathematics & Physics',
      'Architecture & Construction',
      'Cultural Studies',
      'Business & Management'
    ];
  }, []);

  // Get unique durations for filter options
  const uniqueDurations = useMemo(() => {
    return Array.from(new Set(allProgrammes.map(programme => programme.duration))).sort();
  }, [allProgrammes]);

  // Filter programmes based on current filters
  const filteredProgrammes = useMemo(() => {
    return allProgrammes.filter(programme => {
      // Search filter - search through name, level, duration, and categories
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchMatch = 
          programme.name.toLowerCase().includes(searchLower) ||
          programme.level.toLowerCase().includes(searchLower) ||
          programme.duration.toLowerCase().includes(searchLower) ||
          programme.categories.some(cat => cat.toLowerCase().includes(searchLower));
        if (!searchMatch) return false;
      }

      // Level filter
      if (filters.level && programme.level !== filters.level) {
        return false;
      }

      // School filter
      // The school filter is removed as per the edit hint.

      // Subject area filter
      if (filters.subjectArea) {
        const programName = programme.name.toLowerCase();
        const subjectArea = filters.subjectArea.toLowerCase();
        
        let areaMatch = false;
        if (subjectArea.includes('engineering') && programName.includes('engineering')) areaMatch = true;
        if (subjectArea.includes('computer') && (programName.includes('computer') || programName.includes('information technology'))) areaMatch = true;
        if (subjectArea.includes('medical') && (programName.includes('medicine') || programName.includes('medical') || programName.includes('biomedical') || programName.includes('physiotherapy') || programName.includes('radiography'))) areaMatch = true;
        if (subjectArea.includes('environmental') && (programName.includes('environmental') || programName.includes('climate') || programName.includes('water') || programName.includes('renewable') || programName.includes('geology') || programName.includes('geography') || programName.includes('meteorology'))) areaMatch = true;
        if (subjectArea.includes('mathematics') && (programName.includes('mathematics') || programName.includes('physics') || programName.includes('applied'))) areaMatch = true;
        if (subjectArea.includes('architecture') && (programName.includes('architecture') || programName.includes('civil') || programName.includes('quantity') || programName.includes('land surveying'))) areaMatch = true;
        if (subjectArea.includes('cultural') && (programName.includes('cultural') || programName.includes('heritage') || programName.includes('arts'))) areaMatch = true;
        if (subjectArea.includes('business') && (programName.includes('business') || programName.includes('management'))) areaMatch = true;
        
        if (!areaMatch) return false;
      }

      return true;
    });
  }, [allProgrammes, filters]);

  // Group programs by category
  const programsByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    PROGRAM_CATEGORIES.forEach(cat => grouped[cat] = []);
    
    // Use filteredProgrammes instead of officialProgrammes
    filteredProgrammes.forEach(prog => {
      prog.categories.forEach((cat: string) => {
        if (grouped[cat]) grouped[cat].push(prog);
      });
    });
    return grouped;
  }, [filteredProgrammes]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      level: '',
      school: '',
      subjectArea: ''
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <main className="page-content">
      <section 
        className="programs-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.8), rgba(0, 51, 102, 0.9)), url(${buildingImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative'
        }}
      >
        <div className="container">
          <div className="hero-content">
            <h1>Academic Programmes</h1>
            <p>Discover world-class programmes at Malawi University of Science and Technology (MUST)</p>
            
            <div className="hero-intro">
              <h2>Where Excellence Reigns</h2>
              <p>
                At MUST, we offer innovative programmes aligned with global development agendas including 
                MW2063, Africa Agenda 2063, and the UN Sustainable Development Goals. Our graduates are 
                internationally competitive and ready to lead in science, technology, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-filter-section">
        <div className="container">
          <div className="search-filter-container">
            {/* Search Bar */}
            <div className="search-bar">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search programmes, descriptions, or schools..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="clear-search-btn"
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              className="filter-toggle-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
            >
              <i className="fas fa-filter"></i>
              Filters
              {hasActiveFilters && <span className="filter-count">{Object.values(filters).filter(v => v !== '').length}</span>}
            </button>

            {/* Filter Options */}
            <div className={`filter-options ${isFilterOpen ? 'open' : ''}`}>
              <div className="filter-group">
                <label htmlFor="level-filter">Level</label>
                <select
                  id="level-filter"
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="school-filter">School</label>
                <select
                  id="school-filter"
                  value={filters.school}
                  onChange={(e) => handleFilterChange('school', e.target.value)}
                >
                  <option value="">All Schools</option>
                  {uniqueSchools.map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="subject-filter">Subject Area</label>
                <select
                  id="subject-filter"
                  value={filters.subjectArea}
                  onChange={(e) => handleFilterChange('subjectArea', e.target.value)}
                >
                  <option value="">All Subject Areas</option>
                  {subjectAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="clear-filters-btn"
                >
                  <i className="fas fa-times"></i>
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              Showing <strong>{filteredProgrammes.length}</strong> of <strong>{officialProgrammes.length}</strong> programmes
              {hasActiveFilters && (
                <span className="active-filters-indicator">
                  {' '}- filtered by: {Object.entries(filters)
                    .filter(([_, value]) => value !== '')
                    .map(([key, value]) => {
                      if (key === 'search') return `"${value}"`;
                      return value;
                    })
                    .join(', ')}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="programs-list-section">
        <div className="container">
          {filteredProgrammes.length === 0 ? (
            <div className="no-results">
              <div className="no-results-content">
                <div className="no-results-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3>No programmes found</h3>
                <p>
                  {hasActiveFilters 
                    ? "No programmes match your current search criteria. Try adjusting your filters or search terms."
                    : "No programmes are currently available."
                  }
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            PROGRAM_CATEGORIES.map(category => (
              programsByCategory[category].length > 0 && (
                <div className="program-category-list" key={category}>
                  <div
                    className="category-header"
                    style={{ background: categoryColors[category], color: '#fff', padding: '1.2rem 1rem', borderRadius: '8px', margin: '2rem 0 1rem 0', fontSize: '1.3rem', fontWeight: 700 }}
                  >
                    {categoryLabels[category] || category}
                  </div>
                  <div className="programs-table">
                    {programsByCategory[category].map((programme, idx) => (
                      <div
                        className={`program-row${idx % 2 === 0 ? ' even' : ' odd'}`}
                        key={programme.name + idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '1.2rem 1rem',
                          background: idx % 2 === 0 ? '#f8f9fa' : '#fff',
                          borderBottom: '1px solid #e0e0e0',
                          borderRadius: idx === programsByCategory[category].length - 1 ? '0 0 8px 8px' : 0,
                          gap: '1rem',
                          flexWrap: 'nowrap',
                          minHeight: '80px',
                        }}
                      >
                        <div style={{ 
                          flex: '1 1 40%', 
                          fontWeight: 500, 
                          fontSize: '1.05rem', 
                          color: '#222',
                          lineHeight: '1.4',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}>
                          {programme.name}
                        </div>
                        <div style={{ 
                          flex: '0 0 auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                          alignItems: 'flex-start'
                        }}>
                          <span className="level-badge" style={{ 
                            background: '#e3e3e3', 
                            color: '#333', 
                            borderRadius: 12, 
                            padding: '0.3rem 0.8rem', 
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            fontWeight: '600'
                          }}>
                            {programme.level}
                          </span>
                          <span className="duration-badge" style={{ 
                            background: '#e3e3e3', 
                            color: '#333', 
                            borderRadius: 12, 
                            padding: '0.3rem 0.8rem', 
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            fontWeight: '500'
                          }}>
                            {programme.duration}
                          </span>
                        </div>
                        <div style={{ 
                          flex: '1 1 30%',
                          display: 'flex', 
                          gap: '0.5rem', 
                          flexWrap: 'wrap',
                          alignItems: 'center'
                        }}>
                          {programme.categories.map((cat: string) => (
                            <span key={cat} className={`category-badge ${badgeColors[cat]}`} style={{ 
                              background: categoryColors[cat], 
                              color: '#fff', 
                              borderRadius: 10, 
                              padding: '0.3rem 0.8rem', 
                              fontSize: '0.85rem',
                              whiteSpace: 'nowrap',
                              fontWeight: '500'
                            }}>
                              {cat}
                            </span>
                          ))}
                        </div>
                        <div style={{ 
                          flex: '0 0 auto',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <Link to="/application" className="btn btn-sm btn-primary" style={{
                            whiteSpace: 'nowrap',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}>
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))
          )}
        </div>
      </section>

      <section className="admission-info">
        <div className="container">
          <div className="admission-content">
            <h2>Ready to Join MUST?</h2>
            <p>
              Take the first step towards your academic excellence. Our admission process is designed 
              to identify talented individuals who are ready to contribute to Malawi's development 
              through science, technology, and innovation.
            </p>
            <div className="admission-features">
              <div className="feature">
                <i className="fas fa-graduation-cap"></i>
                <h3>Quality Education</h3>
                <p>World-class programmes with industry-relevant curriculum</p>
              </div>
              <div className="feature">
                <i className="fas fa-microscope"></i>
                <h3>Research Excellence</h3>
                <p>State-of-the-art facilities for cutting-edge research</p>
              </div>
              <div className="feature">
                <i className="fas fa-briefcase"></i>
                <h3>Career Ready</h3>
                <p>Graduates equipped for leadership in their fields</p>
              </div>
              <div className="feature">
                <i className="fas fa-globe-africa"></i>
                <h3>Global Impact</h3>
                <p>Contributing to Africa's development and global competitiveness</p>
              </div>
            </div>
            <div className="admission-cta">
              <Link to="/application" className="btn btn-primary btn-lg">
                Start Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Programs; 