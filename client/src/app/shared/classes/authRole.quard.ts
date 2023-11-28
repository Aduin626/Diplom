import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { MyTokenPayload } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthRoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { accessDenied: true } });
      return of(false);
    }

    const token = this.auth.getToken();
    if (token) {
      const decodedToken: MyTokenPayload = jwtDecode(token);
      const userRole = decodedToken.role_id;

      if (route.data['roles'] && route.data['roles'].includes(userRole)) {
        return of(true);
      }
    }

    this.router.navigate(['/']);
    return of(false);
  }

}