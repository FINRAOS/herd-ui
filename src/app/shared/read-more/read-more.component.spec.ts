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
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReadMoreComponent} from './read-more.component';
import {SharedModule} from '../shared.module';

describe('ReadMoreComponent', () => {
  let component: ReadMoreComponent;
  let fixture: ComponentFixture<ReadMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMoreComponent);
    component = fixture.componentInstance;
    component.text = 'this is test';
    fixture.detectChanges();
  });

  it('should be created', () => {
     expect(component).toBeTruthy();
  });

  it('should toggle view', () => {
    fixture.detectChanges();
    component.toggleView();
    expect(component.isCollapsed).toEqual(false);
  });

  it('should set current text when isCollapsed is true', () => {
    component.isCollapsed = false;
    component.maxLength = 4;
    fixture.detectChanges();
    component.toggleView();
    expect(component.isCollapsed).toEqual(true);
    expect(component.currentText).toEqual(component.text.slice(0, component.maxLength));
  });

    it('should set current text when isCollapsed is false', () => {
    component.isCollapsed = false;
    component.maxLength = 4;
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.isCollapsed).toEqual(false);
    expect(component.currentText).toEqual(component.text);
  });
});
