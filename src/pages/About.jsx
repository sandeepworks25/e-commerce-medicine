
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-12 text-white md:py-20">
        <div className="max-w-4xl mx-auto px-3 text-center sm:px-4">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">About MediCare</h1>
          <p className="text-base text-primary-100 sm:text-xl">
            Your trusted online pharmacy for genuine medicines and healthcare products
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-3 py-8 sm:px-4 md:py-12">
        {/* About Content */}
        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl">Our Story</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            MediCare was founded with a mission to make healthcare accessible and affordable to everyone. We believe that quality medicines should be available at your doorstep with just a few clicks.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            With years of experience in the pharmaceutical industry, our team is committed to providing genuine products, expert advice, and exceptional customer service.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl">Why Choose MediCare?</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {[
              {
                icon: '✓',
                title: 'Genuine Products',
                description: 'All medicines verified from licensed suppliers',
              },
              {
                icon: '🚚',
                title: 'Fast Delivery',
                description: '1-2 days delivery in major cities',
              },
              {
                icon: '💊',
                title: 'Wide Selection',
                description: 'Over 1000+ medicines and products',
              },
              {
                icon: '🔒',
                title: 'Secure Payments',
                description: 'Multiple payment options with SSL encryption',
              },
              {
                icon: '👨‍⚕️',
                title: 'Expert Support',
                description: 'Licensed pharmacists available for consultation',
              },
              {
                icon: '⭐',
                title: 'Best Prices',
                description: 'Competitive pricing with regular discounts',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl">Our Team</h2>
          <p className="text-gray-700 mb-6">
            Our team consists of experienced pharmacists, healthcare professionals, and customer service experts dedicated to your health and wellness.
          </p>
        </section>

        {/* Certifications */}
        <section className="mb-8 rounded-lg bg-white p-5 shadow sm:p-8 md:mb-12">
          <h2 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl">Certifications & Compliance</h2>
          <ul className="space-y-3 text-gray-700">
            <li>✓ Licensed Pharmacy (Reg. No. 12345)</li>
            <li>✓ NABH Certified</li>
            <li>✓ ISO 9001:2015 Certified</li>
            <li>✓ PCI Compliant for Payments</li>
            <li>✓ GDPR Compliant for Data Protection</li>
          </ul>
        </section>

        {/* Contact CTA */}
        <div className="rounded-lg bg-primary-50 p-5 text-center sm:p-8">
          <h2 className="mb-2 text-xl font-bold sm:text-2xl">Have questions?</h2>
          <p className="text-gray-600 mb-6">Get in touch with our team</p>
          <a href="/contact-us" className="btn-primary inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
