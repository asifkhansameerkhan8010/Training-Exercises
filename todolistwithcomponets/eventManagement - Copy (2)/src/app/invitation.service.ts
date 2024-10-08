// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/internal/Subject';

// @Injectable({
//   providedIn: 'root'
// })
// export class InvitationService {
//   private invitationStatusUpdatedSource = new Subject<void>();
//   constructor() { }
//   invitationStatusUpdated$ = this.invitationStatusUpdatedSource.asObservable();
//   notifyInvitationStatusUpdated() {
//     this.invitationStatusUpdatedSource.next(); // Notify subscribers that the invitation status has been updated
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Invitation } from './models/model'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private invitationsSubject = new BehaviorSubject<Invitation[]>([]);
  invitations$ = this.invitationsSubject.asObservable();

  loadInvitations(userEmail: string): void {
    const invitationsData = localStorage.getItem(`_invitations_${userEmail}`);
    const invitations = invitationsData ? JSON.parse(invitationsData) : [];
    this.invitationsSubject.next(invitations);
  }

  updateInvitations(invitations: Invitation[]): void {
    this.invitationsSubject.next(invitations);
  }

  saveInvitations(userEmail: string, invitations: Invitation[]): void {
    localStorage.setItem(`_invitations_${userEmail}`, JSON.stringify(invitations));
  }
}
