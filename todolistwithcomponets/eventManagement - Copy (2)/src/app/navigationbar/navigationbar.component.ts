import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-auth.service';
import { BackupService } from '../backup.service';
import { Invitation } from '../models/model';
import { InvitationService } from '../invitation.service'; // Import the service
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigationbar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.css'],
})
export class NavigationbarComponent implements OnInit {
  invitations: Invitation[] = [];
  unreadCount: number = 0;
  dropdown: boolean = false;
  role: string | null = '';
  username: string = '';
  showUsername: boolean = false;

  constructor(
    private router:Router,
    public authservice: UserAuthService,
    public backupservice: BackupService,
    private invitationService: InvitationService // Inject the service
  ) {}

  ngOnInit(): void {
    this.role = this.authservice.getCurrentUserRole();
    const userEmail = this.authservice.getCurrentUserEmail();
    // if (userEmail) {
    //   this.username = userEmail;
    //   this.invitationService.loadInvitations(userEmail); 
    //   this.invitationService.invitations$.subscribe(invitations => {
    //     this.invitations = invitations
    //       .filter(invitation => invitation.status === 'pending')
    //       .slice(0, 3);
    //     // this.unreadCount = this.invitations.filter(invitation => invitation.status === 'pending').length;
    //     this.unreadCount = this.invitations.length;
    //     console.log('Invitations:', this.invitations); 
    //   });
      
    // }
    if (userEmail) {
      this.username = userEmail;
      this.loadAndFilterInvitations(); // Load and filter invitations on component init
    }
  }

  loadAndFilterInvitations(): void {
    const userEmail = this.authservice.getCurrentUserEmail();
    if (userEmail) {
      this.invitationService.loadInvitations(userEmail);
      this.invitationService.invitations$.subscribe((invitations) => {
        // Filter for pending invitations and show only the top 3
        this.invitations = invitations
          .filter((invitation) => invitation.status === 'pending')
          .slice(0, 4);

        // Update unread count
        this.unreadCount = this.invitations.length;
        console.log('Filtered Invitations:', this.invitations);
      });
    }
  }

  showdropdown() {
    this.dropdown = !this.dropdown; 
    console.log('Dropdown visibility:', this.dropdown); 
  }
  

  acceptInvitation(invitation: Invitation): void {
    invitation.status = 'accepted';
    this.updateInvitations(); 
  }

  rejectInvitation(invitation: Invitation): void {
    invitation.status = 'rejected';
    this.updateInvitations(); 
  }

  updateInvitations(): void {
    const userEmail = this.authservice.getCurrentUserEmail();
    if(userEmail)
    {
      this.invitationService.saveInvitations(userEmail, this.invitations); // Save updated invitations
    }
    this.invitationService.updateInvitations(this.invitations); // Notify other components
  }

  routetoHis(){
    this.router.navigate(['/backuphis'])
  }


  toggleUsernameDisplay() {
    this.showUsername = !this.showUsername; 
  }
}
