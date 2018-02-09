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

import { LatestValidVersionFilterComponent } from './latest-valid-version-filter.component';
import { FilterTemplateComponent } from 'app/data-objects/components/filter-template/filter-template.component';
import { EllipsisOverflowComponent } from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('LatestValidVersionFilterComponent', () => {
  let component: LatestValidVersionFilterComponent;
  let fixture: ComponentFixture<LatestValidVersionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [LatestValidVersionFilterComponent,
        FilterTemplateComponent,
        EllipsisOverflowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestValidVersionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe('Latest Valid Version');
  });

  it('should emit that it is deleted on delete binding', () => {
    component.filterDeleted.subscribe((deleteText) => {
      expect(deleteText).toBe('Latest Valid Version');
    });
    spyOn(component.filterDeleted, 'emit').and.callThrough();
    component.delete();
    expect(component.filterDeleted.emit).toHaveBeenCalledWith('Latest Valid Version');
  });
});
