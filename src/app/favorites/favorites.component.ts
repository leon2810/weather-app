import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.state';
import { Store, select } from '@ngrx/store';
import { Observable, zip, from, forkJoin, of } from 'rxjs';
import { Weather, Favorite } from '../state/weather.model';
import { map, switchMap, every, combineLatest, flatMap } from 'rxjs/operators';
import { SetcurrentLocation } from '../state/weather.actions';
import { Router } from '@angular/router';
import { WeatherService } from '../service/weather-service.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy  {

  public favorites$: Observable<Array<Favorite>>;
  favorites: any[] =[];

  constructor(private store: Store<AppState>, private router: Router, private weatherService: WeatherService) { }

  ngOnInit() {
    this.favorites$ = this.store.pipe(select("favorites"))
    this.favorites$.subscribe(favorites => {
      let arrayOfWEathers = [];
      let arrayOfData = [];
      favorites.forEach(fav => {
        arrayOfWEathers.push(this.weatherService.getCurrentWeather(fav.key))
      })
      forkJoin(arrayOfWEathers).subscribe(res => {
        favorites.forEach((val, index) => arrayOfData.push({ key: val.key, name: val.name, weather: res[0][index] }))
        this.favorites = arrayOfData;
      })
      
    })
  }

  setCurrentLocation(fav: any) {
    this.store.dispatch(SetcurrentLocation({ key: fav.key }));
    this.router.navigate(['/']);
  }

  ngOnDestroy() {

  }

}
