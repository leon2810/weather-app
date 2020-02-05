import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Favorite, Tempereture, Forecust } from '../../state/weather.model';
import { WeatherService } from '../../service/weather-service.service';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { ImageService } from '../../service/image-service';
import { map, switchMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-forecust',
  templateUrl: './forecust.component.html',
  styleUrls: ['./forecust.component.scss']
})
export class ForecustComponent implements OnInit {
  currentLocation$: Observable<Favorite>
  forecust$: Observable<Array<Forecust>>
  tempType$: Observable<Tempereture>

  constructor(private _weatherService: WeatherService, private store: Store<AppState>, private imageService: ImageService) {
    this.currentLocation$ = store.select("currentLocation")
  }

  ngOnInit() {  
    this.currentLocation$.subscribe(location => {
      if (location && location.key) {
        this.forecust$ =
        this._weatherService.getWeaklyWeather(location.key).pipe(switchMap(res => res.DailyForecasts)
          , map((x:any) => ({
            date: x.Date,
            minTemp: x.Temperature.Minimum.Value,
            maxTemp: x.Temperature.Maximum.Value,
            image: this.imageService.getImgByTime(x)
          })), toArray());
      }
    })
  }


  getImage(img: string) {
    return this.imageService.imageUrl(img);
  }

  getImgByTime(forcast) {
    return this.imageService.getImgByTime(forcast);
  }

}
