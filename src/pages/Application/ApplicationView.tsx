import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ApplicationService, { ReactFormattedDraft } from '../../services/ApplicationService';
import './ApplicationView.css';

type LoadState = 'idle' | 'loading' | 'error' | 'ready';

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="av-field">
    <div className="av-label">{label}</div>
    <div className="av-value">{value ?? '—'}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="av-section">
    <h3>{title}</h3>
    <div className="av-grid">{children}</div>
  </section>
);

export default function ApplicationView() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<LoadState>('idle');
  const [data, setData] = useState<ReactFormattedDraft | null>(null);

  const isDraftView = useMemo(() => new URLSearchParams(location.search).get('draft') === 'true', [location.search]);

  useEffect(() => {
    const load = async () => {
      setState('loading');
      try {
        if (isDraftView) {
          // For drafts, require a type query param
          const qp = new URLSearchParams(location.search);
          const t = qp.get('type') as 'undergraduate' | 'postgraduate' | null;
          if (!t) throw new Error('Missing draft type');
          const draft = await ApplicationService.getDraft(t);
          if (!draft) throw new Error('No draft found');
          setData(draft);
        } else {
          if (!applicationId) throw new Error('Missing application id');
          const submission = await ApplicationService.getSubmission(applicationId);
          // The API returns a React-shaped payload
          setData(submission as unknown as ReactFormattedDraft);
        }
        setState('ready');
      } catch (e) {
        setState('error');
      }
    };
    load();
  }, [applicationId, isDraftView, location.search]);

  if (state === 'loading' || state === 'idle') {
    return (
      <div className="av-container">
        <div className="av-card"><div className="av-loading">Loading application...</div></div>
      </div>
    );
  }

  if (state === 'error' || !data) {
    return (
      <div className="av-container">
        <div className="av-card">
          <h2>Application Not Found</h2>
          <p>We couldn’t load the application details. It may have been removed or the link is invalid.</p>
          <div className="av-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const typeLabel = data.step1?.applicationType
    ? (data.step1.applicationType === 'undergraduate' ? 'Undergraduate' : 'Postgraduate')
    : '—';

  return (
    <div className="av-container">
      <div className="av-card">
        <header className="av-header">
          <div>
            <h2>Application Overview</h2>
            <p className="av-sub">{typeLabel} • Last saved {data.lastSaved ? new Date(data.lastSaved).toLocaleString() : '—'}</p>
          </div>
          <div className="av-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="btn btn-outline" onClick={() => window.print()}>Print</button>
          </div>
          {((data as any).step1?.passportPhotoUrl) && (
            <div className="av-photo">
              <img src={(data as any).step1.passportPhotoUrl} alt="Passport" />
            </div>
          )}
        </header>

        <Section title="Personal Information">
          <Field label="Title" value={data.step1?.title} />
          <Field label="Surname" value={data.step1?.surname} />
          <Field label="First Name" value={data.step1?.firstName} />
          <Field label="Marital Status" value={data.step1?.maritalStatus} />
          <Field label="Date of Birth" value={data.step1?.dateOfBirth} />
          <Field label="Place of Birth" value={data.step1?.placeOfBirth} />
          <Field label="Nationality" value={data.step1?.nationality} />
          <Field label="Country of Residence" value={data.step1?.countryOfResidence} />
          <Field label="Gender" value={data.step1?.gender} />
          <Field label="Correspondence Address" value={data.step1?.correspondenceAddress} />
          <Field label="Telephone Numbers" value={data.step1?.telephoneNumbers} />
          <Field label="Email Address" value={data.step1?.emailAddress} />
          <Field label="Permanent Address" value={data.step1?.permanentAddress} />
        </Section>

        <Section title="Programme">
          <Field label="Level of Study" value={data.step2?.programInfo?.levelOfStudy} />
          <Field label="Choice 1" value={data.step2?.programInfo?.firstChoice} />
          <Field label="Choice 2" value={data.step2?.programInfo?.secondChoice} />
          <Field label="Choice 3" value={data.step2?.programInfo?.thirdChoice} />
          <Field label="Choice 4" value={data.step2?.programInfo?.fourthChoice} />
          <Field label="Method of Study" value={data.step2?.programInfo?.methodOfStudy} />
        </Section>

        <Section title="Education History">
          <Field label="School Name" value={data.step2?.educationHistory?.schoolName} />
          <Field label="School Dates" value={`${data.step2?.educationHistory?.schoolFromDate || '—'} → ${data.step2?.educationHistory?.schoolToDate || '—'}`} />
          <Field label="Examination Year" value={data.step2?.educationHistory?.examinationYear} />
          <Field label="Results Year" value={data.step2?.educationHistory?.resultsYear} />
          <Field label="University / College" value={data.step2?.educationHistory?.universityCollege} />
          <Field label="Programme" value={data.step2?.educationHistory?.programme} />
          <Field label="Qualification" value={data.step2?.educationHistory?.qualification} />
          <Field label="Date of Award" value={data.step2?.educationHistory?.dateOfAward} />
          <Field label="Class of Award" value={data.step2?.educationHistory?.classOfAward} />
        </Section>

        <Section title="Work Experience">
          {(data.step3?.workExperience || []).length > 0 ? (
            <div className="av-list">
              {data.step3?.workExperience?.map((w, idx) => (
                <div className="av-list-item" key={idx}>
                  <div><strong>{w.organization || '—'}</strong></div>
                  <div>{w.position || '—'}</div>
                  <div className="av-dates">{w.fromDate || '—'} → {w.toDate || '—'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="av-muted">No work experience added.</div>
          )}
        </Section>

        <Section title="Motivation">
          <Field label="Essay" value={data.step3?.motivation?.motivationEssay || '—'} />
        </Section>

        <Section title="Special Needs">
          <Field label="Has Disability" value={data.step4?.hasDisability ? 'Yes' : 'No'} />
          <Field label="Description" value={data.step4?.disabilityDescription || '—'} />
        </Section>

        <Section title="Referees">
          {(data.step5?.referees || []).length > 0 ? (
            <div className="av-list">
              {data.step5?.referees?.map((r, idx) => (
                <div className="av-list-item" key={idx}>
                  <div><strong>{r.name || '—'}</strong>, {r.position || '—'}</div>
                  <div>{r.institution || '—'}</div>
                  <div>{r.address || '—'}</div>
                  <div>{r.email || '—'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="av-muted">No referees provided.</div>
          )}
        </Section>

        <Section title="Declaration">
          <Field label="Agreed" value={data.step5?.declaration?.declarationAgreed ? 'Yes' : 'No'} />
          <Field label="Full Name" value={data.step5?.declaration?.fullName} />
          <Field label="Date" value={data.step5?.declaration?.date} />
          <Field label="All Sections Completed" value={data.step5?.declaration?.allSectionsCompleted ? 'Yes' : 'No'} />
          <Field label="All Documents Uploaded" value={data.step5?.declaration?.allDocumentsUploaded ? 'Yes' : 'No'} />
          <Field label="Deposit Slip Attached" value={data.step5?.declaration?.depositSlipAttached ? 'Yes' : 'No'} />
          <Field label="Payment Reference" value={(data as any).step5?.declaration?.paymentReference || '—'} />
        </Section>
      </div>
    </div>
  );
}


