import { motion } from 'framer-motion';
import { GooglePlayIcon, AppleStoreIcon, SparklesIcon, LocationIcon, JuiceIcon } from '../Icons/Icons';
import appScreenImg from '../../assets/app-screen.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 }
};

const APP_BENEFITS = [
  {
    icon: <JuiceIcon size={20} />,
    title: 'Fresh Juice Anytime',
    desc: 'Use the app to easily access JuiceTap machines.'
  },
  {
    icon: <SparklesIcon size={20} />,
    title: 'Exclusive Offers',
    desc: 'Discover special offers and rewards available through the app.'
  },
  {
    icon: <LocationIcon size={20} />,
    title: 'Find JuiceTap Machines',
    desc: 'Easily discover nearby JuiceTap machines.'
  },
  {
    icon: '⚡',
    title: 'Quick & Easy',
    desc: 'A simple way to enjoy your favourite fresh juice.'
  }
];

export default function AppDownload() {
  return (
    <section className="app-download-section section">
      <div className="container">
        <div className="app-download-grid">
          {/* LEFT CONTENT */}
          <motion.div className="app-download-content" {...fadeUp}>
            <div className="app-download-badge">
              <SparklesIcon size={14} /> JUICETAP APP
            </div>

            <h2 className="app-download-title">
              Your Juice. <span className="title-accent">Your App.</span> Your Rewards.
            </h2>

            <p className="app-download-desc">
              Download the JuiceTap app to enjoy fresh juice from our smart machines, discover exclusive offers, and make every sip more rewarding.
            </p>

            <div className="app-download-tagline">
              <span>Fresh juice is just a tap away.</span>
            </div>

            {/* BENEFITS GRID */}
            <div className="app-benefits-grid">
              {APP_BENEFITS.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="app-benefit-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  <div className="app-benefit-icon">
                    {typeof item.icon === 'string' ? <span>{item.icon}</span> : item.icon}
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* STORE BUTTONS & QR CODES */}
            <div className="app-qr-section">
              <div className="app-qr-grid">
                {/* Google Play QR Card */}
                <div className="app-qr-card">
                  <div className="app-qr-code-box">
                    <img src="/assets/play-store-qr.jpg" alt="Scan QR code for Google Play" className="app-qr-img" />
                  </div>
                  <a
                    href="https://play.google.com/store/apps/details?id=juicetap.engageflake.consumer.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-btn store-btn--google"
                    aria-label="Get it on Google Play"
                  >
                    <div className="store-btn__icon">
                      <GooglePlayIcon size={22} />
                    </div>
                    <div className="store-btn__text">
                      <span className="store-btn__sub">GET IT ON</span>
                      <span className="store-btn__main">Google Play</span>
                    </div>
                  </a>
                </div>

                {/* App Store QR Card */}
                <div className="app-qr-card">
                  <div className="app-qr-code-box">
                    <img src="/assets/app-store-qr.jpg" alt="Scan QR code for App Store" className="app-qr-img" />
                  </div>
                  <a
                    href="https://apps.apple.com/app/id6751802193"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-btn store-btn--apple"
                    aria-label="Download on the App Store"
                  >
                    <div className="store-btn__icon">
                      <AppleStoreIcon size={24} />
                    </div>
                    <div className="store-btn__text">
                      <span className="store-btn__sub">Download on the</span>
                      <span className="store-btn__main">App Store</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT VISUAL / MOCKUP */}
          <motion.div
            className="app-download-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="app-mockup-glow" />
            <div className="app-mockup-container">
              {/* Phone Frame Mockup */}
              <div className="phone-frame">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="phone-screen-crop">
                    <img src={appScreenImg} alt="JuiceTap Mobile App Interface" className="phone-app-screenshot" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
