import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators ,ReactiveFormsModule, NgForm} from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, Guest, Users } from '../models/model';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { format } from 'date-fns';
@Component({
  selector: 'app-eventform',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NavigationbarComponent],
  templateUrl: './eventform.component.html',
  styleUrl: './eventform.component.css'
})
export class EventformComponent implements OnInit {
  start!:string;
  eventName: string = '';
  eventDate: string = '';
  location: string = '';
  eventDescription: string = '';
  eventStatus: string = 'planning'; 
  eventCategory: string = '';
  eventId: string | null = null;
  isEditMode:boolean=false;
  submitBtn:string='save';
  guests: Guest[]=[];

  categories:string[]=[];

  constructor(
    private authService: UserAuthService,
    private router: Router,
    private route:ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.start=format(new Date(),"yyyy-MM-dd'T'HH:mm")
    this.eventId=this.route.snapshot.paramMap.get('eventId');
    if(this.eventId)
    {
      this.isEditMode=true;
      this.submitBtn='Update'
      this.loadEventDetails(this.eventId);
    }
    this.loadCateogry();
  }

  loadCateogry():void
  {
    const storedCategories = localStorage.getItem('categories');
    if(storedCategories)
    {
      this.categories = JSON.parse(storedCategories);
    }
    else{
      return;
    }
  }


  loadEventDetails(eventId: string): void {
    const userEmail = this.authService.getCurrentUserEmail();
    if (userEmail) {
      const userData = localStorage.getItem(userEmail);
      if (userData) {
        const currentUser = JSON.parse(userData);
        if (currentUser.events && currentUser.events[eventId]) {
          const event = currentUser.events[eventId];
          this.eventName = event.title;
          this.eventDate = event.date;
          this.location = event.location;
          this.eventDescription = event.description;
          this.eventStatus = event.status;
          this.eventCategory = event.category;
          console.log(this.eventCategory);
          this.guests = event.guests || [];
        }
      }
    }
  }
  onSubmit(): void {
    if (this.isEditMode && this.eventId) {
      this.updateEvent();
    } else {
      this.addNewEvent();
    }
    this.router.navigate(['/userdashboard']); 
  }
  addNewEvent(): void {
    const eventId = 'event_' + Date.now();
    const event: Event = {
      id: eventId,
      title: this.eventName,
      date: this.eventDate,
      location: this.location,
      description: this.eventDescription,
      status: this.eventStatus,
      category: this.eventCategory,
      guests: this.guests
    };

    this.addEventToUser(event);
  }

  updateEvent(): void {
    if (this.eventId) {
      const event: Event = {
        id: this.eventId,
        title: this.eventName,
        date: this.eventDate,
        location: this.location,
        description: this.eventDescription,
        status: this.eventStatus,
        category: this.eventCategory,
        guests: this.guests
      };
      this.addEventToUser(event);
    }
  }
  addEventToUser(event:any) {
    
    const userEmail = this.authService.getCurrentUserEmail();
    console.log(userEmail);
    if (userEmail) {
      const userData=localStorage.getItem(userEmail);
      if(userData)
      {
        const currentUser:Users=JSON.parse(userData);
        console.log(currentUser)
        if(!currentUser.events){
          currentUser.events={};
        }
        currentUser.events[event.id]=event;
        localStorage.setItem(userEmail,JSON.stringify(currentUser));
      }
      
    }    
  }
   
}
