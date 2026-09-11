// MediKiosk Audit Logging Service (08. Security, Privacy & Interoperability)
import { AuditLog, UserRole } from '../types/clinical';

const AUDIT_LOG_STORAGE_KEY = 'medikiosk_audit_logs';

class AuditService {
  private logs: AuditLog[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (e) {
      this.logs = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Unable to persist audit log to localStorage');
    }
  }

  public recordLog(
    userRole: UserRole,
    action: AuditLog['action'],
    resource: string,
    patientId: string,
    outcome: AuditLog['outcome'] = 'SUCCESS',
    details?: string
  ): AuditLog {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: userRole === 'DOCTOR' ? 'dr-arun-patel' : 'kiosk-terminal-01',
      userRole,
      patientId,
      action,
      resource,
      deviceIp: '192.168.1.104 (Hospital Internal LAN)',
      outcome,
      details
    };

    this.logs.unshift(log);
    // Limit to latest 100 for memory efficiency
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
    this.saveToStorage();
    return log;
  }

  public getLogs(): AuditLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(AUDIT_LOG_STORAGE_KEY);
  }
}

export const auditService = new AuditService();
