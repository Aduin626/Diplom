import { Component } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-admin-dashboard-schedules',
  templateUrl: './admin-dashboard-schedules.component.html',
  styleUrls: ['./admin-dashboard-schedules.component.scss'],
})
export class AdminDashboardSchedulesComponent {
  schedules: any[] = [];
  doctors: any[] = [];
  selectedDoctorId: number | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadSchedules();
    this.loadDoctors();
  }

  loadSchedules() {
    this.adminService.getAllSchedules().subscribe({
      next: (data) => {
        this.schedules = data.schedules;
      },
      error: (error) => {
        console.error('Error fetching schedules', error);
      },
    });
  }

  loadDoctors() {
    this.adminService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (error) => {
        console.error('Error fetching doctors', error);
      },
    });
  }

  getFilteredSchedules() {
    if (this.selectedDoctorId === null) {
      return this.schedules;
    }
    return this.schedules.filter(schedule => schedule.doctor_id === this.selectedDoctorId);
  }

  deleteSchedule(scheduleId: number) {
    // Отправка запроса на удаление
    this.adminService.deleteSchedule(scheduleId).subscribe({
      next: (response) => {
        // Обработка успешного удаления
        console.log('Талон успешно удален', response);
        // Обновление списка талонов
        this.loadSchedules();
      },
      error: (error) => {
        // Обработка ошибок удаления
        console.error('Ошибка при удалении талона', error);
      }
    });
  }
}
