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
    path:'appointment-add',
    component:PatientAppointmentaddPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [1] }, 
  },
  {
    path:'receipts',
    component:PatientReceiptsPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [1] }, 
  },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [2] } // Только для врачей
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardPageComponent,
    canActivate: [AuthRoleGuard],
    data: { roles: [3] } // Только для администраторов
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
