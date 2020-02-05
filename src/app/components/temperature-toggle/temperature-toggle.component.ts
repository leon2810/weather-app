import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { Observable, iif, of, Subscription } from 'rxjs';
import { flatMap, switchMap, map, mergeMap, tap, take, takeLast } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Tempereture } from '../../state/weather.model';
import { SetTempType } from '../../state/weather.actions';
import { debug } from 'util';


@Component({
  selector: 'app-temperature-toggle',
  templateUrl: './temperature-toggle.component.html',
  styleUrls: ['./temperature-toggle.component.scss'],
  animations: [
    trigger('zoomIn', [
      state('initial', style({
        transform: 'scale(1)'
      })),
      state('final', style({
        transform: 'scale(1.5)'
      })),
      state('void', style({
        transform: 'scale(1)'
      })),
      transition('void => *', animate('2s')),
      transition('final=>initial', animate('1000ms')),
      transition('initial=>final', animate('1000ms'))
    ]),
  ]
})
export class TemperatureToggleComponent implements OnInit, OnDestroy {

  temperature$: Observable<Tempereture>
  Tempereture = Tempereture;
  subsribtion: Subscription
  currentState: string = "final";

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.temperature$ = this.store.select("tempType");
    this.triggerAnimation()
  }

  tempChanged(event) {
    this.temperature$ = this.temperature$.pipe(take(1), tap(x => {
      x == Tempereture.Celceuse ?
        this.store.dispatch(SetTempType({ key: Tempereture.Fur })) :
        this.store.dispatch(SetTempType({ key: Tempereture.Celceuse }))
    }))

    this.currentState = 'final';
    this.triggerAnimation();
  }

  triggerAnimation() {
    setTimeout(function () {
      this.currentState = "initial";
    }.bind(this), 1000)
  }

  ngOnDestroy(): void {
    this.subsribtion.unsubscribe()
  }
}
