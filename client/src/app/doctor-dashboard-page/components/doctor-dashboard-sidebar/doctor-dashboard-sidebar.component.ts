import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-doctor-dashboard-sidebar',
  templateUrl: './doctor-dashboard-sidebar.component.html',
  styleUrls: ['./doctor-dashboard-sidebar.component.scss']
})
export class DoctorDashboardSidebarComponent {
  constructor( private authService: AuthService) {}

  onLogoutClick(): void {
    this.authService.openLogoutConfirmationDialog();
  }
}
