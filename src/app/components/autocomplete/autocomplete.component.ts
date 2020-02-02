import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, catchError } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger, MatOptionSelectionChange } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import Weatherserviceservice = require("../../service/weather-service.service");
import WeatherService = Weatherserviceservice.WeatherService;
import { NotificationService } from '../../service/notification-service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  lookupCtrl = new FormControl();
  filteredItems: any;
  isLoading = false;
  _searchTerm: any;
  private _query: BehaviorSubject<any> = new BehaviorSubject(null);


  @ViewChild(MatAutocomplete, {
    read: MatAutocomplete, static: true
  }) matAutocomplete: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger, {
    read: MatAutocompleteTrigger, static: true
  }) matAutocompleteTrigger: MatAutocompleteTrigger;



  constructor(private weatherService: WeatherService, private notificationService: NotificationService) { }

  @Input()
  searchTerm: string;

  @Output()
  answerChanged = new EventEmitter<any>();

  @Input()
  placeHolder: string;


  optionSelectionChange(option: any, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      var answer = { key: option.Key, name: option.LocalizedName };
      this.lookupCtrl.setValue(answer);
      this.answerChanged.emit(option);
    }
  }


  handleEmptyInput(event: any) {
    if (event.target.value === '') {
      this._searchTerm = null;
    }
    return true;
  }

  displayFn(sector) {
    return sector ? sector.name : sector;
  }


  ngOnInit() {
    this._searchTerm = this.searchTerm;    

    this._query.pipe(
      debounceTime(1000),
      tap(() => {
        this.filteredItems = [];
      }),
      switchMap(value => {
        if (value == null || value == "") {
          return of(null);
        }
        if (new RegExp('^[a-zA-Z]$').test(value)) {
          this.isLoading = true;
          return this.weatherService.getLocations(this._searchTerm).pipe(
              finalize(() => {
                this.isLoading = false;
              }));
        }
        else {
          return throwError("search only in english");
        }
      }))
      .subscribe(data => {
        if (data != null) {
          this.filteredItems = data;
        }
      }, err => { debugger; this.notificationService.showError(err); });


    this.lookupCtrl.valueChanges.subscribe(data => {
      this._searchTerm = data;
      if (data == null || data === "" || typeof data === 'object') {
        return;
      }

      this._query.next(data);
    });

    this.lookupCtrl.setValue({ key: "", name: this._searchTerm });
  }
}
