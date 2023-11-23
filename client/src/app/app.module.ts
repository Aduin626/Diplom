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
    PatientDashboardReceiptsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    multi:true,
    useClass:TokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
