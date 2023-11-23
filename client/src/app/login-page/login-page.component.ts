import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MyTokenPayload } from '../shared/interfaces';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        // Теперь вы можете зайти в систему используя свои данные
      } else if (params['accessDenied']) {
        // Для начала авторизуйтесь в системе
      }
    });
  }

  onSubmit() {
    this.form.disable();

    this.aSub = this.auth.login(this.form.value).subscribe(
      (response) => {
        const token = response.token;
        if (token) {
          const decodedToken: MyTokenPayload = jwtDecode(token);
          const userRole = decodedToken.role_id;
          
          switch (userRole) {
            case 1: // Пациент
              this.router.navigate(['/patient-dashboard']);
              break;
            case 2: // Врач
              this.router.navigate(['/doctor-dashboard']);
              break;
            case 3: // Админ
              this.router.navigate(['/admin-dashboard']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        }
      },
      (error) => {
        console.warn(error);
        this.form.enable();
      }
    );
  }
}