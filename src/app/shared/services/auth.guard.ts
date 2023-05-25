import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {DashboardService} from '../../dashboard/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private dashboardService: DashboardService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var isAuthenticated = this.dashboardService.isLoggedIn();
    if(!isAuthenticated){
      this.router.navigate(['/']);
    }
    return isAuthenticated;
  }

}
