import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import ContactForm from '../../components/ContactForm/ContactForm';
import PageShell from '../../components/PageShell/PageShell';
import { Reveal, TextReveal, Stagger, StaggerItem, FloatingElement } from '../../components/Motion/Motion';
import {
  CitrusField,
  CitrusGlow,
  CitrusDivider,
  OrangeSlice,
  LeafSprig,
  PeelCurve,
} from '../../components/Citrus/Citrus';
import { BuildingIcon, PhoneIcon, EmailIcon, WhatsAppIcon, LocationIcon } from '../../components/Icons/Icons';
import { COMPANY, CONTACT } from '../../data/constants';

/* Contact storytelling: HUMAN INTERACTION.
   Warm, open and unhurried — soft drifting citrus, a gently breathing
   background, and a form that assembles itself line by line rather
   than appearing as one intimidating slab. */

export default function Contact() {
  return (
    <PageShell name="contact">
      <SEO
        title="Contact Us"
        description="Get in touch with JuiceTap. Reach out for general enquiries, franchise opportunities, or machine locations. Call us, email us, or send a WhatsApp message."
        path="/contact"
      />

      {/* ===== HERO ===== */}
      <section className="page-hero contact-hero">
        <CitrusField variant="bubbles" density={8} />

        <div className="container">
          <div className="contact-hero__layout">
            <div className="page-hero__content">
              <motion.span
                className="jt-hero-badge"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="jt-hero-badge__dot" />
                Contact Us
              </motion.span>

              <TextReveal as="h1" text="Let's Talk Freshness" delay={0.18} />
              <span className="contact-hero__rule" />

              <motion.p
                className="text-large"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
              >
                Have questions about our machines, locations, or franchise opportunities? We're here to help.
              </motion.p>
            </div>

            {/* The three citrus pieces now live inside one composed cluster so they
                cannot collide or blow up in scale against the section. */}
            <div className="contact-hero__cluster" aria-hidden="true">
              <div className="contact-hero__cluster-disc" />
              <div className="contact-hero__cluster-ring" />
              <div className="contact-hero__cluster-ring contact-hero__cluster-ring--inner" />

              <FloatingElement className="jt-hero-art contact-hero__peel" amplitude={10} rotate={-7} duration={11} delay={1.2}>
                <PeelCurve size="100%" id="contact" />
              </FloatingElement>
              <FloatingElement className="jt-hero-art contact-hero__slice" amplitude={15} rotate={11} duration={8.5}>
                <OrangeSlice size="100%" />
              </FloatingElement>
              <FloatingElement className="jt-hero-art contact-hero__leaf" amplitude={9} rotate={13} duration={9} delay={0.5}>
                <LeafSprig size="100%" id="contact" />
              </FloatingElement>
            </div>
          </div>
        </div>
      </section>

      <CitrusDivider variant="arc" from="transparent" to="#FFFFFF" />

      {/* ===== CONTACT DETAILS + FORM ===== */}
      <section className="section jt-section jt-section--wash contact-section">
        <CitrusGlow size={540} top="-6%" left="-14%" color="rgba(240, 129, 33, 0.13)" duration={17} />
        <CitrusGlow size={460} bottom="4%" right="-12%" color="rgba(46, 125, 50, 0.08)" duration={21} />

        <div className="container">
          <div className="contact-grid">
            <Reveal className="contact-info" variant="left" distance={34}>
              <span className="jt-eyebrow">Reach Us</span>
              <h2>Get in Touch</h2>
              <p className="contact-info__intro">Choose the most convenient way to reach us. Our team is ready to assist you.</p>

              <Stagger className="contact-info__details" gap={0.1} delay={0.12}>
                <StaggerItem className="contact-info__item">
                  <div className="contact-info__icon">
                    <BuildingIcon size={24} />
                  </div>
                  <div>
                    <h3>Office Address</h3>
                    <p>{COMPANY.name}</p>
                    <p>{COMPANY.address}</p>
                  </div>
                </StaggerItem>

                <StaggerItem className="contact-info__item">
                  <div className="contact-info__icon">
                    <PhoneIcon size={24} />
                  </div>
                  <div>
                    <h3>Phone</h3>
                    <p>
                      <a href={CONTACT.phoneTel} className="contact-link" aria-label="Call JuiceTap">
                        CALL NOW
                      </a>
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem className="contact-info__item">
                  <div className="contact-info__icon">
                    <EmailIcon size={24} />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <p>
                      <a href={CONTACT.emailLink} className="contact-link" aria-label="Email JuiceTap">
                        {CONTACT.email}
                      </a>
                    </p>
                  </div>
                </StaggerItem>
              </Stagger>

              <Stagger className="contact-actions" gap={0.08} delay={0.2}>
                <StaggerItem as="span" className="contact-actions__item">
                  <a href={CONTACT.phoneTel} className="btn btn-dark btn-md">
                    <PhoneIcon size={16} /> CALL NOW
                  </a>
                </StaggerItem>
                <StaggerItem as="span" className="contact-actions__item">
                  <a href={CONTACT.whatsappUrl} className="btn btn-whatsapp btn-md" target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon size={16} /> WhatsApp Us
                  </a>
                </StaggerItem>
                <StaggerItem as="span" className="contact-actions__item">
                  <a href={COMPANY.mapUrl} className="btn btn-secondary btn-md" target="_blank" rel="noopener noreferrer">
                    <LocationIcon size={16} /> Get Directions
                  </a>
                </StaggerItem>
              </Stagger>
            </Reveal>

            <Reveal className="contact-form-container" variant="right" delay={0.12} distance={34}>
              <div className="contact-form-card jt-card jt-card--accent">
                <h2>Send a Message</h2>
                <p>Fill out the form below and we will get back to you via WhatsApp.</p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
