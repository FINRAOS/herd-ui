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
import { Action } from './../../../shared/components/side-action/side-action.component';
import { StorageUnitsComponent } from './../storage-units/storage-units.component';
import { LineageComponent } from './../lineage/lineage.component';
import { RouterStub, ActivatedRouteStub } from './../../../../testing/router-stubs';
import {
  BusinessObjectFormatService, BusinessObjectDataService, BusinessObjectData, BusinessObjectFormat,
  BusinessObjectDataVersions
} from '@herd/angular-client';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { DataObjectDetailComponent, DataObjectDetailRequest } from './data-object-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { default as AppIcons } from '../../../shared/utils/app-icons';

describe('DataObjectDetailComponent', () => {
  let component: DataObjectDetailComponent;
  let fixture: ComponentFixture<DataObjectDetailComponent>;
  let spyBdefFormatApi, spydataApi;

  const bdataRequest: DataObjectDetailRequest = {
    namespace: 'ns',
    dataEntityName: 'dn',
    formatUsage: 'PRC',
    formatFileType: 'TXT',
    formatVersion: 0,
    partitionKey: undefined,
    partitionValue: '01-01-2017',
    subPartitionValues: '01-01-2017',
    dataObjectVersion: 0,
    dataObjectStatus: undefined,
    includeDataObjectStatusHistory: true,
    includeStorageUnitStatusHistory: true
  };

  const routeParams = {
    namespace: 'ns',
    dataEntityName: 'dn',
    formatUsage: 'PRC',
    formatFileType: 'TXT',
    formatVersion: 0,
    partitionValue: '01-01-2017',
    subPartitionValues: '01-01-2017',
    dataObjectVersion: 0
  };

  const expectedVersionsResult: BusinessObjectDataVersions = {
    businessObjectDataVersions: [{
      businessObjectDataKey: {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionValue: '01-01-2017',
        subPartitionValues: ['01-01-2017'],
        businessObjectDataVersion: 0
      },
      status: 'VALID'
    }, {
      businessObjectDataKey: {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionValue: '01-01-2017',
        subPartitionValues: ['01-01-2017'],
        businessObjectDataVersion: 1
      },
      status: 'VALID'
    }
    ]
  };

  const expectedFormat: BusinessObjectFormat = {
    namespace: 'ns',
    businessObjectDefinitionName: 'dn',
    businessObjectFormatUsage: 'PRC',
    businessObjectFormatFileType: 'TXT',
    businessObjectFormatVersion: 0,
    partitionKey: 'TEST_KEY',
    schema: {
      partitions: [{
        name: 'TEST_KEY',
        type: 'string',
        size: 'varchar',
        required: true,
        defaultValue: 'string',
        description: 'string'
      },
      {
        name: 'col',
        type: 'string',
        size: 'varchar',
        required: true,
        defaultValue: 'string',
        description: 'string'
      }]
    }
  };

  const sideActions = [
    new Action(AppIcons.shareIcon, 'Share'),
    new Action(AppIcons.saveIcon, 'Save'),
    new Action(AppIcons.watchIcon, 'Watch')
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        SharedModule,
        RouterTestingModule
      ],
      declarations: [DataObjectDetailComponent, LineageComponent, StorageUnitsComponent],
      providers: [
        {
          provide: BusinessObjectFormatService,
          useValue: {
            businessObjectFormatGetBusinessObjectFormat:
            jasmine.createSpy(
              'businessObjectFormatGetBusinessObjectFormat'),
            configuration: {}
          }
        }, {
          provide: BusinessObjectDataService,
          useValue: {
            businessObjectDataGetBusinessObjectDataVersions:
            jasmine.createSpy(
              'businessObjectDataGetBusinessObjectDataVersions'),
            configuration: {}
          }
        }, { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectDetailComponent);
    component = fixture.componentInstance;
  });


  it('should populate versions and side actions on Init', async(inject([
    BusinessObjectFormatService,
    BusinessObjectDataService, ActivatedRoute],
    (
      bformatApi: BusinessObjectFormatService,
      dataApi: BusinessObjectDataService, activeRoute: ActivatedRouteStub) => {

      // Set active route params
      activeRoute.testParams = routeParams;

      const expectedResult: BusinessObjectData = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY',
        partitionValue: '01-01-2017',
        version: 0
      };

      activeRoute.testData = {
        resolvedData: {
          businessObjectData: expectedResult
        }
      };

      // Spy on the services
      spyBdefFormatApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormat).and.returnValue(
        of(expectedFormat));

      spydataApi = (<jasmine.Spy>dataApi.businessObjectDataGetBusinessObjectDataVersions).and.returnValue(
        of(expectedVersionsResult));

      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.sideActions).toEqual(sideActions);
      expect(spyBdefFormatApi.calls.count()).toEqual(0);
      expect(spydataApi.calls.count()).toEqual(1);
      expect(component.businessObjectDataVersions).toEqual([1, 0]);

    })));

  it('should populate versions, get previously stored data on Init', async(inject([
    BusinessObjectFormatService,
    BusinessObjectDataService, ActivatedRoute],
    (
      bformatApi: BusinessObjectFormatService,
      dataApi: BusinessObjectDataService, activeRoute: ActivatedRouteStub) => {

      // Set active route params
      activeRoute.testParams = routeParams;

      const expectedResult: BusinessObjectData = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY',
        partitionValue: '01-01-2017',
        version: 0
      };

      activeRoute.testData = {
        resolvedData: {
          businessObjectData: expectedResult
        }
      };

      // Spy on the services
      spyBdefFormatApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormat).and.returnValue(
        of(expectedFormat));

      spydataApi = (<jasmine.Spy>dataApi.businessObjectDataGetBusinessObjectDataVersions).and.returnValue(
        of(expectedVersionsResult));

      fixture.detectChanges();
      expect(spyBdefFormatApi.calls.count()).toEqual(0);
      expect(spydataApi.calls.count()).toEqual(1);

    })));

  it('should populate versions, get previously stored data with subpartitions and storage units', async(inject([
    BusinessObjectFormatService,
    BusinessObjectDataService, ActivatedRoute],
    (
      bformatApi: BusinessObjectFormatService,
      dataApi: BusinessObjectDataService, activeRoute: ActivatedRouteStub) => {

      // Set active route params
      activeRoute.testParams = routeParams;

      const expectedResult: BusinessObjectData = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY',
        partitionValue: '01-01-2017',
        subPartitionValues: ['01-01-2017'],
        version: 0,
        storageUnits: [{
          storage: {
            name: 'S3',
            storagePlatformName: 'PN',
            attributes: [{ name: 'bucket.name', value: 'bucket.value' }]
          },
          storageDirectory: {
            directoryPath: '/path'
          }
        }]
      };

      const expectedFrmt: BusinessObjectFormat = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY'
      };

      activeRoute.testData = {
        resolvedData: {
          businessObjectData: expectedResult
        }
      };

      // Spy on the services
      spyBdefFormatApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormat).and.returnValue(
        of(expectedFrmt));

      spydataApi = (<jasmine.Spy>dataApi.businessObjectDataGetBusinessObjectDataVersions).and.returnValue(
        of(expectedVersionsResult));

      fixture.detectChanges();
      expect(spyBdefFormatApi.calls.count()).toEqual(1);
      expect(spydataApi.calls.count()).toEqual(1);

    })));

  it('should populate versions, get previously stored data with subpartitions and no storage attributes', async(inject([
    BusinessObjectFormatService,
    BusinessObjectDataService, ActivatedRoute, Router],
    (
      bformatApi: BusinessObjectFormatService,
      dataApi: BusinessObjectDataService, activeRoute: ActivatedRouteStub, router: RouterStub) => {

      // Set active route params
      activeRoute.testParams = routeParams;

      const expectedResult: BusinessObjectData = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY',
        partitionValue: '01-01-2017',
        subPartitionValues: ['01-01-2017'],
        version: 0,
        storageUnits: [{
          storage: {
            name: 'S3',
            storagePlatformName: 'PN',
          },
          storageDirectory: {
            directoryPath: '/path'
          }
        }]
      };
      const expectedFrmt: BusinessObjectFormat = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY',
        schema: {
          columns: [{
            name: 'TEST_KEY',
            type: 'string',
            size: 'varchar',
            required: true,
            defaultValue: 'string',
            description: 'string'
          },
          {
            name: 'col',
            type: 'string',
            size: 'varchar',
            required: true,
            defaultValue: 'string',
            description: 'string'
          }],
          partitions: [
            {
              name: 'testing-partition',
              type: 'string',
              size: 'varchar',
              required: true,
              defaultValue: 'string',
              description: 'string'
            }
          ]
        }
      };

      activeRoute.testData = {
        resolvedData: {
          businessObjectData: expectedResult
        }
      };

      // Spy on the services
      spyBdefFormatApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormat).and.returnValue(
        of(expectedFrmt));

      spydataApi = (<jasmine.Spy>dataApi.businessObjectDataGetBusinessObjectDataVersions).and.returnValue(
        of(expectedVersionsResult));

      fixture.detectChanges();
      // for the ng init
      expect(spyBdefFormatApi).toHaveBeenCalledTimes(1);
      expect(spydataApi).toHaveBeenCalledTimes(1);

      // navigate on version change
      component.go(3);

      expect(router.navigate).toHaveBeenCalledWith(['/data-objects',
        expectedResult.namespace, expectedResult.businessObjectDefinitionName,
        expectedResult.businessObjectFormatUsage, expectedResult.businessObjectFormatFileType,
        expectedResult.businessObjectFormatVersion, expectedResult.partitionValue, 3,
        { subPartitionValues: expectedResult.subPartitionValues.join(',') }]);
    })));
});
