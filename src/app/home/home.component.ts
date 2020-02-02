import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, zip, of, combineLatest, Subscription } from 'rxjs';
import { SetcurrentWeather, AddtWeatherToFavorites, SetcurrentLocation, RemoveWeatherFromFavorites } from '../state/weather.actions';
import { Weather, Favorite } from '../state/weather.model';
import { WeatherService } from '../service/weather-service.service';
import { AppState } from '../app.state';
import { flatMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy  {
  
  cityToSearch: string = "Tel Aviv";
  currentWeather$: Observable<Weather>;
  currentLocation$: Observable<Favorite>
  isFavorite$: Observable<boolean>
  favorites$;
  forecust: any;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  ngOnInit(): void {
    debugger;
    this.currentLocation$.subscribe(location => {
      if (location && location.key) {
        this.cityToSearch = location.name;
        this._weatherService.getCurrentWeather(location.key).subscribe(current => {  this.store.dispatch(SetcurrentWeather(Object.assign({}, current[0], { key: location.key }))); })
        this._weatherService.getWeaklyWeather(location.key).subscribe(weekly => { this.forecust = weekly });
      }
      else {
        this.subscriptions.push(this._weatherService.getCurrentCity().subscribe(city => {
          this.cityToSearch = city.EnglishName;
          this.subscriptions.push(this._weatherService.getLocations(this.cityToSearch).subscribe(data => {
            const thisLocation = data[0];
            this.store.dispatch(SetcurrentLocation(Object.assign({}, { key: thisLocation.Key, name: city.EnglishName })));
          }))
        }));
      }
    })
  }



  constructor(private _weatherService: WeatherService, private store: Store<AppState>) {
    this.currentLocation$ = store.select("currentLocation")
    this.currentWeather$ = store.select("currentWeather");
    this.favorites$ = store.select("favorites");
    this.isFavorite$ = combineLatest(this.favorites$, this.currentLocation$).pipe(flatMap(res => {
      return of(res[0].filter(x => x.key == res[1].key).length > 0)
    }))
  }

  citySelected(data) {
    this.store.dispatch(SetcurrentLocation({ key: data.Key, name: data.LocalizedName }))
  }

  AddToFavorites() {
    this.subscriptions.push(zip(this.currentLocation$, this.isFavorite$).pipe(take(1)).subscribe(res => {
      !res[1] ?
        this.store.dispatch(AddtWeatherToFavorites({ key: res[0].key, name: res[0].name })) :
        this.store.dispatch(RemoveWeatherFromFavorites({ key: res[0].key }))
    }))
  }

  getImage(img: string) {
    return this._weatherService.imageUrl(img);
  }

  getImgByTime(forcast) {
    const hours = new Date().getHours()
    return hours > 6 && hours < 18 ? this.getImage(forcast.Day.Icon) : this.getImage(forcast.Night.Icon) 
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
