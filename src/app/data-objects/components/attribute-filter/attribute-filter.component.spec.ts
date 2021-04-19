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

import { AttributeFilterComponent } from './attribute-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterTemplateComponent } from 'app/data-objects/components/filter-template/filter-template.component';
import { EllipsisOverflowComponent } from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('AttributeFilterComponent', () => {
  let component: AttributeFilterComponent;
  let fixture: ComponentFixture<AttributeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, ReactiveFormsModule],
      declarations: [AttributeFilterComponent,
        FilterTemplateComponent,
        EllipsisOverflowComponent],
      providers: [FormBuilder]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeFilterComponent);
    component = fixture.componentInstance;
  });

  it('should be created with default form values', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.attributeFilterForm.get('name')).toBeDefined();
    expect(component.attributeFilterForm.get('name').value).toBe('');
    expect(component.attributeFilterForm.get('value')).toBeDefined();
    expect(component.attributeFilterForm.get('value').value).toBe('');
  });

  it('should properly init title and form when no filter is passed', () => {
    fixture.detectChanges();
    expect(component.filter).toEqual({});
    expect(component.title).toEqual('Attribute: ');
    // these should not have changed
    expect(component.attributeFilterForm.get('name').value).toBe('');
    expect(component.attributeFilterForm.get('value').value).toBe('');
  });

  it('should properly init title and form when filter is passed', () => {
    component.filter = {attributeName: 'testName', attributeValue: 'testValue'};
    fixture.detectChanges();
    expect(component.filter).toEqual({attributeName: 'testName', attributeValue: 'testValue'});
    expect(component.title).toEqual('Attribute: Name: testName - Value: testValue');
    // these should now be the new values
    expect(component.attributeFilterForm.get('name').value).toBe('testName');
    expect(component.attributeFilterForm.get('value').value).toBe('testValue');
  });

  it('should set showContent to false when close is called', () => {
    fixture.detectChanges();
    component.close();
    expect(component.showContent).toBe(false);
  });

  it('should validate if both are missing in form group and return proper error', () => {
    fixture.detectChanges();
    // form with no name is invalid
    expect(component.attributeFormValidator(component.attributeFilterForm))
      .toEqual({'atLeastOneRequired': 'Must supply at least a name or a value.'});

    // form with just name is valid.
    component.attributeFilterForm.get('name').setValue('testName');
    expect(component.attributeFormValidator(component.attributeFilterForm))
      .toEqual(null);

    // form with just value is valid.
    component.attributeFilterForm.get('name').setValue('');
    component.attributeFilterForm.get('value').setValue('testValue');
    expect(component.attributeFormValidator(component.attributeFilterForm))
      .toEqual(null);
  });

  it('should clear form when clear() is called', () => {
    component.filter = {attributeName: 'testName', attributeValue: 'testValue'};
    fixture.detectChanges();
    spyOn(component.attributeFilterForm, 'reset').and.callThrough();

    component.clear();

    expect(component.attributeFilterForm.reset).toHaveBeenCalledWith({name: '', value: ''});
    expect(component.attributeFilterForm.get('name').value).toBe('');
    expect(component.attributeFilterForm.get('value').value).toBe('');
  });

  it('should reset form to values from init and close when cancel() is called', () => {
    component.filter = {attributeName: 'testName', attributeValue: 'testValue'};
    fixture.detectChanges();
    spyOn(component.attributeFilterForm, 'reset').and.callThrough();
    spyOn(component, 'close').and.callThrough();

    component.attributeFilterForm.get('name').setValue('testSuperName');
    component.attributeFilterForm.get('value').setValue('testSupertValue');

    component.cancel();

    expect(component.close).toHaveBeenCalled();
    expect(component.attributeFilterForm.reset).toHaveBeenCalledWith({
      name: component.filter.attributeName,
      value: component.filter.attributeValue
    });
    expect(component.attributeFilterForm.get('name').value).toBe('testName');
    expect(component.attributeFilterForm.get('value').value).toBe('testValue');
    expect(component.filter.attributeName).toBe('testName');
    expect(component.filter.attributeValue).toBe('testValue');
  });

  it('should emit filter on delete call from output of filterDeleted', () => {
    component.filter = {attributeName: 'testName', attributeValue: 'testValue'};
    fixture.detectChanges();

    spyOn(component.filterDeleted, 'emit').and.callThrough();

    component.filterDeleted.subscribe((filter) => {
      expect(filter).toBe(component.filter);
    });

    component.delete();
    expect(component.filterDeleted.emit).toHaveBeenCalledWith(component.filter);
  });

  // looking at this test in the browser since it is set to an async test
  // you can see the validator.  Since other tests are not set to async you won't be able
  // to see the validation message but it still touches all the needed code.
  it('should apply values properly on apply()', async(() => {
    fixture.detectChanges();
    spyOn(component.attributeFilterForm, 'updateValueAndValidity').and.callThrough();
    spyOn(component.attributeFilterForm, 'markAsTouched').and.callThrough();
    spyOn(component, 'close').and.callThrough();
    spyOn(component.filterChange, 'emit').and.callThrough();

    component.filterChange.subscribe((filter) => {
      expect(filter).toBe(component.filter);
    });

    // form is not valid should simply call markAsTouched() to allow ui to update
    // error values
    component.apply();
    fixture.detectChanges();
    expect(component.attributeFilterForm.updateValueAndValidity).toHaveBeenCalled();
    expect(component.attributeFilterForm.markAsTouched).toHaveBeenCalled();
    expect(component.close).not.toHaveBeenCalled();
    expect(component.filterChange.emit).not.toHaveBeenCalled();
    (component.attributeFilterForm.updateValueAndValidity as jasmine.Spy).calls.reset();
    (component.attributeFilterForm.markAsTouched as jasmine.Spy).calls.reset();
    (component.close as jasmine.Spy).calls.reset();
    (component.filterChange.emit as jasmine.Spy).calls.reset();

    expect(component.title).toBe('Attribute: ');

    component.attributeFilterForm.get('name').setValue('testName');
    component.apply();
    expect(component.attributeFilterForm.updateValueAndValidity).toHaveBeenCalled();
    expect(component.attributeFilterForm.markAsTouched).not.toHaveBeenCalled();
    expect(component.close).toHaveBeenCalled();
    expect(component.filterChange.emit).toHaveBeenCalledWith(component.filter);
    expect(component.filter.attributeName).toBe('testName');
    expect(component.filter.attributeValue).toBe('');
    expect(component.title).toBe('Attribute: Name: testName');
    (component.attributeFilterForm.updateValueAndValidity as jasmine.Spy).calls.reset();
    (component.attributeFilterForm.markAsTouched as jasmine.Spy).calls.reset();
    (component.close as jasmine.Spy).calls.reset();
    (component.filterChange.emit as jasmine.Spy).calls.reset();

    component.attributeFilterForm.get('name').setValue('testName');
    component.attributeFilterForm.get('value').setValue('testValue');
    component.apply();
    expect(component.attributeFilterForm.updateValueAndValidity).toHaveBeenCalled();
    expect(component.attributeFilterForm.markAsTouched).not.toHaveBeenCalled();
    expect(component.close).toHaveBeenCalled();
    expect(component.filterChange.emit).toHaveBeenCalledWith(component.filter);
    expect(component.filter.attributeName).toBe('testName');
    expect(component.filter.attributeValue).toBe('testValue');
    expect(component.title).toBe('Attribute: Name: testName - Value: testValue');
    (component.attributeFilterForm.updateValueAndValidity as jasmine.Spy).calls.reset();
    (component.attributeFilterForm.markAsTouched as jasmine.Spy).calls.reset();
    (component.close as jasmine.Spy).calls.reset();
    (component.filterChange.emit as jasmine.Spy).calls.reset();

    component.attributeFilterForm.get('name').setValue('');
    component.attributeFilterForm.get('value').setValue('testValue');
    component.apply();
    expect(component.attributeFilterForm.updateValueAndValidity).toHaveBeenCalled();
    expect(component.attributeFilterForm.markAsTouched).not.toHaveBeenCalled();
    expect(component.close).toHaveBeenCalled();
    expect(component.filterChange.emit).toHaveBeenCalledWith(component.filter);
    expect(component.filter.attributeName).toBe('');
    expect(component.filter.attributeValue).toBe('testValue');
    expect(component.title).toBe('Attribute: Value: testValue');
    (component.attributeFilterForm.updateValueAndValidity as jasmine.Spy).calls.reset();
    (component.attributeFilterForm.markAsTouched as jasmine.Spy).calls.reset();
    (component.close as jasmine.Spy).calls.reset();
    (component.filterChange.emit as jasmine.Spy).calls.reset();
  }));

  it('should init title properly with empty filter', () => {
    component.filter = {};
    fixture.detectChanges();

    expect(component.title).toBe('Attribute: ');
  });

});
