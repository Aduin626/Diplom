import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-sidebar',
  templateUrl: './admin-dashboard-sidebar.component.html',
  styleUrls: ['./admin-dashboard-sidebar.component.scss']
})
export class AdminDashboardSidebarComponent {
  constructor( private authService: AuthService) {}

  onLogoutClick(): void {
    this.authService.openLogoutConfirmationDialog();
  }
}
