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
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationDateRangeFilterComponent} from './registration-date-range-filter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FilterTemplateComponent} from '../filter-template/filter-template.component';
import {EllipsisOverflowComponent} from '../../../shared/components/ellipsis-overflow/ellipsis-overflow.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SimpleChange} from '@angular/core';

describe('RegistrationDateRangeFilterComponent', () => {
  let component: RegistrationDateRangeFilterComponent;
  let fixture: ComponentFixture<RegistrationDateRangeFilterComponent>;
  const startDate = new Date('2018-04-01');
  const endDate = new Date('2018-04-06');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        ReactiveFormsModule
      ],
      declarations: [
        FilterTemplateComponent,
        EllipsisOverflowComponent,
        RegistrationDateRangeFilterComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationDateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be created with default form values', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate')).toBeDefined();
    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate').value).toBe('');
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate')).toBeDefined();
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate').value).toBe('');
    // comparing by the function body
    expect(component.registrationDateRangeFilterForm.validator.bind(null).toString())
      .toEqual(component.registrationDateRangeValidation.bind(null).toString());
  });

  it('should properly init title and form when no filter is passed', () => {
    fixture.detectChanges();
    expect(component.filter).toEqual({});
    expect(component.title).toEqual('Registration date');
    // these should not have changed
    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate').value).toBe('');
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate').value).toBe('');
  });

  it('should properly init title and form when filter is passed', () => {
    component.filter = {
      startRegistrationDate: startDate,
      endRegistrationDate: endDate
    };

    // Manually call ngInit to set the registration date range filter value
    component.ngOnInit();

    fixture.detectChanges();
    expect(component.title).toEqual(`Registration date starts from ${startDate} and ends ${endDate}`);
    // these should not have changed
    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate').value).toBe(startDate);
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate').value).toBe(endDate);
  });

  it('should properly handle value changes', () => {
    // set to default
    fixture.detectChanges();

    const firstChange = {
      startRegistrationDate: null,
      endRegistrationDate: endDate
    };

    const secondChange = {
      startRegistrationDate: startDate,
      endRegistrationDate: endDate
    };

    // manually call ngOnChanges to test it otherwise you have to create
    // a test parent component to get onChanges to fire
    // changes that add registration date range
    component.ngOnChanges({
      filter: new SimpleChange(undefined, firstChange, false)
    });

    expect(component.title).toEqual(`Registration date ends ${endDate}`);
    expect(component.filter).toEqual(firstChange);
    // these should now be the new values

    // chagnes that add partition value
    component.ngOnChanges({
      filter: new SimpleChange(firstChange, secondChange, false)
    });
    expect(component.title).toEqual(`Registration date starts from ${startDate} and ends ${endDate}`);
    expect(component.filter).toEqual(secondChange);
    // these should now be the new values

    // no changes
    component.ngOnChanges({});
    expect(component.title).toEqual('Registration date');
    expect(component.filter).toEqual({});
    // these should now be the new values
    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate').value).toBe('');
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate').value).toBe('');
  });

  it('should emit filter to be deleted', async(() => {
    component.filter = {
      startRegistrationDate: startDate,
      endRegistrationDate: startDate
    };

    fixture.detectChanges();

    component.filterDeleted.asObservable().subscribe((deletedFilter) => {
      expect(deletedFilter).toBe(component.filter);
    });

    component.delete();
  }));

  it('should reset form values to default on clear()', () => {
    component.filter = {
      startRegistrationDate: startDate,
      endRegistrationDate: endDate
    };

    fixture.detectChanges();

    component.clear();

    // these should now be the new values
    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate').value).toBe('');
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate').value).toBe('');
  });

  it('should reset values to original filter values on cancel() and close the filter', () => {
    const closeSpy = spyOn(component, 'close');

    component.filter = {
      startRegistrationDate: startDate,
      endRegistrationDate: endDate
    };

    fixture.detectChanges();

    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate').value).toBe('');
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate').value).toBe('');

    component.cancel();

    // these should now be the new values
    expect(component.registrationDateRangeFilterForm.get('startRegistrationDate').value).toBe(startDate);
    expect(component.registrationDateRangeFilterForm.get('endRegistrationDate').value).toBe(endDate);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should hide content on close()', () => {
    fixture.detectChanges();
    expect(component.showContent).toBe(true);
    component.close();
    expect(component.showContent).toBe(false);
  });

  it('should only emit filter for apply when form is valid', () => {
    const filterChangeEmitSpy = spyOn(component.filterChange, 'emit');
    const closeSpy = spyOn(component, 'close');
    const valTouchedStartSpy = spyOn(component.registrationDateRangeFilterForm
      .get('startRegistrationDate'), 'markAsTouched').and.callThrough();
    const valTouchedEndSpy = spyOn(component.registrationDateRangeFilterForm.get('endRegistrationDate'), 'markAsTouched').and.callThrough();
    fixture.detectChanges();

    // no fields are set so it should not emit anything
    component.apply();
    expect(filterChangeEmitSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
    // proof that setTitle was not called
    expect(component.title).toEqual(component.titlePrefix);
    // check to make sure full form is marked to revalidate
    valTouchedEndSpy.calls.reset();
    valTouchedStartSpy.calls.reset();

    // test for registration date range set
    component.registrationDateRangeFilterForm.get('startRegistrationDate').setValue('2018-04-01');
    component.registrationDateRangeFilterForm.get('endRegistrationDate').setValue('2018-04-06');
    component.apply();
    expect(filterChangeEmitSpy).toHaveBeenCalledWith({
      startRegistrationDate: '2018-04-01',
      endRegistrationDate: '2018-04-06'
    });
    expect(valTouchedStartSpy).not.toHaveBeenCalled();
    expect(valTouchedEndSpy).not.toHaveBeenCalled();

    filterChangeEmitSpy.calls.reset();

    // test for min/max set
    component.registrationDateRangeFilterForm.get('startRegistrationDate').setValue('');
    component.registrationDateRangeFilterForm.get('endRegistrationDate').setValue('');
    component.apply();

    expect(valTouchedStartSpy).not.toHaveBeenCalled();
    expect(valTouchedEndSpy).not.toHaveBeenCalled();
  });

  it('should return blank filter to form values when no filter exists', () => {
    fixture.detectChanges();
    component.filter = undefined;

    expect(component.filterAsFormValues).toEqual({
      startRegistrationDate: '',
      endRegistrationDate: ''
    });

  });

  it('should have proper validation', () => {
    fixture.detectChanges();
    const form = component.registrationDateRangeFilterForm;
    const startFormValue = component.registrationDateRangeFilterForm.get('startRegistrationDate');
    const endFormValue = component.registrationDateRangeFilterForm.get('endRegistrationDate');

    form.updateValueAndValidity();
    // no value set no key set
    let expectedErrors: any = {
      valueRequired: 'Either start registration date or end registration date must be specified.'
    };
    expect(form.errors).toEqual(expectedErrors);

    // key set but only a single min or max is set
    expectedErrors = {
      valueRequired: 'The start registration date cannot be greater than the end registration date.'
    };
    startFormValue.setValue('2018-04-06');
    endFormValue.setValue('2018-04-01');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(expectedErrors);

    // valid form when only start registration date is present
    startFormValue.setValue('2018-04-01');
    endFormValue.setValue(null);
    form.updateValueAndValidity();
    expect(form.errors).toEqual(null);

    // valid form when only end registration date is present
    startFormValue.setValue(null);
    endFormValue.setValue('2018-04-06');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(null);

    // valid form both start registration date and end registration date are present
    startFormValue.setValue('2018-04-01');
    endFormValue.setValue('2018-04-06');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(null);
  });
});
