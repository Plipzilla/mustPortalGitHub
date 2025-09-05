import React from 'react';
import { useApplication } from './ApplicationContext';
import './FormStyles.css';

const Step2PostgraduateEducation: React.FC = () => {
  const { data, setData } = useApplication();

  const handleProgramChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      step2: {
        ...prev.step2,
        programInfo: {
          ...prev.step2.programInfo,
          [field]: value
        }
      }
    }));
  };

  const handleEducationChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      step2: {
        ...prev.step2,
        educationHistory: {
          ...prev.step2.educationHistory,
          [field]: value
        }
      }
    }));
  };

  // Postgraduate programme options
  const postgraduateProgrammes = [
    // Master’s Programs
    'Master of Science in Medical Microbiology (2 years)',
    'Master of Science in Diagnostic Ultrasound (2 years)',
    'Master of Science in Infection and Immunity (2 years)',
    'MSc in Disaster Risk Management (2 years)',
    'Master of Science in One Health (2 years)',
    'Master of Science in Innovation (2 years)',
    'Master of Science in Entrepreneurship (2 years)',
    'Master of Business Leadership (2 years)',
    'Master of Science in Strategic Family Business (2 years)',
    'Master of Science in Mathematical Modelling (2 years)',
    'Master of Engineering in Applied Chemical Engineering (2 years)',
    'Master of Science in Computer Science (by Research) (2 years)',
    'Master of Science in Data Science (2 years)',
    'Master of Science in Information Technology (by Research) (2 years)',
    'Master of Engineering in Biomedical Engineering (2 years)',
    'Master of Science in Biodiversity Informatics (2 years)',
    'Master of Arts in Music (2 years)',
    // PhD Programs
    'PhD in Applied Mathematics [3 years (Full-time) or 4 years (Part-time)]',
    'PhD in Business Leadership [3 years (Full-time) or 5 years (Part-time)]',
    'PhD in One Health (3 years)',
    'PhD in Strategic Studies (1 year)',
    'PhD in Innovation and Development (3 years)',
  ];

  const studyMethods = [
    'Full-time',
    'Part-time'
  ];

  const classOfAwardOptions = [
    'First Class',
    'Second Class Upper Division',
    'Second Class Lower Division',
    'Third Class',
    'Pass'
  ];

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Programme Selection & University Education</h2>
        <p>Select your preferred programmes and provide your university education details</p>
      </div>

      {/* Programme Selection */}
      <div className="form-section">
        <h3>Programme Selection</h3>
        <p className="section-description">
          Choose up to 4 programmes in order of preference. You must select at least your first choice.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstChoice" className="required">
              First Choice Programme
            </label>
            <select
              id="firstChoice"
              value={data.step2.programInfo.firstChoice}
              onChange={(e) => handleProgramChange('firstChoice', e.target.value)}
              required
            >
              <option value="">Select your first choice</option>
              {postgraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="secondChoice">Second Choice Programme</label>
            <select
              id="secondChoice"
              value={data.step2.programInfo.secondChoice}
              onChange={(e) => handleProgramChange('secondChoice', e.target.value)}
            >
              <option value="">Select your second choice (optional)</option>
              {postgraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="thirdChoice">Third Choice Programme</label>
            <select
              id="thirdChoice"
              value={data.step2.programInfo.thirdChoice}
              onChange={(e) => handleProgramChange('thirdChoice', e.target.value)}
            >
              <option value="">Select your third choice (optional)</option>
              {postgraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fourthChoice">Fourth Choice Programme</label>
            <select
              id="fourthChoice"
              value={data.step2.programInfo.fourthChoice}
              onChange={(e) => handleProgramChange('fourthChoice', e.target.value)}
            >
              <option value="">Select your fourth choice (optional)</option>
              {postgraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="methodOfStudy" className="required">
              Method of Study
            </label>
            <select
              id="methodOfStudy"
              value={data.step2.programInfo.methodOfStudy}
              onChange={(e) => handleProgramChange('methodOfStudy', e.target.value)}
              required
            >
              <option value="">Select study method</option>
              {studyMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* University Education History */}
      <div className="form-section">
        <h3>University Education History</h3>
        <p className="section-description">
          Provide details about your previous university education and degree qualifications.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="universityCollege" className="required">
              Name of University/College
            </label>
            <input
              type="text"
              id="universityCollege"
              value={data.step2.educationHistory.universityCollege}
              onChange={(e) => handleEducationChange('universityCollege', e.target.value)}
              placeholder="Enter your university or college name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="uniFromDate" className="required">
              From Date
            </label>
            <input
              type="date"
              id="uniFromDate"
              value={data.step2.educationHistory.uniFromDate}
              onChange={(e) => handleEducationChange('uniFromDate', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="uniToDate" className="required">
              To Date
            </label>
            <input
              type="date"
              id="uniToDate"
              value={data.step2.educationHistory.uniToDate}
              onChange={(e) => handleEducationChange('uniToDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="programme" className="required">
              Programme Studied
            </label>
            <input
              type="text"
              id="programme"
              value={data.step2.educationHistory.programme}
              onChange={(e) => handleEducationChange('programme', e.target.value)}
              placeholder="e.g., Bachelor of Science in Computer Science"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="qualification" className="required">
              Qualification Obtained
            </label>
            <input
              type="text"
              id="qualification"
              value={data.step2.educationHistory.qualification}
              onChange={(e) => handleEducationChange('qualification', e.target.value)}
              placeholder="e.g., Bachelor of Science (BSc)"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfAward" className="required">
              Date of Award
            </label>
            <input
              type="date"
              id="dateOfAward"
              value={data.step2.educationHistory.dateOfAward}
              onChange={(e) => handleEducationChange('dateOfAward', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="classOfAward" className="required">
              Class of Award
            </label>
            <select
              id="classOfAward"
              value={data.step2.educationHistory.classOfAward}
              onChange={(e) => handleEducationChange('classOfAward', e.target.value)}
              required
            >
              <option value="">Select class of award</option>
              {classOfAwardOptions.map(award => (
                <option key={award} value={award}>{award}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-note">
        <p><strong>Note:</strong> You will need to upload certified copies of your university degree certificates, transcripts, and academic records in the final step.</p>
      </div>
    </div>
  );
};

export default Step2PostgraduateEducation; 