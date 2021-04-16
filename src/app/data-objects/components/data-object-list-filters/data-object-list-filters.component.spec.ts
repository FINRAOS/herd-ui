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

import {
  AnyFilter,
  AttributeFilter,
  DataObjectListFiltersChangeEventData,
  DataObjectListFiltersComponent,
  LatestValidVersionFilter,
  PartitionFilter,
  RegistrationFilter
} from './data-object-list-filters.component';
import { PartitionFilterComponent } from 'app/data-objects/components/partition-filter/partition-filter.component';
import { AttributeFilterComponent } from 'app/data-objects/components/attribute-filter/attribute-filter.component';
// tslint:disable-next-line:max-line-length
import { LatestValidVersionFilterComponent } from 'app/data-objects/components/latest-valid-version-filter/latest-valid-version-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterTemplateComponent } from 'app/data-objects/components/filter-template/filter-template.component';
import { EllipsisOverflowComponent } from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import { RegistrationDateRangeFilterComponent } from '../registration-date-range-filter/registration-date-range-filter.component';

describe('DataObjectListFiltersComponent', () => {
  let component: DataObjectListFiltersComponent;
  let fixture: ComponentFixture<DataObjectListFiltersComponent>;
  let spyFilterSaved: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, ReactiveFormsModule],
      declarations: [DataObjectListFiltersComponent,
        PartitionFilterComponent,
        AttributeFilterComponent,
        LatestValidVersionFilterComponent,
        RegistrationDateRangeFilterComponent,
        FilterTemplateComponent,
        EllipsisOverflowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyFilterSaved = spyOn(component, 'filterSaved');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should add proper filters on addFilter', () => {
    const expectedFilters: AnyFilter[] = [];

    // adding partition filter
    component.addFilter(component.filterTypes[0]);
    expectedFilters.push({type: 'partition', data: undefined} as PartitionFilter);
    expect(component.filters).toEqual(expectedFilters);
    // should call filter saved for partition filters on filter save of the
    // generated component
    expect(spyFilterSaved).not.toHaveBeenCalled();

    component.addFilter(component.filterTypes[1]);
    expectedFilters.push({type: 'attribute', data: undefined} as AttributeFilter);
    expect(component.filters).toEqual(expectedFilters);
    // should call filter saved for attribute filters on filter save of the
    // generated component
    expect(spyFilterSaved).not.toHaveBeenCalled();

    component.addFilter(component.filterTypes[2]);
    expectedFilters.push({type: 'lvv'} as LatestValidVersionFilter);
    expect(component.filters).toEqual(expectedFilters);
    // should call filter saved  when lastest valid version filter is added
    // as it does not have any extra changes before a save
    expect(spyFilterSaved).toHaveBeenCalled();
    // should remove latest valid version filter form selectable filters
    expect(component.filterTypes).not.toContain({
      type: 'lvv',
      displayName: 'Last Valid Version'
    });

    // Index 2 is used again as after ivv filter deleted, registration date filter will be in 2nd position.
    component.addFilter(component.filterTypes[2]);
    expectedFilters.push({type: 'registrationDate'} as RegistrationFilter);
    expect(component.filters).toEqual(expectedFilters);
    // should call filter saved  when lastest valid version filter is added
    // as it does not have any extra changes before a save
    expect(spyFilterSaved).toHaveBeenCalled();
    // should remove latest valid version filter form selectable filters
    expect(component.filterTypes).not.toContain({
      type: 'registrationDate',
      displayName: 'Registration Date'
    });
  });

  it('should delete proper filter on deleteFilter', () => {
    const expectedFilters: AnyFilter[] = [{
      type: 'partition',
      data: undefined
    }, {
      type: 'attribute',
      data: undefined
    }];

    component.addFilter(component.filterTypes[0]);
    component.addFilter(component.filterTypes[1]);
    component.addFilter(component.filterTypes[2]);

    // once lvv filter will be added, it will also be deleted from the type. so registration date will be in 2 position
    component.addFilter(component.filterTypes[2]);

    // emulate deleting lvv
    component.deleteFilter('Latest Valid Version', 2);
    // should add lvv back to filter types
    expect(component.filterTypes).toContain({
      type: 'lvv',
      displayName: 'Last Valid Version'
    });

    // emulate deleting registration date. Now registration date filter is in the 2nd position as ivv deleted
    component.deleteFilter('Registration Date', 2);
    // should add registration date back to filter types
    expect(component.filterTypes).toContain({
      type: 'registrationDate',
      displayName: 'Registration Date'
    });

    expect(component.filters).toEqual(expectedFilters);
    expect(spyFilterSaved).toHaveBeenCalled();

    // emulate deleting attribute filter
    component.deleteFilter(component.filters[1].data, 1);
    expectedFilters.splice(1, 1);
    expect(component.filters).toEqual([{
      type: 'partition',
      data: undefined
    }]);
    expect(spyFilterSaved).toHaveBeenCalled();

    // emulate deleting attribute filter
    component.deleteFilter(component.filters[0].data, 0);
    expect(component.filters).toEqual([]);
    expect(spyFilterSaved).toHaveBeenCalled();
  });

  it('should emit proper event data on filterSaved', () => {
    spyFilterSaved.and.callThrough();
    const startDate = new Date();
    const endDate = new Date();
    const emitSpy = spyOn(component.filtersChange, 'emit');
    const expectedChangeData: DataObjectListFiltersChangeEventData = {
      partitionValueFilters: [{
        partitionKey: 'testKey',
        partitionValues: ['value1', 'value2', 'value3']
      }],
      attributeValueFilters: [{
        attributeName: 'attName',
        attributeValue: 'attValue'
      }],
      latestValidVersion: true,
      registrationDateRangeFilter: {
        startRegistrationDate: startDate,
        endRegistrationDate: endDate
      }
    };

    // no valid filters have data and latest valid version is not set
    component.filters = [
      {
        type: 'partition',
        data: undefined
      } as PartitionFilter,
      {
        type: 'attribute',
        data: undefined
      } as AttributeFilter
    ];

    component.filterSaved();
    expect(emitSpy).toHaveBeenCalledWith(undefined);


    // only lvv is passed
    component.filters = [
      {
        type: 'lvv'
      } as LatestValidVersionFilter
    ];
    component.filterSaved();
    expect(emitSpy).toHaveBeenCalledWith(undefined);

    // only registration date is passed
    component.filters = [
      {
        type: 'registrationDate',
        data: undefined
      } as RegistrationFilter
    ];
    component.filterSaved();
    expect(emitSpy).toHaveBeenCalledWith(undefined);

    // mock filters to send
    component.filters = [
      {
        type: 'partition',
        data: {
          partitionKey: 'testKey',
          partitionValues: ['value1', 'value2', 'value3']
        }
      } as PartitionFilter,
      {
        type: 'attribute',
        data: {
          attributeName: 'attName',
          attributeValue: 'attValue'
        }
      } as AttributeFilter,
      {
        type: 'lvv'
      } as LatestValidVersionFilter,
      {
        type: 'registrationDate',
        data: {
          startRegistrationDate: startDate,
          endRegistrationDate: endDate
        }
      } as RegistrationFilter
    ];
    component.filterSaved();
    expect(emitSpy).toHaveBeenCalledWith(expectedChangeData);

  });

});
