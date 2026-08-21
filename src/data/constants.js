/* ================================================
   JUICETAP — Site Constants & Data
   ================================================ */

export const SITE_NAME = 'JuiceTap';
export const SITE_TAGLINE = 'Fresh Juice. One Tap Away.';
export const SITE_URL = 'https://juicetap.in';

export const CONTACT = {
  phone: '+91 85115 33004',
  phoneRaw: '+918511533004',
  phoneTel: 'tel:+918511533004',
  whatsapp: '918511533004',
  whatsappUrl: 'https://wa.me/918511533004',
  email: 'support@juicetap.in',
  emailLink: 'mailto:support@juicetap.in',
};

export const COMPANY = {
  name: 'JUICETAP GLOBAL PRIVATE LIMITED',
  address: 'Plot 13-14, Nandini Farm, Tata Motors Lane, Bhatpore, Hazira, Surat, Gujarat 394510',
  mapUrl: 'https://maps.google.com/?q=JUICETAP+GLOBAL+PRIVATE+LIMITED+Hazira+Surat',
};

export const GOOGLE_BUSINESS_PROFILE_URL = 'https://www.google.com/search?kgmid=/g/11m63f5ml9&hl=en-IN&q=JUICETAP+GLOBAL+PVT+LTD&shem=epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/osrp/m5/1&kgs=37dfc24dbdee35dc&utm_source=epsd1,ltae,rimspwouoe,sh/x/loc/osrp/m5/1#lrd=0x3be04d005926f77f:0x9594640509ce63bb,1,,,,';

export const SOCIAL = {
  instagram: 'https://www.instagram.com/juicetap.global?igsh=MWVwaWZ4a3h2YmRpNA==',
  linkedin: 'https://www.linkedin.com/company/juicetap-global-pvt-ltd/posts/?feedView=all',
  youtube: 'https://www.youtube.com/@JuiceTap.Global',
  googleBusiness: GOOGLE_BUSINESS_PROFILE_URL,
};

export const WHATSAPP_MESSAGES = {
  general: 'Hi JuiceTap Team, I would like to know more about JuiceTap.',
  business: 'Hi JuiceTap Team, I am interested in the JuiceTap franchise opportunity.',
  machine: 'Hi JuiceTap Team, I would like to know more about your juice vending machines.',
  location: 'Hi JuiceTap Team, I would like to know about JuiceTap locations near me.',
};

export const getWhatsAppUrl = (message) => {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
};

export const getDirectionsUrl = (venue, cityName = '') => {
  if (!venue) return 'https://www.google.com/maps';

  if (venue.latitude && venue.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
  }

  const queryParts = [venue.name, venue.address, cityName].filter(Boolean);
  const query = queryParts.join(', ');
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Machine', path: '/machine' },
  { label: 'Locations', path: '/locations' },
  { label: 'Franchise', path: '/business' },
];

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Story', path: '/about' },
  ],
  explore: [
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Benefits', path: '/benefits' },
    { label: 'Machine', path: '/machine' },
    { label: 'Locations', path: '/locations' },
  ],
  business: [
    { label: 'Franchise Opportunity', path: '/business' },
    { label: 'Become a Franchisee', path: '/business' },
  ],
  support: [
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-and-conditions' },
  ],
};

export const LOCATIONS = [
  {
    city: 'Surat',
    state: 'Gujarat',
    status: 'available',
    description: 'Multiple JuiceTap machines active across key malls, offices & commercial hubs.',
    image: '/assets/surat-location.jpg',
    subLocations: [
      { name: 'VR Mall', address: 'Dumas Rd, Magdalla, Surat, Gujarat 395007', latitude: 21.1462, longitude: 72.7702, type: 'Shopping Mall', image: '/assets/business-locations.png' },
      { name: 'International Wealth Centre (IWC)', address: 'UG-5, International Wealth Centre, Vip Road, Golkiwad, Vesu, Surat, Gujarat 395002', latitude: 21.1524, longitude: 72.7758, type: 'Commercial Hub', image: '/assets/machine-office.png' },
      { name: 'Funstrike', address: 'Pal Gam, Surat, Gujarat 394510', latitude: 21.1963, longitude: 72.7842, type: 'Entertainment Zone', image: '/assets/step-4.png' },
      { name: 'Venus Hospital', address: 'SRSS Venus Hospital Rd, Rampura, Katargam Darwaja, Surat, Gujarat 395003', latitude: 21.2052, longitude: 72.8251, type: 'Healthcare Center', image: '/assets/hero-machine.png' },
      { name: 'SIDS Hospital', address: 'Ring Rd, near Shell Petrol Pump, Sosyo Circle, Khatodra Wadi, Surat, Gujarat 395002', latitude: 21.1714, longitude: 72.8362, type: 'Healthcare Center', image: '/assets/machine-showcase.png' },
      { name: 'SUR Office', address: 'Surat Central Corporate Office, Surat, Gujarat 395003', latitude: 21.1702, longitude: 72.8311, type: 'Corporate Office', image: '/assets/machine-office.png' },
      { name: 'Aljamea-tus-Saifiyah', address: 'Devdi Mubarak, Zampa Bazaar, Surat, Gujarat 395003', latitude: 21.1985, longitude: 72.8339, type: 'Educational Campus', image: '/assets/step-1.png' },
      { name: 'Rebounce', address: 'Next to Prime Shoppers, opp. Happy Residency, Vesu, Surat, Gujarat 395007', latitude: 21.1448, longitude: 72.7663, type: 'Sports & Trampoline Park', image: '/assets/step-2.png' },
      { name: 'Vesu Canal Walkway', address: 'Canal Road, Vesu Promenade, Surat, Gujarat 395007', latitude: 21.1492, longitude: 72.7695, type: 'Public Promenade', image: '/assets/oranges-fresh.png' },
    ]
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'available',
    description: 'Active across Mumbai with installations in high-traffic business parks & malls.',
    image: '/assets/mumbai-location.jpg',
    subLocations: [
      { name: 'Equinox, BKC', address: 'Lal Bahadur Shastri Marg, Ambedkar Nagar, Kurla West, Kurla, Mumbai, Maharashtra 400070', latitude: 19.0682, longitude: 72.8712, type: 'Business Park', image: '/assets/business-locations.png' },
      { name: 'ATLAS SkillTech University', address: 'Equinox Business Park, Ambedkar Nagar, Kurla West, Kurla, Mumbai, Maharashtra 400070', latitude: 19.0685, longitude: 72.8715, type: 'University Campus', image: '/assets/step-3.png' },
      { name: 'Inorbit Mall Malad', address: 'New Link Rd, Malad, Malad West, Mumbai, Maharashtra 400104', latitude: 19.1732, longitude: 72.8361, type: 'Shopping Mall', image: '/assets/machine-showcase.png' },
      { name: 'Reliance Corporate Park (Office 1)', address: 'Thane - Belapur Rd, Reliance Corporate Park, Ghansoli, Navi Mumbai, Maharashtra 400701', latitude: 19.1245, longitude: 73.0135, type: 'Corporate Campus', image: '/assets/machine-office.png' },
      { name: 'Reliance Corporate Park (Office 2)', address: 'Thane - Belapur Rd, Reliance Corporate Park, Ghansoli, Navi Mumbai, Maharashtra 400701', latitude: 19.1250, longitude: 73.0140, type: 'Corporate Campus', image: '/assets/hero-machine.png' },
      { name: 'Vivarea Tower E', address: 'Ground floor, Raheja Platinum, Road, off Andheri - Kurla Road, Sag Baug, Marol, Andheri East, Mumbai 400059', latitude: 19.1172, longitude: 72.8875, type: 'IT Park', image: '/assets/step-4.png' },
      { name: 'TRIL Infinity IT Park Goregaon', address: 'Podium Floor, Infinity IT Park, Building 4, 239 General A.K. Vaidya Marg, Malad East, Mumbai 400097', latitude: 19.1752, longitude: 72.8685, type: 'IT Tech Park', image: '/assets/step-1.png' },
      { name: 'Vivarea Tower B, Mahalaxmi', address: 'Raheja Modern Vivarea, Keshavrao Khadye Marg, Clerk Road, Mahalaxmi, Mumbai 400011', latitude: 18.9812, longitude: 72.8275, type: 'Luxury Residential Hub', image: '/assets/step-2.png' },
      { name: 'Bounce Infiniti Mall', address: '4th Floor, Infiniti Mall, New Link Rd, Malad West, Mumbai, Maharashtra 400064', latitude: 19.1852, longitude: 72.8345, type: 'Action Park', image: '/assets/oranges-fresh.png' },
      { name: 'Trade Centre BKC', address: 'Trade Centre BKC, 309, Kolivery Village, MMRDA Area, Kalina, Bandra East, Mumbai 400098', latitude: 19.0645, longitude: 72.8665, type: 'Financial Center', image: '/assets/business-locations.png' },
      { name: 'Nesco IT Park', address: 'Western Express Highway, NESCO, Goregaon, Mumbai, Maharashtra 400063', latitude: 19.1558, longitude: 72.8542, type: 'IT Park', image: '/assets/machine-office.png' },
      { name: 'Artesia Building, Worli', address: 'Raheja Artesia, Dr Annie Besant Rd, Worli, Mumbai, Maharashtra 400030', latitude: 19.0145, longitude: 72.8182, type: 'Premium Tower', image: '/assets/step-3.png' },
      { name: 'Saki Naka Metro Station', address: 'Andheri-Ghatkopar Link Road, Junction near Saki Naka, Mumbai, Maharashtra 400072', latitude: 19.0882, longitude: 72.8812, type: 'Metro Station Hub', image: '/assets/hero-machine.png' },
      { name: 'DN Nagar Metro Station', address: 'Sahayog Nagar, Bhudargarh Colony, Andheri West, Mumbai, Maharashtra 400053', latitude: 19.1252, longitude: 72.8262, type: 'Metro Station Hub', image: '/assets/machine-showcase.png' },
      { name: 'JLL Workplace One BKC', address: 'One BKC, G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051', latitude: 19.0642, longitude: 72.8672, type: 'Co-Working Space', image: '/assets/step-4.png' },
      { name: 'Marathon Futurex', address: 'Mafatlal Mills Compound, NM Joshi Marg, Lower Parel, Mumbai, Maharashtra 400013', latitude: 18.9952, longitude: 72.8302, type: 'Corporate Tower', image: '/assets/step-1.png' },
      { name: 'NESCO Exhibition Centre', address: 'Western Express Hwy, NESCO, Goregaon East, Mumbai, Maharashtra 400063', latitude: 19.1565, longitude: 72.8550, type: 'Exhibition Center', image: '/assets/business-locations.png' },
      { name: 'Rupa Renaissance', address: 'D-33, Turbhe MIDC Rd, TTC Industrial Area, MIDC Industrial Area, Turbhe, Navi Mumbai 400703', latitude: 19.0522, longitude: 73.0182, type: 'Commercial Complex', image: '/assets/oranges-fresh.png' },
      { name: 'CSMIA Airport T1 & T2 Arrivals', address: 'Chhatrapati Shivaji Maharaj International Airport, Arrivals Level, Vile Parle, Mumbai 400099', latitude: 19.0896, longitude: 72.8656, type: 'Airport Terminal', image: '/assets/hero-machine.png' },
      { name: 'Aurum Q Park', address: 'Thane - Belapur Rd, Reliance Corporate Park, MIDC Industrial Area, Ghansoli, Navi Mumbai 400710', latitude: 19.1235, longitude: 73.0125, type: 'Business District', image: '/assets/step-2.png' },
      { name: 'Winchester Powai', address: 'Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076', latitude: 19.1192, longitude: 72.9092, type: 'Commercial Plaza', image: '/assets/step-3.png' },
    ]
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    status: 'available',
    description: 'Serving 100% freshly squeezed orange juice across prime corporate IT parks & malls.',
    image: '/assets/ahmedabad-location.jpg',
    subLocations: [
      { name: 'Marengo CIMS Hospital', address: 'Plot No. 67/1, opp. Panchamrut Bunglows, nr. Shukan Mall, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat 380060', latitude: 23.0762, longitude: 72.5262, type: 'Multi-Specialty Hospital', image: '/assets/ahmedabad-location.jpg' },
      { name: 'Adani International School', address: 'Shantigram, S.G. Highway Ring Road, Ahmedabad, Gujarat 382421', latitude: 23.1382, longitude: 72.5592, type: 'Educational Campus', image: '/assets/step-1.png' },
      { name: 'Noble Gastro Hospital', address: '5th & 6th Floor, Shaival Imperia, Mithakhali Six Rd, opp. Nalanda Hotel, Ellisbridge, Ahmedabad, Gujarat 380009', latitude: 23.0232, longitude: 72.5642, type: 'Super-Specialty Hospital', image: '/assets/hero-machine.png' },
      { name: 'Welspun GCC', address: 'CH-6, Adani Shantigram, Adalaj, Ahmedabad, Gujarat 382501', latitude: 23.1362, longitude: 72.5572, type: 'Corporate Global Center', image: '/assets/business-locations.png' },
      { name: 'Shree Balaji Agora Mall', address: 'Tapovan Circle, Bhat Circle, 200 ft Sardar Patel Ring Rd, Chandkheda, Ahmedabad, Gujarat 382421', latitude: 23.1182, longitude: 72.5952, type: 'Shopping & Leisure Mall', image: '/assets/oranges-fresh.png' },
      { name: 'KD Hospital', address: 'Sarkhej - Gandhinagar Hwy, Vaishno Devi Circle, Ahmedabad, Gujarat 382421', latitude: 23.1142, longitude: 72.5382, type: 'Multi-Specialty Hospital', image: '/assets/ahmedabad-location.jpg' },
    ]
  },
  {
    city: 'Delhi',
    state: 'Delhi NCR',
    status: 'available',
    description: 'Live across metro terminals, prime offices & high-footfall lifestyle centers.',
    image: '/assets/delhi-location.jpg',
    subLocations: [
      { name: 'Delhi Escorts Fortis IPD', address: 'Metro Station, Okhla Rd, opp. Sukhdev Vihar, New Friends Colony, New Delhi, Delhi 110025', latitude: 28.5612, longitude: 77.2782, type: 'Heart Institute IPD Block', image: '/assets/delhi-location.jpg' },
      { name: 'Delhi Escorts Fortis OPD', address: 'Fortis Escorts Heart Institute, Okhla Road, New Friends Colony, New Delhi, Delhi 110025', latitude: 28.5615, longitude: 77.2785, type: 'Heart Institute OPD Block', image: '/assets/delhi-location.jpg' },
    ]
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    status: 'available',
    description: 'Delivering 100% natural, ice-cold freshly squeezed orange juice across the Pink City.',
    image: '/assets/jaipur-location.jpg',
    subLocations: [
      { name: 'Mall of Jaipur', address: 'Gandhi Path Rd, B Block, Vaishali Nagar, Jaipur, Rajasthan 302021', latitude: 26.8982, longitude: 75.7482, type: 'Shopping Mall', image: '/assets/jaipur-location.jpg' },
      { name: 'Metro Mass Hospital', address: 'Shipra Path, Near Technology park, Shanthi Nagar, Mansarovar, Jaipur, Rajasthan 302020', latitude: 26.8532, longitude: 75.7682, type: 'Super Specialty Hospital', image: '/assets/step-4.png' },
      { name: 'CK Birla Hospital', address: 'Gopalpura Bypass Rd, near Triveni Bridge, Vishveshvariya Nagar, Gopal Pura Mode, Jaipur, Rajasthan 302018', latitude: 26.8622, longitude: 75.7892, type: 'Multi-Specialty Hospital', image: '/assets/hero-machine.png' },
      { name: 'Indus Hospital', address: 'Shipra Path, near Technology Park, Shanthi Nagar, Mansarovar, Jaipur, Rajasthan 302020', latitude: 26.8535, longitude: 75.7685, type: 'Healthcare Center', image: '/assets/oranges-fresh.png' },
      { name: 'Rungta Hospital', address: 'Calgiri Marg, near Police Station, Jhalana Gram, Malviya Nagar, Jaipur, Rajasthan 302017', latitude: 26.8542, longitude: 75.8142, type: 'Multi-Specialty Hospital', image: '/assets/machine-showcase.png' },
    ]
  },
  {
    city: 'Statue of Unity',
    state: 'Gujarat',
    status: 'available',
    description: 'Special tourist spot installation serving pure natural refreshment on demand.',
    image: '/assets/statue-of-unity.jpg',
    subLocations: [
      { name: 'SOU Children Nutrition Park', address: 'Children Nutrition Park Complex, Ekta Nagar, Kevadia, Gujarat 393151', latitude: 21.8382, longitude: 73.7142, type: 'Theme Park & Food Hub', image: '/assets/statue-of-unity.jpg' },
      { name: 'Jungle Safari SOU', address: 'Jungle Safari Complex, Kevadia, Narmada District, Gujarat 393151', latitude: 21.8422, longitude: 73.7212, type: 'Zoological Park Entry', image: '/assets/statue-of-unity.jpg' },
      { name: 'SOU SBB (Shreshtha Bharat Bhavan)', address: 'Shreshtha Bharat Bhavan Complex, Kevadia, Gujarat 393151', latitude: 21.8352, longitude: 73.7182, type: 'Visitor Hub', image: '/assets/statue-of-unity.jpg' },
      { name: 'SOU Valley of Flowers (Spot 1)', address: 'Valley of Flowers Promenade 1, Ekta Nagar, Kevadia, Gujarat 393151', latitude: 21.8322, longitude: 73.7122, type: 'Botanical Garden', image: '/assets/statue-of-unity.jpg' },
      { name: 'SOU Valley of Flowers (Spot 2)', address: 'Valley of Flowers Promenade 2, Ekta Nagar, Kevadia, Gujarat 393151', latitude: 21.8332, longitude: 73.7132, type: 'Botanical Garden', image: '/assets/statue-of-unity.jpg' },
    ]
  },
];

export const USP_ITEMS = [
  { icon: 'natural', title: '100% Natural', description: 'Pure orange juice' },
  { icon: 'fresh', title: 'Freshly Squeezed', description: 'Squeezed on demand' },
  { icon: 'sugar', title: 'No Added Sugar', description: 'Zero artificial sugars' },
  { icon: 'preservatives', title: 'No Preservatives', description: 'Zero added chemicals' },
  { icon: 'hygienic', title: 'Hygienic', description: 'Contactless process' },
  { icon: 'seconds', title: 'Under 60 Secs', description: 'Fast automated serving' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Scan & Pay',
    description: 'Simply scan the QR code or use the touchscreen to select your juice and make a quick digital payment.',
  },
  {
    step: '02',
    title: 'Fresh Oranges Are Squeezed',
    description: 'Premium oranges are automatically selected and freshly squeezed right inside the machine.',
  },
  {
    step: '03',
    title: 'Juice Is Dispensed & Sealed',
    description: 'Your freshly squeezed juice is dispensed into a hygienic cup and automatically sealed.',
  },
  {
    step: '04',
    title: 'Enjoy Fresh Juice',
    description: 'Pick up your glass of 100% natural, freshly squeezed orange juice and enjoy the freshness.',
  },
];

export const MACHINE_FEATURES = [
  { title: 'Smart Vending', description: 'AI-powered inventory management and automated operations.' },
  { title: 'Automated Squeezing', description: 'Fresh oranges squeezed on demand with precision technology.' },
  { title: 'Contactless Operation', description: 'Fully touchless payment and dispensing for maximum hygiene.' },
  { title: 'Fresh Juice Dispensing', description: 'Consistent quality and taste with every glass served.' },
  { title: 'Automatic Sealing', description: 'Each serving is hygienically sealed before dispensing.' },
  { title: 'Real-time Monitoring', description: 'IoT-enabled monitoring for stock, temperature, and performance.' },
];

export const BENEFITS_DATA = [
  {
    title: '100% Natural',
    description: 'Every glass of JuiceTap juice is made from premium, naturally ripened oranges. No artificial flavors, no concentrates — just pure, natural orange juice the way nature intended.',
  },
  {
    title: 'Fresh & Pure',
    description: 'Our juice is squeezed fresh on the spot, right when you order it. Unlike bottled juices that sit on shelves, JuiceTap delivers juice that\'s minutes old, not days or weeks.',
  },
  {
    title: 'No Added Sugar',
    description: 'We believe in the natural sweetness of oranges. JuiceTap juice contains zero added sugar — only the natural fructose that comes from the fruit itself.',
  },
  {
    title: 'No Preservatives',
    description: 'With no shelf life to worry about, our juice needs no preservatives. Every glass is made fresh and consumed immediately, ensuring pure, unadulterated juice.',
  },
  {
    title: 'Automated & Hygienic',
    description: 'Our machines handle the entire process — from orange selection to squeezing to dispensing. Minimal human contact means maximum hygiene and food safety.',
  },
  {
    title: 'Fresh On Demand',
    description: 'No pre-made batches, no sitting around. Your juice is squeezed the moment you order, guaranteeing the freshest possible taste every single time.',
  },
  {
    title: '24/7 Availability',
    description: 'JuiceTap machines are designed to operate around the clock. Whether it\'s an early morning boost or a late-night craving, fresh juice is always available.',
  },
  {
    title: 'Convenient & Fast',
    description: 'Get your fresh juice in under 60 seconds. No waiting in line, no complicated ordering — just tap, pay, and enjoy.',
  },
  {
    title: 'Sustainable Approach',
    description: 'We\'re committed to reducing waste. Our machines optimize orange usage, and we work with recyclable packaging to minimize environmental impact.',
  },
];

export const BUSINESS_LOCATIONS = [
  { icon: '🏢', title: 'Corporate Offices', description: 'Offer a premium perk to employees and visitors.' },
  { icon: '🏥', title: 'Hospitals', description: 'Healthy refreshment for staff, patients, and visitors.' },
  { icon: '🏬', title: 'Shopping Malls', description: 'Capture high footfall with a compelling fresh juice option.' },
  { icon: '🎓', title: 'Colleges & Universities', description: 'A healthy alternative for students and campus visitors.' },
  { icon: '✈️', title: 'Airports', description: 'Premium refreshment for travelers on the go.' },
  { icon: '🚇', title: 'Transit Hubs', description: 'Quick, fresh juice for commuters and travelers.' },
];
