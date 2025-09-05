import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ApplicationService, { ApplicationDraft, ReactFormattedDraft, ApplicationSubmission } from '../../services/ApplicationService';
import { SubjectGrade } from '../../components/SubjectGradesList';

// Application Type
export type ApplicationType = 'undergraduate' | 'postgraduate' | '';

// Step 1: Personal & Contact Details
export interface PersonalInfo {
  // Application Type Selection
  applicationType: ApplicationType;
  
  // Section A: Identity (Official MUST fields)
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
  passportPhoto: File | null;
  // Persisted URL from backend for previously uploaded photo
  passportPhotoUrl?: string;
  
  // Section B: Contact Information (Official MUST fields)
  correspondenceAddress: string;
  telephoneNumbers: string;
  emailAddress: string;
  permanentAddress: string;
  showPermanentAddress: boolean;
}

// Step 2: Programme & Education History
export interface ProgramInfo {
  // Section A: Programme
  levelOfStudy: 'undergraduate' | 'postgraduate' | '';
  firstChoice: string;
  secondChoice: string;
  thirdChoice: string;
  fourthChoice: string;
  methodOfStudy: string;
}

export interface EducationHistory {
  // For Undergraduate
  schoolName: string;
  schoolFromDate: string;
  schoolToDate: string;
  subjectsAndGrades: SubjectGrade[];
  examinationYear: string;
  resultsYear: string;
  
  // For Postgraduate/Mature Entry
  universityCollege: string;
  uniFromDate: string;
  uniToDate: string;
  programme: string;
  qualification: string;
  dateOfAward: string;
  classOfAward: string;
}

// Step 3: Work Experience & Motivation
export interface WorkExperience {
  fromDate: string;
  toDate: string;
  organization: string;
  position: string;
}

export interface Motivation {
  motivationEssay: string;
  uploadMotivationNote: boolean;
  motivationFile: File | null;
}

// Step 4: Special Needs & Financial Info
export interface SpecialNeeds {
  hasDisability: boolean;
  disabilityDescription: string;
}

// Step 5: Referees & Final Declaration
export interface Referee {
  name: string;
  position: string;
  institution: string;
  address: string;
  email: string;
}

export interface Declaration {
  declarationAgreed: boolean;
  fullName: string;
  date: string;
  allSectionsCompleted: boolean;
  allDocumentsUploaded: boolean;
  depositSlipAttached: boolean;
  paymentReference?: string;
}

export interface ApplicationData {
  step1: PersonalInfo;
  step2: {
    programInfo: ProgramInfo;
    educationHistory: EducationHistory;
  };
  step3: {
    workExperience: WorkExperience[];
    motivation: Motivation;
  };
  step4: SpecialNeeds;
  step5: {
    referees: Referee[];
    declaration: Declaration;
  };
  currentStep: number;
  lastSaved: string;
}

const defaultPersonalInfo: PersonalInfo = {
  applicationType: '',
  title: '',
  surname: '',
  firstName: '',
  maritalStatus: '',
  maidenName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  nationality: '',
  countryOfResidence: '',
  gender: '',
  passportPhoto: null,
  correspondenceAddress: '',
  telephoneNumbers: '',
  emailAddress: '',
  permanentAddress: '',
  showPermanentAddress: false,
};

const defaultProgramInfo: ProgramInfo = {
  levelOfStudy: '',
  firstChoice: '',
  secondChoice: '',
  thirdChoice: '',
  fourthChoice: '',
  methodOfStudy: '',
};

const defaultEducationHistory: EducationHistory = {
  schoolName: '',
  schoolFromDate: '',
  schoolToDate: '',
  subjectsAndGrades: [],
  examinationYear: '',
  resultsYear: '',
  universityCollege: '',
  uniFromDate: '',
  uniToDate: '',
  programme: '',
  qualification: '',
  dateOfAward: '',
  classOfAward: '',
};

const defaultMotivation: Motivation = {
  motivationEssay: '',
  uploadMotivationNote: false,
  motivationFile: null,
};

const defaultSpecialNeeds: SpecialNeeds = {
  hasDisability: false,
  disabilityDescription: '',
};

const defaultDeclaration: Declaration = {
  declarationAgreed: false,
  fullName: '',
  date: new Date().toISOString().split('T')[0],
  allSectionsCompleted: false,
  allDocumentsUploaded: false,
  depositSlipAttached: false,
};

const defaultData: ApplicationData = {
  step1: defaultPersonalInfo,
  step2: {
    programInfo: defaultProgramInfo,
    educationHistory: defaultEducationHistory,
  },
  step3: {
    workExperience: [],
    motivation: defaultMotivation,
  },
  step4: defaultSpecialNeeds,
  step5: {
    referees: [
      { name: '', position: '', institution: '', address: '', email: '' },
      { name: '', position: '', institution: '', address: '', email: '' },
    ],
    declaration: defaultDeclaration,
  },
  currentStep: 0,
  lastSaved: '',
};

interface ApplicationContextType {
  data: ApplicationData;
  setData: React.Dispatch<React.SetStateAction<ApplicationData>>;
  updateStep: (step: number) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  submitApplication: () => Promise<ApplicationSubmission>;
  isStepValid: (step: number) => boolean;
  getStepProgress: () => number;
  addWorkExperience: () => void;
  removeWorkExperience: (index: number) => void;
  addReferee: () => void;
  removeReferee: (index: number) => void;
  getApplicationType: () => ApplicationType;
  getTotalSteps: () => number;
  getStepTitle: (step: number) => string;
  isStepAvailable: (step: number) => boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ApplicationData>(defaultData);

  const getFacultyFromProgram = (programName: string): string => {
    if (!programName) return 'Not specified';
    if (programName.includes('Computer Science') || programName.includes('Information Technology')) {
      return 'Malawi Institute of Technology';
    } else if (programName.includes('Environmental') || programName.includes('Climate') || programName.includes('Earth')) {
      return 'Ndata School of Climate and Earth Sciences';
    } else if (programName.includes('Cultural') || programName.includes('Heritage')) {
      return 'Bingu School of Culture and Heritage';
    } else if (programName.includes('Medicine') || programName.includes('Medical') || programName.includes('Biomedical')) {
      return 'Academy of Medical Sciences';
    }
    return 'Not specified';
  };

  // Save draft function
  const saveDraft = useCallback(async () => {
    try {
      // Don't save if no application type is selected
      if (!data.step1.applicationType) {
        console.log('No application type selected, skipping save');
        return;
      }

              // Convert our data structure to match what the backend expects
        // Backend expects nested React structure (step1.title, step2.programInfo.firstChoice, etc.)
        const draftData = {
        application_type: data.step1.applicationType,
        current_step: data.currentStep,
        
        // Send nested React structure that backend expects
        step1: {
          applicationType: data.step1.applicationType,
          title: data.step1.title,
          surname: data.step1.surname,
          firstName: data.step1.firstName,
          maritalStatus: data.step1.maritalStatus,
          maidenName: data.step1.maidenName,
          dateOfBirth: data.step1.dateOfBirth,
          placeOfBirth: data.step1.placeOfBirth,
          nationality: data.step1.nationality,
          countryOfResidence: data.step1.countryOfResidence,
          gender: data.step1.gender,
          correspondenceAddress: data.step1.correspondenceAddress,
          telephoneNumbers: data.step1.telephoneNumbers,
          emailAddress: data.step1.emailAddress,
          permanentAddress: data.step1.permanentAddress,
          showPermanentAddress: data.step1.showPermanentAddress,
        },
        
        step2: {
          programInfo: {
            levelOfStudy: data.step2.programInfo.levelOfStudy,
            firstChoice: data.step2.programInfo.firstChoice,
            secondChoice: data.step2.programInfo.secondChoice,
            thirdChoice: data.step2.programInfo.thirdChoice,
            fourthChoice: data.step2.programInfo.fourthChoice,
            methodOfStudy: data.step2.programInfo.methodOfStudy,
          },
          educationHistory: {
            schoolName: data.step2.educationHistory.schoolName,
            schoolFromDate: data.step2.educationHistory.schoolFromDate,
            schoolToDate: data.step2.educationHistory.schoolToDate,
            subjectsAndGrades: data.step2.educationHistory.subjectsAndGrades,
            examinationYear: data.step2.educationHistory.examinationYear,
            resultsYear: data.step2.educationHistory.resultsYear,
            universityCollege: data.step2.educationHistory.universityCollege,
            uniFromDate: data.step2.educationHistory.uniFromDate,
            uniToDate: data.step2.educationHistory.uniToDate,
            programme: data.step2.educationHistory.programme,
            qualification: data.step2.educationHistory.qualification,
            dateOfAward: data.step2.educationHistory.dateOfAward,
            classOfAward: data.step2.educationHistory.classOfAward,
          },
        },
        
        step3: {
          workExperience: data.step3.workExperience,
          motivation: {
            motivationEssay: data.step3.motivation.motivationEssay,
            uploadMotivationNote: data.step3.motivation.uploadMotivationNote,
          },
        },
        
        step4: {
          hasDisability: data.step4.hasDisability,
          disabilityDescription: data.step4.disabilityDescription,
        },
        
        step5: {
          referees: (() => {
            const refs = Array.isArray(data.step5.referees) ? data.step5.referees : [];
            // Keep only referees with at least one non-empty field
            const cleaned = refs.filter(ref => {
              const fields = [ref?.name, ref?.email, ref?.position, ref?.institution, ref?.address];
              return fields.some(v => (v ?? '').toString().trim() !== '');
            });
            return cleaned;
          })(),
          declaration: {
            declarationAgreed: data.step5.declaration.declarationAgreed,
            fullName: data.step5.declaration.fullName,
            date: data.step5.declaration.date,
            allSectionsCompleted: data.step5.declaration.allSectionsCompleted,
            allDocumentsUploaded: data.step5.declaration.allDocumentsUploaded,
            depositSlipAttached: data.step5.declaration.depositSlipAttached,
            paymentReference: data.step5.declaration.paymentReference,
          },
        },
        
        // Metadata
        programTitle: data.step2.programInfo.firstChoice || `${data.step1.applicationType} Application Draft`,
        faculty: getFacultyFromProgram(data.step2.programInfo.firstChoice),
        currentStep: data.currentStep,
              };

        // Save to backend
      const result = await ApplicationService.saveDraft(draftData);
      
      setData(prev => ({
        ...prev,
        lastSaved: new Date().toISOString(),
      }));

      console.log('Draft saved successfully to backend:', result);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [data]);

  // Autosave every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(timer);
  }, [saveDraft]);

  // Load draft function
  const loadDraft = useCallback(async () => {
    try {
      // Check URL parameters for application type
      const urlParams = new URLSearchParams(window.location.search);
      const applicationType = urlParams.get('type') as 'undergraduate' | 'postgraduate' | null;
      
      if (!applicationType) {
        console.log('No application type specified in URL');
        return;
      }

      // Validate application type
      if (!['undergraduate', 'postgraduate'].includes(applicationType)) {
        console.log('Invalid application type:', applicationType);
        return;
      }

      console.log('Loading draft for application type:', applicationType);

      // Load draft from backend
      const draftData = await ApplicationService.getDraft(applicationType);
      
      if (draftData) {
        console.log('Draft loaded successfully from backend for:', applicationType);
        
        // Backend returns data in React-friendly camelCase format from toApplicationData()
        // Convert backend data structure to our local data structure
        const convertedData: ApplicationData = {
          step1: {
            applicationType: draftData.step1?.applicationType as ApplicationType || applicationType,
            title: draftData.step1?.title || '',
            surname: draftData.step1?.surname || '',
            firstName: draftData.step1?.firstName || '',
            maritalStatus: draftData.step1?.maritalStatus || '',
            maidenName: draftData.step1?.maidenName || '',
            dateOfBirth: draftData.step1?.dateOfBirth || '',
            placeOfBirth: draftData.step1?.placeOfBirth || '',
            nationality: draftData.step1?.nationality || '',
            countryOfResidence: draftData.step1?.countryOfResidence || '',
            gender: draftData.step1?.gender || '',
            passportPhoto: null, // File objects can't be serialized
            passportPhotoUrl: (draftData as any).step1?.passportPhotoUrl || '',
            correspondenceAddress: draftData.step1?.correspondenceAddress || '',
            telephoneNumbers: draftData.step1?.telephoneNumbers || '',
            emailAddress: draftData.step1?.emailAddress || '',
            permanentAddress: draftData.step1?.permanentAddress || '',
            showPermanentAddress: draftData.step1?.showPermanentAddress || false,
          },
          step2: {
            programInfo: {
              levelOfStudy: draftData.step2?.programInfo?.levelOfStudy as 'undergraduate' | 'postgraduate' | '' || applicationType,
              firstChoice: draftData.step2?.programInfo?.firstChoice || '',
              secondChoice: draftData.step2?.programInfo?.secondChoice || '',
              thirdChoice: draftData.step2?.programInfo?.thirdChoice || '',
              fourthChoice: draftData.step2?.programInfo?.fourthChoice || '',
              methodOfStudy: draftData.step2?.programInfo?.methodOfStudy || '',
            },
            educationHistory: {
              schoolName: draftData.step2?.educationHistory?.schoolName || '',
              schoolFromDate: draftData.step2?.educationHistory?.schoolFromDate || '',
              schoolToDate: draftData.step2?.educationHistory?.schoolToDate || '',
              subjectsAndGrades: (() => {
                // Convert old format to new format if needed
                const oldSubjects = (draftData.step2?.educationHistory as any)?.subjectsStudied;
                const oldGrades = (draftData.step2?.educationHistory as any)?.gradesAchieved;
                const newSubjects = (draftData.step2?.educationHistory as any)?.subjectsAndGrades;
                
                if (newSubjects && Array.isArray(newSubjects)) {
                  return newSubjects;
                } else if (oldSubjects && oldGrades) {
                  // Convert old string format to new array format
                  const subjectLines = oldSubjects.split('\n').filter((s: string) => s.trim());
                  const gradeLines = oldGrades.split('\n').filter((g: string) => g.trim());
                  return subjectLines.map((subject: string, index: number) => ({
                    id: `migrated_${Date.now()}_${index}`,
                    subject: subject.trim(),
                    grade: gradeLines[index]?.trim() || ''
                  }));
                }
                return [];
              })(),
              examinationYear: draftData.step2?.educationHistory?.examinationYear || '',
              resultsYear: draftData.step2?.educationHistory?.resultsYear || '',
              universityCollege: draftData.step2?.educationHistory?.universityCollege || '',
              uniFromDate: draftData.step2?.educationHistory?.uniFromDate || '',
              uniToDate: draftData.step2?.educationHistory?.uniToDate || '',
              programme: draftData.step2?.educationHistory?.programme || '',
              qualification: draftData.step2?.educationHistory?.qualification || '',
              dateOfAward: draftData.step2?.educationHistory?.dateOfAward || '',
              classOfAward: draftData.step2?.educationHistory?.classOfAward || '',
            },
          },
          step3: {
            workExperience: Array.isArray(draftData.step3?.workExperience) 
              ? draftData.step3.workExperience.map((exp: any) => ({
                  fromDate: exp.fromDate || '',
                  toDate: exp.toDate || '',
                  organization: exp.organization || '',
                  position: exp.position || '',
                }))
              : [],
            motivation: {
              motivationEssay: draftData.step3?.motivation?.motivationEssay || '',
              uploadMotivationNote: draftData.step3?.motivation?.uploadMotivationNote || false,
              motivationFile: null, // File objects can't be serialized
            },
          },
          step4: {
            hasDisability: draftData.step4?.hasDisability || false,
            disabilityDescription: draftData.step4?.disabilityDescription || '',
          },
          step5: {
            referees: (() => {
              console.log('🔍 REFEREE DEBUG - Loading referees from backend:', draftData.step5?.referees);
              console.log('🔍 REFEREE DEBUG - Referees is array?', Array.isArray(draftData.step5?.referees));
              console.log('🔍 REFEREE DEBUG - Referees length:', draftData.step5?.referees?.length);
              
              if (Array.isArray(draftData.step5?.referees) && draftData.step5.referees.length > 0) {
                const mappedReferees = draftData.step5.referees.map((ref: any) => ({
                  name: ref.name || '',
                  position: ref.position || '',
                  institution: ref.institution || '',
                  address: ref.address || '',
                  email: ref.email || '',
                }));
                console.log('🔍 REFEREE DEBUG - Mapped referees:', mappedReferees);
                return mappedReferees;
              } else {
                console.log('🔍 REFEREE DEBUG - No referees found, using default 2 empty referees');
                return [
                  { name: '', position: '', institution: '', address: '', email: '' },
                  { name: '', position: '', institution: '', address: '', email: '' },
                ];
              }
            })(),
            declaration: {
              declarationAgreed: draftData.step5?.declaration?.declarationAgreed || false,
              fullName: draftData.step5?.declaration?.fullName || '',
              date: draftData.step5?.declaration?.date || new Date().toISOString().split('T')[0],
              allSectionsCompleted: draftData.step5?.declaration?.allSectionsCompleted || false,
              allDocumentsUploaded: draftData.step5?.declaration?.allDocumentsUploaded || false,
              depositSlipAttached: draftData.step5?.declaration?.depositSlipAttached || false,
            },
          },
          currentStep: draftData.currentStep || 1,
          lastSaved: draftData.lastSaved || new Date().toISOString(),
        };

        setData(convertedData);
      } else {
        // No draft found, set application type from URL and start fresh
        setData(prev => ({
          ...prev,
          step1: {
            ...prev.step1,
            applicationType,
          },
        }));
        console.log('No draft found, starting fresh for:', applicationType);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      // On error, still set the application type from URL if available
      const urlParams = new URLSearchParams(window.location.search);
      const applicationType = urlParams.get('type') as 'undergraduate' | 'postgraduate' | null;
      if (applicationType && ['undergraduate', 'postgraduate'].includes(applicationType)) {
        setData(prev => ({
          ...prev,
          step1: {
            ...prev.step1,
            applicationType,
          },
        }));
        console.log('Error loading draft, but set application type from URL:', applicationType);
      }
    }
  }, []);

  // Load draft on component mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // Update current step
  const updateStep = useCallback((step: number) => {
    setData(prev => ({ ...prev, currentStep: step }));
    saveDraft(); // Save on page change
  }, [saveDraft]);

  // Validation functions
  const isStepValid = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // Personal & Contact Details
        const { step1 } = data;
        return !!(
          step1.title &&
          step1.surname &&
          step1.firstName &&
          step1.maritalStatus &&
          step1.dateOfBirth &&
          step1.placeOfBirth &&
          step1.nationality &&
          step1.countryOfResidence &&
          step1.gender &&
          step1.passportPhoto &&
          step1.correspondenceAddress &&
          step1.telephoneNumbers &&
          step1.emailAddress
        );
      
      case 2: // Programme & Education History
        const { step2 } = data;
        return !!(
          step2.programInfo.levelOfStudy &&
          step2.programInfo.firstChoice &&
          ((step2.programInfo.levelOfStudy === 'undergraduate' && 
            step2.educationHistory.schoolName &&
            step2.educationHistory.schoolFromDate &&
            step2.educationHistory.schoolToDate &&
            step2.educationHistory.subjectsAndGrades.filter(item => item.subject.trim() && item.grade.trim()).length >= 6 &&
            step2.educationHistory.examinationYear &&
            step2.educationHistory.resultsYear) ||
           (step2.programInfo.levelOfStudy === 'postgraduate' &&
            step2.educationHistory.universityCollege &&
            step2.educationHistory.uniFromDate &&
            step2.educationHistory.uniToDate &&
            step2.educationHistory.programme &&
            step2.educationHistory.qualification &&
            step2.educationHistory.dateOfAward &&
            step2.educationHistory.classOfAward))
        );
      
      case 3: 
        const applicationType = data.step1.applicationType;
        if (applicationType === 'undergraduate') {
          // Step 3 for undergraduate is Special Needs
          const { step4 } = data;
          return !step4.hasDisability || !!step4.disabilityDescription;
        } else {
          // Step 3 for postgraduate is Work Experience & Motivation
          const { step3 } = data;
          return !!(
            step3.motivation.motivationEssay &&
            step3.motivation.motivationEssay.split(' ').length >= 500 &&
            step3.motivation.motivationEssay.split(' ').length <= 1000
          );
        }
      
      case 4: 
        const appType = data.step1.applicationType;
        if (appType === 'undergraduate') {
          // Step 4 for undergraduate is Referees & Declaration
          const { step5 } = data;
          const validReferees = step5.referees.filter(ref => 
            ref.name && ref.position && ref.institution && ref.address && ref.email
          );
          return !!(
            validReferees.length >= 2 &&
            step5.declaration.declarationAgreed &&
            step5.declaration.fullName &&
            step5.declaration.allSectionsCompleted &&
            step5.declaration.allDocumentsUploaded &&
            step5.declaration.depositSlipAttached &&
            step5.declaration.paymentReference &&
            step5.declaration.paymentReference.trim().length >= 6
          );
        } else {
          // Step 4 for postgraduate is Special Needs
          const { step4 } = data;
          return !step4.hasDisability || !!step4.disabilityDescription;
        }
      
      case 5: // Referees & Declaration (postgraduate only)
        const { step5 } = data;
        const validReferees = step5.referees.filter(ref => 
          ref.name && ref.position && ref.institution && ref.address && ref.email
        );
        return !!(
          validReferees.length >= 2 &&
          step5.declaration.declarationAgreed &&
          step5.declaration.fullName &&
          step5.declaration.allSectionsCompleted &&
          step5.declaration.allDocumentsUploaded &&
          step5.declaration.depositSlipAttached &&
          step5.declaration.paymentReference &&
          step5.declaration.paymentReference.trim().length >= 6
        );
      
      default:
        return false;
    }
  }, [data]);

  // Get overall progress
  const getStepProgress = useCallback(() => {
    let completedSteps = 0;
    for (let i = 0; i < 5; i++) {
      if (isStepValid(i)) completedSteps++;
    }
    return (completedSteps / 5) * 100;
  }, [isStepValid]);

  // Work experience management
  const addWorkExperience = useCallback(() => {
    setData(prev => ({
      ...prev,
      step3: {
        ...prev.step3,
        workExperience: [
          ...prev.step3.workExperience,
          { fromDate: '', toDate: '', organization: '', position: '' }
        ]
      }
    }));
  }, []);

  const removeWorkExperience = useCallback((index: number) => {
    setData(prev => ({
      ...prev,
      step3: {
        ...prev.step3,
        workExperience: prev.step3.workExperience.filter((_, i) => i !== index)
      }
    }));
  }, []);

  // Referee management
  const addReferee = useCallback(() => {
    setData(prev => {
      if (prev.step5.referees.length < 3) {
        console.log('🔍 REFEREE DEBUG - Adding referee. Current count:', prev.step5.referees.length);
        return {
          ...prev,
          step5: {
            ...prev.step5,
            referees: [
              ...prev.step5.referees,
              { name: '', position: '', institution: '', address: '', email: '' }
            ]
          }
        };
      }
      console.log('🔍 REFEREE DEBUG - Cannot add referee, already at max (3)');
      return prev;
    });
  }, []);

  const removeReferee = useCallback((index: number) => {
    setData(prev => {
      if (prev.step5.referees.length > 2) {
        console.log('🔍 REFEREE DEBUG - Removing referee at index:', index, 'Current count:', prev.step5.referees.length);
        return {
          ...prev,
          step5: {
            ...prev.step5,
            referees: prev.step5.referees.filter((_, i) => i !== index)
          }
        };
      }
      console.log('🔍 REFEREE DEBUG - Cannot remove referee, need minimum 2');
      return prev;
    });
  }, []);

  // Get application type
  const getApplicationType = useCallback((): ApplicationType => {
    return data.step1.applicationType;
  }, [data.step1.applicationType]);

  // Get total steps based on application type
  const getTotalSteps = useCallback((): number => {
    const applicationType = data.step1.applicationType;
    return applicationType === 'undergraduate' ? 4 : 5; // Undergraduate: 4 steps, Postgraduate: 5 steps
  }, [data.step1.applicationType]);

  // Get step title based on application type
  const getStepTitle = useCallback((step: number): string => {
    const applicationType = getApplicationType();
    
    if (applicationType === 'undergraduate') {
      const undergraduateStepTitles = {
        1: 'Personal Information',
        2: 'Programme & Secondary Education',
        3: 'Special Needs & Requirements',
        4: 'Referees & Declaration'
      };
      return undergraduateStepTitles[step as keyof typeof undergraduateStepTitles] || 'Unknown Step';
    } else {
      const postgraduateStepTitles = {
        1: 'Personal Information',
        2: 'Programme & University Education',
        3: 'Work Experience & Motivation',
        4: 'Special Needs & Requirements',
        5: 'Referees & Declaration'
      };
      return postgraduateStepTitles[step as keyof typeof postgraduateStepTitles] || 'Unknown Step';
    }
  }, [getApplicationType]);

  // Check if step is available based on application type
  const isStepAvailable = useCallback((step: number): boolean => {
    const applicationType = getApplicationType();
    
    // Step 1 and above only available after application type is selected
    return applicationType !== '';
  }, [getApplicationType]);

  // Submit application function
  const submitApplication = useCallback(async (): Promise<ApplicationSubmission> => {
    try {
      // Don't submit if no application type is selected
      if (!data.step1.applicationType) {
        throw new Error('No application type selected');
      }

      console.log('🔍 SUBMIT DEBUG - Submitting application of type:', data.step1.applicationType);

      // Submit to backend (ApplicationService handles the data conversion)
      const result = await ApplicationService.submitApplication(data.step1.applicationType);
      
      setData(prev => ({
        ...prev,
        lastSaved: new Date().toISOString(),
      }));

      console.log('Application submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to submit application:', error);
      throw error;
    }
  }, [data.step1.applicationType]);

  return (
    <ApplicationContext.Provider value={{
      data,
      setData,
      updateStep,
      saveDraft,
      loadDraft,
      submitApplication,
      isStepValid,
      getStepProgress,
      addWorkExperience,
      removeWorkExperience,
      addReferee,
      removeReferee,
      getApplicationType,
      getTotalSteps,
      getStepTitle,
      isStepAvailable,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider');
  return ctx;
}; 