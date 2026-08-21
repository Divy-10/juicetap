import { useState } from 'react';
import { getWhatsAppUrl } from '../../data/constants';
import Button from '../Button/Button';
import { CheckIcon, WhatsAppIcon } from '../Icons/Icons';

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Franchise Opportunity',
  'Machine Enquiry',
  'Location Enquiry',
  'Become a Franchisee',
  'Other',
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email';
    }
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{8,15}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = 'Enter a valid phone number';
    }
    if (!form.enquiryType) errs.enquiryType = 'Select an enquiry type';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const whatsappMessage = `Hi JuiceTap Team,\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nEnquiry Type: ${form.enquiryType}\n\nMessage:\n${form.message}`;

    window.open(getWhatsAppUrl(whatsappMessage), '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-form__success">
        <div className="contact-form__success-icon">
          <CheckIcon size={24} />
        </div>
        <h3>Message Sent!</h3>
        <p>Your enquiry has been forwarded to WhatsApp. Our team will respond shortly.</p>
        <Button
          variant="secondary"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: '', email: '', phone: '', enquiryType: '', message: '' });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__group">
        <label htmlFor="cf-name" className="contact-form__label">Full Name *</label>
        <input
          id="cf-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={`contact-form__input ${errors.name ? 'contact-form__input-error' : ''}`}
          placeholder="Your full name"
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
            className={`contact-form__input ${errors.email ? 'contact-form__input-error' : ''}`}
            placeholder="your@email.com"
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
            className={`contact-form__input ${errors.phone ? 'contact-form__input-error' : ''}`}
            placeholder="Enter your phone number"
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
          className={`contact-form__input contact-form__textarea ${errors.message ? 'contact-form__input-error' : ''}`}
          placeholder="Tell us how we can help..."
          rows={5}
        />
        {errors.message && <span className="contact-form__error">{errors.message}</span>}
      </div>

      <div className="contact-form__actions">
        <Button type="submit" variant="whatsapp" size="lg" icon={<WhatsAppIcon size={18} />}>
          Send via WhatsApp
        </Button>
        <p className="contact-form__note">
          Your message will be opened via WhatsApp for fast team response.
        </p>
      </div>
    </form>
  );
}
