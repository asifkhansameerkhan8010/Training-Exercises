import { Injectable } from '@angular/core';
import { Users } from './models/model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private readonly currentUserKey = 'loggedInUser';

  constructor(private router:Router) { }

  login(email: string, password: string): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      const storeduser = localStorage.getItem(email);
      console.log(storeduser);
      if (storeduser) {
        const user = JSON.parse(storeduser);
        console.log(user);

        if (user.password === password) {
          localStorage.setItem(this.currentUserKey, email);
          return true;
        } else {
          alert('Password is wrong');
        }
      }
    }
    return false;
  }

  logout() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.currentUserKey);
      this.router.navigate(['/login'])
    }

  }

  
  getCurrentUser(): Users | null {
    if (typeof window !== 'undefined' && localStorage) {
      const email = localStorage.getItem(this.currentUserKey);
      return email ? JSON.parse(localStorage.getItem(email)!) : null;
    }
    return null;
  }

  // Get current user's email
  getCurrentUserEmail(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.currentUserKey);
    }
    return null;
  }


  getCurrentUserRole(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      const email = localStorage.getItem(this.currentUserKey);
      if (email) {
        const userdata = localStorage.getItem(email);
        if (userdata) {
          const data = JSON.parse(userdata);
          return data.role || null;
        }
      }
    }
    return null;
  }

  getCurrentUsers()
  {
    const currentUsers:string[]=[];
    const keys=Object.keys(localStorage);
    keys.forEach((key)=>{
      if(key.includes('@') && !key.includes('admin@gmail.com'))
        currentUsers.push(key);
    })
    console.log(currentUsers);
    return currentUsers;
  }

  getEventTitle(userEmail: string, eventId: string): string | null {
    const userDataString = localStorage.getItem(userEmail);
    
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const event = userData.events[eventId];
      return event ? event.title : null;
    }
    return null;
  }
  
  
}
