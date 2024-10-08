import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { FormsModule, NgForm } from '@angular/forms';
import { Agenda } from '../models/model';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, NavigationbarComponent,FormsModule],
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css'
})
export class UserdashboardComponent implements OnInit {

  events: any[] = [];
  showform:boolean=false;
  showagenda:boolean=false;
  selectedEvent:any;
  formagenda:Agenda={
    agenda:'',
    start:'',
    end:''
  }
  
  constructor(private authService: UserAuthService, private router: Router) { }

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
    }
  }

  loadEvents(email: string): void {
    const userData = localStorage.getItem(email);
    if (userData) {
      const user = JSON.parse(userData);
      this.events = user.events || [];
    }
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/eventform', eventId]);
  }

  deleteEvent(eventId: string): void {
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

  addevent(): void {
    this.router.navigate(['/eventform']);
  }

  manageGuests(eventId: string): void {
    this.router.navigate(['/manageguest', eventId]);
  }

  viewDetails(eventId: string): void {

   this.selectedEvent = this.events.find(event => event.id === eventId);
   if (this.selectedEvent && this.selectedEvent.agenda) {
    this.formagenda = { ...this.selectedEvent.agenda }; // Load existing agenda
    this.showagenda = true; 
    this.showform = false; 
  } else {
    this.showform = true; 
    this.showagenda = false;
  }

  }


  closeModal(): void {
    this.showform = false;
    this.showagenda = false;
  }

  saveEventDetails(): void
  {
    if (this.formagenda.start && this.formagenda.end && this.formagenda.agenda) {
      console.log('Form data:', this.formagenda);
      this.selectedEvent.agenda=this.formagenda;

      const userEmail = this.authService.getCurrentUserEmail();
      if(userEmail)
      {
        const data=localStorage.getItem(userEmail);
        if(data)
        {
          const currentUser=JSON.parse(data);
          currentUser.events[this.selectedEvent.id]=this.selectedEvent;
          localStorage.setItem(userEmail, JSON.stringify(currentUser));
        }
      }
    }
    this.showform=false;
    this.showagenda=true;
   
  }

  
}
