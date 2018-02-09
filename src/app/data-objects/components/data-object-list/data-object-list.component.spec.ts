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

import {AlertService} from 'app/core/services/alert.service';
import {BusinessObjectDataService} from '@herd/angular-client';
import {ActivatedRouteStub} from 'testing/router-stubs';
import {ActivatedRoute} from '@angular/router';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataObjectListComponent} from './data-object-list.component';
import {SideActionComponent} from 'app/shared/components/side-action/side-action.component';
import {SideActionsComponent} from 'app/shared/components/side-actions/side-actions.component';
import {RouterTestingModule} from '@angular/router/testing';
import {DataObjectListFiltersComponent} from 'app/data-objects/components/data-object-list-filters/data-object-list-filters.component';
import {DataTableModule} from 'primeng/components/datatable/datatable';
import {ButtonModule} from 'primeng/components/button/button';
import {EllipsisOverflowComponent} from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import {GenericViewComponent} from 'app/shared/components/generic-view/generic-view.component';
import {PartitionFilterComponent} from 'app/data-objects/components/partition-filter/partition-filter.component';
import {AttributeFilterComponent} from 'app/data-objects/components/attribute-filter/attribute-filter.component';
import {
  LatestValidVersionFilterComponent
  } from 'app/data-objects/components/latest-valid-version-filter/latest-valid-version-filter.component';
import {FilterTemplateComponent} from 'app/data-objects/components/filter-template/filter-template.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpModule} from '@angular/http';
import {DataTable} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';


describe('DataObjectListComponent', () => {
  let component: DataObjectListComponent;
  let fixture: ComponentFixture<DataObjectListComponent>;
  const activeRoute: ActivatedRouteStub = new ActivatedRouteStub();
  let businessObjectDataApi;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        NgbModule.forRoot(),
        RouterTestingModule,
        DataTableModule,
        ButtonModule,
        ReactiveFormsModule
      ],
      declarations: [
        DataObjectListComponent,
        SideActionsComponent,
        SideActionComponent,
        DataObjectListFiltersComponent,
        PartitionFilterComponent,
        AttributeFilterComponent,
        LatestValidVersionFilterComponent,
        FilterTemplateComponent,
        EllipsisOverflowComponent,
        GenericViewComponent
      ],
      providers: [
        BusinessObjectDataService,
        { provide: ActivatedRoute, useValue: activeRoute },
        AlertService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectListComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    activeRoute.testParams = testParam;

    businessObjectDataApi = fixture.debugElement.injector.get(BusinessObjectDataService);
    businessObjectDataApi.defaultHeaders.append('skipAlert', 'true');
    spyOn(businessObjectDataApi, 'defaultHeaders')
      .and.callThrough();
    spyOn(businessObjectDataApi, 'businessObjectDataGetAllBusinessObjectDataByBusinessObjectFormat')
      .and.returnValue(Observable.of(businessObjectDataKeys));
    spyOn(businessObjectDataApi, 'businessObjectDataGetAllBusinessObjectDataByBusinessObjectDefinition')
      .and.returnValue(Observable.of(businessObjectDataKeys));
    spyOn(businessObjectDataApi, 'businessObjectDataSearchBusinessObjectData')
      .and.returnValue(Observable.of(businessObjectSearchResult));
  });

  it('should create the component without error', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should make the data object list without format usage', () => {
    activeRoute.testParams = { namespace: 'ns', dataEntityname: 'name' };
    fixture.detectChanges();
    expect(component.format).toBeFalsy();
  });

  it('should export to csv on click of export', () => {
    const mockTable = {
      exportCSV: jasmine.createSpy('exportCSV')
    };
    component.export((mockTable as any) as DataTable);
    fixture.detectChanges();
    expect(mockTable.exportCSV).toHaveBeenCalled();
  });

  it('should load data on call of loadData function', () => {
    fixture.detectChanges();
    component.loadData(dataObjectListFiltersChangeEventData);
    expect(component.lastLoad).toBeTruthy();
    expect(component.data.length).toBeGreaterThan(0);

    // testing reset of data in case already available.
    component.lastLoad.closed = false;
    component.loadData(dataObjectListFiltersChangeEventData);
    expect(component.lastLoad).toBeTruthy();
    expect(component.data.length).toBeGreaterThan(0);
  });

  it('should show empty message on server 400 error while load data', () => {
    businessObjectDataApi.businessObjectDataSearchBusinessObjectData
      .and.returnValue(Observable.throw({status: 400, json: () => { return {message: 'not found error'}}, body: []}));
    fixture.detectChanges();
    component.loadData(dataObjectListFiltersChangeEventData);
    expect(component.data.length).toBe(0);
    businessObjectDataApi.businessObjectDataSearchBusinessObjectData
      .and.returnValue(Observable.throw({status: 401, url: 'test url for error',
      json: () => { return {message: 'not found error'}}, body: [], statusText: 'not found error'}));
    fixture.detectChanges();
    component.loadData(dataObjectListFiltersChangeEventData);
    expect(component.data.length).toBe(0);
  });

});

const testParam = {
  namespace: 'ns', dataEntityname: 'name',
  formatUsage: 'SRC', formatFileType: 'TXT', formatVersion: '1'
};

const dataObjectListFiltersChangeEventData = {
  partitionValueFilters: [{
    partitionKey: 'xxx',
    partitionValue: 'xxx',
  }],
  attributeValueFilters: [{
    attributeName: 'attr_name',
    attributeValue: 'attr_val',
  }],
  latestValidVersion: false
};

const businessObjectDataKeys = {
  businessObjectDataKeys: [
    {
      businessObjectDefinitionName: 'test-bdef-name',
      namespace: 'test-namespace', businessObjectFormatUsage: 'test-bdef-format-usage',
      businessObjectFormatFileType: 'test-bdef-file-type',
      businessObjectFormatVersion: 'bdef-format-version',
      partitionKey: 'test-key',
      subPartitionValues: ['test-sub-partition-key'],
      attributes: [{name: 'xxx', value: 'yyy'}, {name: 'xxxx', value: 'yyyyy'}],
      version: 231,
      status: false
    },
    {
      businessObjectDefinitionName: 'test-bdef-name1',
      namespace: 'test-namespace1', businessObjectFormatUsage: 'test-bdef-format-usage1',
      businessObjectFormatFileType: 'test-bdef-file-type1',
      businessObjectFormatVersion: 'bdef-format-version1',
      partitionKey: 'test-key',
      subPartitionValues: ['test-sub-partition-key'],
      attributes: [{name: 'xxx1', value: 'yyyy1'}, {name: 'xxxx1', value: 'yyyyy1'}],
      version: 232,
      status: false
    }
  ]
};

const businessObjectSearchResult = {
  businessObjectDataElements: [
    {
      attributes: [{name: 'xxx', value: 'yyyy'}, {name: 'xxx1', value: 'yyyy1'}, {name: 'xxx2', value: 'yyyy2'}],
      status: true
    },
    {
      attributes: [{name: 'xxx3', value: 'yyyy3'}, {name: 'xxx4', value: 'yyyy4'}, {name: 'xxx5', value: 'yyyy5'}],
      status: true
    },
    {
      attributes: [{name: 'xxx6', value: 'yyyy6'}, {name: 'xxx7', value: 'yyyy7'}, {name: 'xxx8', value: 'yyyy8'}],
      status: true
    }
  ]
};



