// import { Component, OnInit } from '@angular/core';
// import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
// import { Guest } from '../models/model';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgForm } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { UserAuthService } from '../user-auth.service';
// import { NotificationService } from '../notification.service';


// @Component({
//   selector: 'app-manageguest',
//   standalone: true,
//   imports: [NavigationbarComponent, CommonModule, FormsModule],
//   templateUrl: './manageguest.component.html',
//   styleUrls: ['./manageguest.component.css']
// })
// export class ManageguestComponent implements OnInit {
//   guests: Guest[] = []; 
//   eventId: string | null = null; 
//   editingIndex: number | null = null; 

//   formdata = {
//     name: '',
//     email: '',
//     guestrsvp: 'Pending'
//   };

//   constructor(private route: ActivatedRoute, private authService: UserAuthService,private notificationService: NotificationService) {
//     this.notificationService.invitationStatusChange$.subscribe(({ email, status }) => {
//       this.updateGuestList(email, status);
//   });
//   }

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       this.eventId = params['eventId'];  
//       console.log('Event ID:', this.eventId);
//       this.loadGuests();  
//     });
//   }

//   loadGuests(): void {
//     if (this.eventId) {
//       const userEmail = this.authService.getCurrentUserEmail();
//       if (userEmail) {
//         const userData = localStorage.getItem(userEmail);
//         if (userData) {
//           const currentUser = JSON.parse(userData);
//           const event = currentUser.events[this.eventId];
//           if (event && event.guests) {
//             this.guests = event.guests;
//           }
//         }
//       }
//     }
//   }


//   // In your user management service
// invitations: { [email: string]: any[] } = {}; // To store invitations sent by each user

// sendInvitations(): void {
//   const senderEmail: string | null = this.authService.getCurrentUserEmail();
  
//   if (senderEmail) {
//     this.guests.forEach(guest => {
//       if (guest.guestrsvp === 'Pending') {
//         this.notificationService.sendInvitation(senderEmail, guest.email);
//         alert(`Invitation sent to ${guest.email}`);
//       }
//     });
//   } else {
//     alert('You must be logged in to send invitations.');
//   }
// }



// updateInvitationStatus(senderEmail: string, status: string): void {
//   const invitation = this.invitations[senderEmail].find(inv => inv.status === 'pending');
//   if (invitation) {
//     invitation.status = status;
//   }
// }




//   onSubmit(form: NgForm) {
//     if (this.editingIndex !== null) {
//       if (this.isDuplicateEmail(this.formdata.email, this.editingIndex)) {
//         alert("Email Already Exists!");
//         return;
//       }

//       this.updateGuest();  

//     } else {
//       if (this.isDuplicateEmail(this.formdata.email)) {
//         alert("Email Already Exists!");
//         return;
//       }

//       console.log('Form submitted for new guest', form.value);
//       const newGuest: Guest = {
//         id: "guest_" + Date.now(),
//         name: this.formdata.name,
//         email: this.formdata.email,
//         guestrsvp: this.formdata.guestrsvp,
//       };
      
//       this.addGuest(newGuest);
//     }

//     form.resetForm();
//     this.editingIndex = null; 
//   }

//   isDuplicateEmail(email: string, editingIndex: number | null = null): boolean {
//     return this.guests.some((guest, index) => guest.email === email && index !== editingIndex);
//   }

//   addGuest(newGuest: Guest): void {
//     console.log('Adding guest', newGuest);
//     if(this.isUserpresent(newGuest.email) && this.authService.getCurrentUser())
//     {
//       this.guests.push(newGuest);
//       this.saveGuests();
//     }
//     else{
//       alert("The guest is not registered")
//     }
    
//   }

//   updateGuest(): void {
//     if (this.editingIndex !== null) {
//       if (!this.isUserpresent(this.formdata.email)) { 
//         alert("The guest is not registered");
//         return;
//       }
//       const updatedGuest: Guest = {
//         id: this.guests[this.editingIndex].id, 
//         name: this.formdata.name,
//         email: this.formdata.email,
//         guestrsvp: this.formdata.guestrsvp
//       };
//       this.guests[this.editingIndex] = updatedGuest;
//       this.saveGuests();
//       this.editingIndex = null; 
//       console.log('Guest updated successfully!');
//     }
//   }
//   updateGuestList(email: string, status: string): void {
//     // Logic to refresh the guest list or manage the state based on the status update
//     const guest = this.guests.find(g => g.email === email);
//     if (guest) {
//         guest.guestrsvp = status === 'accepted' ? 'Accepted' : 'Declined';
//         this.saveGuests();
//         console.log(`Updated guest ${email} to status ${status}.`);
//     }
// }


//   deleteGuest(index: number): void {
//     if (index > -1) {
//       this.guests.splice(index, 1); 
//       this.saveGuests(); 
//       console.log(`Guest at index ${index} deleted successfully!`);
//     }
//   }

//   editGuest(index: number): void {
//     const guest = this.guests[index];
//     this.formdata = {
//       name: guest.name,
//       email: guest.email,
//       guestrsvp: guest.guestrsvp
//     };
//     this.editingIndex = index;
//   }

//   saveGuests(): void {
//     const userEmail = this.authService.getCurrentUserEmail();
//     if (this.eventId && userEmail) {
//       const userData = localStorage.getItem(userEmail);
//       if (userData) {
//         const currentUser = JSON.parse(userData);
//         currentUser.events[this.eventId].guests = this.guests;
//         localStorage.setItem(userEmail, JSON.stringify(currentUser));  
//         console.log('Guests saved successfully!');
//       }
//     }
//   }

//   isUserpresent(user:string):boolean{
//    const cUsers= this.authService.getCurrentUsers();
//    const exists=cUsers.some(users=>users===user);
//    console.log(exists);
//    return exists;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { Guest } from '../models/model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../user-auth.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-manageguest',
  standalone: true,
  imports: [NavigationbarComponent , CommonModule, FormsModule],
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

  constructor(private route: ActivatedRoute, private authService: UserAuthService, private notificationService: NotificationService) {
    this.notificationService.invitationStatusChange$.subscribe(notification => {
      if (notification) {  // Check if notification is not null
        const { email, status } = notification;
        this.updateGuestList(email, status);
      }
    });
  }
  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('Event ID:', this.eventId);
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
          const event = currentUser.events[this.eventId];
          if (event && event.guests) {
            this.guests = event.guests;
          }
        }
      }
    }
  }

  invitations: { [email: string]: any[] } = {};

  sendInvitations(): void {
    const senderEmail: string | null = this.authService.getCurrentUserEmail();
    if (senderEmail) {
        this.guests.forEach(guest => {
            if (guest.guestrsvp === 'Pending') {
                this.notificationService.sendInvitation(senderEmail, guest.email);
                this.notificationService.invitationStatusChange$.next({ email: guest.email, status: 'pending' }); // Emit pending status
                alert(`Invitation sent to ${guest.email}`);
            }
        });
    } else {
        alert('You must be logged in to send invitations.');
    }
}


  updateInvitationStatus(senderEmail: string, status: string): void {
    const invitation = this.invitations[senderEmail].find(inv => inv.status === 'pending');
    if (invitation) {
      invitation.status = status;
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
    if (this.isUserPresent(newGuest.email) && this.authService.getCurrentUser()) {
      this.guests.push(newGuest);
      this.saveGuests();
    } else {
      alert("The guest is not registered");
    }
  }

  updateGuest(): void {
    if (this.editingIndex !== null) {
      if (!this.isUserPresent(this.formdata.email)) {
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

  updateGuestList(email: string, status: string): void {
    const guest = this.guests.find(g => g.email === email);
    if (guest) {
      guest.guestrsvp = status === 'accepted' ? 'Accepted' : 'Declined';
      this.saveGuests();
      console.log(`Updated guest ${email} to status ${status}.`);
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

  isUserPresent(user: string): boolean {
    const currentUsers = this.authService.getCurrentUsers();
    const exists = currentUsers.some(users => users === user);
    console.log(exists);
    return exists;
  }
}
