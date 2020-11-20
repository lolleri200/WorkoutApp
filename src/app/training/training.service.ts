import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, Subject, Subscription  } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UiService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';


@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>) { }

  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
     this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          // throw(new Error());
          // id is located outside the value object from the snapshot, 
          // using map we can combine it to manipulate an array so
          // id will be included 
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              duration: doc.payload.doc.data().duration,
              calories: doc.payload.doc.data().calories
            };
          })
        }))
      .subscribe(
        (exercises: Exercise[]) => {
          console.log(exercises);
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          // this.availableExercises = exercises;
          // this.exercisesChanged.next([ ...this.availableExercises]); 
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
          this.exercisesChanged.next(null);
  // console.log('WHAT', error);
      })
    )
      
    // return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    // console.log(this.runningExercise);
    // this.exerciseChanged.next({ ...this.runningExercise });
    this.store.dispatch(new Training.StartTraining(selectedId));


  }

  completeExercise() {

    // this.exercises.push({...this.runningExercise, date: new Date(), state: 'completed'});
  this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
    this.addDataToDatabase({
      ...ex,
      date: new Date(),
      state: 'completed'
    });
  })

    // this.addDataToDatabase({
    //   ...this.runningExercise,
    //   date: new Date(),
    //   state: 'completed'
    // });
    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
    this.store.dispatch(new Training.StopTraining());

  }

  cancelExercise(progress: number) {
  this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
  this.addDataToDatabase({
    ...ex, 
    duration: ex.duration * (progress / 100),
    calories: ex.calories * (progress / 100),
    date: new Date(), 
    state: 'cancelled'});
  });

  // this.addDataToDatabase({
  //   ...this.runningExercise, 
  //   duration: this.runningExercise.duration * (progress / 100),
  //   calories: this.runningExercise.calories * (progress / 100),
  //   date: new Date(), 
  //   state: 'cancelled'});

    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
    this.store.dispatch(new Training.StopTraining())
  }


  // getRunningExercise() {
  //   return { ...this.runningExercise} ;
  // }

  fetchCompletedOrCancelledExercises() {
    // return this.exercises.slice();
    // do not need an id - so use valuechanges
    this.fbSubs.push(
      this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe( (exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      })
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach( sub => { sub.unsubscribe(); })
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}