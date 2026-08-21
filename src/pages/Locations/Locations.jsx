import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SEO from '../../components/SEO';
import Button from '../../components/Button/Button';
import PageShell from '../../components/PageShell/PageShell';
import { Reveal, TextReveal, Stagger, StaggerItem, CountUp } from '../../components/Motion/Motion';
import { CitrusField, CitrusGlow, CitrusDivider } from '../../components/Citrus/Citrus';
import { LocationIcon, BuildingIcon, NavigationIcon, WhatsAppIcon, CloseIcon, SearchIcon } from '../../components/Icons/Icons';
import { LOCATIONS as STATIC_LOCATIONS, getWhatsAppUrl, getDirectionsUrl, WHATSAPP_MESSAGES } from '../../data/constants';
import { fetchLocations } from '../../services/locationService';

/* Locations: a dotted map of India with a red pin on every JuiceTap city.
   Pin positions are percentages of the map image, calibrated to the cities'
   real latitude/longitude. */

const CITY_PINS = [
  { name: 'Delhi', x: 40.1, y: 26.4 },
  { name: 'Jaipur', x: 35.6, y: 34.0 },
  { name: 'Ahmedabad', x: 25.6, y: 51.3 },
  { name: 'Statue of Unity', x: 29.2, y: 56.6 },
  { name: 'Surat', x: 26.4, y: 59.5 },
  { name: 'Mumbai', x: 26.6, y: 68.8 },
];

function LocationPin() {
  return (
    <svg viewBox="0 0 24 34" className="loc-pin__svg" aria-hidden="true" focusable="false">
      <path
        d="M12 0.5C6.2 0.5 1.5 5.2 1.5 11c0 7.6 9 20.6 10.5 22.6C13.5 31.6 22.5 18.6 22.5 11 22.5 5.2 17.8 0.5 12 0.5z"
        fill="#E53935"
        stroke="#B71C1C"
        strokeWidth="0.75"
      />
      <circle cx="12" cy="11" r="4" fill="#FFFFFF" />
    </svg>
  );
}

function IndiaLocationMap() {
  return (
    <div className="loc-india-map">
      <img
        src="/assets/india-dotted-map.png"
        alt="Map of India showing active JuiceTap locations"
        className="loc-india-map__img"
        loading="lazy"
      />
      {CITY_PINS.map((c) => (
        <span
          className="loc-pin"
          key={c.name}
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
          title={c.name}
        >
          <span className="loc-pin__halo" aria-hidden="true" />
          <LocationPin />
        </span>
      ))}
    </div>
  );
}

export default function Locations() {
  const [locations, setLocations] = useState(STATIC_LOCATIONS);
  const [apiError, setApiError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const result = await fetchLocations();

      if (!isMounted) return;

      if (result.success && Array.isArray(result.groupedLocations) && result.groupedLocations.length > 0) {
        setLocations(result.groupedLocations);
      } else if (result.isConfigured && !result.success) {
        setApiError(result.error || 'Locations are temporarily unavailable. Please check again shortly.');
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lock background scroll while the venue drawer is open.
  useEffect(() => {
    if (!selectedCity) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selectedCity]);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!selectedCity) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedCity(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCity]);

  const query = searchQuery.trim().toLowerCase();

  const filteredLocations = locations
    .map((loc) => {
      // 1. Tab filter check
      if (activeTab !== 'ALL' && loc.city.toUpperCase() !== activeTab.toUpperCase()) {
        return null;
      }

      if (!query) return loc;

      // 2. City level match
      const cityMatches = loc.city.toLowerCase().includes(query) ||
                          (loc.state && loc.state.toLowerCase().includes(query)) ||
                          (loc.description && loc.description.toLowerCase().includes(query));

      // 3. Sub-location / venue level match
      const matchingSubLocations = loc.subLocations?.filter(sub =>
        sub.name?.toLowerCase().includes(query) ||
        sub.address?.toLowerCase().includes(query) ||
        sub.type?.toLowerCase().includes(query)
      );

      if (cityMatches) {
        return loc;
      }

      if (matchingSubLocations && matchingSubLocations.length > 0) {
        return {
          ...loc,
          subLocations: matchingSubLocations
        };
      }

      return null;
    })
    .filter(Boolean);

  const totalVenuesCount = locations.reduce((acc, loc) => acc + (loc.subLocations?.length || 0), 0);

  return (
    <PageShell name="locations">
      <SEO title="Locations & Addresses | JuiceTap Vending Machines" description="Explore all JuiceTap fresh orange juice vending machine locations across Surat, Mumbai, Ahmedabad, Delhi, Jaipur, and Statue of Unity with exact addresses." path="/locations" />

      {/* ===== HERO — live network map ===== */}
      <section className="page-hero locations-hero">
        <CitrusField variant="particles" density={7} />

        <div className="container">
          <div className="locations-hero__layout">
            <div className="locations-hero__copy">
              <div className="page-hero__content">
            <motion.span
              className="jt-hero-badge"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="jt-hero-badge__dot" />
              Network &amp; Venues
            </motion.span>

            <TextReveal as="h1" text="Find Freshness Near You" delay={0.18} />

            <motion.p
              className="text-large"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              Search or click on any city below to view active JuiceTap kiosk addresses, hospitals, corporate towers, and venues.
            </motion.p>
          </div>

          {/* Search Bar Input */}
          {locations.length > 0 && (
            <motion.div
              className="location-search-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="location-search-box">
                <SearchIcon size={18} className="location-search-icon" />
                <input
                  type="text"
                  className="location-search-input"
                  placeholder="Search city, venue, mall, or address..."
                  aria-label="Search JuiceTap locations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="location-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Single-Line Scrollable City Filter Pills */}
          {locations.length > 0 && (
            <motion.div
              className="city-filter-pills"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className={`city-pill ${activeTab === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveTab('ALL')}
                aria-pressed={activeTab === 'ALL'}
              >
                <BuildingIcon size={16} />
                {/* Wrapped so the pill has exactly two flex children —
                    otherwise the pill's 6px gap lands inside the label. */}
                <span>All Cities (<CountUp to={totalVenuesCount} duration={1.1} /> Venues)</span>
              </button>
              {locations.map((loc) => (
                <button
                  key={loc.city}
                  className={`city-pill ${activeTab === loc.city ? 'active' : ''}`}
                  onClick={() => setActiveTab(loc.city)}
                  aria-pressed={activeTab === loc.city}
                >
                  <LocationIcon size={16} />
                  <span>{loc.city} ({loc.subLocations?.length || 0})</span>
                </button>
              ))}
            </motion.div>
          )}
            </div>

            {/* Dotted map of India with a red pin on every JuiceTap city.
                In-flow column, so the hero grows to show the FULL map. */}
            <div className="locations-hero__map">
              <IndiaLocationMap />
            </div>
          </div>
        </div>
      </section>

      <CitrusDivider variant="arc" from="transparent" to="#FFFFFF" />

      {/* Main Locations Grid */}
      <section className="section jt-section jt-section--wash locations-main-section">
        <CitrusGlow size={520} top="10%" right="-14%" color="rgba(240, 129, 33, 0.12)" duration={18} />

        <div className="container">

          {/* API ERROR FALLBACK STATE */}
          {apiError && (
            <Reveal className="locations-state-card" variant="scale">
              <div className="locations-state-icon">🍊</div>
              <h3>Locations Temporarily Unavailable</h3>
              <p>{apiError}</p>
            </Reveal>
          )}

          {/* EMPTY LOCATIONS STATE */}
          {!apiError && filteredLocations.length === 0 && (
            <Reveal className="locations-state-card" variant="scale">
              <div className="locations-state-icon">📍</div>
              {searchQuery ? (
                <>
                  <h3>No locations found matching "{searchQuery}"</h3>
                  <p>Try searching for a different city, mall, address, or clear your search query.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ marginTop: '1rem' }}
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('ALL');
                    }}
                  >
                    Show All Locations
                  </Button>
                </>
              ) : (
                <>
                  <h3>JuiceTap locations are coming soon.</h3>
                  <p>We are actively expanding to new venues near you. Check back shortly!</p>
                </>
              )}
            </Reveal>
          )}

          {/* ACTIVE LOCATIONS GRID */}
          {!apiError && filteredLocations.length > 0 && (
            <Stagger className="locations-grid" gap={0.08} key={`${activeTab}-${query}`}>
              {filteredLocations.map((loc) => (
                <StaggerItem
                  key={loc.city}
                  className="location-card location-card--interactive jt-card"
                  role="button"
                  tabIndex={0}
                  aria-label={`View all JuiceTap venues in ${loc.city}`}
                  onClick={() => setSelectedCity(loc)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCity(loc);
                    }
                  }}
                >
                  <div className="location-card__image-wrap jt-card-media">
                    <img src={loc.image || '/assets/business-locations.png'} alt={loc.city} loading="lazy" />
                    <span className="location-card__count-badge">
                      {loc.subLocations?.length || 0} Venues &amp; Spots
                    </span>
                  </div>

                  <div className="location-card__header">
                    <div className="location-card__title-group">
                      <div className="location-card__city-row">
                        <h2 className="location-card__city">{loc.city}</h2>
                        <span className="location-card__badge location-card__badge--available">
                          <span className="location-card__badge-dot" />
                          Available Now
                        </span>
                      </div>
                      {loc.state && (
                        <p className="location-card__state"><LocationIcon size={14} /> {loc.state}</p>
                      )}
                    </div>
                  </div>

                  <p className="location-card__desc">{loc.description}</p>

                  <div className="location-card__action-row">
                    <span className="view-sub-btn jt-arrow-link">
                      View All Addresses
                      <span className="jt-arrow-link__icon" aria-hidden="true">→</span>
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* SUB-LOCATION VENUES MODAL DRAWER */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            className="sublocation-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCity(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`JuiceTap venues in ${selectedCity.city}`}
          >
            <motion.div
              className="sublocation-modal-content"
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  {selectedCity.state && (
                    <span className="modal-subtitle"><LocationIcon size={14} /> {selectedCity.state}</span>
                  )}
                  <h2>{selectedCity.city} — Active JuiceTap Venues ({selectedCity.subLocations?.length || 0})</h2>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedCity(null)} aria-label="Close modal">
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="sublocations-list">
                {selectedCity.subLocations?.map((sub, idx) => (
                  <motion.div
                    key={`${selectedCity.city}-${sub.id || sub.name}-${idx}`}
                    className="sublocation-item-card"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="sublocation-item-info">
                      <div className="sublocation-header-row">
                        <h3>{sub.name}</h3>
                        {sub.type && (
                          <span className="sublocation-type-tag">{sub.type}</span>
                        )}
                      </div>
                      {sub.rawAddress ? (
                        <p className="sublocation-address">
                          📍 <strong>Full Address:</strong> {sub.rawAddress} {sub.pincode ? `- ${sub.pincode}` : ''}
                        </p>
                      ) : sub.address ? (
                        <p className="sublocation-address">
                          📍 <strong>Full Address:</strong> {sub.address}
                        </p>
                      ) : null}

                      <div className="sublocation-meta-row">
                        {sub.timings && (
                          <span className="sublocation-meta-item">🕒 {sub.timings}</span>
                        )}
                        {sub.phone && (
                          <span className="sublocation-meta-item">📞 {sub.phone}</span>
                        )}
                        {sub.city && (
                          <span className="sublocation-meta-item">🏢 {sub.city}, {sub.state || ''}</span>
                        )}
                      </div>

                      <div className="sublocation-actions">
                        <Button
                          variant="primary"
                          size="sm"
                          href={getDirectionsUrl(sub.latitude, sub.longitude, sub.rawAddress || sub.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          leftIcon={<NavigationIcon size={14} />}
                          aria-label={`Get GPS directions to ${sub.name}`}
                        >
                          Navigate via GPS
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setSelectedCity(null)}>Close Venues List</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CitrusDivider variant="peel" from="#FFFFFF" to="#FFF9F2" />

      <section className="section jt-section jt-section--wash-cream locations-cta">
        <CitrusGlow size={480} bottom="-10%" left="-10%" color="rgba(240, 129, 33, 0.14)" duration={20} />

        <div className="container text-center">
          <Reveal variant="up">
            <span className="jt-eyebrow">Expand With Us</span>
            <h2>Want JuiceTap at Your Office or Venue?</h2>
            <p className="text-large" style={{ maxWidth: '560px', margin: '0 auto var(--space-xl)' }}>
              We deploy smart orange juice machines in offices, hospitals, malls &amp; hubs across India.
            </p>
            <Button href={getWhatsAppUrl(WHATSAPP_MESSAGES.location)} variant="whatsapp" size="lg" icon={<WhatsAppIcon size={20} />}>
              Request Installation
            </Button>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
