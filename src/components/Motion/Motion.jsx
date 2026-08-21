/* ================================================================
   JUICETAP — Shared Motion Primitives (internal pages only)

   A small, reusable set of scroll/entrance animation components so
   individual pages never re-declare variants inline. Everything here
   is transform/opacity only (GPU friendly), respects
   `prefers-reduced-motion`, and dials itself down on small screens.

   NOTE: These are intentionally NOT applied to the Home page.
   ================================================================ */

import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/* JuiceTap house easing — a soft, premium "settle" curve. */
export const EASE = [0.22, 1, 0.36, 1];
export const EASE_OUT = [0.16, 1, 0.3, 1];

/* Shared viewport config so every reveal on the site fires consistently. */
const VIEWPORT = { once: true, margin: '-60px 0px -60px 0px' };

/* --------------------------------------------------------------
   useIsCompact — true on tablet/mobile widths.
   Used to soften or disable heavier effects (parallax, big drifts).
   -------------------------------------------------------------- */
export function useIsCompact(breakpoint = 1024) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [breakpoint]);

  return compact;
}

/* --------------------------------------------------------------
   Reveal — the workhorse entrance animation.

   variant: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'fade'
   strength: how far/hard the element travels (hierarchy control)
   -------------------------------------------------------------- */
const OFFSETS = {
  up: (d) => ({ y: d }),
  down: (d) => ({ y: -d }),
  left: (d) => ({ x: -d }),
  right: (d) => ({ x: d }),
  scale: () => ({ scale: 0.94 }),
  blur: (d) => ({ y: d * 0.5, filter: 'blur(10px)' }),
  fade: () => ({}),
};

const RESTS = {
  up: { y: 0 },
  down: { y: 0 },
  left: { x: 0 },
  right: { x: 0 },
  scale: { scale: 1 },
  blur: { y: 0, filter: 'blur(0px)' },
  fade: {},
};

export function Reveal({
  children,
  as = 'div',
  variant = 'up',
  delay = 0,
  duration = 0.65,
  distance = 32,
  className = '',
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const compact = useIsCompact(640);
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    );
  }

  // Shorter travel on phones keeps things snappy and avoids overflow.
  const d = compact ? Math.min(distance, 20) : distance;
  const offset = (OFFSETS[variant] || OFFSETS.up)(d);
  const rest_ = RESTS[variant] || RESTS.up;

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, ...rest_ }}
      viewport={VIEWPORT}
      transition={{ duration: compact ? duration * 0.85 : duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* --------------------------------------------------------------
   Stagger / StaggerItem — for card grids and lists.
   Parent orchestrates; children only declare their own variants.
   -------------------------------------------------------------- */
export function Stagger({
  children,
  className = '',
  gap = 0.09,
  delay = 0.05,
  as = 'div',
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function StaggerItem({ children, className = '', as = 'div', style, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag className={className} style={style} variants={staggerItemVariants} {...rest}>
      {children}
    </Tag>
  );
}

/* --------------------------------------------------------------
   TextReveal — word-by-word entrance for headings.
   Keeps text selectable and readable; never animates letter spacing.
   -------------------------------------------------------------- */
export function TextReveal({
  text,
  as = 'h1',
  className = '',
  delay = 0,
  gap = 0.045,
  style,
}) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced || !text) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const words = String(text).split(' ');
  const MotionTag = motion[as] || motion.h1;

  return (
    <MotionTag
      className={`jt-text-reveal ${className}`}
      style={style}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="jt-text-reveal__word" aria-hidden="true">
            <motion.span
              className="jt-text-reveal__inner"
              variants={{
                hidden: { y: '105%', opacity: 0 },
                visible: { y: '0%', opacity: 1, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* A real space between the word boxes, not CSS padding, so
              selecting or copying the heading yields proper words. */}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}

/* --------------------------------------------------------------
   ImageReveal — clip-path curtain + slow settle zoom.
   The image content itself is never altered, only how it arrives.
   -------------------------------------------------------------- */
export function ImageReveal({
  src,
  alt,
  className = '',
  imgClassName = '',
  delay = 0,
  from = 'bottom',
  loading = 'lazy',
  children,
  ...rest
}) {
  const reduced = useReducedMotion();

  const CLIPS = {
    bottom: 'inset(100% 0% 0% 0%)',
    top: 'inset(0% 0% 100% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  };

  if (reduced) {
    return (
      <div className={`jt-image-reveal ${className}`} {...rest}>
        <img src={src} alt={alt} className={imgClassName} loading={loading} />
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`jt-image-reveal ${className}`}
      initial={{ clipPath: CLIPS[from] || CLIPS.bottom, opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      <motion.img
        src={src}
        alt={alt}
        className={imgClassName}
        loading={loading}
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.3, delay, ease: EASE }}
      />
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------
   Parallax — subtle scroll-linked drift. Desktop only by design:
   on touch devices parallax reads as jitter and costs frames.
   -------------------------------------------------------------- */
export function Parallax({
  children,
  className = '',
  speed = 40,
  axis = 'y',
  style,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const compact = useIsCompact(1024);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = reduced || compact ? [0, 0] : [speed, -speed];
  const shift = useTransform(scrollYProgress, [0, 1], range);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, [axis]: shift, willChange: 'transform' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------
   FloatingElement — endless gentle drift for decorative art.
   Purely decorative, so it goes fully static under reduced motion.
   -------------------------------------------------------------- */
export function FloatingElement({
  children,
  className = '',
  amplitude = 14,
  rotate = 6,
  duration = 7,
  delay = 0,
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const compact = useIsCompact(768);

  if (reduced) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  const amp = compact ? amplitude * 0.55 : amplitude;

  return (
    <motion.div
      className={className}
      style={{ ...style, willChange: 'transform' }}
      animate={{ y: [0, -amp, 0], rotate: [0, rotate, 0] }}
      transition={{ repeat: Infinity, duration, ease: 'easeInOut', delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------
   HoverCard — the standard JuiceTap card lift.
   Visual styling lives in CSS (.jt-card); this only adds the
   spring so the lift feels physical rather than linear.
   -------------------------------------------------------------- */
export function HoverCard({
  children,
  className = '',
  lift = 8,
  scale = 1.012,
  as = 'div',
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      whileHover={{ y: -lift, scale }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* --------------------------------------------------------------
   MagneticButton — wraps a button/link so it leans toward the
   cursor slightly. Pointer-fine only; taps are unaffected.
   -------------------------------------------------------------- */
export function MagneticButton({ children, className = '', strength = 6, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const compact = useIsCompact(1024);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const disabled = reduced || compact;

  const handleMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * strength * 2, y: relY * strength * 2 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.span
      ref={ref}
      className={`jt-magnetic ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={disabled ? { x: 0, y: 0 } : offset}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      {...rest}
    >
      {children}
    </motion.span>
  );
}

/* --------------------------------------------------------------
   CountUp — number roll-in for stat rows. Uses rAF, stops on
   completion, and shows the final value instantly if motion is off.
   -------------------------------------------------------------- */
export function CountUp({ to = 0, duration = 1.4, suffix = '', prefix = '', className = '' }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [value, setValue] = useState(reduced ? to : 0);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return undefined;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setValue(to);
      return undefined;
    }

    let frame;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return;
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / (duration * 1000), 1);
            // easeOutExpo — fast then settle, matches the house curve
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            setValue(Math.round(to * eased));
            if (p < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
