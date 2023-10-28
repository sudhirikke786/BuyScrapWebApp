import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
 
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data.requiredRole;

    if (this.authService.hasRoleActive(requiredRole)) {
      return true; // User has the required role
    } else {
      this.router.navigate(['/error']); // Redirect to an unauthorized page
      return false; // Prevent access
    }
  }
  
}
