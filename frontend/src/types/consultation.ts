export interface ConsultationRequest {
  // Basic info
  nationality: string;
  dual_citizenship?: string;
  
  // Residency status
  current_country: string;
  residency_status: 'citizen' | 'permanent_resident' | 'temporary_worker' | 'student' | 'other';
  residency_details?: string;
  
  // Travel details
  destination_country: string;
  travel_purpose: 'tourism' | 'business' | 'work' | 'study' | 'transit' | 'family_visit' | 'other';
  travel_dates: string;
  duration: string;
  
  // Additional context
  previous_rejections: boolean;
  additional_info?: string;
  
  // Contact
  email: string;
}

export interface DocumentItem {
  name: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  notes?: string;
}

export interface ConsultationResult {
  consultation_id: string;
  risk_assessment: string;
  confidence_score: number;
  documents_required: DocumentItem[];
  cover_letter: string;
  strategic_notes: string[];
  sources: string[];
  estimated_processing_time: string;
}