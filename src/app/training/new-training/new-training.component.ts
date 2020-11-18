import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { UiService } from '../../shared/ui.service';
import { Exercise } from '../exercise.model';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer'; // to get the type import correctly

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  // @Output() trainingStart = new EventEmitter<void>();
  // exercises: Exercise[];
  exercises$: Observable<Exercise[]>;
  // private exerciseSubscription: Subscription;
  // private loadingSubs: Subscription;

  // isLoading = true;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises();
    // this.db.collection('availableExercises').valueChanges()
    // .subscribe(result => { console.log(result) })
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    // this.exerciseSubscription = this.trainingService.exercisesChanged
    // .subscribe( 
    //   exercises => {
    //     this.exercises = exercises
    //   });
     this.fetchExercises();
  }


  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onstartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    // if(this.exerciseSubscription) {
    //    this.exerciseSubscription.unsubscribe();
    // }
    // if(this.loadingSubs) {
    //     this.loadingSubs.unsubscribe();
    // }
  }

}