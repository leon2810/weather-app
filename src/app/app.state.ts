import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  Action
} from '@ngrx/store';
import { Weather, Favorite } from './state/weather.model';



export interface AppState {
  readonly currentWeather: Weather
  readonly favorites: Array<Favorite>
  readonly currentLocation: Favorite
}

