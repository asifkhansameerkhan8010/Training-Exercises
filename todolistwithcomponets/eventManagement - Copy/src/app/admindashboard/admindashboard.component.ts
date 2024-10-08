import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BackupService } from '../backup.service';
import { Users } from '../models/model';
import { CommonModule } from '@angular/common';
import { NavigationbarComponent } from '../navigationbar/navigationbar.component';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationbarComponent],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {
  users: Users[] = []; 
  oldEmail: string | null = null;
  showForm: boolean = false;
  formdata = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  };
  errorMessage: string = '';

  constructor(public backupService: BackupService) { }

  ngOnInit(): void {
    this.backupService.dataRestored.subscribe(() => {
      this.loadUsers(); 
    });
    this.loadUsers();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  loadUsers(): void {
    this.users = []; 
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('@')) { 
        const userData = localStorage.getItem(key);
        if (userData) {
          this.users.push(JSON.parse(userData));
        }
      }
    });
  }

  onSubmit(form: NgForm) {
    const { username, email, confirmPassword, password, role } = form.value;
    if (password !== confirmPassword) {
      this.errorMessage = "Passwords do not Match!";
      return;
    }

    if (email !== this.oldEmail && localStorage.getItem(email)) {
      this.errorMessage = "User Already Exists with the new email";
      return;
    }

    this.errorMessage = '';
    if (username && email && password && role) {
      const newUser: Users = { username, email, password, role };
      if (this.oldEmail) {
        const existingUserData = localStorage.getItem(this.oldEmail);
        if (existingUserData) {
          const existingUser = JSON.parse(existingUserData);
          newUser.events = existingUser.events; 
        }
        localStorage.removeItem(this.oldEmail);
      }
      this.addUser(newUser);
      form.reset();
      this.showForm = false;
      this.oldEmail = null;
    }
  }

  addUser(user: Users) {
    localStorage.setItem(user.email, JSON.stringify(user));
    this.loadUsers(); 
  }

  deleteUser(mailid: string): void {
    const userData = localStorage.getItem(mailid);
    if (userData) {
      const userrol = JSON.parse(userData);
      if (userrol.role !== 'admin') {
        localStorage.removeItem(mailid);
        this.users = this.users.filter(user => user.email !== mailid);
      } else {
        alert("Admin cannot be deleted.");
      }
    }
  }

  editUser(email: string): void {
    const userData = localStorage.getItem(email);
    if (userData) {
      const user = JSON.parse(userData);
      this.formdata.username = user.username;
      this.formdata.email = user.email;
      this.formdata.password = user.password;
      this.formdata.confirmPassword = user.password;
      this.formdata.role = user.role;
      this.showForm = true;
      this.oldEmail = email;
    }
  }

  restoreData(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target?.result as string);
        // You might need to adjust the method call based on your service
        this.backupService.restoreDataFromLocalStorage(); // Call the restore method you defined
      };
      reader.readAsText(input.files[0]);
    }
  }
}
