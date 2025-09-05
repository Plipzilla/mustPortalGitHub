import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthService from '../../services/AuthService';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; description: string }> = useMemo(() => ({
    success: { label: 'Verified', color: '#4CAF50', description: 'Your email has been verified successfully.' },
    used: { label: 'Already Used', color: '#999', description: 'This verification link was already used.' },
    expired: { label: 'Expired', color: '#e67e22', description: 'This verification link has expired. Please request a new one.' },
    invalid: { label: 'Invalid', color: '#e74c3c', description: 'The verification link is invalid.' },
    error: { label: 'Error', color: '#e74c3c', description: 'An unexpected error occurred.' },
    pending: { label: 'Pending Verification', color: '#f1c40f', description: 'Please verify your email to activate your account.' },
  }), []);

  const meta = map[status] || map['pending'];
  return (
    <div style={{
      border: `1px solid ${meta.color}`,
      borderRadius: 8,
      padding: 16,
      background: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: 10, background: meta.color }} />
        <strong>{meta.label}</strong>
      </div>
      <div style={{ marginTop: 8, color: '#333' }}>{meta.description}</div>
    </div>
  );
}

export default function VerifyAccount() {
  const [search] = useSearchParams();
  const [sending, setSending] = useState(false);
  const status = search.get('status') || 'pending';

  const handleResend = async () => {
    try {
      setSending(true);
      await AuthService.resendVerification();
      alert('Verification email sent. Please check your inbox.');
    } catch (e: any) {
      alert(e.message || 'Failed to resend verification email');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    // no-op: page displays status coming from backend redirect
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <h2>Verify Your Email</h2>
      <p style={{ color: '#555' }}>For security, we need to verify your email address.</p>

      <StatusBadge status={status} />

      {(status === 'expired' || status === 'invalid' || status === 'pending') && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleResend}
            disabled={sending}
            style={{
              background: '#003366',
              color: '#fff',
              padding: '10px 16px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {sending ? 'Sending…' : 'Resend Verification Email'}
          </button>
        </div>
      )}

      {status === 'success' && (
        <p style={{ marginTop: 16 }}>
          Your account is now verified. You can close this page or continue using the portal.
        </p>
      )}
    </div>
  );
}


