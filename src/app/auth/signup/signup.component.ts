import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { UiService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
 
 maxDate;
//  isLoading = false;
 isLoading$: Observable<boolean>;
//  private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private store: Store<fromRoot.State>) {}

  ngOnInit() {
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   (isLoadingState: boolean) => {
    //     this.isLoading = isLoadingState
    //   }
    // );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

  // ngOnDestroy() {
  //   if(this.loadingSubs) {
  //      this.loadingSubs.unsubscribe();
  //   }
  // }
}
