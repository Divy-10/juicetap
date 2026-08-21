import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PROCESS_DATA } from './processData';

/* Sticky visual + scrolling steps. The upgrade here is the juice rail:
   one continuous track down the left of the step column whose fill
   pours from step to step, so the four steps read as a single journey
   (orange -> machine -> juice -> glass) rather than four separate cards. */

export default function ProcessVideoStory() {
  const [activeStep, setActiveStep] = useState(0);
  const [videoErrors, setVideoErrors] = useState({
    0: true,
    1: true,
    2: true,
    3: true
  });
  const videoRefs = useRef({});
  const reduced = useReducedMotion();

  // Monitor scroll intersections to update active step for desktop & mobile
  useEffect(() => {
    let ticking = false;

    const updateActiveStepOnScroll = () => {
      const stepElements = document.querySelectorAll('.process-story__text-block');
      if (!stepElements.length) return;

      const viewportCenter = window.innerHeight / 2;
      let closestStep = 0;
      let minDistance = Infinity;

      stepElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestStep = index;
        }
      });

      setActiveStep(closestStep);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveStepOnScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveStepOnScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Pre-flight check for videos
  useEffect(() => {
    PROCESS_DATA.forEach((item, idx) => {
      fetch(item.videoPath, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            setVideoErrors((prev) => ({ ...prev, [idx]: false }));
          }
        })
        .catch(() => {});
    });
  }, []);

  // Handle playing/pausing of videos based on active index
  useEffect(() => {
    PROCESS_DATA.forEach((_, idx) => {
      const videoEl = videoRefs.current[idx];
      if (videoEl) {
        if (idx === activeStep && !videoErrors[idx]) {
          videoEl.currentTime = 0;
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      }
    });
  }, [activeStep, videoErrors]);

  const handleVideoError = (idx) => {
    setVideoErrors((prev) => ({ ...prev, [idx]: true }));
  };

  const goToStep = (idx) => {
    setActiveStep(idx);
    const el = document.querySelector(`[data-step-index="${idx}"]`);
    if (el) {
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }
  };

  // How far the juice has poured down the rail, 0–100.
  const railProgress = ((activeStep + 1) / PROCESS_DATA.length) * 100;

  return (
    <div className="process-story">
      {/* Mobile Step Tabs */}
      <div className="process-story__mobile-tabs">
        {PROCESS_DATA.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`process-mobile-step-tab ${activeStep === idx ? 'is-active' : ''}`}
            onClick={() => goToStep(idx)}
            aria-current={activeStep === idx ? 'step' : undefined}
          >
            Step 0{idx + 1}
          </button>
        ))}
      </div>

      <div className="process-story__layout">
        {/* Left: Content Descriptions */}
        <div className="process-story__text-side">
          {/* The juice rail — one continuous track for the whole journey. */}
          <div className="process-story__rail" aria-hidden="true">
            <motion.span
              className="process-story__rail-fill"
              animate={{ height: `${railProgress}%` }}
              transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="process-story__text-blocks">
            {PROCESS_DATA.map((item, idx) => (
              <div
                key={item.id}
                className={`process-story__text-block ${activeStep === idx ? 'is-active' : ''}`}
                data-step-index={idx}
                role="button"
                tabIndex={0}
                aria-current={activeStep === idx ? 'step' : undefined}
                onClick={() => goToStep(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToStep(idx);
                  }
                }}
              >
                <div className="process-story__indicator-wrap">
                  <span className="process-story__step-tag">
                    <span className="process-story__step-tag-inner">0{idx + 1}</span>
                  </span>
                </div>
                <div className="process-story__block-content">
                  <h3 className="font-serif process-story__step-title">{item.title}</h3>
                  <p className="process-story__step-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right / Top: Sticky Visual Showcase */}
        <div className="process-story__visual-side">
          <div className="process-story__video-container">
            {/* Thin progress bar across the top of the viewport — shows
                where you are in the journey without extra chrome. */}
            <div className="process-story__viewport-progress" aria-hidden="true">
              <motion.span
                animate={{ width: `${railProgress}%` }}
                transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <AnimatePresence mode="wait">
              {PROCESS_DATA.map((item, idx) => {
                const imageFallback = `/assets/step-${idx + 1}.jpg`;
                return activeStep === idx && (
                  <motion.div
                    key={item.id}
                    className="process-story__video-wrapper"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    {!videoErrors[idx] ? (
                      <video
                        ref={(el) => { videoRefs.current[idx] = el; }}
                        src={item.videoPath}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        aria-label={`JuiceTap process — ${item.title}`}
                        className="process-story__element"
                        onError={() => handleVideoError(idx)}
                      />
                    ) : (
                      <img
                        src={imageFallback}
                        alt={item.title}
                        className="process-story__element"
                        loading="lazy"
                      />
                    )}
                    <div className="process-story__badge">Step 0{idx + 1}</div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
