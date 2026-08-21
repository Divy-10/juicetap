import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import PageShell from '../../components/PageShell/PageShell';
import { Reveal, TextReveal, Stagger, StaggerItem, FloatingElement } from '../../components/Motion/Motion';
import { CitrusGlow, CitrusDivider, PeelCurve } from '../../components/Citrus/Citrus';

/* Legal pages storytelling: CLARITY.
   Deliberately the quietest motion on the site — one hero reveal and
   a gentle stagger down the clauses. Nothing moves while you read. */

const SECTIONS = [
  {
    heading: '1. Information We Collect',
    body: 'We may collect basic transaction details, mobile numbers used for payments/WhatsApp notifications, and standard analytical telemetry to improve website performance and user experience. We do not store financial payment credentials on our servers.',
  },
  {
    heading: '2. How We Use Information',
    body: 'Information gathered is utilized to fulfill your orders, process transactions, communicate via automated WhatsApp updates when requested, and perform maintenance/quality control checks on our machine network.',
  },
  {
    heading: '3. Data Protection',
    body: 'We implement standard technical safeguards to prevent unauthorized access, alteration, or disclosure of user transaction identifiers and contact information.',
  },
];

export default function PrivacyPolicy() {
  return (
    <PageShell name="legal">
      <SEO title="Privacy Policy" description="Privacy Policy for JuiceTap Global Private Limited. Understand how we collect, use, and protect your data." path="/privacy-policy" />

      <section className="page-hero legal-hero">
        <FloatingElement className="jt-hero-art legal-hero__peel" amplitude={10} rotate={-6} duration={11}>
          <PeelCurve size="100%" id="privacy" />
        </FloatingElement>

        <div className="container">
          <div className="page-hero__content">
            <motion.span
              className="jt-hero-badge"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="jt-hero-badge__dot" />
              Legal
            </motion.span>

            <TextReveal as="h1" text="Privacy Policy" delay={0.18} />

            <motion.p
              className="text-large"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              Last updated: August 2026
            </motion.p>
          </div>
        </div>
      </section>

      <CitrusDivider variant="arc" from="transparent" to="#FFFFFF" />

      <section className="section jt-section jt-section--wash">
        <CitrusGlow size={460} top="2%" right="-14%" color="rgba(240, 129, 33, 0.1)" duration={20} />

        <div className="container container-narrow legal-content">
          <Reveal variant="up">
            <p className="legal-content__intro">At JuiceTap Global Private Limited, we prioritize your privacy. This Privacy Policy details how we handle the information collected from your interactions with our website, mobile application, and automated juice vending machines.</p>
          </Reveal>

          <Stagger gap={0.1} delay={0.1}>
            {SECTIONS.map((section) => (
              <StaggerItem key={section.heading} className="legal-clause">
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </PageShell>
  );
}
