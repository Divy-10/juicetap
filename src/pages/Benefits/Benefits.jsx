import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../../components/SEO';
import Button from '../../components/Button/Button';
import PageShell from '../../components/PageShell/PageShell';
import {
  Reveal,
  Stagger,
  StaggerItem,
  TextReveal,
  FloatingElement,
  Parallax,
} from '../../components/Motion/Motion';
import {
  CitrusField,
  CitrusGlow,
  CitrusDivider,
  OrangeSlice,
  LeafSprig,
  JuiceDroplet,
} from '../../components/Citrus/Citrus';
import { BENEFITS_DATA, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../data/constants';

/* Benefits page storytelling: PURITY.
   The hero shows a whole orange being reduced to nothing but juice —
   slice, leaf, droplet — over a field of rising freshness particles. */

export default function Benefits() {
  const reduced = useReducedMotion();

  const renderBenefitIcon = (index) => {
    const strokeProps = { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: "24", height: "24" };
    switch (index) {
      case 0: // 100% Natural
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
      case 1: // Fresh & Pure
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
      case 2: // No Added Sugar
        return <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;
      case 3: // No Preservatives
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
      case 4: // Automated & Hygienic
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
      case 5: // Fresh On Demand
        return <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
      case 6: // 24/7 Availability
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z"/></svg>;
      case 7: // Convenient & Fast
        return <svg viewBox="0 0 24 24" {...strokeProps}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
      case 8: // Sustainable Approach
        return <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;
      default:
        return null;
    }
  };

  return (
    <PageShell name="benefits">
      <SEO title="Benefits" description="Discover the benefits of JuiceTap — 100% natural, freshly squeezed, no added sugar, no preservatives, hygienic automated process." path="/benefits" />

      {/* ===== HERO — "purity" storytelling ===== */}
      <section className="page-hero benefits-hero">
        <CitrusField variant="particles" density={9} />

        {/* A slowly rotating orange cross-section: the whole fruit, nothing added. */}
        <motion.div
          className="jt-hero-art benefits-hero__slice"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        >
          <OrangeSlice size="100%" />
        </motion.div>

        <FloatingElement className="jt-hero-art benefits-hero__leaf" amplitude={16} rotate={-12} duration={8}>
          <LeafSprig size="100%" id="benefits" />
        </FloatingElement>

        {/* A single drop falling on a long loop — the "tap" moment. */}
        {!reduced && (
          <motion.div
            className="jt-hero-art benefits-hero__drop"
            animate={{ y: [-20, 220], opacity: [0, 1, 1, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: 'easeIn', repeatDelay: 2.2 }}
          >
            <JuiceDroplet size={22} id="benefits" />
          </motion.div>
        )}

        <div className="container">
          <div className="page-hero__content">
            <motion.span
              className="jt-hero-badge"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="jt-hero-badge__dot" />
              Benefits
            </motion.span>

            <TextReveal as="h1" text="Why Choose JuiceTap?" delay={0.18} />

            <motion.p
              className="text-large"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Every glass of JuiceTap juice is a commitment to freshness, purity, and your well-being.
            </motion.p>
          </div>
        </div>
      </section>

      <CitrusDivider variant="pour" from="transparent" to="#FFFFFF" />

      {/* ===== THE BENEFITS LIST ===== */}
      <section className="section jt-section jt-section--wash benefits-section">
        <CitrusGlow size={520} top="4%" right="-14%" color="rgba(240, 129, 33, 0.14)" duration={16} />
        <CitrusGlow size={440} bottom="2%" left="-12%" color="rgba(46, 125, 50, 0.09)" duration={20} />

        <div className="container">
          {/* The vertical juice line the numbered markers hang from. */}
          <Parallax className="benefits-spine" speed={18}>
            <span className="benefits-spine__line" />
          </Parallax>

          <Stagger className="benefits-list" gap={0.08}>
            {BENEFITS_DATA.map((benefit, i) => (
              <StaggerItem
                key={benefit.title}
                className={`benefit-item jt-card jt-card--accent ${i % 2 !== 0 ? 'benefit-item--reverse' : ''}`}
              >
                <div className="benefit-item__icon-col">
                  <span className="benefit-item__icon jt-card-icon">{renderBenefitIcon(i)}</span>
                  <span className="benefit-item__number">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="benefit-item__content">
                  <h2>{benefit.title}</h2>
                  <p>{benefit.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="arc" from="#FFFFFF" to="#0F381E" />

      {/* ===== CLOSING CTA ===== */}
      <section className="section jt-section jt-section--wash-dark benefits-cta">
        <div className="jt-tech-grid" />
        <CitrusField variant="particles" density={6} tone="dark" />

        <div className="container text-center">
          <Reveal variant="up">
            <h2 className="benefits-cta__title">Taste the Difference Yourself</h2>
            <p className="benefits-cta__desc">
              Find a JuiceTap machine near you and experience the freshness for yourself.
            </p>
            <div className="benefits-cta__actions">
              <Button to="/locations" variant="primary" size="lg">Find a JuiceTap</Button>
              <Button href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)} variant="outline-white" size="lg">
                Talk to Us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
