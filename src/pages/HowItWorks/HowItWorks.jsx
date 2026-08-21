import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../../components/SEO';
import Button from '../../components/Button/Button';
import ProcessVideoStory from './ProcessVideoStory';
import PageShell from '../../components/PageShell/PageShell';
import { Reveal, TextReveal, FloatingElement } from '../../components/Motion/Motion';
import {
  CitrusField,
  CitrusGlow,
  CitrusDivider,
  OrangeSlice,
  LeafSprig,
} from '../../components/Citrus/Citrus';

/* How It Works storytelling: THE POUR.
   The hero literally performs the product — an orange above, a stream
   of juice falling, a glass filling below — then hands off to the
   step-by-step journey. */

function PouringGlass() {
  const reduced = useReducedMotion();

  return (
    <svg
      className="hiw-pour"
      viewBox="0 0 120 220"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hiwJuice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC072" />
          <stop offset="100%" stopColor="#E8720F" />
        </linearGradient>
        <linearGradient id="hiwStream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD9A8" stopOpacity="0.2" />
          <stop offset="35%" stopColor="#FFB554" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F08121" stopOpacity="1" />
        </linearGradient>
        {/* Clips the juice level to the inside of the glass. */}
        <clipPath id="hiwGlassClip">
          <path d="M34 108 L86 108 L79 200 Q78 208 70 208 L50 208 Q42 208 41 200 Z" />
        </clipPath>
      </defs>

      {/* Falling stream */}
      <motion.rect
        x="57"
        y="18"
        width="6"
        height="92"
        rx="3"
        fill="url(#hiwStream)"
        initial={reduced ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        animate={reduced ? undefined : { scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={reduced ? undefined : { repeat: Infinity, duration: 5, times: [0, 0.22, 0.78, 1], ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 18px' }}
      />

      {/* Glass body */}
      <path
        d="M34 108 L86 108 L79 200 Q78 208 70 208 L50 208 Q42 208 41 200 Z"
        fill="rgba(255,255,255,0.16)"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Juice level rising inside the glass */}
      <g clipPath="url(#hiwGlassClip)">
        <motion.rect
          x="30"
          width="62"
          fill="url(#hiwJuice)"
          initial={reduced ? { y: 130, height: 80 } : { y: 208, height: 0 }}
          animate={reduced ? undefined : { y: [208, 128, 128, 208], height: [0, 80, 80, 0] }}
          transition={reduced ? undefined : { repeat: Infinity, duration: 5, times: [0, 0.45, 0.82, 1], ease: 'easeInOut' }}
        />
      </g>

      {/* Glass rim highlight */}
      <ellipse cx="60" cy="108" rx="26" ry="5" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <PageShell name="how-it-works">
      <SEO
        title="How It Works"
        description="Discover how JuiceTap works — from scanning to sipping. Fresh orange juice in 4 simple steps, under 60 seconds with video showcases."
        path="/how-it-works"
      />

      {/* ===== HERO — the pour ===== */}
      <section className="page-hero hiw-hero">
        <CitrusField variant="droplets" density={7} />

        <FloatingElement className="jt-hero-art hiw-hero__orange" amplitude={13} rotate={10} duration={8}>
          <OrangeSlice size="100%" />
        </FloatingElement>

        <FloatingElement className="jt-hero-art hiw-hero__leaf" amplitude={11} rotate={-14} duration={9.5} delay={0.8}>
          <LeafSprig size="100%" id="hiw" />
        </FloatingElement>

        <div className="container">
          <div className="hiw-hero__layout">
            <div className="page-hero__content">
              <motion.span
                className="jt-hero-badge"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="jt-hero-badge__dot" />
                The Process
              </motion.span>

              <TextReveal as="h1" className="font-serif" text="How JuiceTap Works" delay={0.18} />

              <motion.p
                className="text-large"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                From fresh orchard orange to your sealed cup in less than a minute. Watch the journey unfold below.
              </motion.p>
            </div>

            {/* The pour performs the product while you read the intro. */}
            <motion.div
              className="hiw-hero__visual"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <PouringGlass />
            </motion.div>
          </div>
        </div>
      </section>

      <CitrusDivider variant="pour" from="transparent" to="#FFFFFF" />

      {/* ===== SCROLL-BASED PROCESS STORY ===== */}
      <section className="section jt-section jt-section--wash hiw-story-section">
        <CitrusGlow size={560} top="6%" left="-16%" color="rgba(240, 129, 33, 0.13)" duration={18} />
        <CitrusGlow size={420} bottom="8%" right="-12%" color="rgba(255, 181, 84, 0.16)" duration={22} />

        <div className="container">
          <ProcessVideoStory />
        </div>
      </section>

      <CitrusDivider variant="arc" from="#FFFFFF" to="#F08121" />

      {/* ===== CALL TO ACTION ===== */}
      <section className="section section-orange-feature jt-section text-center hiw-cta">
        <CitrusField variant="bubbles" density={7} />

        <div className="container">
          <Reveal variant="up">
            <h2 className="font-serif hiw-cta__title">Ready to Try?</h2>
            <p className="text-large hiw-cta__desc">
              Find a JuiceTap machine near you and experience the freshness for yourself.
            </p>
            <Button to="/locations" variant="white" size="lg">
              Find a JuiceTap
            </Button>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
