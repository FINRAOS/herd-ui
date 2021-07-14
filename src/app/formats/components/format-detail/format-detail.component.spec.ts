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
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { FormatDetailComponent } from './format-detail.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import {
  BusinessObjectDataService,
  BusinessObjectDefinitionColumnService,
  BusinessObjectFormatExternalInterfaceDescriptiveInformationService,
  BusinessObjectFormatService, NamespaceAuthorization,
  StorageService, UserAuthorizations
} from '@herd/angular-client';
import { of, ReplaySubject, throwError } from 'rxjs';
import { AlertService, DangerAlert } from '../../../core/services/alert.service';
import { SchemaColumnsComponent } from 'app/formats/components/schema-columns/schema-columns.component';
import { AttributeDefinitionsComponent } from 'app/formats/components/attribute-definitions/attribute-definitions.component';
import { ActivatedRouteStub } from 'testing/router-stubs';
import { MockFormat } from 'testing/mockFormat';
import { UserService } from '../../../core/services/user.service';
import { By } from '@angular/platform-browser';

describe('FormatDetailComponent', () => {
  const mockData: MockFormat = new MockFormat();
  let component: FormatDetailComponent;
  let fixture: ComponentFixture<FormatDetailComponent>;
  const activeRoute: ActivatedRouteStub = new ActivatedRouteStub();

  const businessObjectFormatExternalInterfaceDescriptiveInformation = {
    'businessObjectFormatExternalInterfaceKey': {
      'namespace': 'ns',
      'businessObjectDefinitionName': 'name',
      'businessObjectFormatUsage': 'SRC',
      'businessObjectFormatFileType': 'TXT',
      'externalInterfaceName': 'EXTERNAL_INTERFACE'
    },
    'externalInterfaceDisplayName': 'External Interface Display Name',
    'externalInterfaceDescription': 'Description of the external interface.'
  };

  activeRoute.testParams = {
    namespace: 'ns', dataEntityname: 'name',
    formatUsage: 'SRC', formatFileType: 'TXT', formatVersion: '1'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        SharedModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        FormatDetailComponent,
        SchemaColumnsComponent,
        AttributeDefinitionsComponent
      ],
      providers: [
        AlertService,
        {
          provide: StorageService,
          useValue: {
            configuration: {},
            defaultHeaders: new HttpHeaders(),
            storageGetStorages: jasmine.createSpy('storageGetStorages').and.returnValue(of({storageKeys: []}))
          }
        },
        {
          provide: BusinessObjectFormatService,
          useValue: {
            configuration: {},
            businessObjectFormatGetBusinessObjectFormat: jasmine
              .createSpy('businessObjectFormatGetBusinessObjectFormat')
              .and
              .returnValue(of({
                businessObjectFormatUsage: 'SRC',
                businessObjectFormatFileType: 'TXT',
                businessObjectFormatVersion: 0,
                retentionType: 'xyz',
                retentionPeriodInDays: 14,
                recordFlag: 'no',
                documentSchema: 'test document schema',
                documentSchemaUrl: 'test document schema url',
                schema: {
                  columns: [
                    {
                      'name': 'TESTNAME',
                      'type': 'BINARY',
                      'size': null,
                      'required': null,
                      'defaultValue': null,
                      'description': null,
                    }
                  ]
                }
              })),
            businessObjectFormatGetBusinessObjectFormats: jasmine
              .createSpy('businessObjectFormatGetBusinessObjectFormats')
              .and
              .returnValue(of({
                businessObjectFormatKeys: [{
                  businessObjectFormatUsage: 'SRC',
                  businessObjectFormatFileType: 'TXT',
                  businessObjectFormatVersion: 0
                },
                  {businessObjectFormatUsage: 'SRC', businessObjectFormatFileType: 'TXT', businessObjectFormatVersion: 1}
                ]
              })),
          }
        },
        {
          provide: BusinessObjectDataService,
          useValue: {
            configuration: {},
            defaultHeaders: new HttpHeaders(),
            businessObjectDataCheckBusinessObjectDataAvailability:
              jasmine.createSpy('businessObjectDataCheckBusinessObjectDataAvailability')
          }
        },
        {
          provide: BusinessObjectDefinitionColumnService,
          useValue: {
            configuration: {},
            defaultHeaders: new HttpHeaders(),
            businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn:
              jasmine.createSpy('businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn'),
            businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns:
              jasmine.createSpy('businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns')
          }
        },
        {provide: ActivatedRoute, useValue: activeRoute},
        {
          provide: BusinessObjectFormatExternalInterfaceDescriptiveInformationService,
          useValue: {
            configuration: {},
            defaultHeaders: new HttpHeaders(),
            businessObjectFormatExternalInterfaceDescriptiveInformationGetBusinessObjectFormatExternalInterface: jasmine
              .createSpy('businessObjectFormatExternalInterfaceDescriptiveInformationGetBusinessObjectFormatExternalInterface')
              .and
              .returnValue(of(businessObjectFormatExternalInterfaceDescriptiveInformation))
          }
        },
        {
          provide: UserService,
          useValue: {
            user: of({
              userId: 'test_user'
            } as UserAuthorizations)
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set default data for the component with null check',
    inject([BusinessObjectDefinitionColumnService, BusinessObjectDataService],
      (businessObjectDefinitionColumnApi, businessObjectDataApi: BusinessObjectDataService) => {
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn as jasmine.Spy)
          .and.returnValue(of(mockData.formatDetail.schema.columns[0]));
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns as jasmine.Spy)
          .and.returnValue(of({businessObjectDefinitionColumnKeys: []}));
        (businessObjectDataApi.businessObjectDataCheckBusinessObjectDataAvailability as jasmine.Spy)
          .and.returnValue(throwError({status: 403}));
        fixture.detectChanges();

        expect(component.namespace).toEqual('ns');
        expect(component.businessObjectFormatUsage).toEqual('SRC');
        expect(component.businessObjectFormatVersion).toEqual(1);
        expect(component.businessObjectFormatDetail.retentionType).toBe('xyz');
        expect(component.businessObjectFormatDetail.retentionPeriodInDays).toBe(14);
        expect(component.businessObjectFormatDetail.recordFlag).toBe('no');
        expect(component.businessObjectFormatDetail.documentSchema).toBe('test document schema');
        expect(component.businessObjectFormatDetail.documentSchemaUrl).toBe('test document schema url');
        expect(component.minPrimaryPartitionValue).toEqual('Access Denied');
        expect(component.maxPrimaryPartitionValue).toEqual('Access Denied');
      }));

  it('ngOnInit should set data for the component',
    inject([BusinessObjectDefinitionColumnService, BusinessObjectDataService, StorageService],
      (businessObjectDefinitionColumnApi, businessObjectDataApi: BusinessObjectDataService, storageApi: StorageService) => {
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn as jasmine.Spy)
          .and.returnValue(of(mockData.formatDetail.schema.columns[2]));
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns as jasmine.Spy)
          .and.returnValue(of({businessObjectDefinitionColumnKeys: mockData.businessObjectDefinitionColumnKeys}));
        (storageApi.storageGetStorages as jasmine.Spy).and.returnValue(of({storageKeys: [{storageName: 'S3'}]}));
        (businessObjectDataApi.businessObjectDataCheckBusinessObjectDataAvailability as jasmine.Spy)
          .and.returnValue(of({availableStatuses: [{partitionValue: '3'}, {partitionValue: '4'}]}));
        fixture.detectChanges();

        expect(component.namespace).toEqual('ns');
        expect(component.businessObjectFormatUsage).toEqual('SRC');
        expect(component.businessObjectFormatVersion).toEqual(1);
        expect(component.businessObjectFormatDetail.retentionType).toBe('xyz');
        expect(component.businessObjectFormatDetail.retentionPeriodInDays).toBe(14);
        expect(component.businessObjectFormatDetail.recordFlag).toBe('no');
        expect(component.businessObjectFormatDetail.documentSchema).toBe('test document schema');
        expect(component.businessObjectFormatDetail.documentSchemaUrl).toBe('test document schema url');
        expect(component.minPrimaryPartitionValue).toEqual('3');
        expect(component.maxPrimaryPartitionValue).toEqual('4');
      }));

  it('ngOnInit should not set unicode schema characters for the component when schema is not specified',
    inject([BusinessObjectFormatService],
      (businessObjectFormatApi) => {
        (businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat as jasmine.Spy)
          .and.returnValue(of({
            businessObjectFormatUsage: 'SRC',
            businessObjectFormatFileType: 'TXT',
            businessObjectFormatVersion: 0
          }));
        fixture.detectChanges();

        expect(component.unicodeSchemaNullValue).toEqual('');
        expect(component.unicodeSchemaDelimiter).toEqual('');
        expect(component.unicodeSchemaEscapeCharacter).toEqual('');
      }));

  it('ngOnInit should not set unicode schema characters for the component when schema nullValue, delimiter, and escape are not specified',
    inject([BusinessObjectFormatService],
      (businessObjectFormatApi) => {
        (businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat as jasmine.Spy)
          .and.returnValue(of({
            businessObjectFormatUsage: 'SRC',
            businessObjectFormatFileType: 'TXT',
            businessObjectFormatVersion: 0,
            schema: {
              nullValue: null,
              delimiter: null,
              escapeCharacter: null
            }
          }));
        fixture.detectChanges();

        expect(component.unicodeSchemaNullValue).toEqual('');
        expect(component.unicodeSchemaDelimiter).toEqual('');
        expect(component.unicodeSchemaEscapeCharacter).toEqual('');
      }));

  it('ngOnInit should set unicode schema characters for the component when schema nullValue, delimiter, and escape specified as single '
       + 'unicode characters',
    inject([BusinessObjectFormatService],
      (businessObjectFormatApi) => {
        (businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat as jasmine.Spy)
          .and.returnValue(of({
            businessObjectFormatUsage: 'SRC',
            businessObjectFormatFileType: 'TXT',
            businessObjectFormatVersion: 0,
            schema: {
              nullValue: '\u03A7',
              delimiter: '\u03A8',
              escapeCharacter: '\u03A9'
            }
          }));
        fixture.detectChanges();

        expect(component.unicodeSchemaNullValue).toEqual('(U+03A7)');
        expect(component.unicodeSchemaDelimiter).toEqual('(U+03A8)');
        expect(component.unicodeSchemaEscapeCharacter).toEqual('(U+03A9)');
      }));

  it('ngOnInit should not set unicode schema characters for the component when schema nullValue, delimiter, and escape specified as '
       + 'multiple characters',
    inject([BusinessObjectFormatService],
      (businessObjectFormatApi) => {
        (businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat as jasmine.Spy)
          .and.returnValue(of({
            businessObjectFormatUsage: 'SRC',
            businessObjectFormatFileType: 'TXT',
            businessObjectFormatVersion: 0,
            schema: {
              nullValue: '\u03A7\u03A7',
              delimiter: '\u03A8\u03A8',
              escapeCharacter: '\u03A9\u03A9'
            }
          }));
        fixture.detectChanges();

        expect(component.unicodeSchemaNullValue).toEqual('');
        expect(component.unicodeSchemaDelimiter).toEqual('');
        expect(component.unicodeSchemaEscapeCharacter).toEqual('');
      }));

  it('Min and Max primary partition function should handle partition values',
    inject([BusinessObjectDefinitionColumnService, BusinessObjectDataService],
      (businessObjectDefinitionColumnApi, businessObjectDataApi: BusinessObjectDataService) => {
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn as jasmine.Spy)
          .and.returnValue(of(mockData.formatDetail.schema.columns[2]));
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns as jasmine.Spy)
          .and.returnValue(of({businessObjectDefinitionColumnKeys: mockData.businessObjectDefinitionColumnKeys}));
        (businessObjectDataApi.businessObjectDataCheckBusinessObjectDataAvailability as jasmine.Spy)
          .and.returnValue(throwError({status: 404}));

        fixture.detectChanges();

        expect(component.minPrimaryPartitionValue).toEqual('No data registered');
        expect(component.maxPrimaryPartitionValue).toEqual('No data registered');
      }));

  it('should set external interface descriptive information when get external interface descriptive information is called',
    inject([BusinessObjectFormatExternalInterfaceDescriptiveInformationService],
      (businessObjectFormatExternalInterfaceDescriptiveInformationApi:
         BusinessObjectFormatExternalInterfaceDescriptiveInformationService) => {
        const businessObjectFormatExternalInterfaceDescriptiveInformationSpy =
          (businessObjectFormatExternalInterfaceDescriptiveInformationApi
            .businessObjectFormatExternalInterfaceDescriptiveInformationGetBusinessObjectFormatExternalInterface as jasmine.Spy);
        businessObjectFormatExternalInterfaceDescriptiveInformationSpy
          .and
          .returnValue(of(businessObjectFormatExternalInterfaceDescriptiveInformation));
        component.getExternalInterface('EXTERNAL_INTERFACE');
        expect(component.externalInterfaceDisplayName).toEqual('External Interface Display Name');
        expect(component.externalInterfaceDescription).toEqual('Description of the external interface.');
        expect(component.externalInterfaceError).toEqual(undefined);
        expect(businessObjectFormatExternalInterfaceDescriptiveInformationApi.defaultHeaders.get('skipAlert')).toBe(null);
      }));

  it('should set error details when get external interface descriptive information returns error',
    inject([BusinessObjectFormatExternalInterfaceDescriptiveInformationService],
      (businessObjectFormatExternalInterfaceDescriptiveInformationApi:
         BusinessObjectFormatExternalInterfaceDescriptiveInformationService) => {
        const businessObjectFormatExternalInterfaceDescriptiveInformationSpy = (
          businessObjectFormatExternalInterfaceDescriptiveInformationApi
            .businessObjectFormatExternalInterfaceDescriptiveInformationGetBusinessObjectFormatExternalInterface as jasmine.Spy);
        businessObjectFormatExternalInterfaceDescriptiveInformationSpy.and.returnValue(throwError({
          status: '500',
          statusText: 'Internal Server Error',
          url: 'theURL',
          error: {
            message: 'Stuff blew up'
          }
        }));
        component.getExternalInterface('EXTERNAL_INTERFACE');
        expect(component.externalInterfaceError).toEqual(new DangerAlert('HTTP Error: 500 Internal Server Error', 'URL: theURL',
          'Info: Stuff blew up'));
        expect(businessObjectFormatExternalInterfaceDescriptiveInformationApi.defaultHeaders.get('skipAlert')).toBe(null);
      }));

  it('should close current modal on close()', () => {
    const modal = component.open('test modal close', 'EXTERNAL_INTERFACE');
    spyOn(modal, 'close').and.callThrough();
    component.close();
    expect(modal.close).toHaveBeenCalled();
  });

  it('should hide or show data objects link based on access level',
    inject([UserService],
      (us: UserService) => {

        const testAuthorizations: UserAuthorizations = {
          userId: 'test_user',
          namespaceAuthorizations: [],
          securityFunctions: []
        };

        const userSubject = new ReplaySubject<UserAuthorizations>();
        // using a mocked UserService
        (us as any).user = userSubject.asObservable();
        // no namespace or roles set
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateElementVisibility('.data-object-link-authorized', false);
        validateElementVisibility('.data-object-link-unauthorized', true);

        // namespace READ
        testAuthorizations.namespaceAuthorizations = [{
          namespace: component.namespace,
          namespacePermissions: [NamespaceAuthorization.NamespacePermissionsEnum.READ]
        }];
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateElementVisibility('.data-object-link-authorized', false);
        validateElementVisibility('.data-object-link-unauthorized', true);

        // namespace with write but no role
        testAuthorizations.namespaceAuthorizations[0]
          .namespacePermissions.push(NamespaceAuthorization.NamespacePermissionsEnum.WRITE);
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateElementVisibility('.data-object-link-authorized', false);
        validateElementVisibility('.data-object-link-unauthorized', true);

        // role but no namespace rights
        testAuthorizations.namespaceAuthorizations[0].namespacePermissions = [];
        testAuthorizations.securityFunctions = ['FN_BUSINESS_OBJECT_DATA_BY_BUSINESS_OBJECT_DEFINITION_GET'];
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateElementVisibility('.data-object-link-authorized', false);
        validateElementVisibility('.data-object-link-unauthorized', true);

        // has role and namespace rights
        testAuthorizations.namespaceAuthorizations[0].namespacePermissions = [NamespaceAuthorization.NamespacePermissionsEnum.READ];
        testAuthorizations.securityFunctions = ['FN_BUSINESS_OBJECT_DATA_BY_BUSINESS_OBJECT_DEFINITION_GET'];
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateElementVisibility('.data-object-link-authorized', true);
        validateElementVisibility('.data-object-link-unauthorized', false);
      })
  );

  function validateElementVisibility(selector: string,  isVisible: boolean) {
    // css selector which selects parent of the radio-button icon since that is controlled by the sd-authorize directive
    const element = fixture.debugElement.query(By.css(selector));

    const displayStyle = element.nativeElement.style.display;
    if (isVisible) {
      expect(displayStyle).not.toEqual('none');
    } else {
      expect(displayStyle).toEqual('none');
    }
  }

});
