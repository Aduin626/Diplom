import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-admin-dashboard-doctors-edit-form',
  templateUrl: './admin-dashboard-doctors-edit-form.component.html',
  styleUrls: ['./admin-dashboard-doctors-edit-form.component.scss'],
})
export class AdminDashboardDoctorsEditFormComponent {
  editForm: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService, private router:Router) {
    this.editForm = this.fb.group({
      doctor_id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      specialty: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit() {
    this.adminService.doctorToEdit$.subscribe((doctor) => {
      if (doctor) {
        console.log(doctor.name)
        const [firstName, lastName,middleName ] = doctor.name.split(' ');
        this.editForm.patchValue({
          doctor_id: doctor.doctor_id,
          firstName: firstName || '', // Если имени нет, ставим пустую строку
          lastName: lastName || '', // Если фамилии нет, ставим пустую строку
          middleName: middleName || '', // Если отчества нет, ставим пустую строку
          specialty: doctor.specialty,
          email:doctor.email,
        });
      }
    });
  }
  onSubmit() {
    if (this.editForm.valid) {
      this.adminService.updateDoctor(this.editForm.value).subscribe({
        next: (response) => {
          console.log('Данные врача обновлены', response);
          this.router.navigate(['/admin-dashboard']);

        },
        error: (error) => {
          console.error('Ошибка при обновлении данных врача', error);
        }
      });
    } else {
    }
  }
 
}
