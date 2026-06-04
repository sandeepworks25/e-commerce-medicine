import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { dummyFAQs } from '../data/dummy';

const FAQ = () => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="mb-8 text-center md:mb-12">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h1>
          <p className="text-base text-gray-600 sm:text-xl">Find answers to common questions about MediCare</p>
        </div>

        <div className="space-y-4">
          {dummyFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 transition hover:bg-gray-50 sm:px-6 sm:py-4"
              >
                <h3 className="text-left text-base font-semibold sm:text-lg">{faq.question}</h3>
                <ChevronDown
                  size={24}
                  className={`flex-shrink-0 transition-transform ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedId === faq.id && (
                <div className="border-t bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-8 rounded-lg bg-primary-50 p-5 text-center sm:p-8 md:mt-12">
          <h2 className="mb-2 text-xl font-bold sm:text-2xl">Still have questions?</h2>
          <p className="text-gray-600 mb-4">Contact our support team</p>
          <a href="mailto:support@medicare.com" className="btn-primary">
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
