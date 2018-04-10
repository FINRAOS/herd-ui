/*
* Copyright 2018 herd-ui contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {RegistrationDateRangeFilter} from '@herd/angular-client';

@Component({
  selector: 'sd-registration-date-range-filter',
  templateUrl: './registration-date-range-filter.component.html',
  styleUrls: ['./registration-date-range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationDateRangeFilterComponent implements OnInit, OnChanges {
  @Input() filter: RegistrationDateRangeFilter;
  @Output() filterChange = new EventEmitter<RegistrationDateRangeFilter>();
  @Output() filterDeleted = new EventEmitter<RegistrationDateRangeFilter>();
  showValidation = false;
  showContent = true;
  titlePrefix = 'Registration date:';
  title = '';
  RegistrationDateRangeFilterForm: FormGroup;

  get filterAsFormValues() {
    if (this.filter) {
      return {
        startRegistrationDate: this.filter.startRegistrationDate || '',
        endRegistrationDate: this.filter.endRegistrationDate || ''
      };
    } else {
      return {
        startRegistrationDate: '',
        endRegistrationDate: ''
      };
    }
  }

  constructor(private fb: FormBuilder) {
    this.RegistrationDateRangeFilterForm = this.fb.group({startRegistrationDate: '', endRegistrationDate: ''},
      {validator: this.registrationDateRangeValidation});
  }

  ngOnInit() {
    this.setTitle();
    if (this.filter) {
      this.RegistrationDateRangeFilterForm.setValue(this.filterAsFormValues);
    } else {
      this.filter = {};
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && !changes['filter'].firstChange) {
      this.filter = changes['filter'].currentValue;
      // this.RegistrationDateRangeFilterForm.reset(this.filterAsFormValues);
    } else {
      this.filter = {};
      this.clear();
    }

    this.setTitle();
  }

  clear() {
    this.RegistrationDateRangeFilterForm.reset({startRegistrationDate: '', endRegistrationDate: ''});
  }

  delete() {
    this.filterDeleted.emit(this.filter);
  }

  cancel() {
    this.RegistrationDateRangeFilterForm.reset(this.filterAsFormValues);
    this.close();
  }

  apply() {
    this.RegistrationDateRangeFilterForm.updateValueAndValidity();
    if (!this.RegistrationDateRangeFilterForm.errors) {

    this.filter.startRegistrationDate = this.RegistrationDateRangeFilterForm.value.startRegistrationDate != null
      ? this.jsonToDate(this.RegistrationDateRangeFilterForm.value.startRegistrationDate) : null;

    this.filter.endRegistrationDate = this.RegistrationDateRangeFilterForm.value.endRegistrationDate != null
      ? this.jsonToDate(this.RegistrationDateRangeFilterForm.value.endRegistrationDate) : null;

    this.setTitle();
    this.filterChange.emit(this.filter);
    this.close();
    }
  }

  close() {
    this.showContent = false;
  }

  registrationDateRangeValidation(fg: FormGroup):  ValidationErrors {
    fg.markAsUntouched();
    let retval: ValidationErrors = null;
    const startRegistrationDateCtrl = fg.controls['startRegistrationDate'];
    const endRegistrationDateCtrl = fg.controls['endRegistrationDate'];
    if (!startRegistrationDateCtrl.value && !endRegistrationDateCtrl.value) {
      retval = {...retval, valueRequired: 'At least start or end date is required.'};
    } else if (startRegistrationDateCtrl.value && endRegistrationDateCtrl.value) {
      // jsonToDate method cannot be used here as the scope of the function is different then class.
      const startDate = new Date(startRegistrationDateCtrl.value.year,
        startRegistrationDateCtrl.value.month, startRegistrationDateCtrl.value.day);
      const endDate = new Date(endRegistrationDateCtrl.value.year, endRegistrationDateCtrl.value.month, endRegistrationDateCtrl.value.day);
      if (startDate > endDate) {
        retval = {...retval, valueRequired: 'End date need to be higher then start date'};
      }
    }
    return retval;
  }

  private setTitle() {
    let tempTitle = '';
    if (this.filter) {
      if (this.filter.startRegistrationDate != null) {
        tempTitle += this.dateString(this.filter.startRegistrationDate)
      }
      if (this.filter.endRegistrationDate != null) {
        tempTitle += '<>' + this.dateString(this.filter.endRegistrationDate)
      }
    }
    this.title = this.titlePrefix + (tempTitle ? ' ' + tempTitle : tempTitle);
  }

  private jsonToDate(dateObj: any): Date {
    return new Date(dateObj.year, dateObj.month, dateObj.day)
  }

  private dateString(dateObj: any): string {
    return [dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDay()].join('-')
  }
}
