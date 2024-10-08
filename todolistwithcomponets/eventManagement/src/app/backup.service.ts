import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  dataRestored: EventEmitter<void> = new EventEmitter();
  constructor(private router:Router) { }

  backupData(){
    const dataToBackup:any = {};
    const keys = Object.keys(localStorage);
    console.log(keys);
    keys.forEach((key)=>{
      const itemdata=localStorage.getItem(key);
      if(itemdata)
      {
        try{
          dataToBackup[key]=JSON.parse(itemdata);
        }
        catch(e){
          dataToBackup[key]=itemdata;
        }
        
      }
    });
    console.log(dataToBackup);

    const dataStr = JSON.stringify(dataToBackup);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  restoreData(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });
        this.loadUsers(data);  
        alert('Data restored successfully!');
      } catch (err) {
        console.error('Error restoring data', err);
        alert('Failed to restore data. Please check the backup file.');
      }
    };
  
    reader.readAsText(file);
    this.router.navigate(['/login'])
  }

  loadUsers(data: any): void {
    localStorage.clear();
    Object.keys(data).forEach(key => {
      localStorage.setItem(key, JSON.stringify(data[key]));
    });
    this.dataRestored.emit();
  }
  triggerFileInput(){
    const fileInput = document.getElementById('restore-file-input') as HTMLElement;
    fileInput.click();
  }
}
