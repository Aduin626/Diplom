import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription;

  constructor(private auth: AuthService, private router: Router) {}
  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe();
  }
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
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\+?\d{10,15}$/) // Регулярное выражение для проверки телефона
      ]),
      birthday: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      snils: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{3}-\d{3}-\d{3} \d{2}$/) // Регулярное выражение для проверки СНИЛС
      ])
    });
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registred: true,
          },
        });
      },
      (error) => {
        console.warn(error);
        this.form.enable();
      }
    );
  }
}
