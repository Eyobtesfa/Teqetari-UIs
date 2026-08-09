import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router'; // Import RouterLink

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink], // Register RouterLink here
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  // Local state signal if needed
  activeRole = signal<'employee' | 'employer'>('employee');
}