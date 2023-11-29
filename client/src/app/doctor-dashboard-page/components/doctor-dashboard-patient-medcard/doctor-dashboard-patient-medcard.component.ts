import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Medcard } from 'src/app/shared/interfaces';
import { DoctorService } from 'src/app/shared/services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard-patient-medcard',
  templateUrl: './doctor-dashboard-patient-medcard.component.html',
  styleUrls: ['./doctor-dashboard-patient-medcard.component.scss']
})
export class DoctorDashboardPatientMedcardComponent {
  patientId: number | undefined;
  medcard: Medcard | null = null;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMedcard();
  }

  loadMedcard() {
    if (this.patientId) {
      this.doctorService.getMedcard(this.patientId).subscribe({
        next: (data) => {
          this.medcard = data;
        },
        error: (error) => {
          console.error('Error fetching medcard', error);
          this.medcard = null; // Обработка отсутствия данных
        }
      });
    }
  }
}
