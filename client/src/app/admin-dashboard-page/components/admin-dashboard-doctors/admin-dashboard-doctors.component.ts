import { Component } from '@angular/core';
import { Doctor } from 'src/app/shared/interfaces';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-doctors',
  templateUrl: './admin-dashboard-doctors.component.html',
  styleUrls: ['./admin-dashboard-doctors.component.scss']
})
export class AdminDashboardDoctorsComponent {
  doctors: Doctor[] = [];

  constructor(private adminService: AdminService, private router:Router) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.adminService.getAllDoctors().subscribe(
      response => {
        this.doctors = response;
        console.log(this.doctors);
      },
      error => {
        console.error('Error fetching doctors', error);
      }
    );
  }

  deleteDoctor(doctorId: string): void {
    if(confirm('Вы уверены, что хотите удалить этого доктора?')) {
      this.adminService.deleteDoctor(doctorId).subscribe({
        next: () => {
          console.log('Доктор успешно удален');
          this.loadDoctors(); 
        },
        error: (error) => {
          console.error('Ошибка при удалении доктора', error);
        }
      });
    }
  }

  openEditForm(doctor: Doctor): void {
    this.adminService.setDoctorToEdit(doctor);

    this.router.navigate(['/edit-doctor', doctor.doctor_id]);

  }

  openScheduleForm(doctor: Doctor) {
    this.router.navigate(['/createschedule', doctor.doctor_id]);

  }

}
