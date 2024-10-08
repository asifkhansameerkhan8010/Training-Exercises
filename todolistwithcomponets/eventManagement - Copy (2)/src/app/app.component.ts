import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { NavigationbarComponent } from "./navigationbar/navigationbar.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginformComponent } from "./loginform/loginform.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationbarComponent,  SignupComponent, LoginformComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eventManagement';
}
