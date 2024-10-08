import { Component, OnInit} from '@angular/core';
import { UserAuthService } from '../user-auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Event } from '../models/model';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, NavigationbarComponent],
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css'
})
export class UserdashboardComponent implements OnInit{

  events: any[] = [];

  constructor(private authService: UserAuthService,private router:Router){}
  ngOnInit(): void {
    this.loadUserEvents();
  }

  loadUserEvents(): void {
    const userEmail = this.authService.getCurrentUserEmail();
    if (userEmail) {
      const userData = localStorage.getItem(userEmail);
      if (userData) {
        const currentUser = JSON.parse(userData);
        
        this.events = currentUser.events ? Object.values(currentUser.events) : [];
      }
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      if (currentUserEmail) {
      this.loadEvents(currentUserEmail);
    }
    }
  }

  loadEvents(email: string) {
    const userData = localStorage.getItem(email);
    if (userData) {
      const user = JSON.parse(userData);
      this.events = user.events || [];
    }
  }
  

  editEvent(eventId: string): void 
  {
    this.router.navigate(['/eventform', eventId]);

  }

deleteEvent(eventId: string): void 
{
    const userEmail = this.authService.getCurrentUserEmail();
    if (userEmail) {
        const userData = localStorage.getItem(userEmail);
        if (userData) {
            const currentUser = JSON.parse(userData);
            if (currentUser.events && currentUser.events[eventId]) {
                delete currentUser.events[eventId];
                localStorage.setItem(userEmail, JSON.stringify(currentUser));
                this.loadUserEvents();
            }
        }
      }
    }
  addevent()
  {
    this.router.navigate(['/eventform'])
  }
  manageGuests(eventId: string):void
  {
    this.router.navigate(['/manageguest',{ queryParams: { eventId } }])
  }
  viewDetails(eventId: string):void
  {

  }

}