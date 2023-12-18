import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/shared/interfaces';
import { PatientService } from 'src/app/shared/services/patient.service';
declare var createGoogleEvent:any;

@Component({
  selector: 'app-patient-dashboaed-appointment',
  templateUrl: './patient-dashboaed-appointment.component.html',
  styleUrls: ['./patient-dashboaed-appointment.component.scss']
})
export class PatientDashboaedAppointmentComponent implements OnInit{
  addNotif(appointment: Appointment) {
    if (typeof createGoogleEvent === 'function') {
      console.log(appointment)
      createGoogleEvent(appointment);
    } else {
      console.error(typeof createGoogleEvent);
    }
  }

  appointments: Appointment[] = [];

  


  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.patientService.getAppointments().subscribe(

      responce => { 
        this.appointments = responce.appointments; 
        console.log(this.appointments);
      },
      error => {
        console.error('Error fetching appointments', error);
      }
    );
  }


  deleteAppointment(appointmentId: string): void {
    if(confirm('Вы уверены, что хотите удалить эту запись?')) {
      this.patientService.deleteAppointment(appointmentId).subscribe({
        next: () => {
          console.log('Запись успешно удалена');
          this.loadAppointments(); 
        },
        error: (error) => {
          console.error('Ошибка при удалении записи', error);
        }
      });
    }
  }
}


