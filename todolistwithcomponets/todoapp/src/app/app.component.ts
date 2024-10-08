import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputcomponentComponent } from "./inputcomponent/inputcomponent.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InputcomponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todoapp';
}
