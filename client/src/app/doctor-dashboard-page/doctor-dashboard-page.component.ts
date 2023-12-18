import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-doctor-dashboard-page',
  templateUrl: './doctor-dashboard-page.component.html',
  styleUrls: ['./doctor-dashboard-page.component.scss']
})
export class DoctorDashboardPageComponent {
  constructor( private authService: AuthService) {}

  onLogoutClick(): void {
    this.authService.openLogoutConfirmationDialog();
  }
}
