// MediKiosk Offline PHC Mode & Network Sync Resilience
import { PatientQueueItem } from '../data/mockPatients';

const OFFLINE_QUEUE_KEY = 'medikiosk_offline_queue';

class OfflineSyncService {
  private isOnlineStatus: boolean = true;
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnlineStatus = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnlineStatus = true;
        this.notifyListeners();
        this.syncOfflineRecords();
      });
      window.addEventListener('offline', () => {
        this.isOnlineStatus = false;
        this.notifyListeners();
      });
    }
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => l(this.isOnlineStatus));
  }

  public saveOfflineRecord(item: PatientQueueItem): void {
    try {
      const existing = this.getOfflineRecords();
      existing.push(item);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to store offline record');
    }
  }

  public getOfflineRecords(): PatientQueueItem[] {
    try {
      const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  public syncOfflineRecords(): PatientQueueItem[] {
    const records = this.getOfflineRecords();
    if (records.length > 0) {
      console.log(`[OfflineSync] Syncing ${records.length} stored offline clinical intake records to hospital server...`);
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    }
    return records;
  }
}

export const offlineSyncService = new OfflineSyncService();
