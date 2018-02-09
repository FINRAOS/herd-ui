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
import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';

import { DataEntityListComponent } from './data-entity-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub, RouterLinkStubDirective } from 'testing/router-stubs';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { newEvent } from 'testing/testing-utils';

describe('DataEntityListComponent', () => {
  let component: DataEntityListComponent;
  let fixture: ComponentFixture<DataEntityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        FormsModule],
      declarations: [DataEntityListComponent, RouterLinkStubDirective],
      providers: [{
        provide: ElementRef, useValue: {
          nativeElement: {
          }
        }
      }, {
        provide: ActivatedRoute,
        useClass: ActivatedRouteStub
      }, {
        provide: Router, useValue: {
          navigate: jasmine.createSpy('navigate')
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should set data on data change', async(inject([ActivatedRoute, Router], (route: ActivatedRoute, router: Router) => {
    spyOn(component.searchInput, 'focus');

    (route as any).testData = {
      resolvedData: {
        dataEntities: [{ namespace: 'ns', businessObjectDefinitionName: 'bdef1' }, {
          namespace: 'ns', businessObjectDefinitionName: 'bdef2'
        }, {
          namespace: 'vsn2', businessObjectDefinitionName: 'bdef3'
        }],
        total: 3
      }
    }

    fixture.detectChanges();
    expect(component.dataEntities).toEqual((route as any).testData.resolvedData.dataEntities);
    expect(component.total).toEqual(3);
    expect(component.searchInput.focus).toHaveBeenCalled();
  })));

  it('should set searchTerm on queryParams change', async(inject([ActivatedRoute, Router],
    (route: ActivatedRouteStub, router: Router) => {

      spyOn(component.searchInput, 'focus');
      (route as any).testQueryParams = {
        searchTerm: 'testSearchTerm'
      }
      fixture.detectChanges();
      expect(component.searchTerm).toEqual(route.testQueryParams.searchTerm);
      expect(component.searchInput.focus).toHaveBeenCalled();

      // test to make sure it will set it to '' when there is no term at all.
      component.searchTerm = undefined;
      (route as any).testQueryParams = {
        searchTerm: ''
      }
      fixture.detectChanges();
      expect(component.searchTerm).toEqual(route.testQueryParams.searchTerm);
      expect(component.searchInput.focus).toHaveBeenCalledTimes(2);
    })));

  it('should trigger navigations on delayed keyUp of searchInput', fakeAsync(inject([ActivatedRoute, Router],
    (route: ActivatedRouteStub, router: Router) => {

      const input = component.searchInput;
      input.value = 'test'
      input.dispatchEvent(newEvent('keyup'));
      tick(250);
      expect(router.navigate).not.toHaveBeenCalled();
      input.value = 'tes2'
      input.dispatchEvent(newEvent('keyup'));
      tick(250);
      expect(router.navigate).not.toHaveBeenCalled();
      input.value = 'test3'
      input.dispatchEvent(newEvent('keyup'));
      tick(500);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/data-entities'],
        {
          queryParams: {
            searchTerm: 'test3'
          },
          replaceUrl: true
        });
    })));
});
