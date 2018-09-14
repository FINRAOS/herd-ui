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
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { FormatDetailComponent } from './format-detail.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  StorageService,
  BusinessObjectFormatService,
  BusinessObjectDataService,
  BusinessObjectDefinitionColumnService
} from '@herd/angular-client';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../../core/services/alert.service';
import { SchemaColumnsComponent } from 'app/formats/components/schema-columns/schema-columns.component';
import { AttributeDefinitionsComponent } from 'app/formats/components/attribute-definitions/attribute-definitions.component';
import { ActivatedRouteStub } from 'testing/router-stubs';
import { Headers } from '@angular/http'
import { MockFormat } from 'testing/mockFormat';

describe('FormatDetailComponent', () => {
  const mockData: MockFormat = new MockFormat();
  let component: FormatDetailComponent;
  let fixture: ComponentFixture<FormatDetailComponent>;
  const activeRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
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
            defaultHeaders: new Headers(),
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
            defaultHeaders: new Headers(),
            businessObjectDataCheckBusinessObjectDataAvailability:
              jasmine.createSpy('businessObjectDataCheckBusinessObjectDataAvailability')
          }
        },
        {
          provide: BusinessObjectDefinitionColumnService,
          useValue: {
            configuration: {},
            defaultHeaders: new Headers(),
            businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn:
              jasmine.createSpy('businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn'),
            businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns:
              jasmine.createSpy('businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns')
          }
        },
        {provide: ActivatedRoute, useValue: activeRoute}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = {
      namespace: 'ns', dataEntityname: 'name',
      formatUsage: 'SRC', formatFileType: 'TXT', formatVersion: '1'
    };
    fixture = TestBed.createComponent(FormatDetailComponent);
    component = fixture.componentInstance;
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
      }));


  it('ngOnInit should set data for the component',
    inject([BusinessObjectDefinitionColumnService, BusinessObjectDataService],
      (businessObjectDefinitionColumnApi, businessObjectDataApi: BusinessObjectDataService) => {
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn as jasmine.Spy)
          .and.returnValue(of(mockData.formatDetail.schema.columns[2]));
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns as jasmine.Spy)
          .and.returnValue(of({businessObjectDefinitionColumnKeys: mockData.businessObjectDefinationColumnKeys}));
        (businessObjectDataApi.businessObjectDataCheckBusinessObjectDataAvailability as jasmine.Spy)
          .and.returnValue(of({availableStatuses: [{partitionValue: 3}, {partitionValue: 4}]}));
        fixture.detectChanges();

        expect(component.businessObjectFormatDetail.retentionType).toBe('xyz');
        expect(component.businessObjectFormatDetail.retentionPeriodInDays).toBe(14);
        expect(component.businessObjectFormatDetail.recordFlag).toBe('no');
        expect(component.businessObjectFormatDetail.documentSchema).toBe('test document schema');
      }));

  it('Min and Max primary partition function should handle partition values',
    inject([BusinessObjectDefinitionColumnService, BusinessObjectDataService],
      (businessObjectDefinitionColumnApi, businessObjectDataApi: BusinessObjectDataService) => {
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumn as jasmine.Spy)
          .and.returnValue(of(mockData.formatDetail.schema.columns[2]));
        (businessObjectDefinitionColumnApi.businessObjectDefinitionColumnGetBusinessObjectDefinitionColumns as jasmine.Spy)
          .and.returnValue(of({businessObjectDefinitionColumnKeys: mockData.businessObjectDefinationColumnKeys}));
        (businessObjectDataApi.businessObjectDataCheckBusinessObjectDataAvailability as jasmine.Spy)
          .and.returnValue(throwError({status: 404}));

        fixture.detectChanges();
      }));
});
