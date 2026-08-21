import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import WhatsAppWidget from './components/WhatsAppWidget/WhatsAppWidget';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Benefits from './pages/Benefits/Benefits';
import Machine from './pages/Machine/Machine';
import Locations from './pages/Locations/Locations';
import Business from './pages/Business/Business';
import Contact from './pages/Contact/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Terms from './pages/Terms/Terms';
import NotFound from './pages/NotFound/NotFound';


export default function App() {
  return (
    <div className="app-wrapper">
      <ScrollToTop />
      <Navbar />
      
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/machine" element={<Machine />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/business" element={<Business />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
