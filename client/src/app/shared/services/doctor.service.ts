import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Medcard, Patient, Receipt, ReceiptDoctor, Schedule } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSchedule(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>('/api/doctor/schedule', {
      headers: this.getHeaders(),
    });
  }

  getMedcard(patientId: number): Observable<Medcard> {
    return this.http.get<Medcard>(`/api/doctor/medcard/${patientId}`, {
      headers: this.getHeaders(),
    });
  }
  getPatient(): Observable<Patient[]> {
    return this.http.get<Patient[]>('/api/doctor/patients', {
      headers: this.getHeaders(),
    });
  }

  createReceipt(receiptData: ReceiptDoctor): Observable<any> {
    return this.http.post('/api/doctor/receipts', receiptData);
  }
  getAvailableMedications(): Observable<any> {
    return this.http.get('/api/doctor/available-medications');
  }
}
