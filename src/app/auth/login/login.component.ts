import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { UiService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // isLoading = false;
  isLoading$: Observable<boolean>;
  // private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private store: Store<fromRoot.State>) { }

  ngOnInit() {
    // emits the ui object property and get directly the isLoading property instead
    // this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading));
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
 
    // this.store.subscribe(
    //   data => console.log(data)
    // )
    // this.loadingSubs = this.uiService.loadingStateChanged
    // .subscribe(
    //   (isLoadingState: boolean) => {
    //     this.isLoading = isLoadingState
    //   }
    // )

  }

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
    console.log('Logged in', form.value.email);
  }

  // ngOnDestroy() {
  //     if(this.loadingSubs) {
  //         this.loadingSubs.unsubscribe();
  //     }
  // }

}