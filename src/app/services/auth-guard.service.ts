import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private route: Router
  ) { }

  canActivate(): boolean {

    let authInfo = {
      autenticado: false,
    }

    let token = sessionStorage.getItem('token');

    if (token && token.length === 32) {
      authInfo.autenticado = true;
    }

    if (!authInfo.autenticado) {
      this.route.navigate(['login']);
      return;
    }

    return true;
  }

}
