import axios, { AxiosResponse } from 'axios';

// Create dedicated axios instance for ApplicationService
const appApi = axios.create({
  baseURL: 'http://localhost:8003/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
appApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApplicationDraft {
  id?: number;
  user_id?: number;
  application_type: 'undergraduate' | 'postgraduate';
  current_step: number;
  completion_percentage: number;
  
  // Step 1: Personal Information
  title?: string;
  surname?: string;
  first_name?: string;
  marital_status?: string;
  maiden_name?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  nationality?: string;
  country_of_residence?: string;
  gender?: 'male' | 'female' | 'other';
  passport_photo_path?: string;
  correspondence_address?: string;
  telephone_numbers?: string;
  email_address?: string;
  permanent_address?: string;
  show_permanent_address?: boolean;
  
  // Step 2: Program Information
  level_of_study?: 'undergraduate' | 'postgraduate';
  first_choice?: string;
  second_choice?: string;
  third_choice?: string;
  fourth_choice?: string;
  method_of_study?: string;
  
  // Education History
  school_name?: string;
  school_from_date?: string;
  school_to_date?: string;
  subjects_studied?: string;
  examination_year?: string;
  results_year?: string;
  grades_achieved?: string;
  university_college?: string;
  uni_from_date?: string;
  uni_to_date?: string;
  programme?: string;
  qualification?: string;
  date_of_award?: string;
  class_of_award?: string;
  
  // Step 3: Motivation
  motivation_essay?: string;
  upload_motivation_note?: boolean;
  motivation_file_path?: string;
  
  // Step 4: Special Needs
  has_disability?: boolean;
  disability_description?: string;
  
  // Step 5: Declaration
  declaration_agreed?: boolean;
  declaration_full_name?: string;
  declaration_date?: string;
  all_sections_completed?: boolean;
  all_documents_uploaded?: boolean;
  deposit_slip_attached?: boolean;
  
  // Metadata
  program_title?: string;
  faculty?: string;
  last_saved_at?: string;
  created_at?: string;
  updated_at?: string;
}

// React-formatted data structure returned by backend's toApplicationData()
export interface ReactFormattedDraft {
  step1: {
    applicationType: string;
    title: string;
    surname: string;
    firstName: string;
    maritalStatus: string;
    maidenName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    nationality: string;
    countryOfResidence: string;
    gender: string;
    passportPhoto: null;
    correspondenceAddress: string;
    telephoneNumbers: string;
    emailAddress: string;
    permanentAddress: string;
    showPermanentAddress: boolean;
  };
  step2: {
    programInfo: {
      levelOfStudy: string;
      firstChoice: string;
      secondChoice: string;
      thirdChoice: string;
      fourthChoice: string;
      methodOfStudy: string;
    };
    educationHistory: {
      schoolName: string;
      schoolFromDate: string;
      schoolToDate: string;
      subjectsStudied: string;
      examinationYear: string;
      resultsYear: string;
      gradesAchieved: string;
      universityCollege: string;
      uniFromDate: string;
      uniToDate: string;
      programme: string;
      qualification: string;
      dateOfAward: string;
      classOfAward: string;
    };
  };
  step3: {
    workExperience: Array<{
      fromDate: string;
      toDate: string;
      organization: string;
      position: string;
    }>;
    motivation: {
      motivationEssay: string;
      uploadMotivationNote: boolean;
      motivationFile: null;
    };
  };
  step4: {
    hasDisability: boolean;
    disabilityDescription: string;
  };
  step5: {
    referees: Array<{
      name: string;
      position: string;
      institution: string;
      address: string;
      email: string;
    }>;
    declaration: {
      declarationAgreed: boolean;
      fullName: string;
      date: string;
      allSectionsCompleted: boolean;
      allDocumentsUploaded: boolean;
      depositSlipAttached: boolean;
    };
  };
  currentStep: number;
  lastSaved: string;
}

export interface ApplicationSubmission extends Omit<ApplicationDraft, 'id'> {
  id?: number;
  application_id: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submitted_at?: string;
}

export interface WorkExperience {
  id?: number;
  application_draft_id?: number;
  from_date: string;
  to_date: string;
  organization: string;
  position: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Referee {
  id?: number;
  application_draft_id?: number;
  name: string;
  position: string;
  institution: string;
  address: string;
  email: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserApplication {
  id: string;
  title: string;
  faculty: string;
  status: string;
  submitted_date: string;
  last_updated: string;
  application_id: string;
  application_type: 'undergraduate' | 'postgraduate';
  is_draft: boolean;
  completion_percentage?: number;
}

export interface DraftsByType {
  undergraduate: {
    id: number;
    completion_percentage: number;
    last_saved: string;
    program_title?: string;
  } | null;
  postgraduate: {
    id: number;
    completion_percentage: number;
    last_saved: string;
    program_title?: string;
  } | null;
}

class ApplicationService {
  // Get draft by application type
  async getDraft(applicationType: 'undergraduate' | 'postgraduate'): Promise<ReactFormattedDraft | null> {
    try {
      const response: AxiosResponse<{ success: boolean; data: ReactFormattedDraft | null }> = await appApi.get(
        `/application/load-draft?application_type=${applicationType}`
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404 || !error.response?.data?.data) {
        return null; // No draft exists
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch application draft');
    }
  }

      // Save application draft
    async saveDraft(draftData: any): Promise<{ draft_id: number; completion_percentage: number; last_saved: string; application_type: string }> {
      try {
        // Always send JSON data for now (file uploads handled separately)
        // TODO: Implement proper FormData handling for file uploads
        const response = await appApi.post('/application/save-draft', draftData);
        
        return response.data.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to save application draft');
      }
    }

  // Submit application
  async submitApplication(applicationType: 'undergraduate' | 'postgraduate'): Promise<ApplicationSubmission> {
    try {
      const response: AxiosResponse<{ success: boolean; data: ApplicationSubmission }> = await appApi.post('/application/submit', {
        application_type: applicationType,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit application');
    }
  }

  // Get user's applications (drafts and submissions)
  async getUserApplications(): Promise<UserApplication[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: UserApplication[] }> = await appApi.get('/application/my-applications');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
  }

  // Get drafts by type
  async getDraftsByType(): Promise<DraftsByType> {
    try {
      const response: AxiosResponse<{ success: boolean; data: DraftsByType }> = await appApi.get('/application/drafts-by-type');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch drafts');
    }
  }

  // Get specific application
  async getApplication(id: string): Promise<ApplicationDraft | ApplicationSubmission> {
    try {
      const response: AxiosResponse<{ success: boolean; data: ApplicationDraft | ApplicationSubmission }> = await appApi.get(`/application/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch application');
    }
  }

  // Get user's submitted applications only
  async getUserSubmissions(): Promise<UserApplication[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: UserApplication[] }> = await appApi.get('/application/my-submissions');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user submissions');
    }
  }

  // Get a specific submission by application ID
  async getSubmission(applicationId: string): Promise<ReactFormattedDraft> {
    try {
      const response: AxiosResponse<{ success: boolean; data: ReactFormattedDraft }> = await appApi.get(`/application/submission/${applicationId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submission details');
    }
  }

  // Auto-save functionality
  private autoSaveTimeout: NodeJS.Timeout | null = null;

  autoSave(draftData: Partial<ApplicationDraft>, delay: number = 30000): void {
    // Cancel previous auto-save
    this.cancelAutoSave();
    
    // Set new auto-save timeout
    this.autoSaveTimeout = setTimeout(async () => {
      try {
        await this.saveDraft(draftData);
        console.log('Auto-save successful');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, delay);
  }

  cancelAutoSave(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = null;
    }
  }

  // Delete application draft
  async deleteDraft(applicationType: 'undergraduate' | 'postgraduate'): Promise<void> {
    try {
      await appApi.delete('/application/delete-draft', {
        data: { application_type: applicationType }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete application draft');
    }
  }

  // Calculate completion percentage
  calculateCompletionPercentage(draft: ApplicationDraft): number {
    let completedFields = 0;
    let totalFields = 0;

    // Step 1: Personal Information (20 fields)
    const step1Fields = [
      'title', 'surname', 'first_name', 'marital_status', 'date_of_birth',
      'place_of_birth', 'nationality', 'country_of_residence', 'gender',
      'correspondence_address', 'telephone_numbers', 'email_address'
    ];
    
    step1Fields.forEach(field => {
      totalFields++;
      if (draft[field as keyof ApplicationDraft]) completedFields++;
    });

    // Step 2: Program Information
    const step2Fields = ['first_choice', 'level_of_study'];
    step2Fields.forEach(field => {
      totalFields++;
      if (draft[field as keyof ApplicationDraft]) completedFields++;
    });

    // Application type specific fields
    if (draft.application_type === 'postgraduate') {
      // Step 3: Motivation (required for postgraduate)
      totalFields++;
      if (draft.motivation_essay) completedFields++;
    }

    // Step 5: Declaration
    totalFields++;
    if (draft.declaration_agreed) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }
}

export default new ApplicationService(); 