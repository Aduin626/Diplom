import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-patient-dashboaed-sidebar',
  templateUrl: './patient-dashboaed-sidebar.component.html',
  styleUrls: ['./patient-dashboaed-sidebar.component.scss']
})
export class PatientDashboaedSidebarComponent {
  constructor( private authService: AuthService) {}

  onLogoutClick(): void {
    this.authService.openLogoutConfirmationDialog();
  }
}
