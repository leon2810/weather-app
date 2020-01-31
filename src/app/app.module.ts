import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { SharedModule } from './shared.module';
import { currentWeatherReducer, favoritesReducer, currentLocationReducer} from './reducers/weather.reducer';
import { HttpErrorInterceptor } from './interceptor/HttpConfigInterceptor';
import { NotificationService } from './service/NotificationService';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FavoritesComponent,
    NotFoundComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'favorites', component: FavoritesComponent },
      { path: '**', component: NotFoundComponent },
    ]),
    BrowserAnimationsModule,
    StoreModule.forRoot({
      currentWeather: currentWeatherReducer,
      favorites: favoritesReducer,
      currentLocation: currentLocationReducer
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }, NotificationService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
