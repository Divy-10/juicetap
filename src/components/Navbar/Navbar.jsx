import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, CONTACT, SOCIAL } from '../../data/constants';
import Button from '../Button/Button';
import { PhoneIcon, InstagramIcon, LinkedInIcon, EmailIcon } from '../Icons/Icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="banner">
      <nav className="navbar__inner container-wide" aria-label="Main navigation">
        <Link to="/" className="navbar__logo" aria-label="JuiceTap Home">
          <img src="/assets/logo.png" alt="JuiceTap Logo" height="50" />
        </Link>

        <ul className="navbar__links" role="menubar">
          {NAV_LINKS.map((link) => (
            <li key={link.path} role="none">
              <Link
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link-active' : ''}`}
                role="menuitem"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <Button
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            size="sm"
            className="navbar__icon-btn navbar__icon-btn--instagram"
            icon={<InstagramIcon size={20} />}
            aria-label="Instagram"
            title="Instagram"
          />
          <Button
            href={SOCIAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            size="sm"
            className="navbar__icon-btn navbar__icon-btn--linkedin"
            icon={<LinkedInIcon size={20} />}
            aria-label="LinkedIn"
            title="LinkedIn"
          />
          <Button
            href={CONTACT.emailLink}
            variant="dark"
            size="sm"
            className="navbar__icon-btn navbar__icon-btn--email"
            icon={<EmailIcon size={20} />}
            aria-label="Mail JuiceTap"
            title="Mail Us"
          />
          <Button
            href={CONTACT.phoneTel}
            variant="dark"
            size="sm"
            className="navbar__icon-btn navbar__icon-btn--phone"
            icon={<PhoneIcon size={20} />}
            aria-label="Call Now"
            title="Call Now"
          />
          <Button
            href="https://app.juicetap.in/"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="sm"
            className="navbar__buy-btn navbar__action-cta"
            aria-label="Buy Now on JuiceTap App"
          >
            BUY NOW
          </Button>
        </div>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger-open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`navbar__mobile ${mobileOpen ? 'navbar__mobile-open' : ''}`} 
        role="dialog" 
        aria-label="Mobile navigation"
      >
        <div className="navbar__mobile-header">
          <Link to="/" className="navbar__mobile-logo" onClick={() => setMobileOpen(false)}>
            <img src="/assets/logo.png" alt="JuiceTap Logo" height="48" />
          </Link>
          <button 
            className="navbar__mobile-close" 
            onClick={() => setMobileOpen(false)} 
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <div className="navbar__mobile-inner">
          <ul className="navbar__mobile-links">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="navbar__mobile-cta">
            <Button
              href="https://app.juicetap.in/"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setMobileOpen(false)}
            >
              BUY NOW
            </Button>
            <Button
              href={CONTACT.phoneTel}
              variant="dark"
              size="md"
              fullWidth
              icon={<PhoneIcon size={18} />}
              onClick={() => setMobileOpen(false)}
              aria-label="Call JuiceTap"
            >
              CALL NOW
            </Button>
            
            <div className="navbar__mobile-socials">
              <a 
                href={SOCIAL.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="navbar__mobile-social-icon navbar__mobile-social-icon--instagram"
                title="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a 
                href={SOCIAL.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="navbar__mobile-social-icon navbar__mobile-social-icon--linkedin"
                title="LinkedIn"
              >
                <LinkedInIcon size={20} />
              </a>
              <a 
                href={CONTACT.emailLink} 
                aria-label="Mail" 
                className="navbar__mobile-social-icon navbar__mobile-social-icon--email"
                title="Mail"
              >
                <EmailIcon size={20} />
              </a>
              <a 
                href={CONTACT.phoneTel} 
                aria-label="Call Now" 
                className="navbar__mobile-social-icon navbar__mobile-social-icon--phone"
                title="Call Now"
              >
                <PhoneIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}
    </header>
  );
}
