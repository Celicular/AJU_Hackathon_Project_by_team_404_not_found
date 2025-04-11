'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close any open dropdowns when toggling menu
    setActiveDropdown(null);
  };

  const toggleDropdown = (menu) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) onLogout();
  };

  const navItems = [
    {
      name: 'My Info',
      dropdownItems: [
        { name: 'Student Info', path: '/student-info' },
        { name: 'Online Payment', path: '/online-payment' },
        { name: 'Receipt Generation', path: '/receipt-generation' },
        { name: 'Time Table', path: '/time-table' },
        { name: 'Attendance', path: '/attendance' },
      ],
    },
    {
      name: 'Examinations',
      dropdownItems: [
        { name: 'No Dues Generation', path: '/no-dues-generation' },
        { name: 'Exam Form Registration', path: '/exam-form-registration' },
        { name: 'Result', path: '/result' },
        { name: 'Re-evaluation', path: '/re-evaluation' },
        { name: 'Admit Card', path: '/admit-card' },
      ],
    },
    {
      name: 'My Assignments',
      dropdownItems: [
        { name: 'My Tests', path: '/my-tests' },
        { name: 'Assignments', path: '/assignments' },
        { name: 'Lecture Notes', path: '/lecture-notes' },
        { name: 'Syllabus', path: '/syllabus' },
      ],
    },
  ];

  return (
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Logo" className={styles.logoImage} />
          </div>
          <div className={styles.brandName}>Student Portal</div>
        </div>

        <div className={`${styles.navLinksContainer} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navLinks}>
            {navItems.map((item, index) => (
              <li key={index} className={styles.navItem}>
                <div
                  className={styles.navLink}
                  onClick={() => toggleDropdown(item.name)}
                >
                  {item.name}
                  <span className={`${styles.dropdownIcon} ${activeDropdown === item.name ? styles.active : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
                <ul className={`${styles.dropdownMenu} ${activeDropdown === item.name ? styles.show : ''}`}>
                  {item.dropdownItems.map((dropdownItem, i) => (
                    <li key={i}>
                      <Link href={dropdownItem.path} className={styles.dropdownItem}>
                        {dropdownItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.navRight}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.logoutText}>Logout</span>
            <span className={styles.logoutIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>
          </button>
        </div>

        <div className={styles.hamburger} onClick={toggleMenu}>
          <div className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></div>
          <div className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></div>
          <div className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></div>
        </div>
      </div>
    </nav>
  );
} 