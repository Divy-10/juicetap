import { useState } from 'react';
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from '../../data/constants';
import { WhatsAppIcon, CloseIcon, ChevronDownIcon } from '../Icons/Icons';

const ENQUIRY_OPTIONS = [
  { label: 'General Enquiry', message: WHATSAPP_MESSAGES.general },
  { label: 'Franchise Opportunity', message: WHATSAPP_MESSAGES.business },
  { label: 'Machine Enquiry', message: WHATSAPP_MESSAGES.machine },
  { label: 'Location Enquiry', message: WHATSAPP_MESSAGES.location },
];

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="whatsapp-widget" role="complementary" aria-label="WhatsApp chat">
      {/* Popup */}
      {isOpen && (
        <div className="whatsapp-widget__popup">
          <div className="whatsapp-widget__popup-header">
            <div className="whatsapp-widget__popup-info">
              <span className="whatsapp-widget__popup-name">JuiceTap</span>
              <span className="whatsapp-widget__popup-status">Typically replies instantly</span>
            </div>
            <button
              className="whatsapp-widget__popup-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat widget"
            >
              <CloseIcon size={16} />
            </button>
          </div>
          <div className="whatsapp-widget__popup-body">
            <p className="whatsapp-widget__popup-greeting">
              Hi!<br />How can we help you today?
            </p>
            <div className="whatsapp-widget__popup-options">
              {ENQUIRY_OPTIONS.map((option) => (
                <a
                  key={option.label}
                  href={getWhatsAppUrl(option.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-widget__popup-option"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{option.label}</span>
                  <ChevronDownIcon size={14} style={{ transform: 'rotate(-90deg)' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className={`whatsapp-widget__fab ${isOpen ? 'whatsapp-widget__fab-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? <CloseIcon size={24} /> : <WhatsAppIcon size={26} />}
        <span className="whatsapp-widget__fab-label">WhatsApp</span>
      </button>
    </div>
  );
}
