import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from './ApplicationContext';
import './ApplicationConfirmation.css';

const ApplicationConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { data, submitApplication } = useApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const submission = await submitApplication();
      
      // Navigate to success page with submission details
      navigate(`/application/submitted/${submission.application_id}`, { 
        state: { submission },
        replace: true 
      });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToEdit = () => {
    navigate(`/application?type=${data.step1.applicationType}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const formatBoolean = (value: boolean) => {
    return value ? 'Yes' : 'No';
  };

  return (
    <div className="application-confirmation">
      <div className="container">
        <div className="confirmation-header">
          <h1>Review Your Application</h1>
          <p>Please review all information carefully before submitting. Once submitted, you cannot make changes.</p>
        </div>

        {error && (
          <div className="error-banner">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="review-sections">
          {/* Personal Information */}
          <div className="review-section">
            <h3><i className="fas fa-user"></i> Personal Information</h3>
            <div className="review-grid">
              <div className="review-item">
                <label>Application Type</label>
                <span>{data.step1.applicationType}</span>
              </div>
              <div className="review-item">
                <label>Title</label>
                <span>{data.step1.title || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Full Name</label>
                <span>{data.step1.firstName} {data.step1.surname}</span>
              </div>
              <div className="review-item">
                <label>Date of Birth</label>
                <span>{formatDate(data.step1.dateOfBirth)}</span>
              </div>
              <div className="review-item">
                <label>Place of Birth</label>
                <span>{data.step1.placeOfBirth || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Nationality</label>
                <span>{data.step1.nationality || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Gender</label>
                <span>{data.step1.gender || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Email Address</label>
                <span>{data.step1.emailAddress || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Phone Number</label>
                <span>{data.step1.telephoneNumbers || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Program Information */}
          <div className="review-section">
            <h3><i className="fas fa-graduation-cap"></i> Program Information</h3>
            <div className="review-grid">
              <div className="review-item">
                <label>Level of Study</label>
                <span>{data.step2.programInfo.levelOfStudy || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>First Choice Program</label>
                <span>{data.step2.programInfo.firstChoice || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Second Choice Program</label>
                <span>{data.step2.programInfo.secondChoice || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Method of Study</label>
                <span>{data.step2.programInfo.methodOfStudy || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Education History */}
          <div className="review-section">
            <h3><i className="fas fa-school"></i> Education History</h3>
            <div className="review-grid">
              {data.step1.applicationType === 'undergraduate' ? (
                <>
                  <div className="review-item">
                    <label>School Name</label>
                    <span>{data.step2.educationHistory.schoolName || 'Not provided'}</span>
                  </div>
                  <div className="review-item full-width">
                    <label>Subjects and Grades</label>
                    <div className="subjects-grades-display">
                      {data.step2.educationHistory.subjectsAndGrades && data.step2.educationHistory.subjectsAndGrades.length > 0 ? (
                        <div className="subjects-list">
                          {data.step2.educationHistory.subjectsAndGrades.map((item, index) => (
                            <div key={item.id} className="subject-item">
                              <span className="subject-name">{item.subject}</span>
                              <span className="grade-badge">{item.grade}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>Not provided</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="review-item">
                    <label>University/College</label>
                    <span>{data.step2.educationHistory.universityCollege || 'Not provided'}</span>
                  </div>
                  <div className="review-item">
                    <label>Program</label>
                    <span>{data.step2.educationHistory.programme || 'Not provided'}</span>
                  </div>
                  <div className="review-item">
                    <label>Qualification</label>
                    <span>{data.step2.educationHistory.qualification || 'Not provided'}</span>
                  </div>
                  <div className="review-item">
                    <label>Class of Award</label>
                    <span>{data.step2.educationHistory.classOfAward || 'Not provided'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Work Experience (for postgraduate) */}
          {data.step1.applicationType === 'postgraduate' && (
            <div className="review-section">
              <h3><i className="fas fa-briefcase"></i> Work Experience</h3>
              {data.step3.workExperience.length > 0 ? (
                <div className="work-experience-list">
                  {data.step3.workExperience.map((work, index) => (
                    <div key={index} className="work-item">
                      <h4>{work.position} at {work.organization}</h4>
                      <p>{work.fromDate} to {work.toDate}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No work experience provided</p>
              )}
            </div>
          )}

          {/* Motivation (for postgraduate) */}
          {data.step1.applicationType === 'postgraduate' && (
            <div className="review-section">
              <h3><i className="fas fa-lightbulb"></i> Motivation</h3>
              <div className="motivation-text">
                {data.step3.motivation.motivationEssay || 'Not provided'}
              </div>
            </div>
          )}

          {/* Special Needs */}
          <div className="review-section">
            <h3><i className="fas fa-heart"></i> Special Needs</h3>
            <div className="review-grid">
              <div className="review-item">
                <label>Has Disability</label>
                <span>{formatBoolean(data.step4.hasDisability)}</span>
              </div>
              {data.step4.hasDisability && (
                <div className="review-item full-width">
                  <label>Description</label>
                  <span>{data.step4.disabilityDescription || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Referees */}
          <div className="review-section">
            <h3><i className="fas fa-users"></i> Referees</h3>
            {data.step5.referees.filter(ref => ref.name && ref.email).length > 0 ? (
              <div className="referees-list">
                {data.step5.referees
                  .filter(ref => ref.name && ref.email)
                  .map((referee, index) => (
                    <div key={index} className="referee-item">
                      <h4>{referee.name}</h4>
                      <p><strong>Position:</strong> {referee.position}</p>
                      <p><strong>Institution:</strong> {referee.institution}</p>
                      <p><strong>Email:</strong> {referee.email}</p>
                      <p><strong>Address:</strong> {referee.address}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <p>No referees provided</p>
            )}
          </div>

          {/* Declaration */}
          <div className="review-section">
            <h3><i className="fas fa-check-circle"></i> Declaration</h3>
            <div className="review-grid">
              <div className="review-item">
                <label>Declaration Agreed</label>
                <span>{formatBoolean(data.step5.declaration.declarationAgreed)}</span>
              </div>
              <div className="review-item">
                <label>Full Name</label>
                <span>{data.step5.declaration.fullName || 'Not provided'}</span>
              </div>
              <div className="review-item">
                <label>Date</label>
                <span>{formatDate(data.step5.declaration.date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleBackToEdit}
            disabled={isSubmitting}
          >
            <i className="fas fa-edit"></i> Back to Edit
          </button>
          
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Submit Application
              </>
            )}
          </button>
        </div>

        <div className="submission-notice">
          <div className="notice-box">
            <i className="fas fa-info-circle"></i>
            <div>
              <h4>Important Notice</h4>
              <p>
                Once you submit your application, you will not be able to make any changes. 
                Please ensure all information is correct before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationConfirmation; 