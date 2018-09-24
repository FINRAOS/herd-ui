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
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttributeValueFilter, PartitionValueFilter, RegistrationDateRangeFilter } from '@herd/angular-client';

interface FilterType {
  type: string,
  displayName: string
}

export type AnyFilter = PartitionFilter | AttributeFilter | LatestValidVersionFilter | RegistrationFilter;

export interface PartitionFilter {
  type: 'partition',
  data?: PartitionValueFilter
}

export interface AttributeFilter {
  type: 'attribute',
  data?: AttributeValueFilter
}

export interface LatestValidVersionFilter {
  type: 'lvv',
  data?
}

export interface RegistrationFilter {
  type: 'registrationDate',
  data?: RegistrationDateRangeFilter
}

export interface DataObjectListFiltersChangeEventData {
  partitionValueFilters: PartitionValueFilter[],
  attributeValueFilters: AttributeValueFilter[],
  latestValidVersion: boolean,
  registrationDateRangeFilter: RegistrationDateRangeFilter
}

@Component({
  selector: 'sd-data-object-list-filters',
  templateUrl: './data-object-list-filters.component.html',
  styleUrls: ['./data-object-list-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataObjectListFiltersComponent implements OnInit {
  @Input() filters: AnyFilter[] = [];
  @Output() filtersChange = new EventEmitter<DataObjectListFiltersChangeEventData>();
  filterTypes: FilterType[] = [
    {
      type: 'partition',
      displayName: 'Partition'
    }, {
      type: 'attribute',
      displayName: 'Attribute'
    }
  ];
  private lvvFilterType = {
    type: 'lvv',
    displayName: 'Last Valid Version'
  };

  private registrationDate = {
    type: 'registrationDate',
    displayName: 'Registration Date'
  };


  constructor() {
  }

  ngOnInit() {
    this.filterTypes = [...this.filterTypes, this.lvvFilterType, this.registrationDate];
  }

  addFilter(filterType: FilterType) {
    const c: PartitionValueFilter = {};
    switch (filterType.type) {
      case 'partition':
        this.filters = [...this.filters, {
          type: filterType.type,
          data: undefined
        }];
        break;
      case 'attribute':
        this.filters = [...this.filters, {
          type: filterType.type,
          data: undefined
        }];
        break;
      case 'lvv':
        this.filters = [...this.filters, {type: filterType.type}];
        this.filterTypes.splice(this.filterTypes.indexOf(this.lvvFilterType), 1);
        this.filterSaved();
        break;
      case 'registrationDate':
        this.filters = [...this.filters, {type: filterType.type}];
        this.filterTypes.splice(this.filterTypes.indexOf(this.registrationDate), 1);
        this.filterSaved();
        break;
    }
  }

  filterSaved(event?: any) {
    const pValFilters: PartitionValueFilter[] = [];
    const aValFilters: AttributeValueFilter[] = [];
    let lvv = false;
    let registrationDateFilter = undefined;

    this.filters.forEach((f) => {
      switch (f.type) {
        case 'partition':
          if (f.data) {
            pValFilters.push(f.data);
          }
          break;
        case 'attribute':
          if (f.data) {
            aValFilters.push(f.data);
          }
          break;
        case 'lvv':
          lvv = true;
          break;
        case 'registrationDate':
          registrationDateFilter = f.data;
          break;
      }
    });

    if (pValFilters.length || aValFilters.length || lvv || registrationDateFilter) {
      this.filtersChange.emit({
        partitionValueFilters: pValFilters.length ? pValFilters : undefined,
        attributeValueFilters: aValFilters.length ? aValFilters : undefined,
        latestValidVersion: lvv,
        registrationDateRangeFilter: registrationDateFilter ? registrationDateFilter : undefined,
      });
    } else {
      this.filtersChange.emit(undefined);
    }
  }

  deleteFilter(event, i) {
    if (this.filters[i].type === 'lvv') {
      this.filterTypes.push(this.lvvFilterType);
    }
    if (this.filters[i].type === 'registrationDate') {
      this.filterTypes.push(this.registrationDate);
    }
    this.filters.splice(i, 1);
    this.filters = [...this.filters];
    this.filterSaved();
  }

}
