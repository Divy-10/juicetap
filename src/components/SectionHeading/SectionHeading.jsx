import { motion } from 'framer-motion';

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className = '',
}) {
  return (
    <motion.div
      className={`section-heading section-heading-${align} ${dark ? 'section-heading-dark' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      {label && <span className="section-heading__label">{label}</span>}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
    </motion.div>
  );
}
