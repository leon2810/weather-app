import { Component, OnInit, OnDestroy } from '@angular/core';


import { Store, select } from '@ngrx/store';

import { Observable, iif, forkJoin, zip, of, combineLatest } from 'rxjs';
import { SetcurrentWeather, AddtWeatherToFavorites, SetcurrentLocation, RemoveWeatherFromFavorites } from '../state/weather.actions';
import { Weather, Favorite } from '../state/weather.model';
import { WeatherService } from '../service/weather-service.service';
import { AppState } from '../app.state';
import { switchMap, flatMap, take } from 'rxjs/operators';
import { debug } from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy  {
  cityToSearch: string = "Tel Aviv";
  currentWeather: Observable<Weather>;
  currentLocation: Observable<Favorite>
  isFavorite: Observable<boolean>
  favorites$;
  forecust: any;

  ngOnInit(): void {
    this.currentLocation.subscribe(location => {
      if (location && location.key) {
        this._weatherService.getCurrentWeather(location.key).subscribe(current => {  this.store.dispatch(SetcurrentWeather(Object.assign({}, current[0], { key: location.key }))); })
        this._weatherService.getWeaklyWeather(location.key).subscribe(weekly => { this.forecust = weekly });
      }
      else {
        this._weatherService.getCurrentCity().subscribe(city => {
          this.cityToSearch = city.EnglishName;
          this._weatherService.getLocations(this.cityToSearch).subscribe(data => {
            const thisLocation = data[0];
            this.store.dispatch(SetcurrentLocation(Object.assign({}, { key: thisLocation.Key, name: city.EnglishName })));
          })
        });
      }
    })
  }



  constructor(private _weatherService: WeatherService, private store: Store<AppState>) {
    this.currentLocation = store.select("currentLocation")
    this.currentWeather = store.select("currentWeather");
    this.favorites$ = store.select("favorites");
    this.isFavorite = combineLatest(this.favorites$, this.currentLocation).pipe(flatMap(res => {
      return of(res[0].filter(x => x.key == res[1].key).length > 0)
    }))
  }

  citySelected(data) {
    this.store.dispatch(SetcurrentLocation({ key: data.Key, name: data.name }))
  }

  AddToFavorites() {
    zip(this.currentLocation, this.isFavorite).pipe(take(1)).subscribe(res => {
      !res[1] ?
        this.store.dispatch(AddtWeatherToFavorites({ key: res[0].key, name: res[0].name })) :
        this.store.dispatch(RemoveWeatherFromFavorites({ key: res[0].key }))
    })
    this.currentLocation.subscribe(location => {

    }) 
  }

  ngOnDestroy() { }
}
