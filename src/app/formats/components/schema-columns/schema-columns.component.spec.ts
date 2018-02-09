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

import { SchemaColumnsComponent } from './schema-columns.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('SchemaColumnsComponent', () => {
  let component: SchemaColumnsComponent;
  let fixture: ComponentFixture<SchemaColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SchemaColumnsComponent
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

});
