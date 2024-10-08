import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsKey = 'notifications';
  invitationStatusChange$ = new BehaviorSubject<{ email: string; status: string } | null>(null);

  constructor() { }

  sendInvitation(senderEmail: string, recipientEmail: string): void {
    const invitation = {
      sender: senderEmail,
      recipient: recipientEmail,
      message: `You have received an invitation from ${senderEmail}.`,
      status: 'pending',
      date: new Date().toISOString()
    };

    const notificationsData = localStorage.getItem(this.notificationsKey);
    const notifications: { [key: string]: any[] } = notificationsData ? JSON.parse(notificationsData) : {};

    if (!notifications[senderEmail]) {
      notifications[senderEmail] = [];
    }

    notifications[senderEmail].push(invitation);
    localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
    alert(`Invitation sent to ${recipientEmail}`);
  }

  updateInvitationStatus(userEmail: string, updatedNotification: any): void {
    const notificationsData = localStorage.getItem(this.notificationsKey);
    if (notificationsData) {
      const notifications: { [key: string]: any[] } = JSON.parse(notificationsData);
      const userNotifications = notifications[userEmail] || [];

      const index = userNotifications.findIndex((notification: any) => 
        notification.message === updatedNotification.message && notification.date === updatedNotification.date
      );

      if (index !== -1) {
        userNotifications[index] = { ...userNotifications[index], ...updatedNotification };
        notifications[userEmail] = userNotifications;
        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
      }
    }
  }

  notifySender(senderEmail: string, status: string): void {
    alert(`The invitation status for ${senderEmail} has been updated to: ${status}`);
  }

 
  getNotifications(email: string): any[] {
    const notificationsData = localStorage.getItem(this.notificationsKey);
    if (notificationsData) {
      const notifications: { [key: string]: any[] } = JSON.parse(notificationsData);
      return notifications[email] || [];
    }
    return [];
  }

  
  markNotificationAsRead(userEmail: string, index: number): void {
    const notificationsData = localStorage.getItem(this.notificationsKey);
    if (notificationsData) {
      const notifications: { [key: string]: any[] } = JSON.parse(notificationsData);
      const userNotifications = notifications[userEmail] || [];

      if (index >= 0 && index < userNotifications.length) {
        userNotifications[index].read = true; // Assuming you have a read property
        notifications[userEmail] = userNotifications;
        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
      }
    }
}


  
  clearNotifications(userEmail: string): void {
    const notificationsData = localStorage.getItem(this.notificationsKey);
    if (notificationsData) {
      const notifications: { [key: string]: any[] } = JSON.parse(notificationsData);
      delete notifications[userEmail]; // Remove all notifications for the user
      localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
    }
  }
}
