import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import PageShell from '../../components/PageShell/PageShell';
import { Reveal, TextReveal, Stagger, StaggerItem, FloatingElement } from '../../components/Motion/Motion';
import { CitrusGlow, CitrusDivider, PeelCurve } from '../../components/Citrus/Citrus';

/* Shares the legal page treatment with Privacy Policy — same shell
   name, same stylesheet, so the two routes stay identical in feel. */

const SECTIONS = [
  {
    heading: '1. Use of Service',
    body: 'Our vending machines deliver freshly squeezed orange juice on-demand. Users must complete digital payment authorization before product delivery is initiated. Refunds or transaction disputes should be directed to our support team.',
  },
  {
    heading: '2. Intellectual Property',
    body: 'All brand marks, design assets, website styling, mechanical machine engineering configurations, and trade secrets related to JuiceTap are the sole property of JuiceTap Global Private Limited.',
  },
  {
    heading: '3. Limitation of Liability',
    body: 'JuiceTap is not liable for indirect or consequential damages arising from machine service interruptions, payment gateway outages, or temporary availability issues.',
  },
];

export default function Terms() {
  return (
    <PageShell name="legal">
      <SEO title="Terms & Conditions" description="Terms & Conditions for using JuiceTap services, vending machines, and website." path="/terms-and-conditions" />

      <section className="page-hero legal-hero">
        <FloatingElement className="jt-hero-art legal-hero__peel" amplitude={10} rotate={-6} duration={11}>
          <PeelCurve size="100%" id="terms" />
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

            <TextReveal as="h1" text="Terms & Conditions" delay={0.18} />

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
            <p className="legal-content__intro">By using the website, app, or automated juice vending machines operated by JuiceTap Global Private Limited, you agree to these Terms &amp; Conditions.</p>
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
