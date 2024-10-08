import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../user-auth.service';
import { Event, Guest } from '../models/model';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { format } from 'date-fns';
import { BackupService } from '../backup.service';

@Component({
  selector: 'app-eventform',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NavigationbarComponent],
  templateUrl: './eventform.component.html',
  styleUrls: ['./eventform.component.css']
})
export class EventformComponent implements OnInit {
  eventName: string = '';
  eventDate: string = '';
  location: string = '';
  eventDescription: string = '';
  eventStatus: string = 'planning'; 
  eventCategory: string = '';
  eventId: string | null = null;
  isEditMode: boolean = false;
  submitBtn: string = 'Save';
  guests: Guest[] = [];
  categories: string[] = [];
  start: string | undefined;

  constructor(
    private authService: UserAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private backupService: BackupService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    if (this.eventId) {
      this.isEditMode = true;
      this.submitBtn = 'Update';
      this.loadEventDetails(this.eventId);
    }
    this.loadCategories();

    this.start = new Date().toISOString().split('T')[0];
    // Subscribe to backup service to reload categories after data restoration
    this.backupService.dataRestored.subscribe(() => {
      this.loadCategories();
    });
  }

  loadCategories(): void {
    const storedCategories = localStorage.getItem('categories');
    this.categories = storedCategories ? JSON.parse(storedCategories) : [];
  }

  loadEventDetails(eventId: string): void {
    const userEmail = this.authService.getCurrentUserEmail();
    if (userEmail) {
      const userData = localStorage.getItem(userEmail);
      if (userData) {
        const currentUser = JSON.parse(userData);
        const event = currentUser.events.find((e: Event) => e.id === eventId);
        if (event) {
          this.eventName = event.name;
          this.eventDate = format(new Date(event.date), 'yyyy-MM-dd');
          this.location = event.location;
          this.eventDescription = event.description;
          this.eventStatus = event.status;
          this.eventCategory = event.category;
          this.guests = event.guests || [];
        }
      }
    }
  }

  addGuest(guestName: string, guestEmail: string) {
    const guestId = this.generateGuestId(); // Generates a unique ID
    const guest: Guest = {
      id: guestId,
      name: guestName,         // You can replace this with the actual guest's name
      email: guestEmail,
      guestrsvp: 'invited'        // Initial RSVP status
    };
    this.guests.push(guest);
  }

  onSubmit() {
    const userEmail = this.authService.getCurrentUserEmail();
    if (userEmail) {
      const newEvent: Event = {
        id: this.eventId || this.generateEventId(),
        title: this.eventName,
        date: new Date(this.eventDate).toISOString(),
        location: this.location,
        description: this.eventDescription,
        status: this.eventStatus,
        category: this.eventCategory,
        guests: this.guests
      };

      const userData = localStorage.getItem(userEmail);
      let currentUser;

      if (userData) {
        currentUser = JSON.parse(userData);
        if (this.isEditMode) {
          currentUser.events = currentUser.events.map((e: Event) => 
            e.id === this.eventId ? newEvent : e
          );
        } else {
          currentUser.events.push(newEvent);
        }
        localStorage.setItem(userEmail, JSON.stringify(currentUser));
      }

      this.router.navigate(['/user-dashboard']);
    }
  }

  generateEventId(): string {
    return 'event-' + Math.random().toString(36).substr(2, 9); // Generates a random unique ID
  }

  generateGuestId(): string {
    return 'guest-' + Math.random().toString(36).substr(2, 9); // Generates a random unique ID for guests
  }
}
