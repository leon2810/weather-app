import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger, MatOptionSelectionChange } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import Weatherserviceservice = require("../../service/weather-service.service");
import WeatherService = Weatherserviceservice.WeatherService;

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  lookupCtrl = new FormControl();
  filteredItems: any;
  isLoading = false;
  _value: any;
  _searchTerm: any;
  _transformedUrl: string;
  private _validator: BehaviorSubject<any>;
  private _query: BehaviorSubject<any> = new BehaviorSubject(null);


  @ViewChild(MatAutocomplete, {
    read: MatAutocomplete, static: true
  }) matAutocomplete: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger, {
    read: MatAutocompleteTrigger, static: true
  }) matAutocompleteTrigger: MatAutocompleteTrigger;



  constructor(private weatherService: WeatherService) { }

  @Input()
  readOnly: false;

  @Input() value: any;
  //get value() {
  //  return this._value
  //}

  //set value(val) {
  //  this._value = {id : 1 , name:val}
  //  this.lookupCtrl.setValue(val);
  //}

  @Input()
  url: string;

  @Output()
  questionChange = new EventEmitter<any>();

  @Input()
  searchTerm: string;

  @Output()
  answerChanged = new EventEmitter<any>();

  @Input()
  placeHolder: string;

  @Input()
  parentForm: FormGroup;


  optionSelectionChange(option: any, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      var answer = { key: option.Key, name: option.LocalizedName };
      //this._question.answer = answer;
      //this._tempAnswer = answer;
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

  validate(event) {
    this._validator.next(event);
  }


  ngOnInit() {
    this._searchTerm = this.searchTerm;
    
    this._validator = new BehaviorSubject(null);
    //this._query = new BehaviorSubject(null);

    this._validator.pipe(debounceTime(1000))
      .subscribe(data => {
        //if (this._question.answer == null || this._question.answer.value == null) {
        //  this.lookupCtrl.setValue(null);
        //}


      });

    this._query.pipe(
      debounceTime(1000),
      tap(() => {
        this.filteredItems = [];
      }),
      switchMap(value => {
        if (value == null || value == "") {
          return of(null);
        }
        this.isLoading = true;
        return this.weatherService.getLocations(this._searchTerm)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            })
          );
      }
      )
    )
      .subscribe(data => {
        if (data != null) {
          this.filteredItems = data;
        }
        else if (this.value) {

          var answer = { id: this.value.id, name: this.value.name };
          this.filteredItems.push(answer);
          //this.matAutocompleteTrigger.autocomplete.options.toArray()
          this.lookupCtrl.setValue(answer);
          //this._searchTerm = this.value;
        }

      });


    this.lookupCtrl.valueChanges.subscribe(data => {
      this._searchTerm = data;
      if (data == null || data === "" || typeof data === 'object') {
        return;
      }

      this._query.next(data);
    });

    this.lookupCtrl.setValue(this._searchTerm);
  }
}
