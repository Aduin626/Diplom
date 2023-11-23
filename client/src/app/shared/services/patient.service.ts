import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Appointment, AppointmentCreationRequest, Receipt, Schedule } from '../interfaces';

@Injectable({
  
  providedIn: 'root',
})


export class PatientService {
  constructor(private http: HttpClient, private authService: AuthService) {}


  
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log(token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllDoctors(): Observable<any> {
    return this.http.get('/api/patient/doctors', {
      headers: this.getHeaders(),
    });
  }

   

  getDoctorSchedule(doctorId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`/api/patient/doctor-schedule/${doctorId}`,{
      headers: this.getHeaders(),
    });
  }

  createAppointment(appointmentData: AppointmentCreationRequest): Observable<any> {
    return this.http.post('/api/patient/appointments-add', appointmentData, {
      headers: this.getHeaders(),
    });
  }
  
  getAppointments(): Observable<{ appointments: Appointment[] }> {
    return this.http.get<{ appointments: Appointment[] }>('/api/patient/appointments', {
      headers: this.getHeaders(),
    });
  }

  deleteAppointment(appointmentId: string): Observable<any> {
    return this.http.delete(`/api/patient/appointments/${appointmentId}`, {
      headers: this.getHeaders(),
    });
  }



  updateAppointment(
    appointmentId: string,
    appointmentData:AppointmentCreationRequest
  ): Observable<any> {
    return this.http.put(
      `/api/patient/appointments/${appointmentId}`,
      appointmentData,
      { headers: this.getHeaders() }
    );
  }


  getReceipts(): Observable<{ receipts: Receipt[] }> {
    return this.http.get<{ receipts: Receipt[] }>('/api/patient/receipts', {
      headers: this.getHeaders(),
    });
  }

  deleteReceipt(receiptId: string): Observable<any> {
    return this.http.delete(`/api/patient/receipts/${receiptId}`, {
      headers: this.getHeaders(),
    });
  }
}
