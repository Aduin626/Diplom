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
  maxBirthDate: string | undefined;
  registrationError: string | null = null; // Variable to hold registration error message

  constructor(private auth: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe();
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      lastName: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      middleName: new FormControl(null, Validators.required),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\+?\d{10,15}$/), // Регулярное выражение для проверки телефона
      ]),
      birthday: new FormControl(null, [
        Validators.required,
        this.validateBirthDate,
      ]),
      address: new FormControl(null, Validators.required),
      snils: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{3}-\d{3}-\d{3} \d{2}$/), // Регулярное выражение для проверки СНИЛС
      ]),
    });

    // Set maxBirthDate to today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // January is 0!
    const day = today.getDate();

    this.maxBirthDate = `${year}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    }`;
  }

  onSubmit() {
    this.form.disable();
    this.registrationError = null; // Clear previous error
    this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true,
          },
        });
      },
      (error) => {
        console.log(error.error.error);
        if (error && error.error && error.error.error) {
          this.registrationError = error.error.error; // Set the registration error message
        } else {
          this.registrationError = 'An error occurred during registration.';
        }
        this.form.enable();
      }
    );
  }

  validateBirthDate(control: FormControl): { [key: string]: any } | null {
    const inputDate = new Date(control.value);
    const today = new Date();

    // Check if the input date is in the future
    if (inputDate > today) {
      return { futureDate: true };
    }

    return null;
  }
}
