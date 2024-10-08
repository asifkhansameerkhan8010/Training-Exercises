import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BackupService } from '../backup.service';

@Component({
  selector: 'app-navigationbar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './navigationbar.component.html',
  styleUrl: './navigationbar.component.css'
})
export class NavigationbarComponent implements OnInit{

  constructor(public authservice:UserAuthService,public backupservice:BackupService){}

  role:string|null='';
  username:string='';

  ngOnInit(): void {
    this.role=this.authservice.getCurrentUserRole();
    console.log(this.role);

    this.backupservice.dataRestored.subscribe(() => {
      this.role = this.authservice.getCurrentUserRole();
    });
  }
  
  
}
