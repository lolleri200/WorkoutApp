import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { StoreModule } from '@ngrx/store';
// import { appReducer } from './app.reducer';
import { reducers } from './app.reducer';


import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { TrainingModule } from './training/training.module';


import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';


import { AuthService } from './auth/auth.service';
import { TrainingService } from './training/training.service';
import { UiService } from './shared/ui.service';


@NgModule({
  imports:      [ 
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    AngularFirestoreModule,
    AuthModule,
    TrainingModule,
    StoreModule.forRoot(reducers)
  ],
  declarations: [ 
    AppComponent, 
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
     ],
  bootstrap:    [ AppComponent ],
  providers: [ AuthService, TrainingService, UiService ]
})
export class AppModule { }
