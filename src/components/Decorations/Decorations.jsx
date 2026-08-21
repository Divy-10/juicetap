import { motion } from 'framer-motion';
import glassSplashImg from '../../assets/glass-orange-splash.png';

export const GlassOrb = ({ size = 80, top = '10%', right = '5%', left, bottom, delay = 0 }) => (
  <motion.div
    className="glass-orb-wrapper"
    style={{ top, right, left, bottom, width: size, height: size }}
    animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay }}
  >
    <div className="glass-orb-core" />
  </motion.div>
);

export const FloatingOrangeSplash = ({ top = '5%', right = '8%', size = 180 }) => (
  <motion.div
    className="floating-splash-container"
    style={{ top, right, width: size }}
    animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
    transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
  >
    <img src={glassSplashImg} alt="Glass Orange Juice Splash" className="glass-splash-img" />
  </motion.div>
);

export const FluidWaveDivider = ({ flip = false, fill = '#FFF9F2' }) => (
  <div className={`fluid-wave-divider ${flip ? 'fluid-wave-divider--flip' : ''}`}>
    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,58.7C672,43,768,21,864,21.3C960,21,1056,43,1152,53.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
        fill={fill}
      />
    </svg>
  </div>
);
