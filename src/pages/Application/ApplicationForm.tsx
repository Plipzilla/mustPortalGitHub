import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplication } from './ApplicationContext';
import ApplicationService from '../../services/ApplicationService';
import ApplicationTypeSelection from './ApplicationTypeSelection';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2UndergraduateEducation from './Step2UndergraduateEducation';
import Step2PostgraduateEducation from './Step2PostgraduateEducation';
import Step3PostgraduateWorkMotivation from './Step3PostgraduateWorkMotivation';
import Step4SpecialNeeds from './Step4SpecialNeeds';
import Step5RefereesDeclaration from './Step5RefereesDeclaration';
import './ApplicationForm.css';
import './FormStyles.css';

const ProgressBar: React.FC = () => {
  const { data, getStepTitle, getApplicationType, getTotalSteps } = useApplication();
  const applicationType = getApplicationType();

  // Don't show progress bar if no application type is selected
  if (!applicationType) {
    return null;
  }

  const totalSteps = getTotalSteps();
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2>Please fill in your information</h2>
        <p className="application-type-badge">
          {applicationType === 'undergraduate' ? 'Undergraduate Application' : 'Postgraduate Application'}
        </p>
      </div>
      <div className="progress-steps">
        {stepNumbers.map((stepNumber) => (
          <div 
            key={stepNumber} 
            className={`progress-step ${stepNumber <= data.currentStep ? 'active' : ''} ${stepNumber < data.currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{stepNumber}</div>
            <div className="step-label">{getStepTitle(stepNumber)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplicationForm: React.FC = () => {
  const {
    data,
    updateStep,
    saveDraft,
    loadDraft,
    isStepValid,
    getApplicationType,
    setData
  } = useApplication();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lockDraftType, setLockDraftType] = useState<'undergraduate' | 'postgraduate' | null>(null);
  const [lockDraftInfo, setLockDraftInfo] = useState<{ id: number; last_saved: string; program_title?: string } | null>(null);
  const [lockSubmission, setLockSubmission] = useState<{ application_id: string; status: string; title?: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get application type from URL or context
  const applicationType = getApplicationType();

  useEffect(() => {
    const init = async () => {
      await loadDraft();

      // After attempting to load, check if user already has a draft and block starting a new one
      try {
        const drafts = await ApplicationService.getDraftsByType();
        const urlParams = new URLSearchParams(location.search);
        const continueDraft = urlParams.get('continue') === 'true';

        // Determine if any draft exists
        const u = drafts.undergraduate;
        const p = drafts.postgraduate;

        let chosenType: 'undergraduate' | 'postgraduate' | null = null;
        let chosen = null as any;
        if (u && p) {
          // Pick most recent
          chosenType = new Date(u.last_saved) > new Date(p.last_saved) ? 'undergraduate' : 'postgraduate';
          chosen = new Date(u.last_saved) > new Date(p.last_saved) ? u : p;
        } else if (u) {
          chosenType = 'undergraduate';
          chosen = u;
        } else if (p) {
          chosenType = 'postgraduate';
          chosen = p;
        }

        // If a draft exists and user did not explicitly choose to continue, lock new-application start
        if (chosenType && !continueDraft) {
          setLockDraftType(chosenType);
          setLockDraftInfo(chosen);
        } else {
          setLockDraftType(null);
          setLockDraftInfo(null);
        }

        // Also prevent new application if user already has a submitted/reviewed one
        try {
          const submissions = await ApplicationService.getUserSubmissions();
          const blocking = submissions && Array.isArray(submissions) && submissions.find((s: any) => {
            const st = (s.status || '').toLowerCase();
            return ['submitted', 'review', 'accepted', 'rejected'].includes(st);
          });
          if (blocking) {
            setLockSubmission({ application_id: blocking.application_id, status: blocking.status, title: (blocking as any).title });
          } else {
            setLockSubmission(null);
          }
        } catch (e) {
          // ignore submission check errors
          setLockSubmission(null);
        }
      } catch (e) {
        // non-blocking
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [loadDraft, location.search]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [data.currentStep, applicationType]);

  const handleNext = () => {
    if (!applicationType) return; // Can't proceed without application type
    
    const maxSteps = applicationType === 'undergraduate' ? 4 : 5;
    if (isStepValid(data.currentStep)) {
      updateStep(Math.min(data.currentStep + 1, maxSteps));
    }
  };

  const handleBack = () => {
    if (!applicationType) return; // Can't go back from type selection
    
    updateStep(Math.max(data.currentStep - 1, 1));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await saveDraft();
      // Show a temporary success message instead of alert
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Draft saved successfully!';
      successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    } catch (error) {
      alert('Error saving draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewAndSubmit = async () => {
    const maxSteps = applicationType === 'undergraduate' ? 4 : 5;
    if (!isStepValid(maxSteps)) {
      alert('Please complete all required fields before proceeding to review.');
      return;
    }

    // Save the current draft before going to review
    setSaving(true);
    try {
      await saveDraft();
      // Navigate to confirmation page
      navigate(`/application/confirm?type=${applicationType}`);
    } catch (error) {
      alert('Error saving draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your application...</p>
      </div>
    );
  }

  const renderCurrentStep = () => {
    // Show application type selection if:
    // 1. No type is selected OR currentStep is 0 (fresh start)
    // 2. User clicked "Start New Application" (userDrafts is empty but no type selected)
    const urlParams = new URLSearchParams(location.search);
    const continueDraft = urlParams.get('continue') === 'true';
    
    if ((lockSubmission || lockDraftType) && !continueDraft) {
      return (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 20,
        }}>
          {lockSubmission ? (
            <>
              <h3 style={{ marginTop: 0 }}>You already have an application in progress</h3>
              <p style={{ color: '#475569' }}>
                You have a {lockSubmission.status?.toLowerCase()} application. To maintain fairness,
                you can only submit one application at a time. View your application for updates.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/application/view/${lockSubmission.application_id}`)}
                >
                  View Application
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginTop: 0 }}>You already have a draft in progress</h3>
              <p style={{ color: '#475569' }}>
                To keep things clear, you can only work on one application draft at a time. Continue your
                current draft or delete it to start a new one.
              </p>
              <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                <div style={{ fontSize: 14, color: '#64748b' }}>
                  Draft: <strong>{lockDraftInfo?.program_title || (lockDraftType === 'undergraduate' ? 'Undergraduate' : 'Postgraduate')}</strong>
                  {lockDraftInfo?.last_saved ? ` • Last saved: ${new Date(lockDraftInfo.last_saved).toLocaleString()}` : ''}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/application?type=${lockDraftType}&continue=true`, { replace: true })}
                  >
                    Continue Draft
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={async () => {
                      if (!lockDraftType) return;
                      const proceed = window.confirm('Delete your current draft? This cannot be undone.');
                      if (!proceed) return;
                      try {
                        await ApplicationService.deleteDraft(lockDraftType);
                        setLockDraftType(null);
                        setLockDraftInfo(null);
                        // Reset local form state to allow a fresh start
                        setData(prev => ({
                          ...prev,
                          step1: { ...prev.step1, applicationType: '' },
                          currentStep: 0,
                        }));
                        navigate('/application', { replace: true });
                      } catch (err) {
                        alert('Failed to delete draft. Please try again.');
                      }
                    }}
                  >
                    Delete Draft
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (!applicationType || (!continueDraft && data.currentStep === 0)) {
      return <ApplicationTypeSelection />;
    }

    switch (data.currentStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return applicationType === 'undergraduate' ? 
          <Step2UndergraduateEducation /> : 
          <Step2PostgraduateEducation />;
      case 3:
        // Undergraduate skips motivation step, goes to Special Needs
        if (applicationType === 'undergraduate') {
          return <Step4SpecialNeeds />;
        } else {
          return <Step3PostgraduateWorkMotivation />;
        }
      case 4:
        // Step 4 for undergraduate is Referees, for postgraduate is Special Needs
        if (applicationType === 'undergraduate') {
          return <Step5RefereesDeclaration />;
        } else {
          return <Step4SpecialNeeds />;
        }
      case 5:
        // Only postgraduate reaches step 5 (Referees)
        return <Step5RefereesDeclaration />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="application-form-container">
      {applicationType && (
        <div className="application-header">
          <h1>University Application Form</h1>
          <p>Complete all sections to submit your application</p>
        </div>
      )}

      <ProgressBar />

      <div className="form-content">
        <div className="step-content">
          {renderCurrentStep()}

          {applicationType && (
            <div className="form-actions">
              <div className="action-left">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleBack} 
                  disabled={data.currentStep === 1}
                >
                  Back
                </button>
              </div>

              <div className="action-center">
                <button 
                  className="btn btn-outline" 
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
              </div>

              <div className="action-right">
                {(() => {
                  const maxSteps = applicationType === 'undergraduate' ? 4 : 5;
                  return data.currentStep < maxSteps ? (
                    <button 
                      className="btn btn-primary" 
                      onClick={handleNext}
                      disabled={!isStepValid(data.currentStep)}
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      className="btn btn-submit" 
                      onClick={handleReviewAndSubmit}
                      disabled={!isStepValid(data.currentStep) || saving}
                    >
                      {saving 
                        ? 'Saving...' 
                        : 'Review & Submit'
                      }
                    </button>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {data.lastSaved && (
        <div className="save-status">
          Last saved: {new Date(data.lastSaved).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default ApplicationForm; 