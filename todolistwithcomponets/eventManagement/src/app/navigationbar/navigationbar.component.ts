import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BackupService } from '../backup.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-navigationbar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './navigationbar.component.html',
  styleUrl: './navigationbar.component.css'
})
export class NavigationbarComponent implements OnInit{

  constructor(public authservice:UserAuthService,public backupservice:BackupService, private notificationService: NotificationService,){}

  role:string|null='';
  username:string='';
  unreadCount: number = 0;
  notifications: any[] = [];
  showDropdown: boolean = false;

  ngOnInit(): void {
    this.role=this.authservice.getCurrentUserRole();
    console.log(this.role);
    const userEmail = this.authservice.getCurrentUserEmail();
    if (userEmail) {
      this.username = userEmail;
      this.loadNotifications(userEmail);
    }
  }

  loadNotifications(userEmail: string): void {
    this.notifications = this.notificationService.getNotifications(userEmail);
    this.unreadCount = this.notifications.filter(notification => !notification.read).length;
  }

  toggleNotificationDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(index: number): void {
    const userEmail = this.authservice.getCurrentUserEmail();
    if (userEmail) {
      this.notificationService.markNotificationAsRead(userEmail, index);
      this.loadNotifications(userEmail);
    }
}

  
  clearAllNotifications(): void {
    const userEmail = this.authservice.getCurrentUserEmail();
    if (userEmail) {
      this.notificationService.clearNotifications(userEmail);
      this.loadNotifications(userEmail);
    }
  }

  respondToInvitation(notification: any, accepted: boolean): void {
    const status = accepted ? 'accepted' : 'rejected';
    
    const userEmail = this.authservice.getCurrentUserEmail();
    if (userEmail) {
        this.notificationService.updateInvitationStatus(userEmail, {
            ...notification,
            status: status
        });
        this.notificationService.notifySender(notification.sender, status);
        this.loadNotifications(userEmail);
    } else {
        console.error('User email is not available'); // Handle this case appropriately
    }
}

}
