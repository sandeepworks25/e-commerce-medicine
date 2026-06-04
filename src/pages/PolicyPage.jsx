import { ShieldCheck } from 'lucide-react';

const policyContent = {
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'Privacy Policy',
    updated: 'Last updated: 4 June 2026',
    intro: 'This Privacy Policy explains how MediCare collects, uses, stores, and protects information when you browse products, place orders, upload prescriptions, or contact support.',
    sections: [
      {
        heading: 'Information we collect',
        body: 'We may collect account details, contact information, delivery addresses, order history, prescription uploads, payment status, support conversations, and device or usage information needed to operate the service.',
      },
      {
        heading: 'How we use information',
        body: 'We use your information to process orders, verify prescriptions, deliver products, provide customer support, prevent fraud, improve the shopping experience, and send important account or order updates.',
      },
      {
        heading: 'Prescription and health information',
        body: 'Prescription files and related details are used only for medicine verification, order fulfillment, compliance, and customer support. Access is limited to authorized personnel and service partners involved in your order.',
      },
      {
        heading: 'Sharing with partners',
        body: 'We may share required information with delivery partners, pharmacy partners, payment processors, support providers, and legal or regulatory authorities when necessary.',
      },
      {
        heading: 'Your choices',
        body: 'You can update profile details, manage saved addresses, request account support, and contact us for questions about your data or communication preferences.',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms of Service',
    title: 'Terms of Service',
    updated: 'Last updated: 4 June 2026',
    intro: 'These Terms of Service govern your use of MediCare, including browsing, ordering, prescription upload, checkout, and customer support features.',
    sections: [
      {
        heading: 'Using MediCare',
        body: 'You agree to provide accurate account, contact, prescription, and delivery information. You are responsible for maintaining the confidentiality of your login details.',
      },
      {
        heading: 'Medicine orders',
        body: 'Some medicines require a valid prescription before dispatch. Orders may be delayed, cancelled, or modified if prescription verification fails or stock is unavailable.',
      },
      {
        heading: 'Pricing and availability',
        body: 'Product prices, discounts, delivery charges, and availability may change. We try to keep information accurate, but corrections may be made before order confirmation.',
      },
      {
        heading: 'User responsibilities',
        body: 'Do not misuse the platform, upload false prescriptions, attempt fraudulent orders, or use the service in a way that violates applicable laws or healthcare regulations.',
      },
      {
        heading: 'Limitation of service',
        body: 'MediCare is an online pharmacy and commerce platform. Product information is for shopping support and does not replace professional medical advice.',
      },
    ],
  },
  refund: {
    eyebrow: 'Refund Policy',
    title: 'Refund Policy',
    updated: 'Last updated: 4 June 2026',
    intro: 'This Refund Policy explains when refunds, replacements, or cancellations may be available for MediCare orders.',
    sections: [
      {
        heading: 'Cancellations',
        body: 'You may request cancellation before dispatch. If the order has already been shipped, cancellation may depend on delivery status and product eligibility.',
      },
      {
        heading: 'Refund eligibility',
        body: 'Refunds may be available for failed payments, cancelled orders, unavailable products, duplicate payments, or verified delivery issues.',
      },
      {
        heading: 'Medicines and safety',
        body: 'For safety and regulatory reasons, opened medicines or temperature-sensitive products may not be returnable unless damaged, incorrect, expired, or otherwise eligible under applicable rules.',
      },
      {
        heading: 'Replacement requests',
        body: 'If you receive a wrong, damaged, or expired product, contact customer care with order details and photos so the team can review replacement or refund options.',
      },
      {
        heading: 'Refund timeline',
        body: 'Approved refunds are processed to the original payment method or eligible wallet balance. Bank or payment partner timelines may vary.',
      },
    ],
  },
};

const PolicyPage = ({ type }) => {
  const policy = policyContent[type] || policyContent.privacy;

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 rounded-lg bg-slate-950 p-6 text-white md:p-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-teal-500/20 text-teal-200">
            <ShieldCheck size={26} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-200">{policy.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{policy.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{policy.intro}</p>
          <p className="mt-5 text-xs font-semibold text-slate-400">{policy.updated}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="space-y-7">
            {policy.sections.map(section => (
              <section key={section.heading}>
                <h2 className="text-lg font-bold text-slate-950">{section.heading}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-lg bg-teal-50 p-4 text-sm leading-6 text-teal-900">
            For questions about this policy, contact us at <a href="mailto:support@medicare.com" className="font-bold underline">support@medicare.com</a> or visit 24x7 Customer Care.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
