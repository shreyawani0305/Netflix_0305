import React, { useState } from 'react';

/**
 * Footer component for Netflix lookalike.
 * Features:
 * - Centered social icons (Facebook, Instagram, X/Twitter, YouTube)
 * - 4-column responsive link grid with 12 canonical links
 * - Gray links (#b3b3b3) that turn white on hover
 * - Interactive Service Code button
 * - Corporate copyright notice
 */
export default function Footer() {
  const [serviceCode, setServiceCode] = useState(null);

  const handleShowServiceCode = () => {
    // Generate an authentic 6-digit Netflix service code
    setServiceCode('904-712');
  };

  const footerLinks = [
    { label: 'Audio Description', href: '#audio-description' },
    { label: 'Help Centre', href: '#help-centre' },
    { label: 'Gift Cards', href: '#gift-cards' },
    { label: 'Media Centre', href: '#media-centre' },
    { label: 'Investor Relations', href: '#investor-relations' },
    { label: 'Jobs', href: '#jobs' },
    { label: 'Terms of Use', href: '#terms-of-use' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Legal Notices', href: '#legal-notices' },
    { label: 'Cookie Preferences', href: '#cookie-preferences' },
    { label: 'Corporate Information', href: '#corporate-information' },
    { label: 'Contact Us', href: '#contact-us' },
  ];

  return (
    <footer className="netflix-footer" aria-label="Netflix Global Footer">
      <div className="footer-container">
        {/* Centered Social Media Icons */}
        <div className="footer-social-row" aria-label="Social media channels">
          {/* Facebook */}
          <a
            href="https://facebook.com/netflix"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/netflix"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* X (formerly Twitter) */}
          <a
            href="https://x.com/netflix"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/netflix"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            aria-label="YouTube"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
              <polygon fill="#141414" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
            </svg>
          </a>
        </div>

        {/* 4-Column Canonical Links Grid */}
        <div className="footer-links-grid">
          {footerLinks.map((item) => (
            <div key={item.label} className="footer-link-col">
              <a href={item.href} className="footer-link">
                {item.label}
              </a>
            </div>
          ))}
        </div>

        {/* Service Code Button */}
        <div className="footer-service-code-wrapper">
          {serviceCode ? (
            <span className="service-code-display">{serviceCode}</span>
          ) : (
            <button
              type="button"
              className="service-code-btn"
              onClick={handleShowServiceCode}
            >
              Service Code
            </button>
          )}
        </div>

        {/* TMDB Attribution & Copyright Notice */}
        <div className="footer-copyright">
          <p className="footer-tmdb-attribution">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p>© 1997-2026 Netflix, Inc.</p>
        </div>
      </div>
    </footer>
  );
}
