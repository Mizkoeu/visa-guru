const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.detail || 'An error occurred');
  }

  return response.json();
}

export const api = {
  // Health check
  healthCheck: () => apiRequest<{ status: string }>('/api/health'),
  
  // Consultation endpoints
  previewConsultation: (request: object) =>
    apiRequest('/api/consultation/preview', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  
  analyzeConsultation: (request: object) =>
    apiRequest('/api/consultation/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  
  getConsultation: (consultationId: string) =>
    apiRequest(`/api/consultation/${consultationId}`),
  
  // Payment endpoints
  createCheckoutSession: (data: { consultation_id: string; email: string }) =>
    apiRequest<{ checkout_url: string; session_id: string }>('/api/payment/create-checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  verifyPayment: (sessionId: string) =>
    apiRequest('/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),
};