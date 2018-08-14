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
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {SchemaColumnsComponent} from './schema-columns.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Headers} from '@angular/http';
import {BusinessObjectFormatService} from '@herd/angular-client';
import {AlertService, DangerAlert, SuccessAlert} from '../../../core/services/alert.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Observable, throwError } from 'rxjs';
import {CodemirrorModule} from 'ng2-codemirror';
import {ClipboardModule} from 'ngx-clipboard';

describe('SchemaColumnsComponent', () => {
  let component: SchemaColumnsComponent;
  let fixture: ComponentFixture<SchemaColumnsComponent>;

  const ddl = 'select random string that represents ddl';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        CodemirrorModule,
        ClipboardModule,
      ],
      declarations: [
        SchemaColumnsComponent
      ],
      providers: [
        {
          provide: AlertService,
          useValue: {
            alert: jasmine.createSpy('alert')
          }
        },
        {
          provide: BusinessObjectFormatService,
          useValue: {
            businessObjectFormatGenerateBusinessObjectFormatDdl: jasmine.createSpy('businessObjectFormatGenerateBusinessObjectFormatDdl'),
            defaultHeaders: new Headers(),
            configuration: {
              withCredentials: true
            }
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaColumnsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Should open ddl model on click of Generate Format DDL', () => {
    const modal = component.open('test ddl code');
    // this ddl will be blank as we did not passed any ddl
    expect(component.ddl).toEqual('');
    modal.close();
  });

  it('should set schema when get ddl is called', inject([BusinessObjectFormatService],
    (formatApi: BusinessObjectFormatService) => {
      const ddlSpy = (formatApi.businessObjectFormatGenerateBusinessObjectFormatDdl as jasmine.Spy);
      component.bdef = {
        namespace: 'testNS',
        businessObjectDefinitionName: 'testName',
        businessObjectFormatUsage: 'testUSG',
        businessObjectFormatFileType: 'testFileType',
        partitionKey: 'testKey'
      };
      ddlSpy.and.returnValue(Observable.of({ddl: ddl}));
      // fixture.detectChanges() does not work as one of the 3rd party component try to read read only property
      component.ngOnInit();
      component.getDDL(component.bdef);
      expect(component.ddl).toEqual(ddl);
      expect(component.ddlError).toEqual(undefined);
    }));

  it('should show ddl error when get ddl is called', inject([BusinessObjectFormatService],
    (formatApi: BusinessObjectFormatService) => {
      const ddlSpy = (formatApi.businessObjectFormatGenerateBusinessObjectFormatDdl as jasmine.Spy);
      component.bdef = {
        namespace: 'testNS',
        businessObjectDefinitionName: 'testName',
        businessObjectFormatUsage: 'testUSG',
        businessObjectFormatFileType: 'testFileType',
        partitionKey: 'testKey'
      };

      // Test error condition of ddl
      ddlSpy.and.returnValue(throwError({
        status: '500',
        statusText: 'Internal Server Error',
        url: 'theDDLURL',
        json: () => {
          return {message: 'Stuff blew up'}
        }
      }));
      // fixture.detectChanges() does not work as one of the 3rd party component try to read read only property
      component.getDDL(component.bdef);

      expect(component.ddlError).toEqual(new DangerAlert('HTTP Error: 500 Internal Server Error', 'URL: theDDLURL', 'Info: Stuff blew up'));
      expect(formatApi.defaultHeaders.get('skipAlert')).toBe(null);
    }));

  it('should alert successful copy information', inject([AlertService], (a: AlertService) => {
    const alertSpy = (a.alert as jasmine.Spy);
    component.alertSuccessfulCopy();
    expect(alertSpy).toHaveBeenCalledWith(new SuccessAlert('Success!', '', 'DDL Successfully copied to clipboard'));
  }));

  it('should close current modal on cloes()', () => {
    const modal = component.open('test modal close');
    spyOn(modal, 'close').and.callThrough();
    component.close();
    expect(modal.close).toHaveBeenCalled();
  });

});
