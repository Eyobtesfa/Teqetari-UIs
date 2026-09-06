import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationPanelComponent } from '../notification-panel/notification-panel';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationPanelComponent],
  templateUrl: './employee-dash.html',
  styleUrl: './employee-dash.scss',
})
export class EmployeeDashboardComponent {}