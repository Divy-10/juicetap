import { motion } from 'framer-motion';
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
  MagneticButton,
} from '../../components/Motion/Motion';
import {
  CitrusField,
  CitrusGlow,
  CitrusDivider,
} from '../../components/Citrus/Citrus';
import { JuiceIcon, SparklesIcon, ShieldIcon, LocationIcon } from '../../components/Icons/Icons';

/* About storytelling: NATURE MEETS TECHNOLOGY.
   A light, airy hero (the only internal hero that is not orange —
   it is the "orchard" moment) with drifting fruit and rising motes,
   handing off to progressively more engineered sections. */

const VALUES = [
  {
    icon: <JuiceIcon size={24} />,
    title: 'Freshness First',
    desc: 'Every decision we make starts with one question: does this make the juice fresher for our customers?',
  },
  {
    icon: <SparklesIcon size={24} />,
    title: 'Technology for Good',
    desc: 'We use technology to solve real challenges in food freshness, contactless hygiene, and smart inventory.',
  },
  {
    icon: <ShieldIcon size={24} />,
    title: 'Uncompromising Quality',
    desc: 'From the oranges we source to the machines we engineer — quality and food safety are non-negotiable.',
  },
  {
    icon: <LocationIcon size={24} />,
    title: 'Accessible Everywhere',
    desc: 'Fresh, 100% natural orange juice should be a daily convenience available across corporate hubs and public spaces.',
  },
];

export default function About() {
  return (
    <PageShell name="about">
      <SEO
        title="About Us | JuiceTap Fresh Orange Juice Technology"
        description="Learn about JuiceTap — a premium fresh-juice technology brand bringing freshly squeezed orange juice through smart automated vending machines."
        path="/about"
      />

      {/* ===== 1. ABOUT HERO — the orchard =====
           Two columns: copy on the left, a composed citrus cluster on the
           right. Previously the copy sat in a 760px column and the whole
           right-hand half of the hero was empty, with one orange slice
           floating in the top corner. */}
      <section className="page-hero about-hero-animated">
        <div className="about-hero-bg-glow" />
        <CitrusField variant="particles" density={9} className="about-hero-field" />

        <div className="container">
          <div className="about-hero__grid">
            <div className="page-hero__content about-hero__card">
              <motion.span
                className="label about-badge-animated"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <span className="badge-pulse-dot" />
                About Us
              </motion.span>

              <TextReveal as="h1" text="Freshness Meets Smart Technology" delay={0.24} />

              <motion.p
                className="text-large"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
              >
                We are on a mission to reimagine how people experience fresh orange juice — combining nature's finest fruit with intelligent vending technology.
              </motion.p>
            </div>

            {/* Real JuiceTap Vending Machine in Orange Orchard Image */}
            <div className="about-hero__image-col">
              <Reveal variant="scale" delay={0.35}>
                <div className="about-hero__image-frame">
                  <img
                    src="/assets/about-hero.jpg"
                    alt="JuiceTap fresh orange juice vending machine in orange orchard"
                    className="about-hero__img"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CitrusDivider variant="arc" from="#E86F10" to="#FFFFFF" />

      {/* ===== 2 & 3. PROBLEM / SOLUTION ===== */}
      <section className="section jt-section about-problem-solution-section">
        <div className="about-bg-orb about-bg-orb-1" />

        <div className="container">
          <Stagger className="about-two-col" gap={0.15}>
            <StaggerItem className="about-col-card jt-card jt-card--accent">
              <div className="about-col-badge">The Problem</div>
              <h2>Bottled Juice Isn't Fresh</h2>
              <p>Finding genuinely fresh juice shouldn't be difficult. Yet most people settle for bottled juices loaded with preservatives, added sugar, and artificial flavors. Street vendors raise hygiene concerns. The gap between what people want — truly fresh, healthy juice — and what is available is enormous.</p>
            </StaggerItem>

            <StaggerItem className="about-col-card about-col-card--solution jt-card jt-card--accent">
              <div className="about-col-badge about-col-badge--green">Our Solution</div>
              <h2>Smart Automated Squeezing</h2>
              <p>JuiceTap bridges that gap with smart automated vending machines that squeeze fresh oranges right in front of you. No human handling, no preservatives, no compromise. Just pure, freshly squeezed orange juice available at the tap of a button.</p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="peel" from="#FFFFFF" to="#16532B" />

      {/* ===== 4. ENGINEERING PURE FRESHNESS ===== */}
      <section className="section section-orange-feature jt-section about-feature-animated">
        <div className="about-feature-bg-pattern" />
        <div className="about-feature-glow" />
        <CitrusField variant="bubbles" density={7} />

        <div className="container">
          <div className="about-feature-grid">
            <Parallax className="about-image-frame" speed={24}>
              <div className="about-image-backdrop-glow" />
              <ImageReveal
                src="/assets/machine-office.png"
                alt="JuiceTap automated vending machine in office environment"
                className="about-image-wrapper"
                from="bottom"
              />
            </Parallax>

            <Reveal className="about-feature-content" variant="right" delay={0.12} distance={36}>
              <span className="label label--light-pill">Innovation</span>
              <h2>Engineering Pure Freshness</h2>
              <p>Every JuiceTap machine is a feat of engineering — combining food-grade automation, IoT connectivity, and intelligent inventory management. Our machines monitor stock levels, maintain optimal temperature, and ensure every glass meets our quality standards.</p>
              <p>Real-time data analytics help us optimize operations, reduce waste, and ensure fresh juice is always available when you need it.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <CitrusDivider variant="arc" from="#0F381E" to="#FFF9F2" />

      {/* ===== 6. OUR CORE VALUES ===== */}
      <section className="section jt-section about-values-section">
        <div className="about-bg-orb about-bg-orb-2" />

        <div className="container">
          <SectionHeading
            label="Vision"
            title="Our Core Values"
            subtitle="To make fresh, pure, and healthy juice accessible to everyone through smart, contactless technology."
          />

          <Stagger className="about-values-grid" gap={0.1}>
            {VALUES.map((item) => (
              <StaggerItem key={item.title} className="about-value-card about-value-card-premium jt-card jt-card--accent">
                <div className="about-value-card__icon-wrap">
                  <div className="about-value-card__icon jt-card-icon">{item.icon}</div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="pour" from="#FFF9F2" to="#0F381E" />

      {/* ===== 8. PRESENCE ===== */}
      <section className="section section-dark jt-section about-presence-section">
        <div className="about-presence-glow" />
        <div className="jt-tech-grid" />
        <CitrusGlow size={520} top="8%" right="-10%" color="rgba(240, 129, 33, 0.2)" duration={16} />

        <div className="container text-center">
          <Reveal variant="up" duration={0.7}>
            <span className="label about-label-presence">Presence</span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-md)' }}>Growing Across India</h2>
            <p className="text-large" style={{ maxWidth: '600px', margin: '0 auto var(--space-xl)', color: 'rgba(255,255,255,0.75)' }}>
              Starting from Surat, JuiceTap is expanding to major cities across India, bringing fresh juice to corporate offices, malls, hospitals, and transit hubs.
            </p>
            <MagneticButton>
              <Button to="/locations" variant="primary" size="lg">View Our Locations</Button>
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
