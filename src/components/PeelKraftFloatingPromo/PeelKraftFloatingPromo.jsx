import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PeelKraftFloatingPromo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);

  useEffect(() => {
    // Entrance animation delay on page load (resets on page refresh)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseCard = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleDismissTab = (e) => {
    e.stopPropagation();
    setIsTemporarilyHidden(true); // Temporarily hide during current view; shows again on page refresh
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    window.open(
      'https://www.peelkraft.in/products/peelkraft-candied-orange-peel-bites-package',
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (isTemporarilyHidden || !isVisible) return null;

  return (
    <aside 
      className="peelkraft-promo-container" 
      aria-label="PeelKraft Special Promotion"
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Small Floating Side Toggle Tab with Seamlessly Integrated Cancel Icon
          <motion.div
            key="toggle-tab-group"
            className="peelkraft-side-tab-wrapper"
            initial={{ x: 65, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 65, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div
              className="peelkraft-side-tab"
              onClick={handleToggle}
              role="button"
              tabIndex={0}
              aria-expanded="false"
              aria-label="Open PeelKraft promotion"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggle(); }}
            >
              <div className="peelkraft-side-tab__content">
                <img 
                  src="/assets/peelkraft-logo.png" 
                  alt="PeelKraft" 
                  className="peelkraft-side-tab__logo"
                />
                <span className="peelkraft-side-tab__label">Discover</span>
                <span className="peelkraft-side-tab__arrow">&larr;</span>

                {/* Vertical Divider & Integrated Cancel Icon */}
                <span className="peelkraft-side-tab__divider" />
                <span
                  className="peelkraft-side-tab__cancel"
                  onClick={handleDismissTab}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDismissTab(e); }}
                  role="button"
                  tabIndex={0}
                  aria-label="Temporarily close option"
                  title="Close option"
                >
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          // Compact Product Showcase Card
          <motion.div
            key="product-card"
            className="peelkraft-promo-card"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header: Brand info on Left, Close Button neatly aligned on Right */}
            <div className="peelkraft-promo-card__top">
              <div className="peelkraft-promo-card__brand">
                <span className="peelkraft-promo-card__badge">JUICETAP &times; PEELKRAFT</span>
                <img
                  src="/assets/peelkraft-logo.png"
                  alt="PeelKraft Logo"
                  className="peelkraft-promo-card__logo"
                />
              </div>

              <button
                type="button"
                className="peelkraft-promo-card__close"
                onClick={handleCloseCard}
                aria-label="Close PeelKraft promotion"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Product Image */}
            <div className="peelkraft-promo-card__image-container">
              <img
                src="/assets/peelkraft-product.jpg"
                alt="Candied Orange Peel Bites Packaging"
                className="peelkraft-promo-card__image"
              />
            </div>

            {/* Product Content */}
            <div className="peelkraft-promo-card__body">
              <h3 className="peelkraft-promo-card__title">Candied Orange Peel Bites</h3>
              <p className="peelkraft-promo-card__desc">
                Premium Candied Orange Peel Bites made from naturally sweet orange peels, carefully crafted into delicious, chewy bites with a perfect balance of citrusy freshness and sweetness. A unique &ldquo;From Waste to Wonder&rdquo; treat that turns upcycled orange peels into something delightful.
              </p>

              {/* Buy Now CTA */}
              <button
                type="button"
                className="peelkraft-promo-card__cta"
                onClick={handleBuyNow}
              >
                BUY NOW &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
