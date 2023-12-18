import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor, ScheduleData, TimeInterval } from 'src/app/shared/interfaces';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-admin-dashboard-doctors-create-schedule-form',
  templateUrl: './admin-dashboard-doctors-create-schedule-form.component.html',
  styleUrls: ['./admin-dashboard-doctors-create-schedule-form.component.scss'],
})
export class AdminDashboardDoctorsCreateScheduleFormComponent {
  doctorId: number = 0;
  doctorName: string = ''; // Имя врача для отображения
  scheduleData = {
    date: '',
    startTimes: [''], // Массив начальных времен
    endTimes: [''], // Массив конечных времен
  };

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDoctorInfo(this.doctorId);
  }

  loadDoctorInfo(doctorId: number) {
    this.adminService.getDoctorById(doctorId).subscribe({
      next: (doctor) => {
        this.doctorName = doctor.name;
        // Здесь можно дополнительно обработать остальные данные врача, если они вам нужны
      },
      error: (error) => {
        console.error('Error fetching doctor info', error);
        // Обработка ошибок, например, отображение сообщения об ошибке
      },
    });
  }
  addTimeInterval() {
    this.scheduleData.startTimes.push(''); // Добавление пустого начального времени
    this.scheduleData.endTimes.push(''); // Добавление пустого конечного времени
  }

  onSubmit() {
    const scheduleDataToSend = {
      doctorId: this.doctorId,
      date: this.scheduleData.date,
      startTimes: this.scheduleData.startTimes,
      endTimes: this.scheduleData.endTimes,
    };

    this.adminService.createSchedule(scheduleDataToSend).subscribe({
      next: (response) => {
        console.log('Расписание успешно создано', response);
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        console.error('Ошибка при создании расписания', error);
      },
    });
  }
}
