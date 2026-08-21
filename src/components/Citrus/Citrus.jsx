/* ================================================================
   JUICETAP — Citrus Visual Language

   Decorative SVG vocabulary shared by every internal page: orange
   slices, peel curves, leaves, droplets and bubbles. These are the
   supporting cast for the brand story (Orange + Fresh Juice + Smart
   Technology) — never content, never interactive.

   Every layer is pointer-events:none and aria-hidden.
   ================================================================ */

import { motion, useReducedMotion } from 'framer-motion';

/* --------------------------------------------------------------
   Primitive shapes
   -------------------------------------------------------------- */

export const OrangeSlice = ({ size = 90, className = '', style }) => (
  <svg
    viewBox="0 0 100 100"
    className={`citrus-svg ${className}`}
    style={{ width: size, height: size, ...style }}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="50" cy="50" r="48" fill="#FF9E2C" />
    <circle cx="50" cy="50" r="42" fill="#FFF8ED" />
    <path d="M50,50 L50,10 C55,10 62,12 68,17 C75,23 78,29 78,50 Z" fill="#FB8C00" />
    <path d="M50,50 L78,50 C78,55 78,62 72,68 C66,75 59,78 50,78 Z" fill="#F4511E" />
    <path d="M50,50 L50,90 C45,90 38,88 32,83 C25,77 22,71 22,50 Z" fill="#FB8C00" />
    <path d="M50,50 L22,50 C22,45 22,38 28,32 C34,25 41,22 50,22 Z" fill="#F4511E" />
    <path d="M50,50 L77,23 C83,29 87,38 87,50 Z" fill="#FFA726" />
    <path d="M50,50 L23,77 C17,71 13,62 13,50 Z" fill="#FFA726" />
    <circle cx="50" cy="50" r="6" fill="#FFF8ED" />
  </svg>
);

export const LeafSprig = ({ size = 70, className = '', style, id = 'a' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`citrus-svg ${className}`}
    style={{ width: size, height: size, ...style }}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M10,90 C40,90 85,65 95,10 C70,18 20,42 10,90 Z" fill={`url(#citrusLeaf-${id})`} />
    <path d="M10,90 C40,70 65,45 95,10" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M45,65 C55,57 65,55 77,52" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M28,78 C36,72 41,70 50,69" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id={`citrusLeaf-${id}`} x1="10" y1="90" x2="95" y2="10">
        <stop offset="0%" stopColor="#2E7D32" />
        <stop offset="100%" stopColor="#81C784" />
      </linearGradient>
    </defs>
  </svg>
);

/* A single falling juice droplet — the "tap" half of JuiceTap. */
export const JuiceDroplet = ({ size = 26, className = '', style, id = 'a' }) => (
  <svg
    viewBox="0 0 40 56"
    className={`citrus-svg ${className}`}
    style={{ width: size, height: size * 1.4, ...style }}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M20 2 C20 2 38 26 38 38 A18 18 0 0 1 2 38 C2 26 20 2 20 2 Z"
      fill={`url(#citrusDrop-${id})`}
    />
    <ellipse cx="14" cy="34" rx="4.5" ry="6" fill="rgba(255,255,255,0.55)" />
    <defs>
      <linearGradient id={`citrusDrop-${id}`} x1="20" y1="2" x2="20" y2="56">
        <stop offset="0%" stopColor="#FFB554" />
        <stop offset="100%" stopColor="#E8720F" />
      </linearGradient>
    </defs>
  </svg>
);

/* A curl of orange peel — used as an organic section accent. */
export const PeelCurve = ({ size = 130, className = '', style, id = 'a' }) => (
  <svg
    viewBox="0 0 160 90"
    className={`citrus-svg ${className}`}
    style={{ width: size, height: size * 0.56, ...style }}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 74 C30 22 78 4 128 12 C150 16 158 30 154 44 C150 58 132 62 120 54 C136 48 140 38 130 32 C96 20 48 38 22 82 Z"
      fill={`url(#citrusPeel-${id})`}
    />
    <path
      d="M4 74 C30 22 78 4 128 12"
      stroke="#FFD9A8"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />
    <defs>
      <linearGradient id={`citrusPeel-${id}`} x1="4" y1="80" x2="156" y2="10">
        <stop offset="0%" stopColor="#E8720F" />
        <stop offset="100%" stopColor="#FFA845" />
      </linearGradient>
    </defs>
  </svg>
);

/* --------------------------------------------------------------
   CitrusField — the reusable decorative background layer.

   variant:
     'particles' — slow rising motes (About: freshness in the air)
     'bubbles'   — pulp bubbles drifting up (Contact / juice feel)
     'droplets'  — falling juice drops (How It Works: the pour)
     'orbs'      — soft blurred colour fields (calm, text-heavy pages)

   Density is deliberately low: 6–10 nodes, all CSS-animated, so the
   main thread stays free. Hidden entirely under reduced motion.
   -------------------------------------------------------------- */
export function CitrusField({ variant = 'particles', density = 8, tone = 'light', className = '' }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const nodes = Array.from({ length: density }, (_, i) => i);

  return (
    <div
      className={`citrus-field citrus-field--${variant} citrus-field--${tone} ${className}`}
      aria-hidden="true"
    >
      {nodes.map((i) => (
        <span key={i} className={`citrus-node citrus-node--${(i % 5) + 1}`} />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------
   CitrusGlow — a single soft, slowly breathing colour orb.
   Cheaper than a particle field for sections that just need depth.
   -------------------------------------------------------------- */
export function CitrusGlow({
  size = 420,
  top,
  left,
  right,
  bottom,
  color = 'rgba(240, 129, 33, 0.18)',
  duration = 12,
  className = '',
}) {
  const reduced = useReducedMotion();

  const style = {
    width: size,
    height: size,
    top,
    left,
    right,
    bottom,
    background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`,
  };

  if (reduced) {
    return <div className={`citrus-glow ${className}`} style={style} aria-hidden="true" />;
  }

  return (
    <motion.div
      className={`citrus-glow ${className}`}
      style={style}
      aria-hidden="true"
      animate={{ scale: [1, 1.14, 1], opacity: [0.75, 1, 0.75] }}
      transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
    />
  );
}

/* --------------------------------------------------------------
   CitrusDivider — organic section transition.

   Replaces hard block edges with a citrus-inspired curve. `tone`
   sets the incoming section's colour, `fill` the outgoing one.
   variant 'peel' is asymmetric (feels hand-drawn); 'pour' has a
   liquid lip; 'arc' is a clean single sweep.
   -------------------------------------------------------------- */
export function CitrusDivider({ variant = 'arc', from = 'transparent', to = '#FFFFFF', flip = false }) {
  const paths = {
    arc: 'M0,64 C280,8 560,8 720,44 C900,84 1180,92 1440,40 L1440,120 L0,120 Z',
    peel: 'M0,44 C220,110 420,6 660,52 C880,94 1120,26 1440,66 L1440,120 L0,120 Z',
    pour: 'M0,72 C180,72 240,20 360,20 C470,20 520,62 640,62 C800,62 860,14 1010,20 C1180,26 1240,78 1440,60 L1440,120 L0,120 Z',
  };

  return (
    <div
      className={`citrus-divider ${flip ? 'citrus-divider--flip' : ''}`}
      style={{ backgroundColor: from }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false">
        <path d={paths[variant] || paths.arc} fill={to} />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------
   JuiceFlowLine — an animated connecting stroke used to link the
   steps of a process (How It Works, Franchise timeline). The dash
   "pours" downward once the section scrolls into view.
   -------------------------------------------------------------- */
export function JuiceFlowLine({ className = '', vertical = true }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={`juice-flow-line juice-flow-line--static ${className}`} aria-hidden="true" />;
  }

  return (
    <motion.span
      className={`juice-flow-line ${vertical ? '' : 'juice-flow-line--horizontal'} ${className}`}
      aria-hidden="true"
      initial={{ scaleY: 0, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
