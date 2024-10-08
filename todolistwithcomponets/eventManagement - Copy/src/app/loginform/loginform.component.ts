import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, } from '@angular/router';
import { UserAuthService } from '../user-auth.service';
import { CommonModule } from '@angular/common';

@Component({ 
  selector: 'app-loginform',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,FormsModule,CommonModule],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.css'
})
export class LoginformComponent implements OnInit {
  Loginerror='';
  constructor(private authservice:UserAuthService,private router:Router){}

  ngOnInit(): void {
    this.addAdminDetailsToLocalStorage(); 
  }

  addAdminDetailsToLocalStorage(): void {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    const existingAdmin = localStorage.getItem(adminEmail);

    if (!existingAdmin) {
      const adminDetails = {
        username:'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      };
      console.log(adminDetails);
      localStorage.setItem(adminEmail, JSON.stringify(adminDetails));
    }
  }
  Handlelogin(data:NgForm){

    console.log(data.value);
    const {email,password}=data.value;
    const detail=this.authservice.login(email,password);
    if(detail)
    {
      const currentuser=this.authservice.getCurrentUser();
      if(currentuser?.role=='admin')
      {
        this.router.navigate(['/admindashboard'])
      }
      else{
        this.router.navigate(['/userdashboard'])
      }
    }else {
      this.Loginerror = 'Invalid email or password';
    }
    
  }
}
