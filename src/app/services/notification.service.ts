import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { API_BASE_URL } from './api-config';

export interface NotificationItem {
  id: number;
  type: string;
  message: string;
  relatedHireRequestId?: number;
  relatedContractId?: number;
  createdAt: string;
  isRead: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private connection?: signalR.HubConnection;
  readonly notifications = signal<NotificationItem[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  connect(): void {
    if (this.connection) return;

    this.loadNotifications(); // pull persisted ones on connect

    const hubUrl = `${API_BASE_URL.replace('/api', '')}/hubs/notifications`;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => this.authService.accessToken ?? '' })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.on('notification', (data: NotificationItem) => {
      this.notifications.update((list) => [data, ...list]);
    });

    this.connection.start().catch(console.error);
  }

  loadNotifications(): void {
    this.http.get<NotificationItem[]>(`${API_BASE_URL}/notifications`).subscribe({
      next: (list) => this.notifications.set(list),
      error: () => {},
    });
  }

  dismiss(id: number): void {
    this.http.delete(`${API_BASE_URL}/notifications/${id}`).subscribe({
      next: () => this.notifications.update((list) => list.filter((n) => n.id !== id)),
    });
  }
}