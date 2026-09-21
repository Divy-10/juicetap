/* ================================================================
   JUICETAP — Meet Champion
   ----------------------------------------------------------------
   A premium, scroll-driven brand experience hosted by Champion, the
   JuiceTap mascot. One continuous story:

     Meet Champion → he introduces himself → he reveals each benefit
     as its own cinematic scene → Champion's Promise → the reward →
     a live, personalised certificate → celebrate.

   Built on the site's own system: PageShell, SEO, Framer Motion,
   Citrus visuals, existing Champion PNGs and the existing certificate
   + email pipeline. Motion is transform/opacity only, reduced-motion
   aware, and the mascot always sits inside a padded, overflow-visible
   stage so nothing is ever clipped.
   ================================================================ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SEO from '../../components/SEO';
import PageShell from '../../components/PageShell/PageShell';
import { Reveal, FloatingElement } from '../../components/Motion/Motion';
import { CitrusGlow, CitrusField, CitrusDivider } from '../../components/Citrus/Citrus';
import {
  buildCertificatePdf,
  renderCertificateDataUrl,
  downloadBlob,
  slugifyName,
} from './certificate';
import { sendCertificateByEmail, isEmailConfigured } from '../../services/certificateService';

import waveMascot from '../../assets/mascot-hero.png';

const STAND_MASCOT = '/video/hero-mascot.png';
const EASE = [0.22, 1, 0.36, 1];

/* ---------------------------------------------------------------- *
   Benefit story data — each is a distinct "scene"
 * ---------------------------------------------------------------- */
const BENEFITS = [
  {
    id: 'natural',
    num: '01',
    title: 'Natural',
    statement: 'I’m 100% Natural.',
    emoji: '🍊',
    speech: 'I’m 100% natural — just the goodness of real oranges!',
    detail: 'No concentrates. No artificial flavours. Just premium, naturally ripened oranges, pressed into every cup.',
    mascot: STAND_MASCOT,
    pose: 'point',
  },
  {
    id: 'sugar',
    num: '02',
    title: 'No Sugar',
    statement: 'I Have No Added Sugar.',
    emoji: '🚫',
    speech: 'I don’t need added sugar. The natural sweetness of oranges is enough!',
    detail: 'Zero added sugar, zero artificial sweeteners — the sweetness comes straight from the fruit.',
    mascot: waveMascot,
    pose: 'thumbs',
  },
  {
    id: 'preservatives',
    num: '03',
    title: 'No Preservatives',
    statement: 'I Have No Preservatives.',
    emoji: '✨',
    speech: 'I stay simple and fresh — no preservatives added!',
    detail: 'Squeezed and served on the spot, so there’s nothing to preserve. Nothing unnecessary. Just freshness.',
    mascot: STAND_MASCOT,
    pose: 'think',
  },
  {
    id: 'hygienic',
    num: '04',
    title: 'Hygienic',
    statement: 'I’m Fully Hygienic.',
    emoji: '🧼',
    speech: 'I’m fully hygienic — freshness and hygiene go hand in hand!',
    detail: 'A fully automated, contactless machine handles every step — from orange to sealed cup, untouched by hand.',
    mascot: STAND_MASCOT,
    pose: 'excited',
  },
  {
    id: 'seconds',
    num: '05',
    title: 'Under 60 Sec',
    statement: 'I’m Ready in Under 60 Seconds!',
    emoji: '⚡',
    speech: 'I’m ready in under 60 seconds. Watch this!',
    detail: 'From whole orange to a fresh, sealed cup in under a minute. Told you — fresh juice, incredibly fast.',
    mascot: waveMascot,
    pose: 'celebrate',
  },
];

const PROMISE_ITEMS = [
  { icon: '🍊', label: 'I’m 100% Natural', note: 'Real oranges, nothing else.' },
  { icon: '🚫', label: 'I Have No Added Sugar', note: 'Naturally sweet, always.' },
  { icon: '✨', label: 'I Have No Preservatives', note: 'Fresh, never chemical.' },
  { icon: '🧼', label: 'I’m Fully Hygienic', note: 'Contactless & clean.' },
  { icon: '⚡', label: 'I’m Under 60 Seconds', note: 'Fresh, incredibly fast.' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[\p{L}][\p{L}\s.'-]{1,49}$/u;

/* ================================================================ */
export default function MeetChampion() {
  const reduced = useReducedMotion();

  const scrollTo = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },
    [reduced]
  );

  return (
    <PageShell name="champion">
      <SEO
        title="Meet Champion – JuiceTap's Fresh Orange Mascot"
        description="Meet Champion, the official mascot of JuiceTap! Discover Champion's story, learn about 100% natural Valencia orange juice, and claim your personalized JuiceTap Champion certificate."
        path="/meet-champion"
        ogImage="/assets/champion-wave.png"
      />

      <ChampionHero reduced={reduced} onDiscover={() => scrollTo('benefits')} />
      <CitrusDivider variant="peel" from="#E86F10" to="#FFF9F2" />
      <BenefitStory reduced={reduced} />
      <CitrusDivider variant="arc" from="#FFF9F2" to="#123B20" />
      <ChampionsPromise reduced={reduced} onClaim={() => scrollTo('certificate')} />
      <CitrusDivider variant="pour" from="#0A2A16" to="#FFF9F2" />
      <CertificateSection reduced={reduced} />
    </PageShell>
  );
}

/* ================================================================
   1 — HERO
   ================================================================ */
function ChampionHero({ reduced, onDiscover }) {
  const [showBubble, setShowBubble] = useState(reduced);

  useEffect(() => {
    if (reduced) return undefined;
    const t = setTimeout(() => setShowBubble(true), 950);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <section className="champion-hero" id="champion-top">
      <CitrusGlow size={560} top="-140px" left="-120px" color="rgba(240,129,33,0.24)" />
      <CitrusGlow size={480} bottom="-160px" right="-90px" color="rgba(46,125,50,0.13)" duration={15} />
      {!reduced && <CitrusField variant="particles" density={9} tone="light" />}

      <div className="champion-hero__inner container">
        <div className="champion-hero__grid">
          <div className="champion-hero__copy">
            <Reveal variant="up" className="champion-badge">
              <span className="champion-badge__dot" /> MEET CHAMPION
            </Reveal>
            <Reveal as="h1" variant="up" delay={0.05} className="champion-hero__title">
              Meet Champion<span className="champion-hero__dot">.</span>
            </Reveal>
            <Reveal as="p" variant="up" delay={0.12} className="champion-hero__lead">
              Your little guide to fresh, natural orange goodness.
            </Reveal>

            <Reveal variant="up" delay={0.2} className="champion-hero__actions">
              <button type="button" className="btn btn-primary btn-lg champion-cta" onClick={onDiscover}>
                Let&rsquo;s Find Out <span className="btn-arrow">→</span>
              </button>
            </Reveal>

            <Reveal variant="up" delay={0.28} className="champion-hero__chips" aria-hidden="true">
              {BENEFITS.map((b, i) => (
                <FloatingElement
                  key={b.id}
                  className="champion-hero__chip"
                  amplitude={7}
                  rotate={0}
                  duration={5 + i * 0.4}
                  delay={i * 0.3}
                >
                  {b.emoji} {b.title}
                </FloatingElement>
              ))}
            </Reveal>
          </div>

          <div className="champion-hero__stage">
            <div className="champion-stage champion-stage--hero">
              <div className="champion-orbit" aria-hidden="true">
                {!reduced &&
                  [0, 1, 2, 3].map((i) => (
                    <FloatingElement
                      key={i}
                      className={`champion-orbit__slice champion-orbit__slice--${i + 1}`}
                      amplitude={12}
                      rotate={10}
                      duration={6 + i}
                      delay={i * 0.5}
                    >
                      <OrangeSliceSVG />
                    </FloatingElement>
                  ))}
              </div>

              <AnimatePresence>
                {showBubble && (
                  <motion.div
                    className="champion-bubble champion-bubble--hero"
                    initial={reduced ? false : { opacity: 0, y: 14, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    Hey! I&rsquo;m Champion! <span aria-hidden="true">🍊</span>
                    <br />
                    Want to know what makes me different?
                    <span className="champion-bubble__tail" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="champion-figure"
                initial={reduced ? false : { opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.85, ease: EASE }}
              >
                <motion.img
                  src={waveMascot}
                  alt="Champion, the JuiceTap mascot, waving hello"
                  className="champion-img"
                  animate={reduced ? undefined : { y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  draggable="false"
                />
              </motion.div>
              <div className="champion-stage__shadow" />
            </div>
          </div>
        </div>

        <button type="button" className="champion-scroll-hint" onClick={onDiscover} aria-label="Start the story">
          <span>Scroll to begin the story</span>
          <span className="champion-scroll-hint__chevron">⌄</span>
        </button>
      </div>
    </section>
  );
}

/* ================================================================
   2 — BENEFIT STORY (sticky Champion + scroll-driven scenes)
   ================================================================ */
function BenefitStory({ reduced }) {
  const [active, setActive] = useState(0);
  const sceneRefs = useRef([]);
  const b = BENEFITS[active];

  const handleSelectStep = (index) => {
    setActive(index);
    if (sceneRefs.current[index]) {
      sceneRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section className="champion-story" id="benefits">
      <div className="champion-story__intro container">
        <Reveal variant="up" className="champion-section-head">
          <span className="champion-eyebrow">CHAMPION SPEAKS</span>
          <h2 className="champion-h2">Let me tell you about myself</h2>
          <p className="champion-sub">Explore my 5 fresh promises — click or scroll the steps below. 🍊</p>
        </Reveal>
      </div>

      <div className="champion-story__inner container">
        {/* Pinned stage — Champion + live scene FX + progress rail */}
        <div className="champion-story__stage">
          <ProgressRail active={active} onSelect={handleSelectStep} />

          <div className="champion-stage champion-stage--story">
            <div className="champion-scene-fx" aria-hidden="true">
              <AnimatePresence mode="wait">
                <SceneFX key={b.id} id={b.id} reduced={reduced} />
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={b.id}
                className="champion-bubble champion-bubble--story"
                initial={reduced ? false : { opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {b.speech}
                <span className="champion-bubble__tail" />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={b.id}
                className={`champion-figure champion-figure--${b.pose}`}
                initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <img src={b.mascot} alt={`Champion presenting ${b.title}`} className="champion-img" draggable="false" />
              </motion.div>
            </AnimatePresence>
            <div className="champion-stage__shadow" />
          </div>
        </div>

        {/* Scrollable text steps container */}
        <div className="champion-story__scenes-wrapper">
          <div className="champion-story__scenes-scroll">
            {BENEFITS.map((item, i) => (
              <motion.article
                key={item.id}
                ref={(el) => (sceneRefs.current[i] = el)}
                className={`story-scene ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
                onViewportEnter={() => setActive(i)}
                viewport={{ amount: 0.55 }}
              >
                <div className="story-scene__inner">
                  <div className="story-scene__head-row">
                    <span className="story-scene__num">{item.num}</span>
                    <span className="story-scene__badge">{item.title}</span>
                  </div>
                  <h3 className="story-scene__title">
                    {item.statement} <span className="story-scene__emoji" aria-hidden="true">{item.emoji}</span>
                  </h3>
                  <p className="story-scene__detail">{item.detail}</p>
                  <p className="story-scene__quote">
                    <span className="story-scene__quote-label">Champion says</span>
                    &ldquo;{item.speech}&rdquo;
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Quick step navigation indicator */}
          <div className="champion-story__nav-dots">
            {BENEFITS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`champion-story__dot-btn ${i === active ? 'is-active' : ''}`}
                onClick={() => handleSelectStep(i)}
                aria-label={`Go to step ${item.num}: ${item.title}`}
              >
                <span className="champion-story__dot-num">{item.num}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressRail({ active, onSelect }) {
  return (
    <div className="champion-rail" role="tablist" aria-label="Benefit steps">
      {BENEFITS.map((b, i) => (
        <button
          type="button"
          key={b.id}
          className={`champion-rail__step ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
          onClick={() => onSelect && onSelect(i)}
        >
          <span className="champion-rail__dot">{b.num}</span>
          <span className="champion-rail__label">{b.title}</span>
          {i < BENEFITS.length - 1 && <span className="champion-rail__line" />}
        </button>
      ))}
    </div>
  );
}

/* ---- Per-scene cinematic visuals (CSS/SVG, only the active one runs) ---- */
function SceneFX({ id, reduced }) {
  const base = {
    initial: reduced ? false : { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, scale: 1.05 },
    transition: { duration: 0.5, ease: EASE },
  };

  if (id === 'natural') {
    return (
      <motion.div className="scenefx scenefx--natural" {...base}>
        <div className={`scenefx__orange ${reduced ? '' : 'is-spin'}`}>
          <OrangeSliceSVG />
        </div>
        <span className="scenefx__glass"><span className={`scenefx__juice ${reduced ? 'is-full' : 'is-fill'}`} /></span>
        {!reduced && [...Array(6)].map((_, i) => <span key={i} className={`scenefx__leaf scenefx__leaf--${i + 1}`} />)}
      </motion.div>
    );
  }
  if (id === 'sugar') {
    return (
      <motion.div className="scenefx scenefx--sugar" {...base}>
        <div className="scenefx__noring" title="No Added Sugar">
          <SugarCancelIcon />
        </div>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`scenefx__cube scenefx__cube--${i + 1} ${reduced ? '' : 'is-reject'}`} />
        ))}
        <span className="scenefx__stamp scenefx__stamp--sugar">NO ADDED SUGAR</span>
      </motion.div>
    );
  }
  if (id === 'preservatives') {
    return (
      <motion.div className="scenefx scenefx--preservatives" {...base}>
        {[...Array(5)].map((_, i) => <span key={i} className={`scenefx__mote scenefx__mote--${i + 1} ${reduced ? '' : 'is-fade'}`} />)}
        <span className="scenefx__sparkle" />
      </motion.div>
    );
  }
  if (id === 'hygienic') {
    return (
      <motion.div className="scenefx scenefx--hygienic" {...base}>
        <span className="scenefx__shield">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </span>
        {!reduced && [...Array(4)].map((_, i) => <span key={i} className={`scenefx__spark scenefx__spark--${i + 1}`} />)}
        <span className="scenefx__stamp scenefx__stamp--clean">CLEAN ✓</span>
      </motion.div>
    );
  }
  // seconds
  return (
    <motion.div className="scenefx scenefx--seconds" {...base}>
      <Countdown reduced={reduced} />
      {!reduced && [...Array(3)].map((_, i) => <span key={i} className={`scenefx__speed scenefx__speed--${i + 1}`} />)}
      <span className="scenefx__glass scenefx__glass--sec"><span className={`scenefx__juice ${reduced ? 'is-full' : 'is-fill-fast'}`} /></span>
    </motion.div>
  );
}

function Countdown({ reduced }) {
  const [n, setN] = useState(60);
  useEffect(() => {
    if (reduced) {
      setN(0);
      return undefined;
    }
    setN(60);
    const seq = [60, 45, 30, 15, 5, 0];
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      if (i >= seq.length) {
        clearInterval(t);
        return;
      }
      setN(seq[i]);
    }, 550);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <div className="scenefx__count">
      <span className="scenefx__count-num">{String(n).padStart(2, '0')}</span>
      <span className="scenefx__count-unit">{n === 0 ? 'Fresh! ⚡' : 'seconds'}</span>
    </div>
  );
}

/* ================================================================
   3 — CHAMPION'S PROMISE (circular badges around Champion)
   ================================================================ */
function ChampionsPromise({ reduced, onClaim }) {
  const [hover, setHover] = useState(null);

  return (
    <section className="champion-promise" id="promise">
      {!reduced && <CitrusField variant="bubbles" density={10} tone="light" />}
      <CitrusGlow size={620} top="4%" left="50%" color="rgba(240,129,33,0.18)" />

      <div className="container">
        <Reveal variant="up" className="champion-section-head champion-section-head--light">
          <span className="champion-eyebrow champion-eyebrow--light">CHAMPION&rsquo;S PROMISE</span>
          <h2 className="champion-h2 champion-h2--light">Freshness you can see. Goodness you can trust.</h2>
        </Reveal>

        <div className="champion-orbit-wrap">
          <div className="champion-orbit-center">
            <FloatingElement amplitude={12} rotate={3} duration={6}>
              <div className="champion-stage champion-stage--promise">
                <img
                  src={waveMascot}
                  alt="Champion presenting the JuiceTap promise"
                  className="champion-img"
                  draggable="false"
                />
                <div className="champion-stage__shadow" />
              </div>
            </FloatingElement>
            <AnimatePresence>
              {hover !== null && (
                <motion.div
                  className="champion-orbit-note"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {PROMISE_ITEMS[hover].note}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ul className="champion-badges">
            {PROMISE_ITEMS.map((item, i) => (
              <Reveal
                as="li"
                key={item.label}
                variant="scale"
                delay={i * 0.08}
                className={`champion-badge-orb champion-badge-orb--${i + 1}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
              >
                <span className="champion-badge-orb__icon" aria-hidden="true">{item.icon}</span>
                <span className="champion-badge-orb__label">{item.label}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal variant="up" delay={0.15} className="champion-promise__reward">
          <p className="champion-promise__whisper">Now you know all my secrets&hellip;</p>
          <p className="champion-promise__ask">Ready to become a JuiceTap Champion?</p>
          <button type="button" className="btn btn-primary btn-lg champion-cta" onClick={onClaim}>
            Claim My Champion Certificate <span className="btn-arrow">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   4 — CERTIFICATE (live preview + personalization + generation)
   ================================================================ */
const PLEDGE_ITEMS = [
  { id: 'natural', icon: '🍊', text: 'I promise to drink 100% natural fruit juice.' },
  { id: 'sugar', icon: '🚫', text: 'I promise not to add any extra sugar.' },
  { id: 'preservatives', icon: '✨', text: 'I promise to choose fresh juice with zero preservatives.' },
  { id: 'hygienic', icon: '🧼', text: 'I promise to always prefer clean & hygienic juice.' },
];

const initialForm = { name: '', email: '', city: '', consent: false };
const GEN_STEPS = ['Personalizing', 'Adding Your Name', 'Finalizing', 'Ready!'];

function CertificateSection({ reduced }) {
  const [pledges, setPledges] = useState({
    natural: false,
    sugar: false,
    preservatives: false,
    hygienic: false,
  });
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [genStep, setGenStep] = useState(0);
  const [result, setResult] = useState(null); // { blob, previewUrl, name, emailed }
  const [serverError, setServerError] = useState('');
  const [livePreview, setLivePreview] = useState('');
  const lastKeyRef = useRef('');
  const emailConfigured = isEmailConfigured();

  const pledgedCount = Object.values(pledges).filter(Boolean).length;
  const isAllPledged = pledgedCount === PLEDGE_ITEMS.length;

  const handleTogglePledge = (id) => {
    setPledges((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (errors.pledge) setErrors((er) => ({ ...er, pledge: '' }));
      return next;
    });
  };

  const handleToggleAllPledges = () => {
    const nextVal = !isAllPledged;
    setPledges({
      natural: nextVal,
      sugar: nextVal,
      preservatives: nextVal,
      hygienic: nextVal,
    });
    if (errors.pledge) setErrors((er) => ({ ...er, pledge: '' }));
  };

  /* Live certificate preview — debounced, cached images keep it cheap */
  useEffect(() => {
    if (status === 'success') return undefined;
    let cancelled = false;
    const t = setTimeout(() => {
      renderCertificateDataUrl({ name: form.name.trim() || 'Your Name', city: form.city.trim() })
        .then((url) => {
          if (!cancelled) setLivePreview(url);
        })
        .catch(() => {});
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [form.name, form.city, status]);

  const validate = () => {
    const e = {};
    if (!isAllPledged) e.pledge = 'Please tick all 4 promises above to unlock your certificate.';
    const name = form.name.trim();
    if (!name) e.name = 'Please enter your name';
    else if (!NAME_RE.test(name)) e.name = 'Enter a valid name (letters only)';
    const email = form.email.trim();
    if (!email) e.email = 'Please enter your email';
    else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';
    if (!form.consent) e.consent = 'Please confirm to continue';
    return e;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    const eObj = validate();
    if (Object.keys(eObj).length) {
      setErrors(eObj);
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    const city = form.city.trim();
    const key = `${name.toLowerCase()}|${email.toLowerCase()}`;
    if (key === lastKeyRef.current && result) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    setServerError('');
    setGenStep(0);
    const stepTimer = setInterval(() => setGenStep((s) => Math.min(s + 1, GEN_STEPS.length - 1)), 560);
    const minShow = new Promise((res) => setTimeout(res, 2000));

    try {
      const build = (async () => {
        const { blob, jpegBase64 } = await buildCertificatePdf({ name, city });
        const previewUrl = `data:image/jpeg;base64,${jpegBase64}`;
        const pdfBase64 = await blobToBase64(blob);

        let emailed = false;
        let emailAttempted = false;
        let emailErrorMessage = '';

        if (emailConfigured) {
          emailAttempted = true;
          console.log('[Certificate] Attempting email send...');
          const res = await sendCertificateByEmail({
            email,
            name,
            city,
            certificatePdfBase64: pdfBase64,
            fileName: `JuiceTap-Champion-Certificate-${slugifyName(name)}.pdf`,
          });
          console.log('[Certificate] API response:', res);
          if (res.success) {
            emailed = true;
          } else {
            emailed = false;
            emailErrorMessage = res.error || res.message || 'Failed to send certificate email';
          }
        }

        return { blob, previewUrl, name, email, city, pdfBase64, emailed, emailAttempted, emailErrorMessage };
      })();

      const [payload] = await Promise.all([build, minShow]);
      clearInterval(stepTimer);

      if (payload.emailAttempted && !payload.emailed) {
        setServerError(payload.emailErrorMessage || 'Certificate was generated, but we couldn’t send the email. Please try again.');
        setStatus('error');
        return;
      }

      lastKeyRef.current = key;
      setResult(payload);
      setStatus('success');
      downloadBlob(payload.blob, `JuiceTap-Champion-Certificate-${slugifyName(name)}.pdf`);
    } catch (err) {
      clearInterval(stepTimer);
      setServerError(err && err.message ? err.message : 'Something went wrong generating your certificate.');
      setStatus('error');
    }
  };

  const reset = () => {
    setForm(initialForm);
    setPledges({ natural: false, sugar: false, preservatives: false, hygienic: false });
    setErrors({});
    setResult(null);
    setStatus('idle');
    lastKeyRef.current = '';
  };

  const previewSrc = status === 'success' ? result?.previewUrl : livePreview;

  return (
    <section className="champion-cert" id="certificate">
      <CitrusGlow size={520} top="-120px" right="-70px" color="rgba(240,129,33,0.18)" />
      {!reduced && status === 'success' && <CitrusField variant="bubbles" density={12} tone="light" />}

      <div className="container">
        <Reveal variant="up" className="champion-section-head">
          <span className="champion-eyebrow">YOUR REWARD</span>
          <h2 className="champion-h2">{status === 'success' ? 'Congratulations, Champion! 🏆' : 'Claim Your Certificate'}</h2>
          <p className="champion-sub">
            {status === 'success'
              ? 'Your personalised certificate is ready — see it below.'
              : 'Take your healthy juice promise below to unlock your personalised certificate.'}
          </p>
        </Reveal>

        {/* --- CHAMPION'S HEALTHY JUICE PROMISE CARD --- */}
        <Reveal variant="up" className="champion-oath-card">
          <div className="champion-oath-card__head">
            <div className="champion-oath-card__badge">
              <span className="champion-oath-card__emoji" aria-hidden="true">📜</span>
              <span className="champion-oath-card__eyebrow">HEALTHY HABIT PROMISE</span>
            </div>
            <h3 className="champion-oath-card__title">My Healthy Juice Promise 🍊</h3>
            <p className="champion-oath-card__desc">
              Tick these 4 simple steps to unlock your official Champion Certificate!
            </p>
          </div>

          <div className="champion-oath-grid">
            {PLEDGE_ITEMS.map((item) => {
              const isChecked = pledges[item.id];
              return (
                <label key={item.id} className={`champion-oath-item ${isChecked ? 'is-checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTogglePledge(item.id)}
                    className="champion-oath-item__input"
                  />
                  <span className="champion-oath-item__checkbox" aria-hidden="true">
                    {isChecked && <span className="champion-oath-item__check">✓</span>}
                  </span>
                  <span className="champion-oath-item__icon" aria-hidden="true">{item.icon}</span>
                  <span className="champion-oath-item__text">{item.text}</span>
                </label>
              );
            })}
          </div>

          <div className="champion-oath-card__footer">
            <label className={`champion-oath-all ${isAllPledged ? 'is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={isAllPledged}
                onChange={handleToggleAllPledges}
                className="champion-oath-item__input"
              />
              <span className="champion-oath-item__checkbox champion-oath-item__checkbox--all" aria-hidden="true">
                {isAllPledged && <span className="champion-oath-item__check">✓</span>}
              </span>
              <span className="champion-oath-all__text">
                <strong>Select All</strong> — I promise all 4! ✨
              </span>
            </label>

            <div className="champion-oath-status">
              {isAllPledged ? (
                <span className="champion-oath-status__badge is-done">
                  🎉 All Promises Checked! Certificate Unlocked 🏆
                </span>
              ) : (
                <span className="champion-oath-status__badge">
                  {pledgedCount} of {PLEDGE_ITEMS.length} Promises Checked
                </span>
              )}
            </div>
          </div>
          {errors.pledge && <div className="champion-oath-card__error" role="alert">{errors.pledge}</div>}
        </Reveal>

        <div className="champion-cert__layout">
          {/* LEFT — framed live preview */}
          <div className="champion-cert__preview-col">
            <div className={`champion-cert-frame ${reduced ? '' : 'is-shine'}`}>
              {previewSrc ? (
                <img src={previewSrc} alt="Your JuiceTap Champion certificate preview" className="champion-cert-frame__img" />
              ) : (
                <div className="champion-cert-frame__skeleton"><span /></div>
              )}
              {!reduced && (
                <>
                  <span className="champion-cert-frame__float champion-cert-frame__float--1" />
                  <span className="champion-cert-frame__float champion-cert-frame__float--2" />
                </>
              )}
            </div>
            <p className="champion-cert__preview-cap">
              {status === 'success' ? '🍊 Officially yours' : 'Live preview — updates as you type'}
            </p>
          </div>

          {/* RIGHT — form / generation / success */}
          <div className="champion-cert__action-col">
            <AnimatePresence mode="wait">
              {status === 'loading' ? (
                <motion.div
                  key="gen"
                  className="champion-gen"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="champion-gen__mascot">
                    <motion.img
                      src={waveMascot}
                      alt="Champion preparing your certificate"
                      className="champion-img"
                      animate={reduced ? undefined : { rotate: [-3, 3, -3] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      draggable="false"
                    />
                  </div>
                  <p className="champion-gen__say">Give me a moment&hellip; I&rsquo;m preparing your certificate!</p>
                  <ol className="champion-gen__steps">
                    {GEN_STEPS.map((s, i) => (
                      <li key={s} className={`champion-gen__step ${i <= genStep ? 'is-active' : ''} ${i < genStep ? 'is-done' : ''}`}>
                        <span className="champion-gen__step-dot">{i < genStep ? '✓' : i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ) : status === 'success' ? (
                <motion.div
                  key="success"
                  className="champion-success"
                  initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="champion-success__mascot">
                    <motion.img
                      src={waveMascot}
                      alt="Champion celebrating"
                      className="champion-img"
                      animate={reduced ? undefined : { y: [0, -14, 0], rotate: [-5, 5, -5] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      draggable="false"
                    />
                  </div>
                  <h3 className="champion-success__title">You&rsquo;re Officially a JuiceTap Champion! 🍊🏆</h3>
                  <p className="champion-success__text">
                    {result?.emailed
                      ? 'Your certificate is ready, and a copy has been sent to your email.'
                      : result?.emailAttempted
                        ? 'Your certificate is ready, but we couldn’t send the email right now — download it below.'
                        : 'Your certificate is ready and has been downloaded to your device.'}
                  </p>
                  <div className="champion-success__actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg champion-cta"
                      onClick={() =>
                        result && downloadBlob(result.blob, `JuiceTap-Champion-Certificate-${slugifyName(result.name)}.pdf`)
                      }
                    >
                      Download Certificate <span className="btn-arrow">↓</span>
                    </button>
                    <Link to="/" className="btn btn-secondary btn-lg">Explore JuiceTap</Link>
                    <button type="button" className="btn btn-ghost champion-success__restart" onClick={reset}>
                      Create another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="champion-cert__card"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <div className="champion-cert__card-head">
                    <span className="champion-cert__card-emoji" aria-hidden="true">🍊</span>
                    <div>
                      <h3>Make it yours</h3>
                      <p>Champion will personalise your certificate instantly.</p>
                    </div>
                  </div>

                  {!isAllPledged && (
                    <div className="champion-cert__lock-notice" role="alert">
                      🔒 Please tick the 4 promises above to unlock certificate creation.
                    </div>
                  )}

                  <form className="champion-form" onSubmit={handleSubmit} noValidate>
                    <div className="champion-field">
                      <label htmlFor="ch-name">Your Name *</label>
                      <input id="ch-name" name="name" type="text" value={form.name} onChange={onChange}
                        className={errors.name ? 'has-error' : ''} placeholder="e.g. Priya Sharma" autoComplete="name" maxLength={50} />
                      {errors.name && <span className="champion-error">{errors.name}</span>}
                    </div>
                    <div className="champion-field">
                      <label htmlFor="ch-email">Your Email *</label>
                      <input id="ch-email" name="email" type="email" value={form.email} onChange={onChange}
                        className={errors.email ? 'has-error' : ''} placeholder="you@email.com" autoComplete="email" />
                      {errors.email && <span className="champion-error">{errors.email}</span>}
                    </div>
                    <div className="champion-field">
                      <label htmlFor="ch-city">City <span className="champion-optional">(optional)</span></label>
                      <input id="ch-city" name="city" type="text" value={form.city} onChange={onChange}
                        placeholder="Your city" autoComplete="address-level2" maxLength={40} />
                    </div>

                    <label className={`champion-consent ${errors.consent ? 'has-error' : ''}`}>
                      <input type="checkbox" name="consent" checked={form.consent} onChange={onChange} />
                      <span>I confirm my details are correct{emailConfigured ? ' and agree to receive my certificate by email' : ''}.</span>
                    </label>
                    {errors.consent && <span className="champion-error champion-error--block">{errors.consent}</span>}

                    {status === 'error' && (
                      <div className="champion-form__server-error" role="alert">{serverError} Please try again.</div>
                    )}

                    <button type="submit" className={`btn btn-primary btn-lg champion-cta champion-form__submit ${!isAllPledged ? 'is-locked' : ''}`}>
                      {isAllPledged ? 'Get My Official Certificate ' : 'Tick Promises Above to Unlock '}
                      <span aria-hidden="true">{isAllPledged ? '🍊' : '🔒'}</span>
                    </button>
                    <p className="champion-form__note">
                      {emailConfigured
                        ? 'Instantly generated, downloaded, and emailed to you.'
                        : 'Instantly generated and downloaded to your device.'}
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
function OrangeSliceSVG() {
  return (
    <svg viewBox="0 0 100 100" className="orange-slice-svg" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="48" fill="#F08121" />
      <circle cx="50" cy="50" r="40" fill="#FFB861" />
      <circle cx="50" cy="50" r="35" fill="#FFE0B8" />
      {[...Array(8)].map((_, i) => {
        const a = (Math.PI * 2 * i) / 8;
        return (
          <path
            key={i}
            d={`M50 50 L${50 + Math.cos(a - 0.28) * 32} ${50 + Math.sin(a - 0.28) * 32} L${50 + Math.cos(a + 0.28) * 32} ${50 + Math.sin(a + 0.28) * 32} Z`}
            fill="#FFC978"
          />
        );
      })}
      <circle cx="50" cy="50" r="5" fill="#FFE7C4" />
    </svg>
  );
}

function SugarCancelIcon() {
  return (
    <svg viewBox="0 0 100 100" className="scenefx__sugar-svg" aria-hidden="true" focusable="false">
      <defs>
        <filter id="sugar-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#D32F2F" floodOpacity="0.3" />
        </filter>
        <linearGradient id="sugar-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF5350" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
        <linearGradient id="sugar-spoon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="sugar-cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="sugar-cube-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="sugar-cube-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="42" fill="#FFFFFF" opacity="0.96" filter="url(#sugar-glow)" />

      <g transform="translate(0, 1)">
        <path
          d="M18 78 Q32 66 41 54"
          fill="none"
          stroke="url(#sugar-spoon-grad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <ellipse cx="48" cy="48" rx="15" ry="11" fill="url(#sugar-spoon-grad)" transform="rotate(-28 48 48)" />
        <ellipse cx="48" cy="47" rx="13" ry="9" fill="#F8FAFC" transform="rotate(-28 48 48)" />

        <g transform="translate(36, 36)">
          <polygon points="8,0 16,4 8,8 0,4" fill="url(#sugar-cube-top)" stroke="#94A3B8" strokeWidth="0.8" />
          <polygon points="0,4 8,8 8,17 0,13" fill="url(#sugar-cube-left)" stroke="#94A3B8" strokeWidth="0.8" />
          <polygon points="8,8 16,4 16,13 8,17" fill="url(#sugar-cube-right)" stroke="#94A3B8" strokeWidth="0.8" />
        </g>

        <g transform="translate(45, 27)">
          <polygon points="8,0 16,4 8,8 0,4" fill="url(#sugar-cube-top)" stroke="#94A3B8" strokeWidth="0.8" />
          <polygon points="0,4 8,8 8,17 0,13" fill="url(#sugar-cube-left)" stroke="#94A3B8" strokeWidth="0.8" />
          <polygon points="8,8 16,4 16,13 8,17" fill="url(#sugar-cube-right)" stroke="#94A3B8" strokeWidth="0.8" />
        </g>
      </g>

      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#sugar-ring-grad)"
        strokeWidth="8"
      />
      <line
        x1="22"
        y1="22"
        x2="78"
        y2="78"
        stroke="url(#sugar-ring-grad)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const s = String(reader.result || '');
      resolve(s.includes(',') ? s.split(',')[1] : s);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
