import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Visa Guru
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get AI-powered, personalized visa guidance for complex immigration scenarios. 
            No more generic checklists or conflicting advice.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This service provides research assistance and document preparation guidance only. 
              We do not provide legal advice. Always consult official embassy sources and immigration lawyers for legal guidance.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Questionnaire</h3>
              <p className="text-gray-600 text-sm">
                Adaptive questions that understand complex scenarios like dual citizenship and residency status
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Research</h3>
              <p className="text-gray-600 text-sm">
                Real-time research of current visa requirements specific to your exact situation
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalized Documents</h3>
              <p className="text-gray-600 text-sm">
                Custom document checklist and AI-written cover letter addressing your edge cases
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/consultation"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Get My Visa Guidance - $49
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Complete personalized consultation in under 10 minutes
            </p>
          </div>

          <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Perfect For Complex Cases
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">We Handle:</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Dual citizenship scenarios</li>
                  <li>• Multiple residency statuses</li>
                  <li>• H1B, Green Card, F1/OPT holders</li>
                  <li>• Complex travel patterns</li>
                  <li>• Previous visa rejections</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">You Get:</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Prioritized document checklist</li>
                  <li>• Personalized cover letter</li>
                  <li>• Strategic application notes</li>
                  <li>• Risk assessment & confidence score</li>
                  <li>• Current processing time estimates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
