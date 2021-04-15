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
import { ActivatedRouteStub, RouterStub } from './../../../../testing/router-stubs';
import { By } from '@angular/platform-browser';
import {
  BusinessObjectData,
  BusinessObjectDataService,
  BusinessObjectDataVersions,
  BusinessObjectFormat,
  BusinessObjectFormatService,
  UploadAndDownloadService
} from '@herd/angular-client';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { DataObjectDetailComponent, DataObjectDetailRequest } from './data-object-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { default as AppIcons } from '../../../shared/utils/app-icons';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AlertService } from '../../../core/services/alert.service';
import { of } from 'rxjs';

describe('DataObjectDetailComponent', () => {
  let component: DataObjectDetailComponent;
  let fixture: ComponentFixture<DataObjectDetailComponent>;
  let spyBdefFormatApi, spydataApi, spyUploadAndDownloadService;
  let spyAlertService;

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
        NgbModule,
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
        },
        {
          provide: BusinessObjectDataService,
          useValue: {
            businessObjectDataGetBusinessObjectDataVersions:
              jasmine.createSpy(
                'businessObjectDataGetBusinessObjectDataVersions'),
            configuration: {}
          }
        },
        {
          provide: UploadAndDownloadService,
          useValue: {
            uploadandDownloadInitiateDownloadSingleBusinessObjectDataStorageFile:
              jasmine.createSpy(
                'uploadandDownloadInitiateDownloadSingleBusinessObjectDataStorageFile'),
            configuration: {}
          }
        },
        {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        {provide: Router, useClass: RouterStub},
        {
          provide: AlertService,
          useValue: {
            alert: jasmine.createSpy('alert')
          }
        }]
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
      const date = new Date();
      const expectedResult: BusinessObjectData = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY',
        partitionValue: '01-01-2017',
        version: 0,
        retentionExpirationDate: date
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
      expect(component.businessObjectData.retentionExpirationDate).toEqual(date);
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
      expect(component.businessObjectData.retentionExpirationDate).toBe(undefined);
      const spanEl = fixture.debugElement.query(By.css('.expiry-date')).nativeElement;
      expect(spanEl.innerHTML).toBe('');
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
            attributes: [{name: 'bucket.name', value: 'bucket.value'}]
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
        {subPartitionValues: expectedResult.subPartitionValues.join(',')}]);
    })));

  it('should download file on click of the download link', async(inject([
    UploadAndDownloadService], (uploadAndDownloadService: UploadAndDownloadService) => {
    const businessObjectData: BusinessObjectData = {
      namespace: 'ns',
      businessObjectDefinitionName: 'dn',
      businessObjectFormatUsage: 'PRC',
      businessObjectFormatFileType: 'TXT',
      businessObjectFormatVersion: 0,
      partitionKey: 'TEST_KEY',
      partitionValue: '09-01-2018',
      version: 0
    };

    const storageEvent = {
      directoryPath: 'test-file-directory/file-path',
      filePath: 'test-file-directory/file-path/filename.txt',
      storage: {
        name: 'test name',
        attributes: [
          {
            value: 'test-bucket-name'
          }
        ]
      }
    };
    const downloadBusinessObjectDataStorageFileSingleInitiationResponse = {
      businessObjectDataStorageFileKey: null,
      awsS3BucketName: 'ns',
      awsAccessKey: 'awsAccessKey',
      awsSecretKey: 'awsSecretKey',
      awsSessionToken: 'awsSessionToken',
      awsSessionExpirationTime: null,
      preSignedUrl: 'https://test-bucket-name.s3.amazonaws.com/test-file-directory/file-path/filename.txt'
    };

    // Spy on the services
    spyUploadAndDownloadService = (<jasmine.Spy>uploadAndDownloadService
      .uploadandDownloadInitiateDownloadSingleBusinessObjectDataStorageFile)
      .and
      .returnValue(of(downloadBusinessObjectDataStorageFileSingleInitiationResponse));

    component.businessObjectData = businessObjectData;
    component.getPreSignedUrl(storageEvent);
    expect(component.presignedURL).toContain('https://test-bucket-name.s3.amazonaws.com/test-file-directory/file-path/filename.txt');
    expect(spyUploadAndDownloadService).toHaveBeenCalledTimes(1);

  })));

  it('should not download file if did not able get preSigned url from herd', async(inject([
    UploadAndDownloadService], (uploadAndDownloadService: UploadAndDownloadService) => {
    const businessObjectData: BusinessObjectData = {
      namespace: 'ns',
      businessObjectDefinitionName: 'dn',
      businessObjectFormatUsage: 'PRC',
      businessObjectFormatFileType: 'TXT',
      businessObjectFormatVersion: 0,
      partitionKey: 'TEST_KEY',
      partitionValue: '09-01-2018',
      version: 0
    };

    const storageEvent = {
      directoryPath: 'test-file-directory/file-path',
      filePath: 'test-file-directory/file-path/filename.txt',
      storage: {
        name: 'test name',
        attributes: [
          {
            value: 'test-bucket-name'
          }
        ]
      }
    };

    // Spy on the services
    spyUploadAndDownloadService = (<jasmine.Spy>uploadAndDownloadService
      .uploadandDownloadInitiateDownloadSingleBusinessObjectDataStorageFile)
      .and
      .returnValue(throwError({status: 404}));

    component.businessObjectData = businessObjectData;
    component.getPreSignedUrl(storageEvent);

    expect(component.presignedURL).toBe(undefined);
    expect(spyUploadAndDownloadService).toHaveBeenCalledTimes(1);

  })));

  it('should show alert with error message when download failed', async(inject([
      UploadAndDownloadService, AlertService],
    (uploadAndDownloadService: UploadAndDownloadService, alertService: AlertService) => {
      const businessObjectData: BusinessObjectData = {
        namespace: 'ns',
        businessObjectDefinitionName: 'dn',
        businessObjectFormatUsage: 'PRC',
        businessObjectFormatFileType: 'TXT',
        businessObjectFormatVersion: 0,
        partitionKey: 'TEST_KEY',
        partitionValue: '09-01-2018',
        version: 0
      };

      const storageEvent = {
        directoryPath: 'test-file-directory/file-path',
        filePath: 'test-file-directory/file-path/filename.txt',
        storage: {
          name: 'test name',
          attributes: [
            {
              value: 'test-bucket-name'
            }
          ]
        }
      };

      const downloadError = {
        status: 500,
        error: {
          message: 'Test error message'
        }
      };

      // Spy on the services
      spyUploadAndDownloadService = (<jasmine.Spy>uploadAndDownloadService
        .uploadandDownloadInitiateDownloadSingleBusinessObjectDataStorageFile)
        .and
        .returnValue(throwError(downloadError));
      // throwError("Test failure");

      spyAlertService = (<jasmine.Spy>alertService.alert);

      component.businessObjectData = businessObjectData;
      component.getPreSignedUrl(storageEvent);

      expect(component.presignedURL).toBeUndefined();
      expect(spyUploadAndDownloadService).toHaveBeenCalledTimes(1);
      expect(spyAlertService).toHaveBeenCalledTimes(1);

    })));

});
