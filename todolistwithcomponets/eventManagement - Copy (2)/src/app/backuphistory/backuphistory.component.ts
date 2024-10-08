import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";

@Component({
  selector: 'app-backuphistory',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationbarComponent],
  templateUrl: './backuphistory.component.html',
  styleUrl: './backuphistory.component.css'
})
export class BackuphistoryComponent implements OnInit  {
  backupHistory: Array<{ timestamp: string, by: string, fileName: string }> = [];
  ngOnInit(): void {
    this.getBackupHistory();
  }
  getBackupHistory(): void {
    const history = localStorage.getItem('backupHistory');
    if (history) {
      this.backupHistory = JSON.parse(history).map((backup: any) => ({
        timestamp: backup.timestamp,
        by: backup.by , 
        fileName: backup.fileName || 'backup.json' 
      }));
    }
  }
}
