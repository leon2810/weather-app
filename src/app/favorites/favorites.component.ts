import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.state';
import { Store, select } from '@ngrx/store';
import { Observable, zip, from, forkJoin, of, pipe } from 'rxjs';
import { Weather, Favorite } from '../state/weather.model';
import { map, switchMap, every, combineLatest, flatMap, mergeMap } from 'rxjs/operators';
import { SetcurrentLocation } from '../state/weather.actions';
import { Router } from '@angular/router';
import { WeatherService } from '../service/weather-service.service';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy  {

  favorites$: Observable<Array<Favorite>>;
  favoritesWeather$: Observable<Array<{ Favorite,any}>>;
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
    //this.favoritesWeather$ = this.favorites$.pipe(mergeMap(x => x)).
    //  pipe(mergeMap(x => forkJoin(this.weatherService.getCurrentWeather(x.key)).pipe(map(y => ({ x, y })))))

  //  this.favoritesWeather$ = this.favorites$.pipe(mergeMap(x => x)).
  //    pipe(mergeMap(x => forkJoin(this.weatherService.getCurrentWeather(x.key)).pipe(mergeMap(x => x), map(y => ({ x, y }))))).pipe(flatMap(res => from(res)))
    //
  }

  setCurrentLocation(fav: any) {
    debugger;
    this.store.dispatch(SetcurrentLocation({ key: fav.key, name: fav.name }));
    this.router.navigate(['/']);
  }

  getImage(img: string) {
    return this.weatherService.imageUrl(img);
  }

  ngOnDestroy() {

  }

}
