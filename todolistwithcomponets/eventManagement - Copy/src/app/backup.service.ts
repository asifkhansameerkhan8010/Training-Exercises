import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private backupData: any = null;
  dataRestored = new Subject<void>();

  // Method to back up the data
  backupDataToLocalStorage(): void {
    try {
      const allData: any = {};
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          allData[key] = JSON.parse(data);
        }
      });

      this.backupData = allData; // Store backup data in memory
      localStorage.setItem('backupData', JSON.stringify(allData)); // Save to localStorage as backup
      alert('Backup Successful!');
    } catch (error) {
      console.error('Backup failed:', error);
      alert('An error occurred during backup.');
    }
  }

  // Method to restore the data
  restoreDataFromLocalStorage(): void {
    try {
      const backupDataStr = localStorage.getItem('backupData');
      if (backupDataStr) {
        const backupData = JSON.parse(backupDataStr);

        // Restore each piece of data
        for (const key in backupData) {
          if (backupData.hasOwnProperty(key)) {
            localStorage.setItem(key, JSON.stringify(backupData[key]));
          }
        }

        this.dataRestored.next(); // Emit an event that data has been restored
        alert('Data Restored Successfully!');
      } else {
        alert('No backup data found to restore.');
      }
    } catch (error) {
      console.error('Restoration failed:', error);
      alert('An error occurred during restoration.');
    }
  }

  // Method to clear backup data
  clearBackupData(): void {
    try {
      localStorage.removeItem('backupData');
      this.backupData = null; // Clear backup in memory
      alert('Backup data cleared.');
    } catch (error) {
      console.error('Failed to clear backup data:', error);
      alert('An error occurred while clearing backup data.');
    }
  }
}
