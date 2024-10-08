import { Component, OnInit } from '@angular/core';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { Guest } from '../models/model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../user-auth.service'; // Import the auth service

@Component({
  selector: 'app-manageguest',
  standalone: true,
  imports: [NavigationbarComponent, CommonModule, FormsModule],
  templateUrl: './manageguest.component.html',
  styleUrls: ['./manageguest.component.css']
})
export class ManageguestComponent implements OnInit {
  guests: Guest[] = []; 
  eventId: string | null = null; 
  formdata = {
    name: '',
    email: '',
    guestrsvp: 'Pending'
  };

  constructor(private route: ActivatedRoute, private authService: UserAuthService) {}

  ngOnInit(): void {
   
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.loadGuests(); 
    });
  }

  
  loadGuests(): void {
    if (this.eventId) {
      const userEmail = this.authService.getCurrentUserEmail(); 
      if (userEmail) {
        const userData = localStorage.getItem(userEmail);
        if (userData) {
          const currentUser = JSON.parse(userData);
          

          console.log('Current user data:', currentUser);
  
          if (currentUser.events && currentUser.events[this.eventId]) {

            console.log('Current event data:', currentUser.events[this.eventId]);

            this.guests = currentUser.events[this.eventId].guests || [];

            console.log('Guest list:', this.guests);
          }
        }
      }
    }
  }
  
 
onSubmit(form: NgForm) {
  if (form.valid) {
    const newGuest: Guest = {
      id: 'guestId_' + Date.now(),
      name: this.formdata.name.trim(), // Trim any extra spaces
      email: this.formdata.email.trim(), // Ensure email is trimmed
      guestrsvp: this.formdata.guestrsvp
    };
    this.addGuest(newGuest); // Call addGuest with the new guest object
    form.reset(); // Reset the form for a new entry
  } else {
    console.error('Form is invalid');
  }
}


  // Add a guest to the list
  addGuest(newGuest: Guest): void {
    // Check if the guest is already in the list
    const exists = this.guests.some(guest => guest.email === newGuest.email); // Assuming email is unique
    if (!exists) {
      this.guests.push(newGuest);
      console.log('Guest added:', newGuest);
      this.saveGuests(); // Call saveGuests to store the updated list
    } else {
      console.error('Guest already exists or invalid name.');
    }
  }

 // Save updated guest list to localStorage
saveGuests(): void {
  const userEmail = this.authService.getCurrentUserEmail(); // Get the logged-in user's email
  if (userEmail) {
    const userData = localStorage.getItem(userEmail);
    if (userData) {
      const currentUser = JSON.parse(userData);

    
      console.log('Current user data before saving:', currentUser);

      
      if (currentUser.events && this.eventId) {
      
        console.log('Current guests before update:', currentUser.events[this.eventId].guests);
        
        
        currentUser.events[this.eventId].guests = this.guests; // Make sure this is being executed

       
        console.log('Updated guests after assignment:', currentUser.events[this.eventId].guests);
        

        localStorage.setItem(userEmail, JSON.stringify(currentUser));
        

        console.log('Final guest list saved to local storage:', currentUser.events[this.eventId].guests);
      }
    }
  }
}

}
