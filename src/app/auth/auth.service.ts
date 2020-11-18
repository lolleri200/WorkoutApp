import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AngularFireAuth } from '@angular/fire/auth';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';



@Injectable()
export class AuthService {

  // authChange = new Subject<boolean>(); //signed in or not
  // // private user: User;
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromRoot.State> ) { }


  initAuthListener() {
    this.afAuth.authState.subscribe( user => {
      if(user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true); // logged in

        this.store.dispatch(new Auth.SetAuthenticated());

        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();

        // this.isAuthenticated = false;
        // this.authChange.next(false); // logged out

        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }


  registerUser( authData: AuthData ) {
      // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
      this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email, 
      authData.password)
      .then( result => {
        console.log(result);
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
      })
      .catch( error => {
        console.log(error);
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
        // this.snackbar.open(error.message, null, {
        //   duration: 3000
        // });
        this.uiService.showSnackbar(error.message, null, 3000);
      })
  }

  login( authData: AuthData ) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // }
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());

    this.afAuth.auth
      .signInWithEmailAndPassword(
        authData.email,
        authData.password)
        .then( result => {
          console.log(result);
          // this.uiService.loadingStateChanged.next(false);
          // this.store.dispatch({type: 'STOP_LOADING'});
          this.store.dispatch(new UI.StopLoading());
      })
      .catch( error => {
        console.log(error);
          // this.uiService.loadingStateChanged.next(false);
          // this.store.dispatch({type: 'STOP_LOADING'});
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    // this.user = null;
  }

  // not needed anymore
  getUser() {
    // return { ...this.user }; //returning a brand new user instead the same object - best practice
  }

  // isAuth() {
  //   // return this.user != null;
  //   return this.isAuthenticated;
  // }

}