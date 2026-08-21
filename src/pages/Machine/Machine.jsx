import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../../components/SEO';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import Button from '../../components/Button/Button';
import PageShell from '../../components/PageShell/PageShell';
import {
  Reveal,
  Stagger,
  StaggerItem,
  TextReveal,
  ImageReveal,
  Parallax,
  FloatingElement,
} from '../../components/Motion/Motion';
import {
  CitrusField,
  CitrusGlow,
  CitrusDivider,
  OrangeSlice,
  JuiceDroplet,
} from '../../components/Citrus/Citrus';
import { MachineIcon, ShieldIcon, SparklesIcon, ClockIcon, CheckIcon, JuiceIcon } from '../../components/Icons/Icons';
import { MACHINE_FEATURES, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../data/constants';

/* Machine page storytelling: ENGINEERING.
   The hero is a technical readout — a blueprint grid, a scanning
   sweep and telemetry chips — married to the orange it processes. */

const HYGIENE_ITEMS = [
  { icon: <ShieldIcon size={24} />, title: 'Food-Grade Materials', desc: 'Every component touching fruit or juice is made from certified food-grade materials.' },
  { icon: <SparklesIcon size={24} />, title: 'Automated Cleaning', desc: 'Self-cleaning cycles ensure the machine stays hygienic and fresh round the clock.' },
  { icon: <CheckIcon size={24} />, title: 'Minimal Human Contact', desc: 'Fully automated process means zero human handling for maximum food safety.' },
  { icon: <ClockIcon size={24} />, title: 'Intelligent Temperature', desc: 'Climate management keeps oranges fresh and dispenses juice ice-cold.' },
];

/* Distinct icon per feature (keyed on the exact MACHINE_FEATURES titles) so the
   cards no longer all render the same glyph. */
const FEATURE_ICONS = {
  'Smart Vending': <MachineIcon size={22} />,
  'Automated Squeezing': <SparklesIcon size={22} />,
  'Contactless Operation': <ShieldIcon size={22} />,
  'Fresh Juice Dispensing': <JuiceIcon size={22} />,
  'Automatic Sealing': <CheckIcon size={22} />,
  'Real-time Monitoring': <ClockIcon size={22} />,
};

export default function Machine() {
  const reduced = useReducedMotion();

  return (
    <PageShell name="machine">
      <SEO title="Our Machine | Smart Automated Juice Vending Technology" description="Explore the JuiceTap smart vending machine — featuring automated squeezing, contactless operation, IoT monitoring, and food-grade engineering." path="/machine" />

      {/* ===== HERO — engineering readout ===== */}
      <section className="page-hero machine-hero">
        <div className="jt-tech-grid" />

        {/* A single scan line sweeping the hero, like a machine
            calibrating itself. One transform, runs off the compositor. */}
        {!reduced && (
          <motion.div
            className="machine-hero__scan"
            animate={{ x: ['-30%', '130%'] }}
            transition={{ repeat: Infinity, duration: 7.5, ease: 'easeInOut', repeatDelay: 1.5 }}
          />
        )}

        <FloatingElement className="jt-hero-art machine-hero__slice" amplitude={12} rotate={8} duration={9}>
          <OrangeSlice size="100%" />
        </FloatingElement>

        <div className="container">
          <div className="machine-hero__layout">
            <div className="page-hero__content">
              <motion.span
                className="jt-hero-badge"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="jt-hero-badge__dot" />
                Smart Technology
              </motion.span>

              <TextReveal as="h1" text="Meet the JuiceTap Machine" delay={0.18} />
              <span className="machine-hero__rule" />

              <motion.p
                className="text-large"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                Autonomous vending technology designed to bring freshly squeezed orange juice to corporate hubs, hospitals, and transit points.
              </motion.p>

              {/* Live telemetry chips — the machine reporting for duty. */}
              <motion.div
                className="machine-hero__telemetry"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {['Automated squeezing', 'IoT monitored', 'Contactless serve'].map((chip, i) => (
                  <span className="machine-chip" key={chip} style={{ animationDelay: `${i * 0.9}s` }}>
                    <span className="machine-chip__pulse" />
                    {chip}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right column: the real machine, framed — fills what was an empty half. */}
            <motion.div
              className="machine-hero__visual"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="machine-hero__photo">
                <div className="machine-hero__frame">
                  <img
                    src="/assets/juicetap-real-machine.jpg"
                    alt="A JuiceTap fresh orange juice vending machine installed on site"
                    loading="eager"
                  />
                  <span className="machine-hero__tint" aria-hidden="true" />
                  <span className="machine-hero__sheen" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CitrusDivider variant="arc" from="transparent" to="#FFFFFF" />

      {/* ===== PRECISION ENGINEERING ===== */}
      <section className="section jt-section jt-section--wash machine-intro">
        <CitrusGlow size={520} top="-8%" right="-12%" color="rgba(240, 129, 33, 0.15)" duration={17} />

        <div className="container">
          <div className="machine-hero-grid">
            <Parallax className="machine-hero-image" speed={26}>
              <div className="machine-image-halo" />
              <ImageReveal
                src="/assets/machine-showcase.png"
                alt="JuiceTap automated juice vending machine front view"
                className="machine-image-reveal"
                from="bottom"
              />
              {/* A drop falling beside the machine on a long loop. */}
              {!reduced && (
                <motion.span
                  className="machine-image-drop"
                  animate={{ y: [0, 130], opacity: [0, 1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 3.6, ease: 'easeIn', repeatDelay: 2.8 }}
                >
                  <JuiceDroplet size={18} id="machine" />
                </motion.span>
              )}
            </Parallax>

            <Reveal className="machine-hero-content" variant="right" delay={0.12} distance={36}>
              <span className="jt-eyebrow">Precision</span>
              <h2>Precision Engineering for Pure Juice</h2>
              <p>Every JuiceTap machine is built with food-grade materials and precision engineering. From automated orange selection to final cup sealing, every step is designed for maximum freshness and hygiene.</p>
              <p>Our machines operate autonomously with real-time IoT monitoring, ensuring consistent quality and stock availability around the clock.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <CitrusDivider variant="peel" from="#FFFFFF" to="#FFF9F2" />

      {/* ===== KEY FEATURES ===== */}
      <section className="section jt-section jt-section--wash-cream machine-features">
        <div className="jt-tech-grid jt-tech-grid--light" />

        <div className="container">
          <SectionHeading label="Features" title="Key Machine Features" subtitle="Built with cutting-edge technology for an exceptional juice experience." />

          <Stagger className="machine-features-grid" gap={0.08}>
            {MACHINE_FEATURES.map((feature) => (
              <StaggerItem key={feature.title} className="machine-feature-card jt-card jt-card--accent">
                <div className="machine-feature-card__icon jt-card-icon">
                  {FEATURE_ICONS[feature.title] || <MachineIcon size={22} />}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="arc" from="#FFF9F2" to="#FFFFFF" />

      {/* ===== HYGIENE & SAFETY ===== */}
      <section className="section jt-section jt-section--wash machine-hygiene">
        <CitrusGlow size={460} bottom="0%" left="-12%" color="rgba(46, 125, 50, 0.1)" duration={19} />

        <div className="container">
          <SectionHeading label="Hygiene & Safety" title="Designed for Food Safety" subtitle="Cleanliness, hygiene, and contactless serving are built into the machine architecture." />

          <Stagger className="machine-hygiene-grid" gap={0.1}>
            {HYGIENE_ITEMS.map((item) => (
              <StaggerItem key={item.title} className="machine-hygiene-card jt-card">
                <div className="machine-hygiene-card__icon jt-card-icon jt-card-icon--forest">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="pour" from="#FFFFFF" to="#0F381E" />

      {/* ===== CTA ===== */}
      <section className="section jt-section jt-section--wash-dark machine-cta">
        <div className="jt-tech-grid" />
        <CitrusField variant="particles" density={6} tone="dark" />

        <div className="container text-center">
          <Reveal variant="up">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-md)' }}>Interested in Our Technology?</h2>
            <p style={{ maxWidth: '500px', margin: '0 auto var(--space-xl)', color: 'rgba(255,255,255,0.65)' }}>Whether you are looking to start a franchise with us or want to learn more about our technology, we would love to connect.</p>
            <div className="flex-center gap-md" style={{ flexWrap: 'wrap' }}>
              <Button href={getWhatsAppUrl(WHATSAPP_MESSAGES.machine)} variant="whatsapp" size="lg">Machine Enquiry</Button>
              <Button to="/business" variant="outline-white" size="lg">Franchise Opportunity</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
