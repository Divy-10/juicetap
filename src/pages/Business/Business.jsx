import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
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
} from '../../components/Citrus/Citrus';
import {
  WhatsAppIcon,
  PhoneIcon,
  MachineIcon,
  ShieldIcon,
  ClockIcon,
  BuildingIcon,
  HospitalIcon,
  MallIcon,
  SchoolIcon,
  PlaneIcon,
  TrainIcon,
  UserGroupIcon,
  ChevronDownIcon,
  JuiceIcon,
  SparklesIcon,
  NavigationIcon,
  CheckIcon,
} from '../../components/Icons/Icons';
import { BUSINESS_LOCATIONS, CONTACT, getWhatsAppUrl } from '../../data/constants';

/* Franchise storytelling: EXPANSION.
   The hero shows the network growing — expansion arcs sweeping out
   from a home marker to new sites, one after another. */

const FRANCHISE_WHATSAPP_MSG =
  'Hello JuiceTap Team, I am interested in starting a JuiceTap franchise. Please share the franchise details and investment information.';

const FRANCHISE_STEPS = [
  {
    step: '01',
    title: 'Enquire',
    desc: 'Reach out to our franchise team via WhatsApp or Call to express your interest.',
  },
  {
    step: '02',
    title: 'Discuss Opportunity',
    desc: 'Connect with our experts to discuss location suitability, business model, and operational details.',
  },
  {
    step: '03',
    title: 'Select Location',
    desc: 'Identify and finalize high-footfall commercial sites such as corporate parks, malls, or hospitals.',
  },
  {
    step: '04',
    title: 'Set Up JuiceTap',
    desc: 'Our team handles machine delivery, technical installation, and initial inventory setup.',
  },
  {
    step: '05',
    title: 'Launch & Operate',
    desc: 'Start serving 100% fresh orange juice with automated 24/7 operations and remote IoT support.',
  },
];

const FRANCHISE_BENEFITS = [
  {
    icon: <ClockIcon size={24} />,
    title: '24/7 Autonomous Operation',
    desc: 'Smart vending machines squeeze fresh oranges on demand with zero human intervention required during serving.',
  },
  {
    icon: <SparklesIcon size={24} />,
    title: 'Low Operational Complexity',
    desc: 'IoT-enabled remote monitoring keeps track of inventory, sales, and machine diagnostics in real time.',
  },
  {
    icon: <JuiceIcon size={24} />,
    title: '100% Pure & Hygienic',
    desc: 'Automated squeezing and contactless cup sealing ensure unmatched cleanliness and customer trust.',
  },
  {
    icon: <BuildingIcon size={24} />,
    title: 'Turnkey Site Setup',
    desc: 'From site assessment to installation and maintenance, JuiceTap provides end-to-end guidance.',
  },
];

const WHY_ITEMS = [
  {
    icon: <MachineIcon size={26} />,
    title: 'Automated Operation',
    desc: 'JuiceTap machines select, squeeze, and seal 100% natural orange juice automatically with no manual intervention.',
  },
  {
    icon: <SparklesIcon size={26} />,
    title: 'IoT Monitoring',
    desc: 'Real-time remote tracking of orange inventory, sales analytics, and machine diagnostics right from your smartphone.',
  },
  {
    icon: <ShieldIcon size={26} />,
    title: 'Contactless Hygiene',
    desc: 'Fully sealed single-use cups dispense zero-preservative, ice-cold fresh orange juice for maximum food safety.',
  },
  {
    icon: <UserGroupIcon size={26} />,
    title: 'Turnkey Setup',
    desc: 'Full franchise assistance including site evaluation, technical installation, stock replenishment support, and maintenance.',
  },
];

const SUPPORT_ITEMS = [
  {
    title: 'Site Feasibility Assessment',
    desc: 'Footfall evaluation and site layout guidance to ensure optimal machine placement.',
    icon: <NavigationIcon size={22} />,
  },
  {
    title: 'Machine Delivery & Setup',
    desc: 'Full technical setup, calibration, and operational readiness before launch.',
    icon: <MachineIcon size={22} />,
  },
  {
    title: 'Technical & Machine Training',
    desc: 'Hands-on operational training for cleaning, stock refill, and basic maintenance.',
    icon: <CheckIcon size={22} />,
  },
  {
    title: 'IoT & Remote Diagnostics',
    desc: 'Real-time dashboard access for inventory tracking and continuous remote support.',
    icon: <SparklesIcon size={22} />,
  },
];

/* Keyed on the exact BUSINESS_LOCATIONS titles from constants.js so every
   site card gets its own icon. (Previously keyed on strings that did not
   exist in BUSINESS_LOCATIONS, so five of six cards fell back to BuildingIcon.) */
const LOCATION_ICONS = {
  'Corporate Offices': <BuildingIcon size={26} />,
  'Hospitals': <HospitalIcon size={26} />,
  'Shopping Malls': <MallIcon size={26} />,
  'Colleges & Universities': <SchoolIcon size={26} />,
  'Airports': <PlaneIcon size={26} />,
  'Transit Hubs': <TrainIcon size={26} />,
};

const FAQS = [
  {
    q: 'How does the JuiceTap automated vending machine work?',
    a: 'JuiceTap machines store whole, fresh oranges in a hygienic climate-controlled environment. Upon payment, the machine automatically selects, squeezes, dispenses, and seals 100% pure orange juice into a glass in under 60 seconds.',
  },
  {
    q: 'What locations are ideal for setting up a JuiceTap franchise?',
    a: 'High-footfall locations with health-conscious audiences thrive best — including IT parks, corporate offices, multi-specialty hospitals, shopping malls, university campuses, airports, and transit hubs.',
  },
  {
    q: 'What support does JuiceTap provide to franchise owners?',
    a: 'JuiceTap provides site feasibility assessment, machine delivery & installation, comprehensive operational training, IoT remote monitoring access, regular servicing, and marketing support.',
  },
  {
    q: 'How can I receive detailed franchise investment and financial details?',
    a: 'Click on the "WhatsApp Us" or "Call Now" buttons on this page to directly connect with our franchise team. We will share comprehensive franchise documentation tailored to your target city.',
  },
];

export default function Business() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const whatsappUrl = getWhatsAppUrl(FRANCHISE_WHATSAPP_MSG);

  return (
    <PageShell name="business">
      <SEO
        title="Start Your JuiceTap Franchise | Automated Fresh Juice Business"
        description="Build a high-ROI fresh orange juice business with JuiceTap automated vending technology. Turnkey franchise opportunity with remote IoT monitoring & full support."
        path="/business"
      />

      {/* ===== 1. PREMIUM FRANCHISE HERO & IMMEDIATE CTAS ===== */}
      <section className="franchise-hero">
        <div className="franchise-hero__bg-blur" />
        <div className="jt-tech-grid" />
        <CitrusField variant="particles" density={7} />

        <FloatingElement className="jt-hero-art franchise-hero__slice" amplitude={12} rotate={9} duration={9}>
          <OrangeSlice size="100%" />
        </FloatingElement>

        <div className="container">
          <div className="franchise-hero__grid">
            {/* Left Content */}
            <div className="franchise-hero__content">
              <motion.span
                className="franchise-hero__badge"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <span className="badge-dot" /> High-Growth Business Opportunity
              </motion.span>

              <TextReveal
                as="h1"
                className="franchise-hero__title"
                text="Start Your Own JuiceTap Franchise"
                delay={0.16}
              />

              <motion.p
                className="franchise-hero__subtitle"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                Build a modern fresh-juice business powered by smart, automated vending technology. Serve 100% natural, freshly squeezed orange juice with minimal operational complexity.
              </motion.p>

              {/* IMMEDIATE CONTACT OPTIONS (Above the fold) */}
              <motion.div
                className="franchise-hero__cta-box"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="franchise-btn franchise-btn--whatsapp"
                  aria-label="WhatsApp Us for Franchise Details"
                >
                  <WhatsAppIcon size={20} className="btn-icon" />
                  <span>WhatsApp Us</span>
                </a>

                <a
                  href={CONTACT.phoneTel}
                  className="franchise-btn franchise-btn--call"
                  aria-label="Call JuiceTap Franchise Team"
                >
                  <PhoneIcon size={20} className="btn-icon" />
                  <span>Call Now</span>
                </a>
              </motion.div>

              {/* Professional Trust Indicators (SVG Only) */}
              <motion.div
                className="franchise-hero__trust-row"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.8 } },
                }}
              >
                {[
                  { icon: <MachineIcon size={16} className="trust-svg" />, label: 'Automated Squeezing' },
                  { icon: <SparklesIcon size={16} className="trust-svg" />, label: 'Real-time IoT Monitoring' },
                  { icon: <ShieldIcon size={16} className="trust-svg" />, label: 'End-to-End Setup Support' },
                ].map((item) => (
                  <motion.div
                    className="trust-pill"
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    {item.icon} {item.label}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Visual */}
            <Parallax className="franchise-hero__visual-col" speed={18}>
              <ImageReveal
                src="/assets/machine-office.png"
                alt="JuiceTap automated fresh orange juice vending machine"
                className="visual-card"
                imgClassName="visual-card__img"
                from="bottom"
                loading="eager"
              >
                <motion.div
                  className="visual-card__badge"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="badge-text">Smart Vending</span>
                  <span className="badge-sub">100% Natural Fresh Juice</span>
                </motion.div>
              </ImageReveal>
            </Parallax>
          </div>
        </div>
      </section>

      <CitrusDivider variant="arc" from="transparent" to="#FFFFFF" />

      {/* ===== 2. WHY CHOOSE JUICETAP FRANCHISE ===== */}
      <section className="section jt-section jt-section--wash section-why">
        <CitrusGlow size={500} top="-6%" right="-12%" color="rgba(240, 129, 33, 0.13)" duration={18} />

        <div className="container">
          <SectionHeading
            label="Why JuiceTap"
            title="Why Choose JuiceTap Franchise?"
            subtitle="A technology-first fresh juice solution designed for high footfall locations and seamless operations."
          />

          <Stagger className="why-grid" gap={0.09}>
            {WHY_ITEMS.map((item) => (
              <StaggerItem key={item.title} className="why-card jt-card jt-card--accent">
                <div className="why-card__icon jt-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="peel" from="#FFFFFF" to="#FFF9F2" />

      {/* ===== 3. FRANCHISE BENEFITS ===== */}
      <section className="section jt-section jt-section--wash-cream section-benefits">
        <div className="container">
          <SectionHeading
            label="Franchisee Advantages"
            title="Key Benefits of Partnering With Us"
            subtitle="Designed to offer convenience, quality, and smooth business growth."
          />

          <Stagger className="benefits-grid" gap={0.08}>
            {FRANCHISE_BENEFITS.map((item) => (
              <StaggerItem key={item.title} className="benefit-card jt-card">
                <div className="benefit-card__icon jt-card-icon jt-card-icon--forest">{item.icon}</div>
                <div className="benefit-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="arc" from="#FFF9F2" to="#FFFFFF" />

      {/* ===== 4. HOW THE FRANCHISE WORKS ===== */}
      <section className="section jt-section jt-section--wash section-process">
        <div className="container">
          <SectionHeading
            label="Simple 5-Step Process"
            title="How the Franchise Process Works"
            subtitle="From initial enquiry to machine installation, we make the journey smooth and transparent."
          />

          <div className="process-timeline-wrap">
            {/* A juice line linking the five steps into one journey. */}
            <motion.span
              className="process-timeline__connector"
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />

            <Stagger className="process-timeline" gap={0.11} delay={0.25}>
              {FRANCHISE_STEPS.map((step) => (
                <StaggerItem key={step.step} className="process-step jt-card">
                  <div className="process-step__number jt-step-num">{step.step}</div>
                  <div className="process-step__content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <CitrusDivider variant="peel" from="#FFFFFF" to="#FFF9F2" />

      {/* ===== 5. IDEAL LOCATIONS FOR JUICETAP ===== */}
      <section className="section jt-section jt-section--wash-cream section-locations">
        <CitrusGlow size={460} bottom="0%" left="-12%" color="rgba(240, 129, 33, 0.12)" duration={20} />

        <div className="container">
          <SectionHeading
            label="Prime Deployment Sites"
            title="Where JuiceTap Franchise Thrives"
            subtitle="Deploy machines in high-traffic hubs with continuous daily customer footfall."
          />

          <Stagger className="biz-sites-grid" gap={0.07}>
            {BUSINESS_LOCATIONS.map((loc) => (
              <StaggerItem key={loc.title} className="biz-site-card jt-card jt-card--accent">
                <div className="biz-site-card__icon jt-card-icon">
                  {LOCATION_ICONS[loc.title] || <BuildingIcon size={26} />}
                </div>
                <h3>{loc.title}</h3>
                <p>{loc.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ===== 6. INVESTMENT / OPPORTUNITY CARD ===== */}
      <section className="section jt-section jt-section--wash-cream section-investment">
        <div className="container">
          <Reveal className="investment-card" variant="scale" duration={0.75}>
            <div className="jt-tech-grid" />
            <CitrusField variant="particles" density={6} tone="dark" />

            <div className="investment-card__content">
              <span className="label text-white-opaque">Investment &amp; Details</span>
              <h2>Get Complete Franchise &amp; Investment Info</h2>
              <p>
                Connect directly with our team to receive complete details on machine specifications, site requirements, and franchise onboarding guidance.
              </p>
            </div>
            <div className="investment-card__actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="franchise-btn franchise-btn--whatsapp"
              >
                <WhatsAppIcon size={20} className="btn-icon" />
                <span>Request Details on WhatsApp</span>
              </a>
              <a href={CONTACT.phoneTel} className="franchise-btn franchise-btn--call-white">
                <PhoneIcon size={20} className="btn-icon" />
                <span>Call Now</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <CitrusDivider variant="arc" from="#FFF9F2" to="#FFFFFF" />

      {/* ===== 7. WHAT JUICETAP PROVIDES (SUPPORT) ===== */}
      <section className="section jt-section jt-section--wash section-support">
        <div className="container">
          <SectionHeading
            label="Complete Assistance"
            title="What JuiceTap Provides"
            subtitle="We partner with you at every stage to ensure operational excellence and brand consistency."
          />

          <Stagger className="support-grid" gap={0.09}>
            {SUPPORT_ITEMS.map((sup, idx) => (
              <StaggerItem key={sup.title} className="support-card jt-card jt-card--accent">
                <div className="support-card__header-row">
                  <div className="support-card__icon jt-card-icon jt-card-icon--forest">{sup.icon}</div>
                  <span className="support-card__num">0{idx + 1}</span>
                </div>
                <h3>{sup.title}</h3>
                <p>{sup.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="peel" from="#FFFFFF" to="#FFF9F2" />

      {/* ===== 8. FREQUENTLY ASKED QUESTIONS ===== */}
      <section className="section jt-section jt-section--wash-cream section-faq">
        <div className="container container-narrow">
          <SectionHeading
            label="Got Questions?"
            title="Franchise Frequently Asked Questions"
            subtitle="Everything you need to know about starting a JuiceTap franchise."
          />

          <Stagger className="faq-list" gap={0.06}>
            {FAQS.map((faq, idx) => (
              <StaggerItem
                key={faq.q}
                className={`faq-item ${openFaq === idx ? 'faq-item--open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon-wrap">
                    <ChevronDownIcon size={18} className={`faq-chevron ${openFaq === idx ? 'faq-chevron--open' : ''}`} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      className="faq-answer-wrap"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CitrusDivider variant="pour" from="#FFF9F2" to="#0F381E" />

      {/* ===== 9. FINAL CONVERSION CTA ===== */}
      <section className="section jt-section jt-section--wash-dark final-cta">
        <div className="jt-tech-grid" />
        <CitrusField variant="particles" density={7} tone="dark" />

        <div className="container text-center">
          <Reveal variant="up">
            <span className="jt-eyebrow jt-eyebrow--light">Take the Next Step</span>
            <h2 className="final-cta__title">Ready to Start Your JuiceTap Business?</h2>
            <p className="final-cta__desc">
              Talk to our franchise team today and explore how you can bring JuiceTap to your location.
            </p>
            <div className="final-cta__actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="franchise-btn franchise-btn--whatsapp franchise-btn--lg"
              >
                <WhatsAppIcon size={22} className="btn-icon" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={CONTACT.phoneTel}
                className="franchise-btn franchise-btn--call-white franchise-btn--lg"
              >
                <PhoneIcon size={22} className="btn-icon" />
                <span>Call Now</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 10. MOBILE STICKY BOTTOM CONTACT BAR ===== */}
      <div className="mobile-sticky-bar" aria-label="Quick contact actions">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-sticky-btn mobile-sticky-btn--whatsapp"
        >
          <WhatsAppIcon size={20} className="btn-icon" />
          <span>WhatsApp</span>
        </a>

        <a href={CONTACT.phoneTel} className="mobile-sticky-btn mobile-sticky-btn--call">
          <PhoneIcon size={20} className="btn-icon" />
          <span>Call Now</span>
        </a>
      </div>
    </PageShell>
  );
}
