import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthRoleGuard } from './shared/classes/authRole.quard';
import { PatientDashboardPageComponent } from './patient-dashboard-page/patient-dashboard-page.component';
import { DoctorDashboardPageComponent } from './doctor-dashboard-page/doctor-dashboard-page.component';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { PatientAppointmentaddPageComponent } from './patient-appointmentadd-page/patient-appointmentadd-page.component';
import { PatientReceiptsPageComponent } from './patient-receipts-page/patient-receipts-page.component';
import { AdminDoctorCreatePageComponent } from './admin-doctor-create-page/admin-doctor-create-page.component';
import { AdminDashboardDoctorsEditFormComponent } from './admin-dashboard-page/components/admin-dashboard-doctors-edit-form/admin-dashboard-doctors-edit-form.component';
import { AdminDashboardSchedulesComponent } from './admin-dashboard-page/components/admin-dashboard-schedules/admin-dashboard-schedules.component';
import { AdminDoctorSchedulesPageComponent } from './admin-doctor-schedules-page/admin-doctor-schedules-page.component';
import { AdminDashboardDoctorsCreateScheduleFormComponent } from './admin-dashboard-page/components/admin-dashboard-doctors-create-schedule-form/admin-dashboard-doctors-create-schedule-form.component';
import { DoctorDashboardPatientMedcardComponent } from './doctor-dashboard-page/components/doctor-dashboard-patient-medcard/doctor-dashboard-patient-medcard.component';
import { DoctorPatientListPageComponent } from './doctor-patient-list-page/doctor-patient-list-page.component';
import { DoctorDashboardCreateReceiptComponent } from './doctor-dashboard-page/components/doctor-dashboard-create-receipt/doctor-dashboard-create-receipt.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
    ],
  },
  {
    path: 'patient-dashboard',
    component: PatientDashboardPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [1] },
  },

  {
    path: 'appointment-add',
    component: PatientAppointmentaddPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [1] },
  },
  {
    path: 'receipts',
    component: PatientReceiptsPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [1] },
  },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [2] }, // Только для врачей
  },
  {
    path: 'patient-medical-record/:id',
    component: DoctorDashboardPatientMedcardComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [2] }, // Только для врачей
  },
  {
    path: 'patient-list',
    component: DoctorPatientListPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [2] }, // Только для врачей
  },
  {
    path: 'create-receipt/:id',
    component: DoctorDashboardCreateReceiptComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [2] }, // Только для врачей
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [3] }, // Только для администраторов
  },

  {
    path: 'doctor-add',
    component: AdminDoctorCreatePageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [3] },
  },
  {
    path: 'edit-doctor/:id',
    component: AdminDashboardDoctorsEditFormComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [3] },
  },
  {
    path: 'createschedule/:id',
    component: AdminDashboardDoctorsCreateScheduleFormComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [3] },
  },
  {
    path: 'schedules',
    component: AdminDoctorSchedulesPageComponent,
    canActivate:[AuthRoleGuard],
    data:{roles:[3]},

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
