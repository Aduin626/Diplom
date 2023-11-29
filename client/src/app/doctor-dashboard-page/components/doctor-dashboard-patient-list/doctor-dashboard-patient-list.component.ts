import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from 'src/app/shared/interfaces';
import { DoctorService } from 'src/app/shared/services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard-patient-list',
  templateUrl: './doctor-dashboard-patient-list.component.html',
  styleUrls: ['./doctor-dashboard-patient-list.component.scss']
})
export class DoctorDashboardPatientListComponent {
  patient: Patient[] = [];
  searchQuery: string = '';

  constructor(private doctorService: DoctorService, private router:Router) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  
  get filteredPatients(): Patient[] {
    return this.patient.filter(patient =>
      patient.snils.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  loadDoctors(): void {
    this.doctorService.getPatient().subscribe(
      response => {
        this.patient = response;
        console.log(this.patient);
      },
      error => {
        console.error('Error fetching doctors', error);
      }
    );
  }

  
  openCreateReceiptForm(patientId: number) {
    this.router.navigate(['/create-receipt', patientId]);
  }
}
