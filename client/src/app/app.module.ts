import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { PatientDashboardPageComponent } from './patient-dashboard-page/patient-dashboard-page.component';
import { DoctorDashboardPageComponent } from './doctor-dashboard-page/doctor-dashboard-page.component';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { PatientDashboaedSidebarComponent } from './patient-dashboard-page/components/patient-dashboaed-sidebar/patient-dashboaed-sidebar.component';
import { PatientDashboaedAppointmentComponent } from './patient-dashboard-page/components/patient-dashboaed-appointment/patient-dashboaed-appointment.component';
import { CustomTimePipe } from './shared/pipes/custom-time.pipe';
import { PatientAppointmentaddPageComponent } from './patient-appointmentadd-page/patient-appointmentadd-page.component';
import { DoctorDropdownComponent } from './patient-appointmentadd-page/components/doctor-dropdown/doctor-dropdown.component';
import { PatientReceiptsPageComponent } from './patient-receipts-page/patient-receipts-page.component';
import { PatientDashboardReceiptsComponent } from './patient-dashboard-page/components/patient-dashboard-receipts/patient-dashboard-receipts.component';
import { AdminDashboardSidebarComponent } from './admin-dashboard-page/components/admin-dashboard-sidebar/admin-dashboard-sidebar.component';
import { AdminDashboardDoctorsComponent } from './admin-dashboard-page/components/admin-dashboard-doctors/admin-dashboard-doctors.component';
import { AdminDoctorCreatePageComponent } from './admin-doctor-create-page/admin-doctor-create-page.component';
import { AdminDashboardDoctorsCreateFormComponent } from './admin-dashboard-page/components/admin-dashboard-doctors-create-form/admin-dashboard-doctors-create-form.component';
import { AdminDashboardDoctorsEditFormComponent } from './admin-dashboard-page/components/admin-dashboard-doctors-edit-form/admin-dashboard-doctors-edit-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminDashboardSchedulesComponent } from './admin-dashboard-page/components/admin-dashboard-schedules/admin-dashboard-schedules.component';
import { AdminDoctorSchedulesPageComponent } from './admin-doctor-schedules-page/admin-doctor-schedules-page.component';
import { AdminDashboardDoctorsCreateScheduleFormComponent } from './admin-dashboard-page/components/admin-dashboard-doctors-create-schedule-form/admin-dashboard-doctors-create-schedule-form.component';
import { DoctorDashboardSidebarComponent } from './doctor-dashboard-page/components/doctor-dashboard-sidebar/doctor-dashboard-sidebar.component';
import { DoctorDashboardSchedulesComponent } from './doctor-dashboard-page/components/doctor-dashboard-schedules/doctor-dashboard-schedules.component';
import { DoctorDashboardPatientMedcardComponent } from './doctor-dashboard-page/components/doctor-dashboard-patient-medcard/doctor-dashboard-patient-medcard.component';
import { DoctorPatientListPageComponent } from './doctor-patient-list-page/doctor-patient-list-page.component';
import { DoctorDashboardPatientListComponent } from './doctor-dashboard-page/components/doctor-dashboard-patient-list/doctor-dashboard-patient-list.component';
import { DoctorDashboardCreateReceiptComponent } from './doctor-dashboard-page/components/doctor-dashboard-create-receipt/doctor-dashboard-create-receipt.component';
import { ConfirmDialogComponent } from './shared/modal/confim-logout/confim-logout.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    PatientDashboardPageComponent,
    DoctorDashboardPageComponent,
    AdminDashboardPageComponent,
    PatientDashboaedSidebarComponent,
    PatientDashboaedAppointmentComponent,
    CustomTimePipe,
    PatientAppointmentaddPageComponent,
    DoctorDropdownComponent,
    PatientReceiptsPageComponent,
    PatientDashboardReceiptsComponent,
    AdminDashboardSidebarComponent,
    AdminDashboardDoctorsComponent,
    AdminDoctorCreatePageComponent,
    AdminDashboardDoctorsCreateFormComponent,
    AdminDashboardDoctorsEditFormComponent,
    AdminDashboardSchedulesComponent,
    AdminDoctorSchedulesPageComponent,
    AdminDashboardDoctorsCreateScheduleFormComponent,
    DoctorDashboardSidebarComponent,
    DoctorDashboardSchedulesComponent,
    DoctorDashboardPatientMedcardComponent,
    DoctorPatientListPageComponent,
    DoctorDashboardPatientListComponent,
    DoctorDashboardCreateReceiptComponent,
    ConfirmDialogComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    multi:true,
    useClass:TokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
