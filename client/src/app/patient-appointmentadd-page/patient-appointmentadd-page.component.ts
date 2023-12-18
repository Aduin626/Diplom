import { Component, ViewChild } from '@angular/core';
import { AppointmentCreationRequest, Doctor, Schedule } from '../shared/interfaces';
import { PatientService } from '../shared/services/patient.service';
import { DoctorDropdownComponent } from './components/doctor-dropdown/doctor-dropdown.component';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-patient-appointmentadd-page',
  templateUrl: './patient-appointmentadd-page.component.html',
  styleUrls: ['./patient-appointmentadd-page.component.scss']
})
export class PatientAppointmentaddPageComponent {


constructor(private patientService: PatientService, private router:Router) {}

@ViewChild(DoctorDropdownComponent) doctorDropdownComponent!: DoctorDropdownComponent;
problemDescription: string = '';

ngOnInit(): void {


}




onSubmit(): void {
  const selectedScheduleId = this.doctorDropdownComponent.selectedScheduleId;
  const problemDescription = this.problemDescription;
  
  if (selectedScheduleId) {
    const appointmentData: AppointmentCreationRequest = {
      scheduleId: selectedScheduleId.toString(),
      problemDescription: problemDescription
    };

    this.patientService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        alert('Appointment created successfully');
        this.router.navigate(['/patient-dashboard']);

      },
      error: (error) => {
        console.error('Error creating appointment', error);
        // Обработка ошибки
      }
    });
  }
  

  
}


}






