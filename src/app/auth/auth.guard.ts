import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanLoad,
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  Route } from '@angular/router';
import  { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

// import { AuthService } from './auth.service';
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    // private authServivce: AuthService, 
    private store: Store<fromRoot.State>,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ) {
    // if(this.authServivce.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad(
    route: Route
  ) {
    // if(this.authServivce.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
    // Observable makes ongoing contract, constanly emits new values, in this case guard only runs once (finish after 1 value)
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

}