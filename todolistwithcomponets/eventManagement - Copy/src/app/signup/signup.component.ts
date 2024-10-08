import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Users } from '../models/model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink ,RouterLinkActive,RouterModule} from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  constructor(private router:Router){}

  signupError: string = '';

  formData = {
    username: '',
    email: '',
    password: '',
    cnfrm_password: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { username, email, password, cnfrm_password } = form.value;

      if (password !== cnfrm_password) {
        this.signupError = 'Passwords do not match!';
        return;
      }


      if (this.isEmailTaken(email)) {
        this.signupError = 'An account with this email already exists!';
        return;
      }
      const newUser: Users = { 
        username, 
        email, 
        password, 
        events: {} ,
        role:'user'
      };


      this.saveUserToLocalStorage(newUser);

      
      form.resetForm();
      this.signupError = '';
      alert('Sign up successful! You can now log in.');
      this.router.navigate(['/login']);

    } else {
      this.signupError = 'Please fill out all fields!';
    }
  }

  private isEmailTaken(email: string): boolean {
    return !!localStorage.getItem(email);
  }

  private saveUserToLocalStorage(user: Users): void {
    localStorage.setItem(user.email, JSON.stringify(user));
  }
}
