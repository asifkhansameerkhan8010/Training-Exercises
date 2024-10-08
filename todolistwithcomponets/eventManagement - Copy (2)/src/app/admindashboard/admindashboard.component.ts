import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { Users } from '../models/model';
import { BackupService } from '../backup.service';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationbarComponent],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent implements OnInit{

  constructor(private backupService: BackupService) { }

  ngOnInit(): void {
    this.backupService.dataRestored.subscribe(() => {
      this.loadUsers();
    });
   this.loadUsers();
  }

  users: any[] = [];
  oldEmail: string | null = null;
  showForm: boolean = false;
  formdata = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  };
  isEdit:boolean=false;
  
  
  errorMessage: string = '';
  error:string='';

  toggleForm() {
    this.showForm = !this.showForm;
  }

  loadUsers(): void {
    this.users = []; 
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('@') && !key.includes("invitations_")) { 
        const userData = localStorage.getItem(key);
        if (userData) {
          this.users.push(JSON.parse(userData));
        }
      }
    });
    console.log("see this");
    console.log(this.users);
  }

  
  onSubmit(form: NgForm){
   
    const { username, email,confirmPassword, password, role } = form.value;
    if(password!==confirmPassword)
    {
      this.errorMessage="Passwords do not Match!"
      return;
    }

    if (email !== this.oldEmail && localStorage.getItem(email)) {
      this.error = "User Already Exists with the new email";
      return;
    }

    this.errorMessage = '';
    const userRole: 'user' | 'admin' = role === 'admin' ? 'admin' : 'user'; 
    if(username && email && password && role)
    {
      const newUser: Users = { username, email, password, role };
      if (this.oldEmail) {
        const existingUserData = localStorage.getItem(this.oldEmail);
        if (existingUserData) {
            const existingUser = JSON.parse(existingUserData);
            newUser.events = existingUser.events; 
        }
        localStorage.removeItem(this.oldEmail);
      }
      
      this.addUser(newUser)
      form.reset();
      this.showForm=false;
      this.oldEmail = null;
      this.isEdit=false;
    }
  }


  // addUser(username:string,email:string,password:string,role:any)
  addUser(user:Users)
  {
    console.log(`${user.username} ${user.email} ${user.password} ${user.role}`)
  //   const newUser:Users={username,email,password,role};
  //   if (this.oldEmail) {
  //     const existingUserData = localStorage.getItem(this.oldEmail);
  //     if (existingUserData) {
  //         const existingUser = JSON.parse(existingUserData);
  //         newUser.events = existingUser.events;
  //     }
  // }
    // localStorage.setItem(email,JSON.stringify(newUser));
    localStorage.setItem(user.email, JSON.stringify(user));
    this.loadUsers();
  }

  deleteUser(mailid:string):void
  {
    const userData = localStorage.getItem(mailid);
    console.log(userData);
    if(userData)
    {
      console.log(mailid);
      console.log(JSON.parse(userData));
      const userrol=JSON.parse(userData);
      if(userrol.role!='admin')
      {
        localStorage.removeItem(mailid);
        this.users=this.users.filter(user=>user.email!=mailid)
      }
      else{
        alert("Admin cannot be deleted..");
      }
     
    }
  }

  editUser(email:string):void{
    this.isEdit=true;
    const userData = localStorage.getItem(email);
    if(userData)
    {
      const user=JSON.parse(userData);
      
      this.formdata.username = user.username;
      this.formdata.email = user.email;
      this.formdata.password = user.password;
      this.formdata.confirmPassword = user.password;
      this.formdata.role = user.role;
      this.showForm = true;

      this.oldEmail = email;
    }
  }
}
