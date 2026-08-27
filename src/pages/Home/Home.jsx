import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import Button from '../../components/Button/Button';
import ContactForm from '../../components/ContactForm/ContactForm';
import AppDownload from '../../components/AppDownload/AppDownload';

import {
  USP_ITEMS,
  HOW_IT_WORKS_STEPS,
  MACHINE_FEATURES,
  LOCATIONS,
  GOOGLE_BUSINESS_PROFILE_URL,
} from '../../data/constants';
import { fetchLocations } from '../../services/locationService';

// SVG Decorative Components
const LeafSVG = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))' }}>
    <path d="M10,110 C50,110 100,80 110,10 C80,20 20,50 10,110 Z" fill="url(#leafGrad)" />
    <path d="M10,110 C45,85 75,55 110,10" stroke="#558B2F" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50,80 C60,70 70,68 85,65" stroke="#558B2F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30,95 C40,88 45,86 55,85" stroke="#558B2F" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="leafGrad" x1="10" y1="110" x2="110" y2="10">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="100%" stopColor="#8BC34A" />
      </linearGradient>
    </defs>
  </svg>
);


const LiquidSplashSVG = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M200,380 C320,380 370,300 370,200 C370,120 320,60 200,60 C80,60 30,120 30,200 C30,300 80,380 200,380 Z" fill="url(#splashGrad)" opacity="0.85" />
    <path d="M220,90 C260,70 300,100 320,130 C340,160 380,210 350,260 C320,310 260,350 200,350 C140,350 80,310 50,260 C20,210 60,160 80,130 C100,100 140,70 180,90 Z" fill="url(#splashGrad2)" opacity="0.9" />
    <circle cx="70" cy="90" r="12" fill="#FFA726" />
    <circle cx="330" cy="110" r="8" fill="#FFB74D" />
    <circle cx="320" cy="290" r="10" fill="#FFA726" />
    <circle cx="90" cy="310" r="14" fill="#FF8F00" />
    <defs>
      <linearGradient id="splashGrad" x1="200" y1="20" x2="200" y2="380">
        <stop offset="0%" stopColor="#FFA726" />
        <stop offset="100%" stopColor="#E65100" />
      </linearGradient>
      <linearGradient id="splashGrad2" x1="200" y1="50" x2="200" y2="350">
        <stop offset="0%" stopColor="#FFD54F" />
        <stop offset="100%" stopColor="#FF9800" />
      </linearGradient>
    </defs>
  </svg>
);

// Organic Wave Transitions
const FluidDivider1 = ({ bg = 'var(--color-cream)', fill = 'var(--color-white)' }) => (
  <div className="fluid-divider" style={{ backgroundColor: bg }}>
    <svg viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,45 C240,-15 480,105 720,45 C960,-15 1200,105 1440,45 L1440,90 L0,90 Z" fill={fill} />
    </svg>
  </div>
);

const FluidDivider3 = ({ bg = 'var(--color-primary)', fill = 'var(--color-cream)' }) => (
  <div className="fluid-divider" style={{ backgroundColor: bg }}>
    <svg viewBox="0 0 1440 110" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,40 C300,100 600,-20 900,60 C1140,110 1320,40 1440,80 L1440,110 L0,110 Z" fill={fill} />
    </svg>
  </div>
);

const FluidDivider5 = ({ bg = '#0F381E', fill = 'var(--color-cream)' }) => (
  <div className="fluid-divider" style={{ backgroundColor: bg }}>
    <svg viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 C200,70 500,90 800,45 C1100,0 1300,80 1440,25 L1440,90 L0,90 Z" fill={fill} />
    </svg>
  </div>
);

/* Premium container ship for the Global Orange Sourcing map.
   Drawn bow-first along +X so `offset-rotate: auto` turns the hull to face
   its direction of travel along each sea route. A clean white hull with an
   orange waterline and a mixed white/orange container stack reads instantly
   as an international freighter while staying elegant at map scale. The wake
   sits on the outer group (steady on the water); the hull rides in an inner
   `__body` group that gently bobs and rocks as it sails. Sized in the map
   SVG's own viewBox units (1024 x 510). */
const CargoShip = ({ route }) => (
  <g className={`cargo-ship cargo-ship--${route}`} aria-hidden="true">
    {/* Slim foam wake trailing off the stern, fading out behind. */}
    <path
      className="cargo-ship__wake"
      d="M-16,3.4 C-26,2.9 -35,3.1 -44,3.9 C-35,4.7 -26,4.6 -16,4.2 Z"
      fill="url(#cargoTrailGrad)"
    />

    <g className="cargo-ship__body">
      {/* Hull — white body with an orange waterline and a pointed bow at +X */}
      <path
        d="M-16,-2 L12,-2 L19.5,2.3 L12,6.6 L-14,6.6 Q-16,6.6 -16,4.8 Z"
        fill="#FFFFFF"
      />
      {/* Orange lower hull / waterline band */}
      <path
        d="M-16,3.5 L15,3.5 L19.5,2.3 L12,6.6 L-14,6.6 Q-16,6.6 -16,4.8 Z"
        fill="#F08121"
      />
      {/* Crisp unifying outline on top of both fills */}
      <path
        d="M-16,-2 L12,-2 L19.5,2.3 L12,6.6 L-14,6.6 Q-16,6.6 -16,4.8 Z"
        fill="none"
        stroke="#1F4A34"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Thin highlight where the white meets the orange */}
      <path d="M-15.6,3.5 L14.4,3.5" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />

      {/* Stern superstructure — white bridge, tiny windows and an orange funnel */}
      <rect x="-13.6" y="-10.2" width="1.7" height="2.4" rx="0.4" fill="#F08121" stroke="#FFFFFF" strokeWidth="0.3" />
      <rect x="-15" y="-8" width="3.7" height="6" rx="0.7" fill="#FFFFFF" stroke="#1F4A34" strokeWidth="0.55" />
      <rect x="-14.2" y="-6.9" width="2.1" height="0.85" rx="0.2" fill="#A9C6D2" />
      <rect x="-14.2" y="-5.3" width="2.1" height="0.85" rx="0.2" fill="#A9C6D2" />

      {/* Stacked containers — clean white with orange accents. Bottom row. */}
      <rect x="-10.6" y="-6" width="5" height="4" rx="0.4" fill="#F08121" stroke="#CDB89C" strokeWidth="0.4" />
      <rect x="-5.2" y="-6" width="5" height="4" rx="0.4" fill="#FFFFFF" stroke="#CDB89C" strokeWidth="0.4" />
      <rect x="0.2" y="-6" width="5" height="4" rx="0.4" fill="#FFFFFF" stroke="#CDB89C" strokeWidth="0.4" />
      <rect x="5.6" y="-6" width="4.6" height="4" rx="0.4" fill="#F08121" stroke="#CDB89C" strokeWidth="0.4" />
      {/* Top row */}
      <rect x="-7.4" y="-9.2" width="5" height="3.2" rx="0.4" fill="#FFFFFF" stroke="#CDB89C" strokeWidth="0.4" />
      <rect x="-2" y="-9.2" width="5" height="3.2" rx="0.4" fill="#F08121" stroke="#CDB89C" strokeWidth="0.4" />
      <rect x="3.4" y="-9.2" width="3.8" height="3.2" rx="0.4" fill="#FFFFFF" stroke="#CDB89C" strokeWidth="0.4" />

      {/* Bow foam as the ship cuts forward */}
      <path
        className="cargo-ship__bow-foam"
        d="M19.5,2.3 Q23,2.7 23.2,4.8 Q20.8,3.8 18.8,4 Z"
        fill="#FFFFFF"
        opacity="0.8"
      />
    </g>
  </g>
);

// Framer Motion Presets
const textReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1.0, ease: [0.34, 1.56, 0.64, 1] }
  }
};

/* The hero mascot ships as a transparent-alpha WebM (VP9, ALPHA_MODE=1).
   Chrome/Firefox/Android render its transparency correctly, but Apple WebKit
   (iOS Safari, iOS Chrome, macOS Safari) does not support alpha in WebM and
   fills the transparent area with BLACK. For those browsers only, we swap the
   <video> for a transparent PNG of the same mascot — the floating/pulsing
   motion comes from the framer-motion container, so it still animates.
   Feature/platform detection runs once at module load (client-only SPA). */
const IS_APPLE_WEBKIT = (() => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIOS =
    /iP(ad|hone|od)/.test(ua) ||
    (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
  const isSafari =
    /safari/i.test(ua) && !/(chrome|crios|chromium|android|edg|edgios|fxios|opr|opios)/i.test(ua);
  return isIOS || isSafari;
})();

export default function Home() {
  const [locations, setLocations] = useState(LOCATIONS);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 767);
  const parallaxRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetchLocations().then((res) => {
      if (isMounted && res.success && res.groupedLocations?.length > 0) {
        setLocations(res.groupedLocations);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Move Parallax Handler
  const handleMouseMove = (e) => {
    if (!parallaxRef.current || window.innerWidth < 1024) return;
    const { clientWidth, clientHeight } = parallaxRef.current;
    const x = (e.clientX - clientWidth / 2) / 35;
    const y = (e.clientY - clientHeight / 2) / 35;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  // How it works scroll monitoring for PC & Mobile
  useEffect(() => {
    let ticking = false;

    const updateActiveStepOnScroll = () => {
      const stepElements = document.querySelectorAll('.how-it-works__story-text-block');
      if (!stepElements.length) return;

      const viewportCenter = window.innerHeight / 2;
      let closestStep = 0;
      let minDistance = Infinity;

      stepElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestStep = index;
        }
      });

      setActiveStep(closestStep);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveStepOnScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveStepOnScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <SEO
        title="Fresh Juice. Just a Tap Away."
        description="JuiceTap — freshly squeezed orange juice served through smart vending technology. 100% natural, no added sugar, no preservatives. Find a JuiceTap near you."
        path="/"
      />

      {/* ===== HERO SECTION ===== */}
      <section
        className="hero"
        ref={parallaxRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="hero__background-orange" />

        {/* Floating Leaves */}
        <motion.div
          className="hero__decor leaf-1"
          animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <LeafSVG />
        </motion.div>

        <motion.div
          className="hero__decor leaf-2"
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <LeafSVG />
        </motion.div>

        {/* Hero Content Container */}
        <div className="hero__container container">
          <div className="hero__editorial-grid">

            {/* Left Column: Title, Subtitle, CTAs & Social Proof */}
            <div className="hero__content-col">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="hero__content-inner"
              >
                <div className="hero__header-block">
                  <motion.span className="hero__badge" variants={textReveal}>
                    FRESHNESS, REIMAGINED
                  </motion.span>

                  <motion.h1 className="hero__title display-title" variants={textReveal}>
                    Fresh Juice.<br />
                    <span className="hero__title-accent">Just a Tap Away.</span>
                  </motion.h1>

                  <motion.p className="hero__description" variants={textReveal}>
                    Freshly squeezed Premium Valencia Orange juice,<br />
                    powered by smart vending technology.
                  </motion.p>
                </div>

                {/* Mobile Glass Visual — Positioned EXACTLY between Description & CTA buttons */}
                <div className="hero__product-col hero__product-col--mobile">
                  <div className="hero__splash-bg">
                    <LiquidSplashSVG />
                  </div>

                  <motion.div className="hero__glass-parallax-wrap">
                    <div className="hero__pedestal" />
                    <motion.div
                      className="hero__glass-container"
                      initial={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      animate={{
                        opacity: 1,
                        scale: [0.98, 1.03, 0.98],
                        y: [0, -6, 0],
                        rotate: [2, -2, 2]
                      }}
                      transition={{
                        opacity: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      {IS_APPLE_WEBKIT ? (
                        <img
                          src="/video/hero-mascot.png"
                          alt="JuiceTap mascot"
                          aria-hidden="true"
                          className="hero__glass-image hero__mascot-image hero__video"
                        />
                      ) : (
                        <video
                          src="/video/video-background-remover.webm"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="hero__glass-image hero__mascot-image hero__video"
                        />
                      )}
                    </motion.div>
                  </motion.div>
                </div>

                <div className="hero__actions-block">
                  <motion.div className="hero__actions" variants={textReveal}>
                    <Button to="/locations" className="btn-hero-primary" variant="primary" size="lg">
                      Find a JuiceTap <span className="btn-arrow">→</span>
                    </Button>
                    <Button to="/business" className="btn-hero-secondary" variant="outline-white" size="lg">
                      Franchise Opportunity <span className="btn-arrow">→</span>
                    </Button>
                  </motion.div>

                  {/* Google Reviews CTA Badge */}
                  <motion.a
                    href={GOOGLE_BUSINESS_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero__google-reviews-badge"
                    variants={textReveal}
                    aria-label="Read JuiceTap reviews on Google"
                  >
                    <div className="hero__google-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                    </div>
                    <div className="hero__google-reviews-text">
                      <strong>Google Reviews</strong>
                      <span>See what our customers are saying ↗</span>
                    </div>
                  </motion.a>


                </div>

              </motion.div>
            </div>

            {/* Right Column: Desktop Premium Pedestal + Mascot with Splash */}
            <div className="hero__product-col hero__product-col--desktop">
              <div className="hero__splash-bg">
                <LiquidSplashSVG />
              </div>

              <motion.div
                className="hero__glass-parallax-wrap"
                animate={{ x: coords.x, y: coords.y }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              >
                {/* Stand Pedestal */}
                <div className="hero__pedestal" />

                {/* Mascot Container with Creative Floating & Hover Physics */}
                <motion.div
                  className="hero__glass-container"
                  initial={isMobile ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : { opacity: 0, y: 100, scale: 0.8, rotate: -6 }}
                  animate={{
                    opacity: 1,
                    scale: [0.98, 1.03, 0.98],
                    y: [0, -6, 0],
                    rotate: [2, -2, 2]
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: [-3, 3, -3, 0],
                    transition: { duration: 0.5, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    opacity: { duration: isMobile ? 0.3 : 1.2, ease: "easeOut" },
                    scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {IS_APPLE_WEBKIT ? (
                    <img
                      src="/video/hero-mascot.png"
                      alt="JuiceTap mascot"
                      aria-hidden="true"
                      className="hero__glass-image hero__mascot-image hero__video"
                    />
                  ) : (
                    <video
                      src="/video/video-background-remover.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="hero__glass-image hero__mascot-image hero__video"
                    />
                  )}
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== USP STRIP (Layered Rounded Overlay Card) ===== */}
      <section className="usp">
        <div className="container-wide">
          <div className="usp__card-wrapper">
            <div className="usp__row">
              {USP_ITEMS.map((item) => {
                const renderSvgIcon = (iconName) => {
                  const strokeProps = { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: "20", height: "20" };
                  switch (iconName) {
                    case 'natural':
                      return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>;
                    case 'fresh':
                      return (
                        <svg viewBox="0 0 24 24" {...strokeProps}>
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                          <circle cx="12" cy="14" r="2.5" fill="currentColor" opacity="0.4" />
                        </svg>
                      );
                    case 'sugar':
                      return <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>;
                    case 'preservatives':
                      return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
                    case 'hygienic':
                      return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
                    case 'seconds':
                      return <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
                    default:
                      return null;
                  }
                };

                return (
                  <div key={item.title} className="usp__item">
                    <span className="usp__icon-inline">{renderSvgIcon(item.icon)}</span>
                    <div>
                      <h3 className="usp__title">{item.title}</h3>
                      <p className="usp__desc">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: GLOBAL ORANGE SOURCING TO INDIA & JUICETAP ===== */}
      <section className="brand-statement global-sourcing">
        <div className="container">
          <motion.div
            className="brand-statement__content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.span className="sourcing-badge" variants={textReveal}>
              IMPORTED VALENCIA ORANGES
            </motion.span>
            <motion.h2 className="brand-statement__headline font-serif" variants={textReveal}>
              Global Orange Sourcing
            </motion.h2>
            <motion.p className="brand-statement__subheadline" variants={textReveal}>
              Sourcing premium Valencia oranges from Australia, Egypt, South Africa, and India—delivered fresh to every JuiceTap machine.
            </motion.p>
          </motion.div>

          {/* GEOGRAPHIC STORYBOARD CANVAS: FULL WORLD MAP & 3 GLOBAL SEA ROUTES */}
          <div className="sourcing-canvas">

            {/* Full-world map backdrop. Fresh oranges set sail from Australia,
                Egypt and South Africa and arrive by sea at the India hub. */}
            <div className="world-map-backdrop">
              <img
                src="/assets/juicetap-world-clean.png"
                alt="JuiceTap global sourcing — sea routes to India"
                className="world-map-img"
                loading="lazy"
                decoding="async"
              />
              {/* The canvas is locked to the map's 1024:510 aspect ratio and the
                  image is object-fit:fill, so the map, this overlay
                  (preserveAspectRatio="none") and the % positioned country
                  markers all share one coordinate space at every viewport
                  width. x = marker-left% x 10.24, y = marker-top% x 5.1. */}
              <svg
                className="world-map-overlay-svg"
                viewBox="0 0 1024 510"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  {/* Foam wake fades out behind each ship's stern */}
                  <linearGradient id="cargoTrailGrad" x1="-15" y1="0" x2="-46" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                  {/* Soft glow that pulses around the India destination */}
                  <radialGradient id="indiaHubGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F08121" stopOpacity="0.30" />
                    <stop offset="55%" stopColor="#F08121" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#F08121" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Pulsing destination glow behind India */}
                <circle className="india-hub-glow" cx="686" cy="286" r="70" fill="url(#indiaHubGlow)" />

                {/* Curved dashed SEA ROUTES, each running source -> India across
                    the ocean. Coordinates are marker-left% x 10.24 /
                    marker-top% x 5.1, so the dashes align with the pins. */}

                {/* Egypt -> India: down the Red Sea, east across the Arabian Sea */}
                <path
                  d="M 563,260 Q 620,345 686,286"
                  stroke="#F08121"
                  strokeWidth="2.4"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                  className="connection-path path-egypt"
                />
                {/* South Africa -> India: up the Indian Ocean */}
                <path
                  d="M 553,444 Q 665,378 686,286"
                  stroke="#F08121"
                  strokeWidth="2.4"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                  className="connection-path path-south-africa"
                />
                {/* Australia -> India: a deep arc through the open Indian Ocean,
                    sweeping south of the Indonesian islands up to India */}
                <path
                  d="M 855,434 Q 800,450 686,286"
                  stroke="#F08121"
                  strokeWidth="2.4"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                  className="connection-path path-australia"
                />

                {/* SEA FREIGHT: container ships carrying Valencia oranges sail
                    each route above from its sourcing country in to the India
                    hub, positioned by CSS `offset-path` (GPU-composited). */}
                <CargoShip route="egypt" />
                <CargoShip route="south-africa" />
                <CargoShip route="australia" />

                {/* Arrival rings rippling out at the India hub as freight lands */}
                <g className="arrival-rings" aria-hidden="true">
                  <circle className="arrival-ring arrival-ring--1" cx="686" cy="286" r="16" />
                  <circle className="arrival-ring arrival-ring--2" cx="686" cy="286" r="16" />
                </g>
              </svg>
            </div>

            {/* Sourcing Location Markers & Labels */}
            {/* 1. AUSTRALIA */}
            <div className="sourcing-marker-label marker--australia">
              <img src="/assets/orange-slice-fresh.png" alt="Orange Fruit Pin" className="location-orange-fruit-pin" />
              <div className="country-direct-label">
                <span className="c-name">AUSTRALIA</span>
              </div>
            </div>

            {/* 2. EGYPT */}
            <div className="sourcing-marker-label marker--egypt">
              <img src="/assets/orange-slice-fresh.png" alt="Orange Fruit Pin" className="location-orange-fruit-pin" />
              <div className="country-direct-label">
                <span className="c-name">EGYPT</span>
              </div>
            </div>

            {/* 3. SOUTH AFRICA */}
            <div className="sourcing-marker-label marker--south-africa">
              <img src="/assets/orange-slice-fresh.png" alt="Orange Fruit Pin" className="location-orange-fruit-pin" />
              <div className="country-direct-label">
                <span className="c-name">SOUTH AFRICA</span>
              </div>
            </div>

            {/* 4. CENTRAL HERO INDIA HUB — JUICETAP GLASS AT CENTER OF INDIA.
                 The destination every sea route arrives at. On Apple WebKit
                 the alpha WebM renders black, so those browsers get the
                 transparent PNG of the same product instead. */}
            <div className="sourcing-marker-label marker--india">
              <span className="india-destination-halo" aria-hidden="true" />
              <div className="india-product-overlay">
                <div className="product-media-wrap">
                  {IS_APPLE_WEBKIT ? (
                    <img
                      src="/video/hero-mascot.png"
                      alt="JuiceTap fresh orange juice"
                      className="sourcing-glass-video"
                    />
                  ) : (
                    <video
                      src="/video/video-background-remover.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="sourcing-glass-video"
                    />
                  )}
                </div>

                {/* Freight landing here: a crate pops in on the same rhythm
                    as the arriving planes, so the hub reads as receiving. */}
                <div className="india-cargo-drop" aria-hidden="true">
                  <svg viewBox="0 0 34 26" className="india-cargo-drop__crate">
                    <rect x="1.4" y="8" width="31" height="17" rx="3" fill="#B5651D" stroke="#FFFFFF" strokeWidth="1.6" />
                    <path d="M1.4,16.5 L32.4,16.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
                    <circle cx="10" cy="6.5" r="5" fill="#FFA726" stroke="#FFFFFF" strokeWidth="1.2" />
                    <circle cx="21" cy="5.5" r="5.6" fill="#FB8C00" stroke="#FFFFFF" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 5. SIDE CORNER BADGE: IMPORTED VALENCIA ORANGE */}
            <div className="valencia-corner-badge">
              <img src="/assets/orange-slice-fresh.png" alt="Imported Valencia Oranges" className="valencia-orange-img" />
              <div className="valencia-text">
                <span className="valencia-label">IMPORTED</span>
                <span className="valencia-title">VALENCIA ORANGE</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WAVE TRANSITION: Brand Statement -> How It Works */}
      <FluidDivider3 bg="var(--color-cream)" fill="var(--color-white)" />

      {/* ===== SECTION 3: HOW IT WORKS (STICKY STORYBOARD / PROCESS) ===== */}
      <section className="how-it-works">
        <div className="container">
          <div className="how-it-works__sticky-layout">

            {/* Left: Sticky Image Showcase */}
            <div className="how-it-works__visual-side">
              <div className="how-it-works__mobile-tabs">
                {HOW_IT_WORKS_STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`mobile-step-tab ${activeStep === idx ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveStep(idx);
                      const el = document.querySelector(`[data-step-index="${idx}"]`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    Step 0{idx + 1}
                  </button>
                ))}
              </div>
              <div className="how-it-works__visual-container">
                <AnimatePresence mode="wait">
                  {HOW_IT_WORKS_STEPS.map((step, idx) => {
                    let imgPath = `/assets/step-${idx + 1}.png`;
                    if (idx === 0) imgPath = '/assets/step-1.jpg';
                    if (idx === 1) imgPath = '/assets/step-2.jpg';
                    if (idx === 2) imgPath = '/assets/step-3.jpg';
                    if (idx === 3) imgPath = '/assets/step-4.jpg';

                    return activeStep === idx && (
                      <motion.div
                        key={idx}
                        className="how-it-works__image-wrapper"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={imgPath}
                          alt={step.title}
                          className="how-it-works__story-image"
                          loading="lazy"
                        />
                        <div className="how-it-works__step-indicator">Step 0{idx + 1}</div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Scrolling Content Blocks */}
            <div className="how-it-works__text-side">
              <div className="how-it-works__scroll-header">
                <span className="label">Process</span>
                <h2 className="how-it-works__title font-serif">HOW JUICETAP <span style={{ color: 'var(--color-primary)' }}>WORKS</span></h2>
                <p className="how-it-works__subtitle">From orange to your cup in less than a minute.</p>
              </div>

              <div className="how-it-works__text-blocks">
                {HOW_IT_WORKS_STEPS.map((step, idx) => (
                  <div
                    key={step.step}
                    className={`how-it-works__story-text-block ${activeStep === idx ? 'is-active' : ''}`}
                    data-step-index={idx}
                  >
                    <span className="how-it-works__step-num">0{idx + 1}</span>
                    <h3 className="how-it-works__step-title">{step.title}</h3>
                    <p className="how-it-works__step-desc">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WAVE TRANSITION: How It Works -> Ecosystem */}
      <FluidDivider1 bg="var(--color-white)" fill="#FAF6EE" />

      {/* ===== SECTION 3.5: THE JUICETAP ECOSYSTEM (PEELKRAFT VENTURE) ===== */}
      <section className="ecosystem">
        <div className="container">
          {/* Section Editorial Header */}
          <motion.div
            className="ecosystem__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.span className="ecosystem__badge" variants={textReveal}>
              SUSTAINABILITY & INNOVATION
            </motion.span>
            <motion.h2 className="ecosystem__title font-serif" variants={textReveal}>
              From Every Drop to Something More.
            </motion.h2>
            <motion.p className="ecosystem__intro" variants={textReveal}>
              JuiceTap doesn't just serve fresh juice. We are building a smarter circular system where what remains after every glass can become something valuable. Through PeelKraft, orange peel byproducts receive a second life as premium upcycled foods and sustainable innovations.
            </motion.p>
          </motion.div>

          {/* Authentic Circular Journey (Real JuiceTap Machine -> Transport -> Eco Manufacturing -> Final PeelKraft Products) */}
          <motion.div
            className="ecosystem__journey"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="journey-line" />

            <div className="journey-step">
              <div className="journey-step__img-frame">
                <img src="/assets/juicetap-real-machine.jpg" alt="Collect Orange Peels from JuiceTap Machine" className="journey-step__img" />
                <span className="journey-step__num">01</span>
              </div>
              <div className="journey-step__text">
                <h4 className="journey-step__title">Collect Orange Peels</h4>
                <p className="journey-step__desc">Harvested directly from JuiceTap machines</p>
              </div>
            </div>

            <div className="journey-step">
              <div className="journey-step__img-frame">
                <img src="/assets/peel-transport.png" alt="Transport Peels to PeelKraft Manufacturing Facility" className="journey-step__img" />
                <span className="journey-step__num">02</span>
              </div>
              <div className="journey-step__text">
                <h4 className="journey-step__title">Transport to Manufacturing</h4>
                <p className="journey-step__desc">Sent to PeelKraft facility for eco processing</p>
              </div>
            </div>

            <div className="journey-step">
              <div className="journey-step__img-frame">
                <img src="/assets/peel-manufacturing.png" alt="Sustainable Upcycling & Manufacturing" className="journey-step__img" />
                <span className="journey-step__num">03</span>
              </div>
              <div className="journey-step__text">
                <h4 className="journey-step__title">Sustainable Manufacturing</h4>
                <p className="journey-step__desc">Extracted & upcycled with zero waste</p>
              </div>
            </div>

            <div className="journey-step journey-step--highlight">
              <div className="journey-step__img-frame">
                <img src="/assets/peelkraft-product.jpg" alt="Finished PeelKraft Products" className="journey-step__img" />
                <span className="journey-step__num">04</span>
              </div>
              <div className="journey-step__text">
                <h4 className="journey-step__title">Made PeelKraft Products</h4>
                <p className="journey-step__desc">Transformed into valuable organic goods</p>
              </div>
            </div>
          </motion.div>

          {/* Main PeelKraft Brand Story Card */}
          <motion.div
            className="ecosystem__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="ecosystem__card-grid">

              {/* Left Column: Brand Story & CTA */}
              <div className="ecosystem__card-content">
                <div className="ecosystem__brand-tag">
                  <span className="brand-dot" /> A JUICETAP VENTURE
                </div>

                <div className="ecosystem__logo-wrap">
                  <img
                    src="/assets/peelkraft-logo.png"
                    alt="PeelKraft Official Logo"
                    className="ecosystem__brand-logo-img"
                  />
                  <span className="ecosystem__tagline">From Waste to Wonder</span>
                </div>

                <p className="ecosystem__card-desc">
                  PeelKraft transforms orange peel byproducts from JuiceTap into innovative, sustainable products — turning waste into something valuable.
                </p>

                <div className="ecosystem__card-features">
                  <div className="ecosystem__feature-item">
                    <span className="feature-bullet" /> 100% Upcycled Orange Peels
                  </div>
                  <div className="ecosystem__feature-item">
                    <span className="feature-bullet" /> Zero-Waste Circular Economy
                  </div>
                  <div className="ecosystem__feature-item">
                    <span className="feature-bullet" /> Sustainable Food & Eco Innovation
                  </div>
                </div>

                <div className="ecosystem__cta-row">
                  <Button
                    href="https://www.peelkraft.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="lg"
                    className="btn-peelkraft"
                  >
                    Explore PeelKraft <span className="btn-arrow">→</span>
                  </Button>
                </div>
              </div>

              {/* Right Column: Commercial Product Showcase */}
              <div className="ecosystem__card-visual">
                <div className="ecosystem__product-showcase">
                  <div className="showcase-header">
                    <span className="showcase-tag">PEELKRAFT INNOVATION</span>
                    <span className="showcase-status">CIRCULAR MODEL</span>
                  </div>

                  <div className="showcase-body">
                    <div className="showcase-img-container">
                      <img
                        src="/assets/peelkraft-product.jpg"
                        alt="PeelKraft Orange Peel Candy Zesty Mint"
                        className="showcase-product-img"
                      />
                    </div>
                    <h4 className="showcase-title">Orange Peel Candy</h4>
                    <p className="showcase-desc">Zesty Mint — Crafted from 100% pure JuiceTap upcycled orange peels.</p>
                  </div>

                  <div className="showcase-footer">
                    <span className="showcase-footer__leaf-dot" />
                    <span>Powered by JuiceTap Byproduct Harvest</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* WAVE TRANSITION: Ecosystem -> Smart Showcase */}
      <FluidDivider5 bg="#FAF6EE" fill="#0F381E" />

      {/* ===== SECTION 4: SMART SHOWCASE (DARK SECTION) ===== */}
      <section className="machine-showcase section-dark">
        <div className="container">
          <div className="machine-showcase__header-center">
            <span className="label" style={{ color: 'var(--color-primary-light)' }}>Smart. Hygienic. Automatic.</span>
            <h2 className="font-serif text-white">The Future of Fresh Juice</h2>
            <p className="text-white-opaque">JuiceTap machines bring you 100% natural orange juice with zero human touch and maximum hygiene.</p>
          </div>

          <div className="machine-showcase__editorial-layout">
            {/* Left Features list */}
            <div className="machine-showcase__side-col left-col">
              {MACHINE_FEATURES.slice(0, 3).map((feat) => {
                const renderFeatureIcon = (title) => {
                  const props = { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#FFB347", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
                  switch (title) {
                    case 'Smart Vending':
                      return (
                        <svg {...props}>
                          <rect x="4" y="2" width="16" height="20" rx="2" />
                          <line x1="8" y1="6" x2="16" y2="6" />
                          <line x1="8" y1="10" x2="12" y2="10" />
                          <circle cx="16" cy="16" r="1.5" fill="#FFB347" />
                        </svg>
                      );
                    case 'Automated Squeezing':
                      return (
                        <svg {...props}>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v10M7 12h10" />
                          <circle cx="12" cy="12" r="3" fill="#FFB347" opacity="0.5" />
                        </svg>
                      );
                    case 'Contactless Operation':
                      return (
                        <svg {...props}>
                          <path d="M12 2a10 10 0 0 1 10 10" />
                          <path d="M12 6a6 6 0 0 1 6 6" />
                          <path d="M12 10a2 2 0 0 1 2 2" />
                          <path d="M6.5 19.5L12 14l3.5 3.5" />
                        </svg>
                      );
                    default:
                      return null;
                  }
                };
                return (
                  <div key={feat.title} className="machine-showcase__feature-box text-right">
                    <div className="feature-box__content">
                      <h4 className="text-white">{feat.title}</h4>
                      <p className="text-white-opaque">{feat.description}</p>
                    </div>
                    <div className="feature-box__icon-wrapper">
                      {renderFeatureIcon(feat.title)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Machine Image */}
            <div className="machine-showcase__center-col">
              <div className="machine-showcase__circle-glow" />
              <img
                src="/assets/hero-machine.png"
                alt="JuiceTap Smart Vending Machine"
                className="machine-showcase__center-image"
                loading="lazy"
              />
            </div>

            {/* Right Features list */}
            <div className="machine-showcase__side-col right-col">
              {MACHINE_FEATURES.slice(3, 6).map((feat) => {
                const renderFeatureIcon = (title) => {
                  const props = { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#FFB347", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
                  switch (title) {
                    case 'Fresh Juice Dispensing':
                      return (
                        <svg {...props}>
                          <path d="M7 21h10l1-15H6L7 21z" />
                          <path d="M6 6h12" />
                          <path d="M12 2v4" />
                          <path d="M10 12c1 1 3 1 4 0" />
                        </svg>
                      );
                    case 'Automatic Sealing':
                      return (
                        <svg {...props}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      );
                    case 'Real-time Monitoring':
                      return (
                        <svg {...props}>
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      );
                    default:
                      return null;
                  }
                };
                return (
                  <div key={feat.title} className="machine-showcase__feature-box text-left">
                    <div className="feature-box__icon-wrapper">
                      {renderFeatureIcon(feat.title)}
                    </div>
                    <div className="feature-box__content">
                      <h4 className="text-white">{feat.title}</h4>
                      <p className="text-white-opaque">{feat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Button to="/machine" variant="primary" className="btn-editorial" size="md">
              Discover More <span style={{ marginLeft: '4px' }}>→</span>
            </Button>
          </div>
        </div>
      </section>

      {/* WAVE TRANSITION: Showcase -> Locations */}
      <FluidDivider5 bg="#0F381E" fill="var(--color-cream)" />

      {/* ===== SECTION 5: WHERE FRESHNESS LIVES (LOCATIONS) ===== */}
      <section className="locations-preview">
        <div className="container">
          <div className="locations-preview__header-row">
            <div>
              <span className="label">Network</span>
              <h2 className="font-serif">WHERE FRESHNESS LIVES</h2>
              <p>Find JuiceTap machines near you.</p>
            </div>
            <div>
              <Button to="/locations" className="btn-editorial-outline" size="md">
                View All Locations
              </Button>
            </div>
          </div>

          <div className="locations-preview__cards-grid">
            {locations.slice(0, 6).map((loc) => {
              return (
                <div key={loc.city} className="locations-preview__card-item">
                  <div className="locations-preview__card-thumb">
                    <img src={loc.image || '/assets/machine-office.png'} alt={loc.city} loading="lazy" />
                    <span className="locations-preview__card-city-tag">📍 {loc.state}</span>
                  </div>
                  <div className="locations-preview__card-body">
                    <div className="locations-preview__card-header">
                      <h3>{loc.city}</h3>
                      <span className={`locations-badge badge-${loc.status || 'available'}`}>
                        Available Now
                      </span>
                    </div>
                    <p className="locations-preview__card-desc">{loc.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WAVE TRANSITION: Locations -> Business Banner */}
      <FluidDivider1 bg="var(--color-cream)" fill="var(--color-white)" />

      {/* ===== SECTION 6: BUSINESS BANNER ===== */}
      <section className="business-preview">
        <div className="container">
          <div className="business-preview__banner-wrap">
            <div className="business-preview__banner-grid">

              <div className="business-preview__banner-text">
                <span className="label" style={{ color: 'rgba(255,255,255,0.9)' }}>Franchise Opportunity</span>
                <h2 className="font-serif text-white">Own a JuiceTap<br />Franchise</h2>
                <p className="text-white-opaque">Deploy our autonomous fresh-squeezed juice machines in offices, hospitals, shopping malls, and transit terminals.</p>

                {/* 3 info badges */}
                <div className="business-preview__badge-row">
                  <div className="business-preview__badge-card">
                    <strong>High Footfall</strong>
                    <span>More Revenue</span>
                  </div>
                  <div className="business-preview__badge-card">
                    <strong>24/7</strong>
                    <span>Passive Income</span>
                  </div>
                  <div className="business-preview__badge-card">
                    <strong>Low</strong>
                    <span>Operational Cost</span>
                  </div>
                </div>

                <div className="business-preview__banner-actions">
                  <Button to="/business" className="btn-hero-primary" size="md">
                    Become a Franchisee <span style={{ marginLeft: '4px' }}>→</span>
                  </Button>
                </div>
              </div>

              <div className="business-preview__banner-visual">
                <img
                  src="/assets/machine-office.png"
                  alt="JuiceTap Machine Franchise Mockup"
                  className="business-preview__banner-img"
                  loading="lazy"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===== GOOGLE REVIEWS SECTION ===== */}
      <section className="google-reviews-section">
        <div className="container">
          <div className="google-reviews-card">
            <div className="google-reviews-header">
              <span className="label">Customer Reviews</span>
              <h2 className="font-serif">Google Reviews</h2>
              <p className="google-reviews-desc">
                See what our customers are saying about JuiceTap on Google or share your own experience with us.
              </p>
            </div>

            <div className="google-reviews-actions">
              <a
                href={GOOGLE_BUSINESS_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-google-primary"
                aria-label="Read JuiceTap reviews on Google"
              >
                <span>Read Reviews on Google</span>
                <span className="btn-arrow">↗</span>
              </a>
              <a
                href={GOOGLE_BUSINESS_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-google-outline"
                aria-label="Write a review for JuiceTap on Google"
              >
                <span>Write a Review on Google</span>
                <span className="btn-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== APP DOWNLOAD SECTION ===== */}
      <AppDownload />

      {/* ===== CONTACT CTA ===== */}
      <section className="contact-cta">
        <div className="container">
          <div className="contact-cta__layout">
            <motion.div
              className="contact-cta__card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleUp}
            >
              <span className="label">Connect With Us</span>
              <h2 className="font-serif" style={{ marginBottom: 'var(--space-md)' }}>Let's Talk Freshness.</h2>
              <p className="contact-cta__desc" style={{ marginBottom: 'var(--space-xl)' }}>
                Have a question, interested in a franchise, or looking for a JuiceTap location? Reach out by filling the form below, and we will connect with you via WhatsApp.
              </p>

              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>


    </>
  );
}
