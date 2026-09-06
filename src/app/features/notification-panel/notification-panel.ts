
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-panel.html',
  styleUrl: './notification-panel.scss',
})
export class NotificationPanelComponent {
  notificationService = inject(NotificationService);
}