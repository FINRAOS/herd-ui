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
  DataObjectListFiltersComponent, AnyFilter, PartitionFilter,
  AttributeFilter, LatestValidVersionFilter, DataObjectListFiltersChangeEventData
} from './data-object-list-filters.component';
import { PartitionFilterComponent } from 'app/data-objects/components/partition-filter/partition-filter.component';
import { AttributeFilterComponent } from 'app/data-objects/components/attribute-filter/attribute-filter.component';
import {
  LatestValidVersionFilterComponent
} from 'app/data-objects/components/latest-valid-version-filter/latest-valid-version-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterTemplateComponent } from 'app/data-objects/components/filter-template/filter-template.component';
import { EllipsisOverflowComponent } from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import { expand } from 'rxjs/operators/expand';

describe('DataObjectListFiltersComponent', () => {
  let component: DataObjectListFiltersComponent;
  let fixture: ComponentFixture<DataObjectListFiltersComponent>;
  let spyFilterSaved: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot(), ReactiveFormsModule],
      declarations: [DataObjectListFiltersComponent,
        PartitionFilterComponent,
        AttributeFilterComponent,
        LatestValidVersionFilterComponent,
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
    const expectedFilters: AnyFilter[] = []

    // adding partition filter
    component.addFilter(component.filterTypes[0]);
    expectedFilters.push({ type: 'partition', data: undefined } as PartitionFilter);
    expect(component.filters).toEqual(expectedFilters);
    // should call filter saved for partition filters on filter save of the
    // generated component
    expect(spyFilterSaved).not.toHaveBeenCalled();

    component.addFilter(component.filterTypes[1]);
    expectedFilters.push({ type: 'attribute', data: undefined } as AttributeFilter);
    expect(component.filters).toEqual(expectedFilters);
    // should call filter saved for attribute filters on filter save of the
    // generated component
    expect(spyFilterSaved).not.toHaveBeenCalled();

    component.addFilter(component.filterTypes[2]);
    expectedFilters.push({ type: 'lvv' } as LatestValidVersionFilter);
    expect(component.filters).toEqual(expectedFilters);
    // should call filter saved  when lastest valid version filter is added
    // as it does not have any extra changes before a save
    expect(spyFilterSaved).toHaveBeenCalled();
    // should remove latest valid version filter form selectable filters
    expect(component.filterTypes).not.toContain({
      type: 'lvv',
      displayName: 'Last Valid Version'
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

    // emulate deleting lvv
    component.deleteFilter('Latest Valid Version', 2);
    // should add lvv back to filter types
    expect(component.filterTypes).toContain({
      type: 'lvv',
      displayName: 'Last Valid Version'
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
    spyFilterSaved.and.callThrough()
    const expectedChangeData: DataObjectListFiltersChangeEventData = {
      partitionValueFilters: [{
        partitionKey: 'testKey',
        partitionValues: ['value1', 'value2', 'value3']
      }],
      attributeValueFilters: [{
        attributeName: 'attName',
        attributeValue: 'attValue'
      }],
      latestValidVersion: true
    }

    const emitSpy = spyOn(component.filtersChange, 'emit');

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
      } as LatestValidVersionFilter
    ]

    component.filterSaved();
    expect(emitSpy).toHaveBeenCalledWith(expectedChangeData);

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
    expect(emitSpy).toHaveBeenCalledWith({
      partitionValueFilters: undefined, attributeValueFilters: undefined, latestValidVersion: true
    });
  });

});
