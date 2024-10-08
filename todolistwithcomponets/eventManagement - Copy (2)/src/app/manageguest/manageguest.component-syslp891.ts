import { Component, OnInit } from '@angular/core';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { Guest, Invitation } from '../models/model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../user-auth.service';
import { InvitationService } from '../invitation.service';



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
  editingIndex: number | null = null; 

  formdata = {
    name: '',
    email: '',
    guestrsvp: 'Pending'
  };

  constructor(private route: ActivatedRoute, private authService: UserAuthService,private invitationService:InvitationService) {}
  invitations: Invitation[] = [];
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.loadGuests();
    });
    
  }

 
  loadGuests(): void {
    if (this.eventId) {
        const userEmail = this.authService.getCurrentUserEmail();
        
        // Ensure userEmail is not null before proceeding
        if (userEmail) {
            const userData = localStorage.getItem(userEmail);
            if (userData) {
                const currentUser = JSON.parse(userData);
                const event = currentUser.events[this.eventId];
                if (event && event.guests) {
                    this.guests = event.guests;
                }
            }
            // Now we can safely call loadInvitations since userEmail is guaranteed to be a string
            this.invitationService.loadInvitations(userEmail); // Load invitations
            this.invitationService.invitations$.subscribe(invitations => {
                // Update guests based on invitation responses
                this.guests.forEach(guest => {
                    const invitation = invitations.find(inv => inv.inviteeEmail === guest.email);
                    if (invitation) {
                        guest.guestrsvp = invitation.status; // Update guest RSVP status based on invitation
                    }
                });
            });
        } else {
            console.error("User email is null. Cannot load guests or invitations.");
        }
    }
}


  onSubmit(form: NgForm) {
    if (this.editingIndex !== null) {
      if (this.isDuplicateEmail(this.formdata.email, this.editingIndex)) {
        alert("Email Already Exists!");
        return;
      }

      this.updateGuest();  

    } else {
      if (this.isDuplicateEmail(this.formdata.email)) {
        alert("Email Already Exists!");
        return;
      }

      console.log('Form submitted for new guest', form.value);
      const newGuest: Guest = {
        id: "guest_" + Date.now(),
        name: this.formdata.name,
        email: this.formdata.email,
        guestrsvp: this.formdata.guestrsvp,
      };
      
      this.addGuest(newGuest);
    }

    form.resetForm();
    this.editingIndex = null; 
  }

  isDuplicateEmail(email: string, editingIndex: number | null = null): boolean {
    return this.guests.some((guest, index) => guest.email === email && index !== editingIndex);
  }

  addGuest(newGuest: Guest): void {
    console.log('Adding guest', newGuest);
    if(this.isUserpresent(newGuest.email) && this.authService.getCurrentUser())
    {
      this.guests.push(newGuest);
      this.saveGuests();
    }
    else{
      alert("The guest is not registered")
    }
    
  }

  updateGuest(): void {
    if (this.editingIndex !== null) {
      if (!this.isUserpresent(this.formdata.email)) { 
        alert("The guest is not registered");
        return;
      }
      const updatedGuest: Guest = {
        id: this.guests[this.editingIndex].id, 
        name: this.formdata.name,
        email: this.formdata.email,
        guestrsvp: this.formdata.guestrsvp
      };
      this.guests[this.editingIndex] = updatedGuest;
      this.saveGuests();
      this.editingIndex = null; 
      console.log('Guest updated successfully!');
    }
  }


  deleteGuest(index: number): void {
    if (index > -1) {
      this.guests.splice(index, 1); 
      this.saveGuests(); 
      console.log(`Guest at index ${index} deleted successfully!`);
    }
  }

  editGuest(index: number): void {
    const guest = this.guests[index];
    this.formdata = {
      name: guest.name,
      email: guest.email,
      guestrsvp: guest.guestrsvp
    };
    this.editingIndex = index;
  }

  saveGuests(): void {
    const userEmail = this.authService.getCurrentUserEmail();
    if (this.eventId && userEmail) {
      const userData = localStorage.getItem(userEmail);
      if (userData) {
        const currentUser = JSON.parse(userData);
        currentUser.events[this.eventId].guests = this.guests;
        localStorage.setItem(userEmail, JSON.stringify(currentUser));  
        console.log('Guests saved successfully!');
      }
    }
  }

  isUserpresent(user:string):boolean{
   const cUsers= this.authService.getCurrentUsers();
   const exists=cUsers.some(users=>users===user);
   console.log(exists);
   return exists;
  }



  sendInvitation(eventId: string): void {
    const senderEmail = this.authService.getCurrentUserEmail();  // Get the sender's email
  
    if (!senderEmail) {
      console.error('Sender email is not available');
      return;
    }
  
    // Loop through each guest and create invitations
    this.guests.forEach(guest => {
      const recipientEmail = guest.email;
  
      // Retrieve existing invitations for the recipient
      const existingInvitationsData = localStorage.getItem(`_invitations_${recipientEmail}`);
      const existingInvitations: Invitation[] = existingInvitationsData ? JSON.parse(existingInvitationsData) : [];
  
      // Check if an invitation for this event already exists
      const alreadyInvited = existingInvitations.some(invitation =>
        invitation.sentBy === senderEmail &&
        invitation.inviteeEmail === recipientEmail &&
        invitation.eventId === eventId && // Check against eventId
        invitation.status === 'pending'
      );
  
      if (alreadyInvited) {
        console.log(`Invitation already sent to ${recipientEmail} for event ID ${eventId}.`);
        return; 
      }
      const invitation: Invitation = {
        inviteeEmail: recipientEmail,
        inviteeName: guest.name,
        status: 'pending', // Default status
        sentBy: senderEmail, // Sender's email
        sentAt: new Date(), // Current timestamp
        responseAt: undefined, // No response at this moment
        eventId: eventId // Include the eventId
      };
  
     
      existingInvitations.push(invitation);
      localStorage.setItem(`_invitations_${recipientEmail}`, JSON.stringify(existingInvitations));
    });
  
    console.log('Invitations sent:', this.guests);
  }
  getAcceptedCount(): number {
    return this.guests.filter(guest => guest.guestrsvp === 'accepted').length;
  }

  
  getPendingCount(): number {
    return this.guests.filter(guest => guest.guestrsvp === 'Pending').length;
  }

  
  getRejectedCount(): number {
    return this.guests.filter(guest => guest.guestrsvp === 'rejected').length;
  }
  

}


