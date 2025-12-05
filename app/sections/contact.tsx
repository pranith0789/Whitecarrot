import SectionWrapper from '@/app/components/SectionWrapper';

export default function Contact({ sectionId }: { sectionId: string }) {
  return (
    <SectionWrapper id={sectionId} entrance="zoom">
            {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 text-center">
          Contact Our Hiring Team
        </h2>

        <p className="text-lg text-gray-600 text-center mt-3 max-w-2xl mx-auto">
          Have questions about open roles, hiring timelines, or your application status?
          Our recruitment team is here to support you.
        </p>

        {/* Contact Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">

          {/* Email Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
            <div className="text-blue-600 text-4xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
            <p className="text-gray-600 mt-2">careers@company.com</p>
            <p className="text-sm text-gray-500 mt-1">For job-related queries & applications</p>
          </div>

          {/* Phone Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
            <div className="text-green-600 text-4xl mb-4">📞</div>
            <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
            <p className="text-gray-600 mt-2">+91 98765 43210</p>
            <p className="text-sm text-gray-500 mt-1">Mon–Fri, 10 AM – 6 PM IST</p>
          </div>

          {/* Location Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 text-center">
            <div className="text-red-600 text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-gray-800">Visit Us</h3>
            <p className="text-gray-600 mt-2">Hyderabad, India</p>
            <p className="text-sm text-gray-500 mt-1">Office visits by appointment only</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-blue-600 text-white px-10 py-8 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold">Ready to Join Us?</h3>
          <p className="mt-2 text-blue-100">Submit your resume and our hiring team will get in touch.</p>
          <button className="mt-5 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition">
            Submit Resume
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          We aim to respond within 24–48 hours.
        </p>
    </SectionWrapper>
  );
}
