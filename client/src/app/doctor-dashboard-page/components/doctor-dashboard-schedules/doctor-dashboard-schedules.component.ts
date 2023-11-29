import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DoctorService } from 'src/app/shared/services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard-schedules',
  templateUrl: './doctor-dashboard-schedules.component.html',
  styleUrls: ['./doctor-dashboard-schedules.component.scss']
})
export class DoctorDashboardSchedulesComponent {
  schedule: any[] = [];

  constructor(private doctorService: DoctorService, private router:Router) {}

  ngOnInit() {
    this.loadSchedule();
  }

  loadSchedule() {
    this.doctorService.getSchedule().subscribe({
      next: (data) => {
        this.schedule = data;
      },
      error: (error) => {
        console.error('Error fetching schedule', error);
      }
    });
  }

  openPatientMedicalRecord(patientId: number): void {
    // Осуществление перехода на страницу медицинской карты пациента
    this.router.navigate(['/patient-medical-record', patientId]);
  }
}
