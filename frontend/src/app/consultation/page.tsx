'use client';

import { useState } from 'react';
import { ConsultationRequest } from '@/types/consultation';
import { api } from '@/lib/api';

export default function ConsultationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ConsultationRequest>>({
    nationality: '',
    current_country: '',
    residency_status: 'citizen',
    destination_country: '',
    travel_purpose: 'tourism',
    travel_dates: '',
    duration: '',
    previous_rejections: false,
    email: ''
  });

  const handleInputChange = (field: keyof ConsultationRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // First get a preview
      const preview = await api.previewConsultation(formData);
      console.log('Preview:', preview);
      
      // Then proceed to payment
      const checkoutResponse = await api.createCheckoutSession({
        consultation_id: 'temp-' + Date.now(),
        email: formData.email!
      });
      
      // Redirect to Stripe checkout
      window.location.href = checkoutResponse.checkout_url;
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error processing your request. Please try again.');
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Background</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is your nationality? (Passport country)
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Chinese, Indian, German"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have dual citizenship? (Optional)
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Canadian, Australian (leave blank if none)"
                value={formData.dual_citizenship || ''}
                onChange={(e) => handleInputChange('dual_citizenship', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which country do you currently live in?
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., United States, Canada, United Kingdom"
                value={formData.current_country}
                onChange={(e) => handleInputChange('current_country', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is your status in {formData.current_country || 'that country'}?
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.residency_status}
                onChange={(e) => handleInputChange('residency_status', e.target.value)}
              >
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident (Green Card/PR)</option>
                <option value="temporary_worker">Temporary Worker (H1B, L1, etc.)</option>
                <option value="student">Student (F1, J1, etc.)</option>
                <option value="other">Other</option>
              </select>
            </div>

            {formData.residency_status === 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify your residency status
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Tourist visa, Working holiday visa"
                  value={formData.residency_details || ''}
                  onChange={(e) => handleInputChange('residency_details', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Travel Plans</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which country do you want to visit?
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Germany, Japan, France"
                value={formData.destination_country}
                onChange={(e) => handleInputChange('destination_country', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is the purpose of your visit?
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.travel_purpose}
                onChange={(e) => handleInputChange('travel_purpose', e.target.value)}
              >
                <option value="tourism">Tourism/Vacation</option>
                <option value="business">Business</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="transit">Transit</option>
                <option value="family_visit">Visiting Family/Friends</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When do you plan to travel?
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., March 2025, Summer 2025, Flexible"
                value={formData.travel_dates}
                onChange={(e) => handleInputChange('travel_dates', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How long do you plan to stay?
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2 weeks, 1 month, 3 months"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Have you ever been denied a visa before?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previous_rejections"
                    checked={!formData.previous_rejections}
                    onChange={() => handleInputChange('previous_rejections', false)}
                    className="mr-2"
                  />
                  No, never
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previous_rejections"
                    checked={formData.previous_rejections}
                    onChange={() => handleInputChange('previous_rejections', true)}
                    className="mr-2"
                  />
                  Yes, I have been denied before
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any other relevant information? (Optional)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                placeholder="e.g., Previous travel history, specific concerns, urgency, multiple destination plans..."
                value={formData.additional_info || ''}
                onChange={(e) => handleInputChange('additional_info', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address for results delivery
              </label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review & Payment</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Your Consultation Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Nationality:</strong> {formData.nationality}</div>
                <div><strong>Current Location:</strong> {formData.current_country}</div>
                <div><strong>Status:</strong> {formData.residency_status}</div>
                <div><strong>Destination:</strong> {formData.destination_country}</div>
                <div><strong>Purpose:</strong> {formData.travel_purpose}</div>
                <div><strong>Travel Dates:</strong> {formData.travel_dates}</div>
                <div><strong>Duration:</strong> {formData.duration}</div>
                <div><strong>Email:</strong> {formData.email}</div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What You&apos;ll Receive</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Personalized document checklist prioritized for your situation</li>
                <li>• AI-written cover letter addressing your specific circumstances</li>
                <li>• Strategic notes for stronger application</li>
                <li>• Risk assessment and confidence score</li>
                <li>• Current processing time estimates</li>
                <li>• PDF delivery via email within 10 minutes</li>
              </ul>
              <div className="mt-4 text-2xl font-bold text-blue-600">$49</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This service provides research assistance and document preparation guidance only. 
                We do not provide legal advice. Always verify information with official embassy sources.
              </p>
            </div>
          </div>
        );
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.nationality && formData.current_country && formData.residency_status;
      case 2:
        return formData.destination_country && formData.travel_purpose && formData.travel_dates && formData.duration;
      case 3:
        return formData.email;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">Step {step} of 4</span>
                <span className="text-sm font-medium text-gray-500">{Math.round((step / 4) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form content */}
            {renderStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepComplete() || loading}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment - $49'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}