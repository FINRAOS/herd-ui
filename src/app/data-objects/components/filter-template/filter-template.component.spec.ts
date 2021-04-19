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

import { FilterTemplateComponent } from './filter-template.component';
import { EllipsisOverflowComponent } from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('FilterTemplateComponent', () => {
  let component: FilterTemplateComponent;
  let fixture: ComponentFixture<FilterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [
        FilterTemplateComponent, EllipsisOverflowComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle and remove filter', () => {
    component.remove();
    component.isFilterContentShown = false;
    component.toggleContent();
    expect(component.isFilterContentShown).toBeTruthy();
  });

});
