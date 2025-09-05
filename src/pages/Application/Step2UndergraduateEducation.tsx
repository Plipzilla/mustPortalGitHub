import React from 'react';
import { useApplication } from './ApplicationContext';
import SubjectGradesList, { SubjectGrade } from '../../components/SubjectGradesList';
import './FormStyles.css';

const Step2UndergraduateEducation: React.FC = () => {
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

  const handleSubjectsAndGradesChange = (subjects: SubjectGrade[]) => {
    setData(prev => ({
      ...prev,
      step2: {
        ...prev.step2,
        educationHistory: {
          ...prev.step2.educationHistory,
          subjectsAndGrades: subjects
        }
      }
    }));
  };

  // Undergraduate programme options
  const undergraduateProgrammes = [
    'Bachelor of Engineering (Hons) in Biomedical Engineering (5 Years)',
    'Bachelor of Engineering (Hons) in Chemical Engineering (5 Years)',
    'Bachelor of Engineering (Hons) in Manufacturing Engineering (5 Years)',
    'Bachelor of Engineering (Hons) in Metallurgy and Materials Engineering (5 Years)',
    'Bachelor of Engineering (Hons) in Polymer and Textile Engineering (5 Years)',
    'Bachelor of Engineering (Hons) in Sustainable Energy Engineering (5 Years)',
    'Bachelor of Science in Medical Microbiology (4 Years)',
    'Bachelor of Science in Medical Imaging (Diagnostic Radiography) (4 Years)',
    'Bachelor of Science in Medical Imaging (Diagnostic Ultrasound) (4 Years)',
    'Bachelor of Science in Immunology (4 Years)',
    'Bachelor of Science in Sports Science (4 Years)',
    'Bachelor of Science in Food Science and Technology (4 Years)',
    'Bachelor of Science in Sciences Education (4 Years)',
    'Bachelor of Science in Mathematical Sciences (4 Years)',
    'Bachelor of Science in Earth Sciences (Geology) (4 Years)',
    'Bachelor of Science in Meteorology and Climate Science (4 Years)',
    'Bachelor of Science in Disaster Risk Management (4 Years)',
    'Bachelor of Science in Geo-Information and Earth Observation Science (4 Years)',
    'Bachelor of Science in Petroleum Resources (Oil and Gas) (4 Years)',
    'Bachelor of Science in Water Quality and Management (4 Years)',
    'Bachelor of Science in Computer Systems and Security (4 Years)',
    'Bachelor of Science in Business Information Technology (4 Years)',
    'Bachelor of Arts in Indigenous Knowledge Systems and Practices (4 Years)',
    'Bachelor of Arts in African Musicology (4 Years)',
    'Bachelor of Arts in Language, Communication and Culture (4 Years)',
    'Bachelor of Arts in Cultural Economy (4 Years)',
    'Bachelor of Arts in Archiving and Records Management (4 Years)',
    // ODEL
    'Bachelor of Science in Sciences Education (Physics)',
    'Bachelor of Science in Sciences Education (Mathematics)',
    'Bachelor of Science in Sciences Education (Biology)',
    'Bachelor of Science in Sciences Education (Chemistry)',
    'Bachelor of Science in Sciences Education (Geography)',
    'Bachelor of Arts in Language Education',
    'Bachelor of Science in Business Management and Entrepreneurship',
    // Weekend
    'Bachelor of Science in Sciences Education (Geography) (4 years)',
    'Bachelor of Science in Sciences Education (Chemistry) (4 years)',
    'Bachelor of Science in Sciences Education (Biology) (4 years)',
    'Bachelor of Science in Sciences Education (Physics) (4 years)',
    'Bachelor of Science in Sciences Education (Mathematics) (4 years)',
    'Bachelor of Science in Disaster Risk Management (4 years)',
    'Bachelor of Science in Mathematical Sciences (4 years)',
    'Bachelor of Science in Geo-Information and Earth Observation Science (4 years)',
    'Bachelor of Arts in Cultural Economy (4 years)',
    'Bachelor of Arts in Language Education (4 years)',
    'Bachelor of Arts in Archiving and Records Management (4 years)',
    'Bachelor of Arts in Language, Communication and Culture (4 years)',
    'Bachelor of Science in Business Information Technology (4 years)',
    'Bachelor of Science in Computer Systems and Security (4 years)',
    'Bachelor of Science in Business Management and Entrepreneurship (4 years)',
  ];

  const applicationCategories = [
    'Economic Fee Paying',
    'ODeL (Open Distance and Electronic Learning)',
    'Mature Entry',
    'Weekend Classes'
  ];

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Programme Selection & Secondary Education</h2>
        <p>Select your preferred programmes and provide your secondary education details</p>
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
              {undergraduateProgrammes.map(program => (
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
              {undergraduateProgrammes.map(program => (
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
              {undergraduateProgrammes.map(program => (
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
              {undergraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="applicationCategory" className="required">
              Application Category
            </label>
            <select
              id="applicationCategory"
              value={data.step2.programInfo.methodOfStudy}
              onChange={(e) => handleProgramChange('methodOfStudy', e.target.value)}
              required
            >
              <option value="">Select application category</option>
              {applicationCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Education History */}
      <div className="form-section">
        <h3>Secondary Education History</h3>
        <p className="section-description">
          Provide details about your secondary school education and examination results. 
          <strong>You must enter at least 6 subjects and their corresponding grades for eligibility.</strong>
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="schoolName" className="required">
              Name of Secondary School
            </label>
            <input
              type="text"
              id="schoolName"
              value={data.step2.educationHistory.schoolName}
              onChange={(e) => handleEducationChange('schoolName', e.target.value)}
              placeholder="Enter your secondary school name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="schoolFromDate" className="required">
              From Date
            </label>
            <input
              type="date"
              id="schoolFromDate"
              value={data.step2.educationHistory.schoolFromDate}
              onChange={(e) => handleEducationChange('schoolFromDate', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="schoolToDate" className="required">
              To Date
            </label>
            <input
              type="date"
              id="schoolToDate"
              value={data.step2.educationHistory.schoolToDate}
              onChange={(e) => handleEducationChange('schoolToDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">
              Subjects and Grades
            </label>
            <SubjectGradesList
              value={data.step2.educationHistory.subjectsAndGrades || []}
              onChange={handleSubjectsAndGradesChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="examinationYear" className="required">
              Year of Examination
            </label>
            <input
              type="number"
              id="examinationYear"
              value={data.step2.educationHistory.examinationYear}
              onChange={(e) => handleEducationChange('examinationYear', e.target.value)}
              placeholder="e.g., 2023"
              min="1980"
              max={new Date().getFullYear()}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="resultsYear" className="required">
              Year Results Received
            </label>
            <input
              type="number"
              id="resultsYear"
              value={data.step2.educationHistory.resultsYear}
              onChange={(e) => handleEducationChange('resultsYear', e.target.value)}
              placeholder="e.g., 2023"
              min="1980"
              max={new Date().getFullYear()}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-note">
        <p><strong>Note:</strong> You will need to upload certified copies of your academic certificates and transcripts in the final step.</p>
      </div>
    </div>
  );
};

export default Step2UndergraduateEducation; 