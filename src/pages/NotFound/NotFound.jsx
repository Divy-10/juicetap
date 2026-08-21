import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../../components/SEO';
import Button from '../../components/Button/Button';
import PageShell from '../../components/PageShell/PageShell';
import { FloatingElement, MagneticButton } from '../../components/Motion/Motion';
import { CitrusGlow, OrangeSlice, LeafSprig, JuiceDroplet } from '../../components/Citrus/Citrus';

/* 404 storytelling: A JUICE THAT ROLLED AWAY.
   The middle zero of "404" is an orange that has rolled off course,
   with a drip below it — playful, on-brand, over in one beat. */

export default function NotFound() {
  const reduced = useReducedMotion();

  return (
    <PageShell name="notfound">
      <SEO title="404 — Not Found" description="Looks like this juice took a wrong turn." path="/404" />

      <section className="not-found section-cream jt-section">
        <CitrusGlow size={560} top="6%" left="-12%" color="rgba(240, 129, 33, 0.16)" duration={16} />
        <CitrusGlow size={420} bottom="4%" right="-10%" color="rgba(46, 125, 50, 0.09)" duration={21} />

        <FloatingElement className="jt-hero-art not-found__leaf" amplitude={12} rotate={-14} duration={9}>
          <LeafSprig size="100%" id="notfound" />
        </FloatingElement>

        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* The middle zero is a real orange that rolled away. The
                digits are decorative, so the real "404" is exposed to
                assistive tech as visually-hidden text instead. */}
            <div className="not-found__code">
              <span className="visually-hidden">404</span>
              <span aria-hidden="true">4</span>
              <motion.span
                className="not-found__orange"
                aria-hidden="true"
                initial={reduced ? undefined : { x: 60, rotate: 140, opacity: 0 }}
                animate={reduced ? undefined : { x: 0, rotate: 0, opacity: 1 }}
                transition={reduced ? undefined : { duration: 1.05, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <OrangeSlice size="100%" />
              </motion.span>
              <span aria-hidden="true">4</span>
            </div>

            {/* A single drip below the orange, on a slow loop. */}
            {!reduced && (
              <motion.span
                className="not-found__drip"
                aria-hidden="true"
                animate={{ y: [0, 46], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeIn', repeatDelay: 2.4, delay: 1.4 }}
              >
                <JuiceDroplet size={16} id="notfound" />
              </motion.span>
            )}

            <motion.h1
              className="not-found__title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              Looks like this juice took a wrong turn.
            </motion.h1>

            <motion.p
              className="not-found__text text-large"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <MagneticButton>
                <Button to="/" variant="primary" size="lg">Back to Home</Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
