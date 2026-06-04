import { useState } from 'react';
import { useToast } from '../components/common/Toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    addToast('Message sent successfully! We will get back to you soon.', 'success');
    setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-12 text-white md:py-20">
        <div className="max-w-4xl mx-auto px-3 text-center sm:px-4">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Contact Us</h1>
          <p className="text-base text-primary-100 sm:text-xl">
            We're here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-3 py-8 sm:px-4 md:py-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-8">
            <h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="input-base"
                  placeholder="Your message..."
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-8">
              <h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Get in Touch</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">📞 Phone</h3>
                  <p className="text-gray-600">+91-1234-567890</p>
                  <p className="text-gray-600">Mon-Sun: 9 AM - 9 PM IST</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📧 Email</h3>
                  <p className="text-gray-600">support@medicare.com</p>
                  <p className="text-gray-600">Response within 24 hours</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📍 Office Address</h3>
                  <p className="text-gray-600">
                    MediCare Headquarters<br/>
                    123 Healthcare Avenue<br/>
                    Mumbai, Maharashtra 400050<br/>
                    India
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🕐 Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9 AM - 6 PM<br/>
                    Saturday: 10 AM - 4 PM<br/>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-8">
              <h2 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Departments</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Customer Support</p>
                  <p className="text-sm text-gray-600">support@medicare.com</p>
                </div>
                <div>
                  <p className="font-semibold">Pharmacist Consultation</p>
                  <p className="text-sm text-gray-600">pharma@medicare.com</p>
                </div>
                <div>
                  <p className="font-semibold">Business Inquiries</p>
                  <p className="text-sm text-gray-600">business@medicare.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
