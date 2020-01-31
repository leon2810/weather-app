import { createAction, props } from '@ngrx/store';
import { Weather, Favorite } from './weather.model';


export const SET_WEATHER = '[Weather] SetCurrent';
export const GET_CURRENT = '[Weather] GetCurrent';
export const ADD_FAVORITE = '[Weather] ADD_FAVORITE';
export const REMOVE_FAVORITE = '[Weather] REMOVE_FAVORITE';
export const SET_CURRENT_LOCATION = '[Weather] Set Current Location';
export const GET_CURRENT_LOCATION = '[Weather] Get Current Location';

export const SetcurrentWeather = createAction(SET_WEATHER, props<{ weather: Weather; }>());
export const GetcurrentWeather = createAction(GET_CURRENT);
export const AddtWeatherToFavorites = createAction(ADD_FAVORITE, props<Favorite>());
export const RemoveWeatherFromFavorites = createAction(REMOVE_FAVORITE, props<{ key: number; }>());
export const SetcurrentLocation = createAction(SET_CURRENT_LOCATION, props<{key:number,name?:string}>());
export const GetCurrentLocation = createAction(GET_CURRENT_LOCATION);
