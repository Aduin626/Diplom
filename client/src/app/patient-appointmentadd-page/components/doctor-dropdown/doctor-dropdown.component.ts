import { Component } from '@angular/core';
import { Doctor, Schedule } from 'src/app/shared/interfaces';
import { PatientService } from 'src/app/shared/services/patient.service';

@Component({
  selector: 'app-doctor-dropdown',
  templateUrl: './doctor-dropdown.component.html',
  styleUrls: ['./doctor-dropdown.component.scss'],
})
export class DoctorDropdownComponent {
  doctors: Doctor[] = [];
  schedules: Schedule[] = [];
  selectedDoctorId: number | undefined;
  selectedScheduleId: number|undefined

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.patientService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Error fetching doctors', error);
      },
    });
  }

  onDoctorChange(): void {
    if (this.selectedDoctorId) {
      this.patientService.getDoctorSchedule(this.selectedDoctorId).subscribe({
        next: (responce) => {


          this.schedules = responce;

          console.log(this.schedules)
         
        },
        error: (error) => {
          console.error('Error fetching doctor schedules', error);
        },
      });
    }
  }


  
  onScheduleChange(): void {
    if (this.selectedScheduleId) {
      // Ваш код здесь, например:
      console.log('Selected schedule ID:', this.selectedScheduleId);
      // Возможно тебе нужно как-то обработать selectedScheduleId, возможно,
      // отправлять его на сервер или что-то ещё.
    }
  }


}
