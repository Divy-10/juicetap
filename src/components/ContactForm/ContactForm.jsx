import { useState } from 'react';
import Button from '../Button/Button';
import { CheckIcon } from '../Icons/Icons';

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Franchise Opportunity',
  'Machine Enquiry',
  'Location Enquiry',
  'Become a Franchisee',
  'Other',
];

const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: '',
    message: '',
    website_url: '', // Honeypot field (hidden)
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = 'Name is required';
    } else if (form.name.trim().length > 100) {
      errs.name = 'Name must be under 100 characters';
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Enter a valid email address';
    } else if (form.email.trim().length > 120) {
      errs.email = 'Email must be under 120 characters';
    }

    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{8,15}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = 'Enter a valid phone number';
    }

    if (!form.enquiryType) {
      errs.enquiryType = 'Select an enquiry type';
    }

    if (!form.message.trim()) {
      errs.message = 'Message is required';
    } else if (form.message.trim().length > 2000) {
      errs.message = 'Message must be under 2000 characters';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus('submitting');

    const submitData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      enquiryType: form.enquiryType,
      message: form.message.trim(),
      website_url: form.website_url, // Honeypot field
    };

    try {
      if (APPS_SCRIPT_URL) {
        // Post data to Google Apps Script Web App using no-cors / text payload for full cross-domain compatibility
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(submitData),
        });
      }
      // Since Google Apps Script Web App redirects or uses opaque no-cors response in browsers,
      // a successful fetch call indicates completion.
      setStatus('success');
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-form__success">
        <div className="contact-form__success-icon">
          <CheckIcon size={24} />
        </div>
        <h3>Thank You!</h3>
        <p>Thank you! Your message has been submitted successfully.</p>
        <Button
          variant="secondary"
          onClick={() => {
            setStatus('idle');
            setForm({ name: '', email: '', phone: '', enquiryType: '', message: '', website_url: '' });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && (
        <div className="contact-form__error-alert" style={{
          padding: '0.875rem 1rem',
          backgroundColor: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          color: '#991B1B',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          Something went wrong. Please try again.
        </div>
      )}

      {/* Honeypot anti-spam field - invisible to humans */}
      <div style={{ display: 'none', visibility: 'hidden' }} aria-hidden="true">
        <input
          type="text"
          name="website_url"
          tabIndex="-1"
          value={form.website_url}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="cf-name" className="contact-form__label">Full Name *</label>
        <input
          id="cf-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className={`contact-form__input ${errors.name ? 'contact-form__input-error' : ''}`}
          placeholder="Your full name"
          maxLength={100}
        />
        {errors.name && <span className="contact-form__error">{errors.name}</span>}
      </div>

      <div className="contact-form__row">
        <div className="contact-form__group">
          <label htmlFor="cf-email" className="contact-form__label">Email *</label>
          <input
            id="cf-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className={`contact-form__input ${errors.email ? 'contact-form__input-error' : ''}`}
            placeholder="your@email.com"
            maxLength={120}
          />
          {errors.email && <span className="contact-form__error">{errors.email}</span>}
        </div>

        <div className="contact-form__group">
          <label htmlFor="cf-phone" className="contact-form__label">Phone *</label>
          <input
            id="cf-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={status === 'submitting'}
            className={`contact-form__input ${errors.phone ? 'contact-form__input-error' : ''}`}
            placeholder="Enter your phone number"
            maxLength={20}
          />
          {errors.phone && <span className="contact-form__error">{errors.phone}</span>}
        </div>
      </div>

      <div className="contact-form__group">
        <label htmlFor="cf-type" className="contact-form__label">Enquiry Type *</label>
        <select
          id="cf-type"
          name="enquiryType"
          value={form.enquiryType}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className={`contact-form__input contact-form__select ${errors.enquiryType ? 'contact-form__input-error' : ''}`}
        >
          <option value="">Select enquiry type</option>
          {ENQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.enquiryType && <span className="contact-form__error">{errors.enquiryType}</span>}
      </div>

      <div className="contact-form__group">
        <label htmlFor="cf-message" className="contact-form__label">Message *</label>
        <textarea
          id="cf-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className={`contact-form__input contact-form__textarea ${errors.message ? 'contact-form__input-error' : ''}`}
          placeholder="Tell us how we can help..."
          rows={5}
          maxLength={2000}
        />
        {errors.message && <span className="contact-form__error">{errors.message}</span>}
      </div>

      <div className="contact-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Message'}
        </Button>
      </div>
    </form>
  );
}
