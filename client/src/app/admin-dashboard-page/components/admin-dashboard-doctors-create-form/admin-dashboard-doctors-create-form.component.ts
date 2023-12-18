import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorForm } from 'src/app/shared/interfaces';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-admin-dashboard-doctors-create-form',
  templateUrl: './admin-dashboard-doctors-create-form.component.html',
  styleUrls: ['./admin-dashboard-doctors-create-form.component.scss']
})
export class AdminDashboardDoctorsCreateFormComponent {
  form!: FormGroup;
  selectedFile: File | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      lastName: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      middleName: new FormControl(null, Validators.required),
      specialty: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.form.disable();
    this.adminService.addDoctor(this.form.value).subscribe(
      () => {
        alert('Doctor added successfully');
        this.form.reset();

      },
      error => {
        alert(error);
        this.form.enable();
      }
    );
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedFile = element.files ? element.files[0] : null;
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      alert('Пожалуйста, выберите файл.');
      return;
    }

    this.adminService.uploadDoctorsExcel(this.selectedFile).subscribe(
      response => {
        alert('Excel файл успешно загружен');
        this.form.reset();
      },
      error => {
        alert('Ошибка при загрузке Excel файла');
      }
    );
  }
}
