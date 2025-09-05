<?php

namespace App\Http\Controllers;

use App\Models\ApplicationDraft;
use App\Models\ApplicationSubmission;
use App\Models\WorkExperience;
use App\Models\Referee;
use App\Models\SubmissionWorkExperience;
use App\Models\SubmissionReferee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    /**
     * Save or update application draft.
     */
    public function saveDraft(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Validate that application_type is provided (support JSON and multipart keys)
            $applicationType = $request->input('application_type')
                ?? $request->input('step1.applicationType')
                ?? $request->input('step1[applicationType]');
            
            if (!in_array($applicationType, ['undergraduate', 'postgraduate'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Valid application type is required (undergraduate or postgraduate)',
                ], 422);
            }

            // Enforce max 1 draft per user (regardless of type)
            $anyExistingDraft = ApplicationDraft::where('user_id', $user->id)->first();
            if ($anyExistingDraft && $anyExistingDraft->application_type !== $applicationType) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an application draft. Please delete it before starting a new one.',
                    'existing_draft' => [
                        'id' => $anyExistingDraft->id,
                        'application_type' => $anyExistingDraft->application_type,
                        'last_saved' => optional($anyExistingDraft->last_saved_at)->toISOString(),
                    ],
                ], 422);
            }

            // Find or create draft for user and application type
            $draft = ApplicationDraft::where('user_id', $user->id)
                ->where('application_type', $applicationType)
                ->first();
            
            if (!$draft) {
                $draft = new ApplicationDraft([
                    'user_id' => $user->id,
                    'application_type' => $applicationType
                ]);
            }

            // Update draft fields from request
            $this->updateDraftFromRequest($draft, $request);
            
            // Calculate and update completion percentage
            $draft->updateCompletionPercentage();

            return response()->json([
                'success' => true,
                'message' => 'Draft saved successfully',
                'data' => [
                    'draft_id' => $draft->id,
                    'application_type' => $draft->application_type,
                    'completion_percentage' => $draft->completion_percentage,
                    'last_saved' => $draft->last_saved_at->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('saveDraft error', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to save draft. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Load user's draft by application type.
     */
    public function loadDraft(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Get application type from query parameter
            $applicationType = $request->query('application_type');
            
            if (!$applicationType || !in_array($applicationType, ['undergraduate', 'postgraduate'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Valid application type is required (undergraduate or postgraduate)',
                ], 422);
            }

            \Log::info('Loading draft for user ' . $user->id . ' with application type: ' . $applicationType);

            $draft = ApplicationDraft::with(['workExperiences', 'referees'])
                ->where('user_id', $user->id)
                ->where('application_type', $applicationType)
                ->first();

            if (!$draft) {
                \Log::info('No draft found for user ' . $user->id . ' and type ' . $applicationType);
                return response()->json([
                    'success' => true,
                    'message' => 'No draft found for this application type',
                    'data' => null,
                ]);
            }

            \Log::info('Draft found with ID: ' . $draft->id . ', converting to application data');
            $applicationData = $draft->toApplicationData();
            \Log::info('Converted application data: ' . json_encode($applicationData));

            return response()->json([
                'success' => true,
                'message' => 'Draft loaded successfully',
                'data' => $applicationData,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to load draft: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load draft',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit final application.
     */
    public function submitApplication(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $user = $request->user();
            $user->updateLastActivity();

            // Validate that application_type is provided
            $applicationType = $request->input('application_type');
            if (!in_array($applicationType, ['undergraduate', 'postgraduate'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Valid application type is required (undergraduate or postgraduate)',
                ], 422);
            }

            // Enforce: user can submit only one application (regardless of type)
            $existingSubmission = ApplicationSubmission::where('user_id', $user->id)->first();
            if ($existingSubmission) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already submitted an application. Only one submission is allowed.',
                    'application_id' => $existingSubmission->application_id,
                ], 422);
            }

            // Get user's draft for specific application type
            $draft = ApplicationDraft::with(['workExperiences', 'referees'])
                ->where('user_id', $user->id)
                ->where('application_type', $applicationType)
                ->first();

            if (!$draft) {
                return response()->json([
                    'success' => false,
                    'message' => 'No draft found to submit',
                ], 404);
            }

            // Validate completion
            if ($draft->completion_percentage < 100) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please complete all required fields before submitting',
                    'completion_percentage' => $draft->completion_percentage,
                ], 422);
            }

            // Validate payment reference - REQUIRED for submission
            $paymentReference = $draft->payment_reference;
            
            // First check if payment reference is provided
            if (empty($paymentReference) || trim($paymentReference) === '') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment reference number is required to submit your application. Please enter your bank deposit reference number.',
                    'code' => 'PAYMENT_REFERENCE_REQUIRED',
                ], 422);
            }

            // Then validate against admin-provided list
            $refRow = \DB::table('payment_references')->where('reference', $paymentReference)->first();
            if (!$refRow) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid payment reference number. Please check your reference number and try again, or contact Admissions if the problem persists.',
                    'code' => 'PAYMENT_REFERENCE_INVALID',
                ], 422);
            }

            if ($refRow->status === 'used') {
                return response()->json([
                    'success' => false,
                    'message' => 'This payment reference has already been used. Please contact Admissions if you believe this is an error.',
                    'code' => 'PAYMENT_REFERENCE_ALREADY_USED',
                ], 422);
            }

            if ($refRow->status === 'flagged') {
                return response()->json([
                    'success' => false,
                    'message' => 'This payment reference has been flagged. Please contact Admissions for assistance.',
                    'code' => 'PAYMENT_REFERENCE_FLAGGED',
                ], 422);
            }

            // Create application submission
            $submission = ApplicationSubmission::create([
                'user_id' => $user->id,
                'application_id' => ApplicationSubmission::generateApplicationId(),
                'application_type' => $draft->application_type,
                'status' => 'submitted',
                
                // Copy all fields from draft
                'title' => $draft->title,
                'surname' => $draft->surname,
                'first_name' => $draft->first_name,
                'marital_status' => $draft->marital_status,
                'maiden_name' => $draft->maiden_name,
                'date_of_birth' => $draft->date_of_birth,
                'place_of_birth' => $draft->place_of_birth,
                'nationality' => $draft->nationality,
                'country_of_residence' => $draft->country_of_residence,
                'gender' => $draft->gender,
                'passport_photo_path' => $draft->passport_photo_path,
                'correspondence_address' => $draft->correspondence_address,
                'telephone_numbers' => $draft->telephone_numbers,
                'email_address' => $draft->email_address,
                'permanent_address' => $draft->permanent_address,
                'show_permanent_address' => $draft->show_permanent_address,
                
                'level_of_study' => $draft->level_of_study,
                'first_choice' => $draft->first_choice,
                'second_choice' => $draft->second_choice,
                'third_choice' => $draft->third_choice,
                'fourth_choice' => $draft->fourth_choice,
                'method_of_study' => $draft->method_of_study,
                
                'school_name' => $draft->school_name,
                'school_from_date' => $draft->school_from_date,
                'school_to_date' => $draft->school_to_date,
                'subjects_studied' => $draft->subjects_studied,
                'examination_year' => $draft->examination_year,
                'results_year' => $draft->results_year,
                'grades_achieved' => $draft->grades_achieved,
                'subjects_and_grades' => $draft->subjects_and_grades,
                'university_college' => $draft->university_college,
                'uni_from_date' => $draft->uni_from_date,
                'uni_to_date' => $draft->uni_to_date,
                'programme' => $draft->programme,
                'qualification' => $draft->qualification,
                'date_of_award' => $draft->date_of_award,
                'class_of_award' => $draft->class_of_award,
                
                'motivation_essay' => $draft->motivation_essay,
                'upload_motivation_note' => $draft->upload_motivation_note,
                'motivation_file_path' => $draft->motivation_file_path,
                
                'has_disability' => $draft->has_disability,
                'disability_description' => $draft->disability_description,
                
                'declaration_agreed' => $draft->declaration_agreed,
                'declaration_full_name' => $draft->declaration_full_name,
                'declaration_date' => $draft->declaration_date,
                'all_sections_completed' => $draft->all_sections_completed,
                'all_documents_uploaded' => $draft->all_documents_uploaded,
                'deposit_slip_attached' => $draft->deposit_slip_attached,
                'payment_reference' => $paymentReference,
                'payment_verified' => true,
                
                'program_title' => $draft->program_title ?: $draft->first_choice,
                'faculty' => $draft->faculty ?: $draft->getFacultyFromProgram($draft->first_choice),
                'submitted_at' => now(),
            ]);

            // Copy work experiences
            foreach ($draft->workExperiences as $workExp) {
                SubmissionWorkExperience::create([
                    'application_submission_id' => $submission->id,
                    'from_date' => $workExp->from_date,
                    'to_date' => $workExp->to_date,
                    'organization' => $workExp->organization,
                    'position' => $workExp->position,
                    'order_index' => $workExp->order_index,
                ]);
            }

            // Copy referees
            foreach ($draft->referees as $referee) {
                SubmissionReferee::create([
                    'application_submission_id' => $submission->id,
                    'name' => $referee->name,
                    'position' => $referee->position,
                    'institution' => $referee->institution,
                    'address' => $referee->address,
                    'email' => $referee->email,
                    'order_index' => $referee->order_index,
                ]);
            }

            // Mark reference as used and delete the draft after successful submission
            if ($paymentReference) {
                \DB::table('payment_references')->where('reference', $paymentReference)->update([
                    'status' => 'used',
                    'used_by_user_id' => $user->id,
                    'used_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Delete the draft after successful submission
            $draft->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Application submitted successfully',
                'data' => [
                    'application_id' => $submission->application_id,
                    'submission_id' => $submission->id,
                    'status' => $submission->status,
                    'submitted_at' => $submission->submitted_at->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit application. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's drafts by application type.
     */
    public function getDraftsByType(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            $undergraduateDraft = $user->undergraduateDraft();
            $postgraduateDraft = $user->postgraduateDraft();

            return response()->json([
                'success' => true,
                'message' => 'Drafts retrieved successfully',
                'data' => [
                    'undergraduate' => $undergraduateDraft ? [
                        'id' => $undergraduateDraft->id,
                        'completion_percentage' => $undergraduateDraft->completion_percentage,
                        'last_saved' => $undergraduateDraft->last_saved_at->toISOString(),
                        'program_title' => $undergraduateDraft->program_title
                    ] : null,
                    'postgraduate' => $postgraduateDraft ? [
                        'id' => $postgraduateDraft->id,
                        'completion_percentage' => $postgraduateDraft->completion_percentage,
                        'last_saved' => $postgraduateDraft->last_saved_at->toISOString(),
                        'program_title' => $postgraduateDraft->program_title
                    ] : null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve drafts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's applications (drafts and submissions).
     */
    public function getUserApplications(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Get drafts ordered by application type
            $drafts = ApplicationDraft::where('user_id', $user->id)
                ->orderBy('application_type')
                ->orderBy('last_saved_at', 'desc')
                ->get();
            
            // Get submissions
            $submissions = ApplicationSubmission::where('user_id', $user->id)
                ->orderBy('submitted_at', 'desc')
                ->get();

            $applications = [];

            // Format drafts with application type information
            foreach ($drafts as $draft) {
                $applications[] = [
                    'id' => "draft_{$draft->id}",
                    'title' => $draft->program_title ?: ucfirst($draft->application_type) . ' Application Draft',
                    'faculty' => $draft->faculty ?: 'Not specified',
                    'status' => $draft->completion_percentage < 100 ? 'incomplete' : 'draft',
                    'submitted_date' => '',
                    'last_updated' => $draft->last_saved_at->format('Y-m-d'),
                    'application_id' => "DRAFT-{$draft->application_type}-{$draft->id}",
                    'application_type' => $draft->application_type,
                    'is_draft' => true,
                    'completion_percentage' => $draft->completion_percentage,
                ];
            }

            // Format submissions
            foreach ($submissions as $submission) {
                $applications[] = [
                    'id' => $submission->id,
                    'title' => $submission->program_title,
                    'faculty' => $submission->faculty,
                    'status' => $submission->status,
                    'submitted_date' => $submission->submitted_at->format('Y-m-d'),
                    'last_updated' => $submission->updated_at->format('Y-m-d'),
                    'application_id' => $submission->application_id,
                    'application_type' => $submission->application_type,
                    'is_draft' => false,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Applications retrieved successfully',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve applications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific application details.
     */
    public function getApplication(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Check if it's a draft or submission
            if (str_starts_with($id, 'draft_')) {
                $draftId = str_replace('draft_', '', $id);
                $draft = ApplicationDraft::with(['workExperiences', 'referees'])
                    ->where('id', $draftId)
                    ->where('user_id', $user->id)
                    ->first();

                if (!$draft) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Draft not found',
                    ], 404);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Draft retrieved successfully',
                    'data' => $draft->toApplicationData(),
                ]);
            } else {
                $submission = ApplicationSubmission::with(['workExperiences', 'referees'])
                    ->where('id', $id)
                    ->where('user_id', $user->id)
                    ->first();

                if (!$submission) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Application not found',
                    ], 404);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Application retrieved successfully',
                    'data' => $submission,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve application',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update draft fields from request data.
     */
    private function updateDraftFromRequest(ApplicationDraft $draft, Request $request): void
    {
        $data = $request->all();
        
        // Handle passport photo upload
        if ($request->hasFile('passportPhoto')) {
            $file = $request->file('passportPhoto');
            
            // Validate file type (skip MIME type check if php_fileinfo is not available)
            $allowedExtensions = ['jpg', 'jpeg', 'png'];
            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, $allowedExtensions)) {
                throw new \Exception('Passport photo must be a JPG or PNG image');
            }
            
            // Validate file size (2MB max)
            if ($file->getSize() > 2 * 1024 * 1024) {
                throw new \Exception('Passport photo must be less than 2MB');
            }
            
            // Generate unique filename
            $filename = 'passport_' . $draft->user_id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Store file in storage/app/public/passport_photos
            $path = $file->storeAs('passport_photos', $filename, 'public');
            
            // Update draft with file path
            $draft->passport_photo_path = $path;
        }
        
        // Map React field names to database field names and update
        $fieldMapping = [
            // Step 1: Personal Information
            'step1.applicationType' => 'application_type',
            'step1[applicationType]' => 'application_type',
            'step1.title' => 'title',
            'step1[title]' => 'title',
            'step1.surname' => 'surname',
            'step1[surname]' => 'surname',
            'step1.firstName' => 'first_name',
            'step1[firstName]' => 'first_name',
            'step1.maritalStatus' => 'marital_status',
            'step1[maritalStatus]' => 'marital_status',
            'step1.maidenName' => 'maiden_name',
            'step1[maidenName]' => 'maiden_name',
            'step1.dateOfBirth' => 'date_of_birth',
            'step1[dateOfBirth]' => 'date_of_birth',
            'step1.placeOfBirth' => 'place_of_birth',
            'step1[placeOfBirth]' => 'place_of_birth',
            'step1.nationality' => 'nationality',
            'step1[nationality]' => 'nationality',
            'step1.countryOfResidence' => 'country_of_residence',
            'step1[countryOfResidence]' => 'country_of_residence',
            'step1.gender' => 'gender',
            'step1[gender]' => 'gender',
            'step1.correspondenceAddress' => 'correspondence_address',
            'step1[correspondenceAddress]' => 'correspondence_address',
            'step1.telephoneNumbers' => 'telephone_numbers',
            'step1[telephoneNumbers]' => 'telephone_numbers',
            'step1.emailAddress' => 'email_address',
            'step1[emailAddress]' => 'email_address',
            'step1.permanentAddress' => 'permanent_address',
            'step1[permanentAddress]' => 'permanent_address',
            'step1.showPermanentAddress' => 'show_permanent_address',
            'step1[showPermanentAddress]' => 'show_permanent_address',
            
            // Step 2: Program Information
            'step2.programInfo.levelOfStudy' => 'level_of_study',
            'step2.programInfo.firstChoice' => 'first_choice',
            'step2.programInfo.secondChoice' => 'second_choice',
            'step2.programInfo.thirdChoice' => 'third_choice',
            'step2.programInfo.fourthChoice' => 'fourth_choice',
            'step2.programInfo.methodOfStudy' => 'method_of_study',
            
            // Step 2: Education History
            'step2.educationHistory.schoolName' => 'school_name',
            'step2.educationHistory.schoolFromDate' => 'school_from_date',
            'step2.educationHistory.schoolToDate' => 'school_to_date',
            'step2.educationHistory.examinationYear' => 'examination_year',
            'step2.educationHistory.resultsYear' => 'results_year',
            'step2.educationHistory.universityCollege' => 'university_college',
            'step2.educationHistory.uniFromDate' => 'uni_from_date',
            'step2.educationHistory.uniToDate' => 'uni_to_date',
            'step2.educationHistory.programme' => 'programme',
            'step2.educationHistory.qualification' => 'qualification',
            'step2.educationHistory.dateOfAward' => 'date_of_award',
            'step2.educationHistory.classOfAward' => 'class_of_award',
            
            // Step 3: Motivation
            'step3.motivation.motivationEssay' => 'motivation_essay',
            'step3.motivation.uploadMotivationNote' => 'upload_motivation_note',
            
            // Step 4: Special Needs
            'step4.hasDisability' => 'has_disability',
            'step4.disabilityDescription' => 'disability_description',
            
            // Step 5: Declaration
            'step5.declaration.declarationAgreed' => 'declaration_agreed',
            'step5.declaration.fullName' => 'declaration_full_name',
            'step5.declaration.date' => 'declaration_date',
            'step5.declaration.allSectionsCompleted' => 'all_sections_completed',
            'step5.declaration.allDocumentsUploaded' => 'all_documents_uploaded',
            'step5.declaration.depositSlipAttached' => 'deposit_slip_attached',
            'step5.declaration.paymentReference' => 'payment_reference',
            
            // Metadata
            'currentStep' => 'current_step',
            'programTitle' => 'program_title',
            'faculty' => 'faculty',
        ];

        // Update simple fields
        foreach ($fieldMapping as $requestKey => $dbField) {
            $value = data_get($data, $requestKey);
            // Normalize empty strings to null to avoid invalid casting (e.g., dates)
            if (is_string($value)) {
                $value = trim($value);
                if ($value === '') {
                    $value = null;
                }
            }
            if ($value !== null) {
                $draft->$dbField = $value;
            }
        }

        // Handle subjects and grades conversion
        if (isset($data['step2']['educationHistory']['subjectsAndGrades'])) {
            $subjectsAndGrades = $data['step2']['educationHistory']['subjectsAndGrades'];
            
            // Validate and clean the data
            if (is_array($subjectsAndGrades)) {
                $cleanedData = [];
                foreach ($subjectsAndGrades as $item) {
                    if (isset($item['subject']) && isset($item['grade']) && isset($item['id'])) {
                        $cleanedData[] = [
                            'id' => $item['id'],
                            'subject' => trim($item['subject']),
                            'grade' => trim($item['grade']),
                        ];
                    }
                }
                $draft->subjects_and_grades = $cleanedData;
                
                // For backward compatibility, also update old format fields
                $subjects = [];
                $grades = [];
                foreach ($cleanedData as $item) {
                    if (!empty($item['subject']) || !empty($item['grade'])) {
                        $subjects[] = $item['subject'];
                        $grades[] = $item['grade'];
                    }
                }
                $draft->subjects_studied = implode("\n", $subjects);
                $draft->grades_achieved = implode("\n", $grades);
            }
        }

        // Set program title and faculty if first choice is set
        if (isset($data['step2']['programInfo']['firstChoice'])) {
            $draft->program_title = $data['step2']['programInfo']['firstChoice'];
            $draft->faculty = $draft->getFacultyFromProgram($data['step2']['programInfo']['firstChoice']);
        }

        // Normalize enum/categorical fields to satisfy DB constraints
        if (!empty($draft->gender)) {
            $normalizedGender = strtolower(trim((string) $draft->gender));
            $allowedGenders = ['male', 'female', 'other'];
            $draft->gender = in_array($normalizedGender, $allowedGenders, true) ? $normalizedGender : null;
        }

        if (!empty($draft->application_type)) {
            $normalizedType = strtolower(trim((string) $draft->application_type));
            $allowedTypes = ['undergraduate', 'postgraduate'];
            $draft->application_type = in_array($normalizedType, $allowedTypes, true) ? $normalizedType : $draft->application_type;
        }

        if (!empty($draft->level_of_study)) {
            $normalizedLevel = strtolower(trim((string) $draft->level_of_study));
            $allowedLevels = ['undergraduate', 'postgraduate'];
            $draft->level_of_study = in_array($normalizedLevel, $allowedLevels, true) ? $normalizedLevel : null;
        }

        $draft->last_saved_at = now();
        $draft->save();

        // Handle work experiences
        if (isset($data['step3']['workExperience'])) {
            // Delete existing work experiences
            $draft->workExperiences()->delete();
            
            // Create new work experiences
            foreach ($data['step3']['workExperience'] as $index => $workExp) {
                if (!empty($workExp['organization']) || !empty($workExp['position'])) {
                    WorkExperience::create([
                        'application_draft_id' => $draft->id,
                        'from_date' => $workExp['fromDate'] ?? '',
                        'to_date' => $workExp['toDate'] ?? '',
                        'organization' => $workExp['organization'] ?? '',
                        'position' => $workExp['position'] ?? '',
                        'order_index' => $index,
                    ]);
                }
            }
        }

        // Handle referees
        if (isset($data['step5']['referees'])) {
            // Delete existing referees
            $draft->referees()->delete();
            
            // Create new referees
            foreach ($data['step5']['referees'] as $index => $referee) {
                if (!empty($referee['name']) || !empty($referee['email'])) {
                    Referee::create([
                        'application_draft_id' => $draft->id,
                        'name' => $referee['name'] ?? '',
                        'position' => $referee['position'] ?? '',
                        'institution' => $referee['institution'] ?? '',
                        'address' => $referee['address'] ?? '',
                        'email' => $referee['email'] ?? '',
                        'order_index' => $index,
                    ]);
                }
            }
        }
    }

    /**
     * Get user's submitted applications only.
     */
    public function getUserSubmissions(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            $submissions = ApplicationSubmission::where('user_id', $user->id)
                ->with(['workExperiences', 'referees'])
                ->orderBy('submitted_at', 'desc')
                ->get();

            $submissionData = $submissions->map(function ($submission) {
                return [
                    'id' => $submission->application_id,
                    'title' => $submission->program_title ?: $submission->first_choice,
                    'faculty' => $submission->faculty ?: 'Not specified',
                    'status' => $submission->status,
                    'submitted_date' => $submission->submitted_at->format('M d, Y'),
                    'last_updated' => $submission->updated_at->format('M d, Y'),
                    'application_id' => $submission->application_id,
                    'application_type' => $submission->application_type,
                    'is_draft' => false,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Submissions retrieved successfully',
                'data' => $submissionData,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve submissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific submission by application ID for viewing.
     */
    public function getSubmission(Request $request, $applicationId): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            $submission = ApplicationSubmission::where('application_id', $applicationId)
                ->where('user_id', $user->id)
                ->with(['workExperiences', 'referees'])
                ->first();

            if (!$submission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Submission not found',
                ], 404);
            }

            // Convert submission to a readable format
            $submissionData = [
                'application_id' => $submission->application_id,
                'application_type' => $submission->application_type,
                'status' => $submission->status,
                'submitted_at' => $submission->submitted_at->toISOString(),
                
                'step1' => [
                    'applicationType' => $submission->application_type,
                    'title' => $submission->title,
                    'surname' => $submission->surname,
                    'firstName' => $submission->first_name,
                    'maritalStatus' => $submission->marital_status,
                    'maidenName' => $submission->maiden_name,
                    'dateOfBirth' => $submission->date_of_birth?->format('Y-m-d'),
                    'placeOfBirth' => $submission->place_of_birth,
                    'nationality' => $submission->nationality,
                    'countryOfResidence' => $submission->country_of_residence,
                    'gender' => $submission->gender,
                    'correspondenceAddress' => $submission->correspondence_address,
                    'telephoneNumbers' => $submission->telephone_numbers,
                    'emailAddress' => $submission->email_address,
                    'permanentAddress' => $submission->permanent_address,
                    'showPermanentAddress' => $submission->show_permanent_address,
                ],
                
                'step2' => [
                    'programInfo' => [
                        'levelOfStudy' => $submission->level_of_study,
                        'firstChoice' => $submission->first_choice,
                        'secondChoice' => $submission->second_choice,
                        'thirdChoice' => $submission->third_choice,
                        'fourthChoice' => $submission->fourth_choice,
                        'methodOfStudy' => $submission->method_of_study,
                    ],
                    'educationHistory' => [
                        'schoolName' => $submission->school_name,
                        'schoolFromDate' => $submission->school_from_date,
                        'schoolToDate' => $submission->school_to_date,
                        'subjectsStudied' => $submission->subjects_studied,
                        'examinationYear' => $submission->examination_year,
                        'resultsYear' => $submission->results_year,
                        'gradesAchieved' => $submission->grades_achieved,
                        'universityCollege' => $submission->university_college,
                        'uniFromDate' => $submission->uni_from_date,
                        'uniToDate' => $submission->uni_to_date,
                        'programme' => $submission->programme,
                        'qualification' => $submission->qualification,
                        'dateOfAward' => $submission->date_of_award,
                        'classOfAward' => $submission->class_of_award,
                    ],
                ],
                
                'step3' => [
                    'workExperience' => $submission->workExperiences->map(function ($work) {
                        return [
                            'fromDate' => $work->from_date,
                            'toDate' => $work->to_date,
                            'organization' => $work->organization,
                            'position' => $work->position,
                        ];
                    })->toArray(),
                    'motivation' => [
                        'motivationEssay' => $submission->motivation_essay,
                        'uploadMotivationNote' => $submission->upload_motivation_note,
                    ],
                ],
                
                'step4' => [
                    'hasDisability' => $submission->has_disability,
                    'disabilityDescription' => $submission->disability_description,
                ],
                
                'step5' => [
                    'referees' => $submission->referees->map(function ($referee) {
                        return [
                            'name' => $referee->name,
                            'position' => $referee->position,
                            'institution' => $referee->institution,
                            'address' => $referee->address,
                            'email' => $referee->email,
                        ];
                    })->toArray(),
                    'declaration' => [
                        'declarationAgreed' => $submission->declaration_agreed,
                        'fullName' => $submission->declaration_full_name,
                        'date' => $submission->declaration_date?->format('Y-m-d'),
                        'allSectionsCompleted' => $submission->all_sections_completed,
                        'allDocumentsUploaded' => $submission->all_documents_uploaded,
                        'depositSlipAttached' => $submission->deposit_slip_attached,
                    ],
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Submission retrieved successfully',
                'data' => $submissionData,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve submission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete application draft.
     */
    public function deleteDraft(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Validate that application_type is provided
            $applicationType = $request->input('application_type');
            if (!in_array($applicationType, ['undergraduate', 'postgraduate'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Valid application type is required (undergraduate or postgraduate)',
                ], 422);
            }

            // Find the draft for user and application type
            $draft = ApplicationDraft::where('user_id', $user->id)
                ->where('application_type', $applicationType)
                ->first();

            if (!$draft) {
                return response()->json([
                    'success' => false,
                    'message' => 'Draft not found',
                ], 404);
            }

            // Delete associated work experiences and referees (cascade delete should handle this, but being explicit)
            $draft->workExperiences()->delete();
            $draft->referees()->delete();
            
            // Delete the draft
            $draft->delete();

            return response()->json([
                'success' => true,
                'message' => 'Draft deleted successfully',
                'data' => [
                    'application_type' => $applicationType,
                    'deleted_at' => now()->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete draft. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 