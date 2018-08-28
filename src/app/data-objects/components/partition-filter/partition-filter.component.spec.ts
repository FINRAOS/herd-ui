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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartitionFilterComponent } from './partition-filter.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterTemplateComponent } from 'app/data-objects/components/filter-template/filter-template.component';
import { EllipsisOverflowComponent } from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import { SimpleChange } from '@angular/core';

describe('PartitionFilterComponent', () => {
  let component: PartitionFilterComponent;
  let fixture: ComponentFixture<PartitionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot(), ReactiveFormsModule],
      declarations: [PartitionFilterComponent, FilterTemplateComponent, EllipsisOverflowComponent],
      providers: [FormBuilder]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartitionFilterComponent);
    component = fixture.componentInstance;
  });

  it('should be created with default form values', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.partitionFilterForm.get('key')).toBeDefined();
    expect(component.partitionFilterForm.get('key').value).toBe('');
    expect(component.partitionFilterForm.get('value')).toBeDefined();
    expect(component.partitionFilterForm.get('value').value).toBe('');
    expect(component.partitionFilterForm.get('min')).toBeDefined();
    expect(component.partitionFilterForm.get('min').value).toBe('');
    expect(component.partitionFilterForm.get('max')).toBeDefined();
    expect(component.partitionFilterForm.get('max').value).toBe('');
    // comparing by the function body
    expect(component.partitionFilterForm.validator.bind(null).toString()).toEqual(component.partitionFormValidator.bind(null).toString());
  });

  it('should properly init title and form when no filter is passed', () => {
    fixture.detectChanges();
    expect(component.filter).toEqual({});
    expect(component.title).toEqual('Partition:');
    // these should not have changed
    expect(component.partitionFilterForm.get('key').value).toBe('');
    expect(component.partitionFilterForm.get('value').value).toBe('');
    expect(component.partitionFilterForm.get('min').value).toBe('');
    expect(component.partitionFilterForm.get('max').value).toBe('');
  });

  it('should properly initialize when single partitionvValue exists', () => {
    component.filter = {
      partitionKey: 'testKey',
      partitionValues: ['testValue']
    }
    fixture.detectChanges();
    expect(component.title).toEqual('Partition: testKey: testValue');
    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('testKey');
    expect(component.partitionFilterForm.get('value').value).toBe('testValue');
    expect(component.partitionFilterForm.get('min').value).toBe('');
    expect(component.partitionFilterForm.get('max').value).toBe('');
  });

  it('should properly initialize when multiple partitionValues exist', () => {
    component.filter = {
      partitionKey: 'testKey2',
      partitionValues: ['testValue', 'testValue2']
    }
    fixture.detectChanges();
    expect(component.title).toEqual('Partition: testKey2: testValue,testValue2');
    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('testKey2');
    expect(component.partitionFilterForm.get('value').value).toBe('testValue,testValue2');
    expect(component.partitionFilterForm.get('min').value).toBe('');
    expect(component.partitionFilterForm.get('max').value).toBe('');
  });

  it('should properly initialize when partitionValueRange exists', () => {
    component.filter = {
      partitionKey: 'testKey2',
      partitionValueRange: {
        startPartitionValue: 'firstValue',
        endPartitionValue: 'secondValue'
      }
    }
    fixture.detectChanges();
    expect(component.title).toEqual('Partition: testKey2: firstValue - secondValue');
    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('testKey2');
    expect(component.partitionFilterForm.get('value').value).toBe('');
    expect(component.partitionFilterForm.get('min').value).toBe('firstValue');
    expect(component.partitionFilterForm.get('max').value).toBe('secondValue');
  });

  it('should properly handle value changes', () => {
    // set to default
    fixture.detectChanges();

    const firstChange = {
      partitionKey: 'testKey2',
      partitionValueRange: {
        startPartitionValue: 'firstValue',
        endPartitionValue: 'secondValue'
      }
    };

    const secondChange = {
      partitionKey: 'testKey2',
      partitionValues: ['testValue', 'testValue2']
    };

    // manually call ngOnChanges to test it otherwise you have to create
    // a test parent component to get onChanges to fire
    // changes that add partitionValueRange
    component.ngOnChanges({
      filter: new SimpleChange(undefined, firstChange, false)
    });

    expect(component.title).toEqual('Partition: testKey2: firstValue - secondValue');
    expect(component.filter).toEqual(firstChange);
    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('testKey2');
    expect(component.partitionFilterForm.get('value').value).toBe('');
    expect(component.partitionFilterForm.get('min').value).toBe('firstValue');
    expect(component.partitionFilterForm.get('max').value).toBe('secondValue');

    // chagnes that add partition value
    component.ngOnChanges({
      filter: new SimpleChange(firstChange, secondChange, false)
    });
    expect(component.title).toEqual('Partition: testKey2: testValue,testValue2');
    expect(component.filter).toEqual(secondChange);
    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('testKey2');
    expect(component.partitionFilterForm.get('value').value).toBe('testValue,testValue2');
    expect(component.partitionFilterForm.get('min').value).toBe('');
    expect(component.partitionFilterForm.get('max').value).toBe('');

    // no changes
    component.ngOnChanges({});
    expect(component.title).toEqual('Partition:');
    expect(component.filter).toEqual({});
    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('');
    expect(component.partitionFilterForm.get('value').value).toBe('');
    expect(component.partitionFilterForm.get('min').value).toBe('');
    expect(component.partitionFilterForm.get('max').value).toBe('');
  });

  it('should emit filter to be deleted', async(() => {
    component.filter = {
      partitionKey: 'testKey2',
      partitionValueRange: {
        startPartitionValue: 'firstValue',
        endPartitionValue: 'secondValue'
      }
    };

    fixture.detectChanges();

    component.filterDeleted.asObservable().subscribe((deletedFilter) => {
      expect(deletedFilter).toBe(component.filter);
    });

    component.delete();
  }));

  it('should reset form values to default on clear()', () => {
    component.filter = {
      partitionKey: 'testKey2',
      partitionValueRange: {
        startPartitionValue: 'firstValue',
        endPartitionValue: 'secondValue'
      }
    };

    fixture.detectChanges();

    component.clear();

    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('');
    expect(component.partitionFilterForm.get('value').value).toBe('');
    expect(component.partitionFilterForm.get('min').value).toBe('');
    expect(component.partitionFilterForm.get('max').value).toBe('');
  });

  it('should reset values to original filter values on cancel() and close the filter', () => {
    const closeSpy = spyOn(component, 'close');

    component.filter = {
      partitionKey: 'testKey2',
      partitionValueRange: {
        startPartitionValue: 'firstValue',
        endPartitionValue: 'secondValue'
      }
    };

    fixture.detectChanges();

    component.partitionFilterForm.get('key').setValue('testKey');
    component.partitionFilterForm.get('min').setValue('val1');
    component.partitionFilterForm.get('max').setValue('val2');

    component.cancel();

    // these should now be the new values
    expect(component.partitionFilterForm.get('key').value).toBe('testKey2');
    expect(component.partitionFilterForm.get('value').value).toBe('');
    expect(component.partitionFilterForm.get('min').value).toBe('firstValue');
    expect(component.partitionFilterForm.get('max').value).toBe('secondValue');
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
    const valTouchedKeySpy = spyOn(component.partitionFilterForm.get('key'), 'markAsTouched').and.callThrough();
    const valTouchedValSpy = spyOn(component.partitionFilterForm.get('value'), 'markAsTouched').and.callThrough();
    const valTouchedMinSpy = spyOn(component.partitionFilterForm.get('min'), 'markAsTouched').and.callThrough();
    const valTouchedMaxSpy = spyOn(component.partitionFilterForm.get('max'), 'markAsTouched').and.callThrough();
    fixture.detectChanges();

    // no fields are set so it should not emit anything
    component.apply();
    expect(filterChangeEmitSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
    // proof that setTitle was not called
    expect(component.title).toEqual(component.titlePrefix);
    // check to make sure full form is marked to revalidate
    expect(valTouchedKeySpy).toHaveBeenCalled();
    expect(valTouchedValSpy).toHaveBeenCalled();
    expect(valTouchedMinSpy).toHaveBeenCalled();
    expect(valTouchedMaxSpy).toHaveBeenCalled();
    valTouchedMaxSpy.calls.reset();
    valTouchedMinSpy.calls.reset();
    valTouchedValSpy.calls.reset();
    valTouchedKeySpy.calls.reset();

    // test for partitionValues set
    component.partitionFilterForm.get('key').setValue('testKey');
    component.partitionFilterForm.get('value').setValue('val1,val2');
    component.apply();
    expect(filterChangeEmitSpy).toHaveBeenCalledWith({
      partitionKey: 'testKey',
      partitionValues: ['val1', 'val2']
    });
    expect(valTouchedKeySpy).not.toHaveBeenCalled();
    expect(valTouchedValSpy).not.toHaveBeenCalled();
    expect(valTouchedMinSpy).not.toHaveBeenCalled();
    expect(valTouchedMaxSpy).not.toHaveBeenCalled();

    filterChangeEmitSpy.calls.reset();

    // test for min/max set
    component.partitionFilterForm.get('value').setValue('');
    component.partitionFilterForm.get('min').setValue('val1');
    component.partitionFilterForm.get('max').setValue('val2');
    component.apply();
    expect(filterChangeEmitSpy).toHaveBeenCalledWith({
      partitionKey: 'testKey',
      partitionValueRange: {
        startPartitionValue: 'val1',
        endPartitionValue: 'val2'
      }
    });

    expect(valTouchedKeySpy).not.toHaveBeenCalled();
    expect(valTouchedValSpy).not.toHaveBeenCalled();
    expect(valTouchedMinSpy).not.toHaveBeenCalled();
    expect(valTouchedMaxSpy).not.toHaveBeenCalled();
  });

  it('should return blank filter to form values when no filter exists', () => {
    fixture.detectChanges();
    component.filter = undefined;

    expect(component.filterAsFormValues).toEqual({
      min: '',
      max: '',
      key: '',
      value: ''
    });

  });

  it('should disable min/max if partitionValue is form is set and vice versa', () => {
    fixture.detectChanges();

    // all enabled at the start by default
    expect(component.partitionFilterForm.get('value').disabled).toBe(false);
    expect(component.partitionFilterForm.get('min').disabled).toBe(false);
    expect(component.partitionFilterForm.get('max').disabled).toBe(false);

    component.partitionFilterForm.get('key').setValue('testKey');
    component.partitionFilterForm.get('value').setValue('val1,val2');
    expect(component.partitionFilterForm.get('min').disabled).toBe(true);
    expect(component.partitionFilterForm.get('max').disabled).toBe(true);

    component.partitionFilterForm.get('value').setValue('');
    component.partitionFilterForm.get('min').setValue('val1');
    component.partitionFilterForm.get('max').setValue('val2');
    expect(component.partitionFilterForm.get('value').disabled).toBe(true);

    component.partitionFilterForm.get('min').setValue('');
    component.partitionFilterForm.get('max').setValue('');

    // all are again enabled when no values are set
    expect(component.partitionFilterForm.get('value').disabled).toBe(false);
    expect(component.partitionFilterForm.get('min').disabled).toBe(false);
    expect(component.partitionFilterForm.get('max').disabled).toBe(false);
  });

  it('should have proper validation', () => {
    fixture.detectChanges();
    const form = component.partitionFilterForm;
    const keyFormValue = component.partitionFilterForm.get('key');
    const pValFormValue = component.partitionFilterForm.get('value');
    const minFormValue = component.partitionFilterForm.get('min');
    const maxFormValue = component.partitionFilterForm.get('max');

    form.updateValueAndValidity();
    // no value set no key set
    let expectedErrors: any = {
      keyRequired: 'Partition Key is required.',
      valueRequired: 'Must enter a partition value set or min value max value set.'
    };
    expect(form.errors).toEqual(expectedErrors);

    // key set but only a single min or max is set
    expectedErrors = {
      fullRangeRequired: 'Min and Max values are required'
    }
    keyFormValue.setValue('testKey');
    minFormValue.setValue('minVal');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(expectedErrors);

    minFormValue.setValue('');
    maxFormValue.setValue('mVal');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(expectedErrors);

    // range incorrect
    expectedErrors = {
      rangeStartTooLarge: 'Min value must be smaller than max value.'
    }
    minFormValue.setValue('minVal');
    maxFormValue.setValue('mVal');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(expectedErrors);

    // valid form
    minFormValue.setValue('minVal');
    maxFormValue.setValue('zMaxVal');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(null);

    // valid form
    pValFormValue.setValue('testVal');
    minFormValue.setValue('');
    maxFormValue.setValue('');
    form.updateValueAndValidity();
    expect(form.errors).toEqual(null);
  });

});
