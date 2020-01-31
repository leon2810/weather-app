import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  Action,
  createReducer,
  on,
  props
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Weather, Favorite } from '../state/weather.model';
import {
  GET_CURRENT,
  SET_WEATHER,
 ADD_FAVORITE, REMOVE_FAVORITE, SetcurrentWeather, GetcurrentWeather, AddtWeatherToFavorites, RemoveWeatherFromFavorites, GetCurrentLocation, SetcurrentLocation
} from '../state/weather.actions';
import { debug } from 'util';


export const favoritesInitialState = new Array<Favorite>();

const _currentWeatherReducer = createReducer(null,
  on(GetcurrentWeather, state => state),
  on(SetcurrentWeather, (state, props) => {
    state = Object.assign({}, props);
    return state;
  })
);

const _currentLocationReducer = createReducer(null,
  on(GetCurrentLocation, state => state),
  on(SetcurrentLocation, (state, props) => {
    state = Object.assign({}, props);
    return state;
  })
);

export function currentLocationReducer(state, action) {
  return _currentLocationReducer(state, action);
}

export function currentWeatherReducer(state, action) {
  return _currentWeatherReducer(state, action);
}

const _favoritesReducer = createReducer(favoritesInitialState,
  on(AddtWeatherToFavorites, (state, props) => {
    let favorites = [...state];
    favorites.push(props);
    state = favorites;
    return state;
  }),
  on(RemoveWeatherFromFavorites, (state, props) => {
    state = state.filter(x => x.key != props.key)
    return state;
  })
);

export function favoritesReducer(state, action) {
  return _favoritesReducer(state, action);
}



