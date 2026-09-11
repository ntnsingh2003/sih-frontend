import React from 'react';
import { auditService } from '../../services/auditService';
import { ShieldCheck, X, Trash2, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = React.useState(auditService.getLogs());

  React.useEffect(() => {
    if (isOpen) {
      setLogs(auditService.getLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '900px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Audit Logs & Access History</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-subtle)' }}>
                Module 08: Immutable trail tracking all patient record access, AI triage, and edits.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setLogs(auditService.getLogs())}
              title="Refresh logs"
              style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={onClose}
              style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No audit logs captured yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {logs.map((log) => {
                const isFlagged = log.outcome === 'FLAGGED';
                return (
                  <div
                    key={log.id}
                    style={{
                      border: isFlagged ? '1.5px solid #dc2626' : '1px solid var(--color-border)',
                      background: isFlagged ? '#fef2f2' : '#f8fafc',
                      borderRadius: '8px',
                      padding: '0.85rem 1.2rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.86rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>{log.action}</span>
                        <span style={{ background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {log.userRole}
                        </span>
                        <span style={{ background: isFlagged ? '#dc2626' : '#059669', color: '#fff', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                          {log.outcome}
                        </span>
                      </div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                        <strong>Resource:</strong> {log.resource}
                      </div>
                      {log.details && (
                        <div style={{ color: 'var(--color-text-subtle)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                          {log.details}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0, fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                      <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>{log.deviceIp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '0.85rem 1.5rem', borderTop: '1px solid var(--color-border)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
            Retention: Temporary voice/session buffers purged; clinical logs preserved under DPDP & ABDM norms.
          </span>
          <button
            onClick={() => {
              auditService.clearLogs();
              setLogs([]);
            }}
            style={{ fontSize: '0.8rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
          >
            <Trash2 size={14} /> Clear Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
