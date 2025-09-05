import React, { useState, useEffect } from 'react';
import './SubjectGradesList.css';

export interface SubjectGrade {
  id: string;
  subject: string;
  grade: string;
}

interface SubjectGradesListProps {
  value: SubjectGrade[];
  onChange: (subjects: SubjectGrade[]) => void;
  onBlur?: () => void;
  className?: string;
  required?: boolean;
  error?: string;
  label?: string;
  placeholder?: {
    subject?: string;
    grade?: string;
  };
  gradeOptions?: string[];
}

const DEFAULT_GRADE_OPTIONS = [
  'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F',
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'Distinction', 'Merit', 'Credit', 'Pass', 'Fail'
];

const SubjectGradesList: React.FC<SubjectGradesListProps> = ({
  value = [],
  onChange,
  onBlur,
  className = "",
  required = false,
  error = "",
  label,
  placeholder = {
    subject: "Enter subject name",
    grade: "Select or enter grade"
  },
  gradeOptions = DEFAULT_GRADE_OPTIONS
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const MINIMUM_SUBJECTS = 6;

  const generateId = () => `subject_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Initialize with minimum empty rows if no data
  useEffect(() => {
    if (value.length === 0) {
      const initialSubjects: SubjectGrade[] = [];
      for (let i = 0; i < MINIMUM_SUBJECTS; i++) {
        initialSubjects.push({
          id: generateId(),
          subject: '',
          grade: ''
        });
      }
      onChange(initialSubjects);
    }
  }, [value.length, onChange, MINIMUM_SUBJECTS]);

  const addSubject = () => {
    const newSubject: SubjectGrade = {
      id: generateId(),
      subject: '',
      grade: ''
    };
    onChange([...value, newSubject]);
  };

  const removeSubject = (id: string) => {
    onChange(value.filter(item => item.id !== id));
    // Clear any errors for removed item
    const newErrors = { ...errors };
    delete newErrors[`${id}_subject`];
    delete newErrors[`${id}_grade`];
    setErrors(newErrors);
  };

  const updateSubject = (id: string, field: 'subject' | 'grade', newValue: string) => {
    const updatedSubjects = value.map(item =>
      item.id === id ? { ...item, [field]: newValue } : item
    );
    onChange(updatedSubjects);

    // Clear error when user starts typing
    const errorKey = `${id}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const validateField = (id: string, field: 'subject' | 'grade', value: string): string => {
    if (field === 'subject') {
      if (!value.trim()) return 'Subject name is required';
      if (value.length < 2) return 'Subject name must be at least 2 characters';
      if (value.length > 100) return 'Subject name must be less than 100 characters';
    } else if (field === 'grade') {
      if (!value.trim()) return 'Grade is required';
      if (value.length > 20) return 'Grade must be less than 20 characters';
    }
    return '';
  };

  const handleBlur = (id: string, field: 'subject' | 'grade', fieldValue: string) => {
    const error = validateField(id, field, fieldValue);
    const errorKey = `${id}_${field}`;
    
    setErrors(prev => ({
      ...prev,
      [errorKey]: error
    }));

    if (onBlur) {
      onBlur();
    }
  };

  const validEntries = value.filter(item => item.subject.trim() && item.grade.trim());
  const hasMinimumEntries = validEntries.length >= MINIMUM_SUBJECTS;
  const showRequiredError = required && !hasMinimumEntries && error;

  // Don't render if initializing
  if (value.length === 0) {
    return null;
  }

  return (
    <div className={`subjects-grades-container ${className}`}>
      {label && (
        <label className={required ? 'required' : ''}>
          {label}
        </label>
      )}
      
      <div className="subjects-grades-list">
        <div className="list-header">
          <div className="subject-column">Subject</div>
          <div className="grade-column">Grade</div>
          <div className="action-column">Action</div>
        </div>

        {value.map((item, index) => (
          <div key={item.id} className="subject-grade-row">
            <div className="subject-column">
              <input
                type="text"
                value={item.subject}
                onChange={(e) => updateSubject(item.id, 'subject', e.target.value)}
                onBlur={(e) => handleBlur(item.id, 'subject', e.target.value)}
                placeholder={placeholder.subject}
                className={errors[`${item.id}_subject`] ? 'error' : ''}
                maxLength={100}
              />
              {errors[`${item.id}_subject`] && (
                <div className="field-error">{errors[`${item.id}_subject`]}</div>
              )}
            </div>

            <div className="grade-column">
              <div className="grade-input-container">
                <input
                  type="text"
                  list={`grades-${item.id}`}
                  value={item.grade}
                  onChange={(e) => updateSubject(item.id, 'grade', e.target.value)}
                  onBlur={(e) => handleBlur(item.id, 'grade', e.target.value)}
                  placeholder={placeholder.grade}
                  className={errors[`${item.id}_grade`] ? 'error' : ''}
                  maxLength={20}
                />
                <datalist id={`grades-${item.id}`}>
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade} />
                  ))}
                </datalist>
              </div>
              {errors[`${item.id}_grade`] && (
                <div className="field-error">{errors[`${item.id}_grade`]}</div>
              )}
            </div>

            <div className="action-column">
              <button
                type="button"
                onClick={() => removeSubject(item.id)}
                className="remove-button"
                disabled={value.length <= MINIMUM_SUBJECTS}
                title={value.length <= MINIMUM_SUBJECTS ? `Minimum ${MINIMUM_SUBJECTS} subjects required` : "Remove subject"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" 
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <div className="add-subject-row">
          <button
            type="button"
            onClick={addSubject}
            className="add-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path 
                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" 
                fill="currentColor"
              />
            </svg>
            Add Subject
          </button>
        </div>
      </div>

      {(showRequiredError || error) && (
        <div className="error-message">
          {error || `At least ${MINIMUM_SUBJECTS} subjects and grades are required for eligibility`}
        </div>
      )}

      <div className="subjects-grades-hint">
        <strong>Minimum {MINIMUM_SUBJECTS} subjects required.</strong> Enter each subject you studied and the grade you received. 
        You currently have {validEntries.length} valid {validEntries.length === 1 ? 'entry' : 'entries'}.
        {validEntries.length < MINIMUM_SUBJECTS && (
          <span className="hint-warning"> ({MINIMUM_SUBJECTS - validEntries.length} more needed)</span>
        )}
      </div>
    </div>
  );
};

export default SubjectGradesList; 