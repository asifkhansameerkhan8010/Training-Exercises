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
  filteredEvents: any[] = [];  
  showform:boolean=false;
  showagenda:boolean=false;
  selectedEvent:any;
  formagenda:Agenda={
    agenda:'',
    start:'',
    end:''
  }
  categories:string[] | null=[];
  searchTerm: string = '';
  dateFilter: string = '';
  categoryFilter: string = '';
  statusFilter: string = '';
  isDetailspresent:boolean=false;

  constructor(private authService: UserAuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUserEvents();
    this.filteredEvents = [...this.events];
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);  // Ensure it is an array of strings
    } else {
      this.categories = [];
    }
    
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



  filterEvents(): void {
  this.filteredEvents = this.events.filter(event => {
    
    const matchesSearchTerm = this.searchTerm === '' ||
                              event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                              event.description.toLowerCase().includes(this.searchTerm.toLowerCase());

    const matchesDateFilter = this.dateFilter === '' || this.filterByDate(event.date);

    const matchesCategoryFilter = this.categoryFilter === '' || event.category === this.categoryFilter;

    const matchesStatusFilter = this.statusFilter === '' || event.status === this.statusFilter;

    return matchesSearchTerm && matchesDateFilter && matchesCategoryFilter && matchesStatusFilter;
  });
  console.log('Filtered Events:', this.filteredEvents);
}

  

  filterByDate(date: string): boolean {
    const eventDate = new Date(date);
    const today = new Date();
    const weekStart = new Date();
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date();
    weekEnd.setDate(today.getDate() + (7 - today.getDay()));
    
    switch (this.dateFilter) {
      case 'today':
        return eventDate.toDateString() === today.toDateString();
      case 'week':
        return eventDate >= weekStart && eventDate <= weekEnd;
      case 'month':
        return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
      default:
        return true;
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
    this.isDetailspresent=true;
    this.formagenda = { ...this.selectedEvent.agenda }; 
    this.showagenda = true; 
    this.showform = false; 
  } else {
    this.isDetailspresent=false;
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
