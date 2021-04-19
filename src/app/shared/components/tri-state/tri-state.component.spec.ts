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
import { TriStateComponent, TriStateEnum } from './tri-state.component';

describe('TriStateComponent', () => {
  let component: TriStateComponent;
  let fixture: ComponentFixture<TriStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TriStateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriStateComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set state when already defined', () => {
    component.state = TriStateEnum.State2;
    fixture.detectChanges();
    expect(component.state).toEqual(TriStateEnum.State2);
  });

  it('should toggle between all the three states', () => {
    component.state = undefined;
    fixture.detectChanges();
    expect(component.state).toEqual(TriStateEnum.State1);

    component.changeState();
    fixture.detectChanges();
    expect(component.state).toEqual(TriStateEnum.State2);

    component.changeState();
    fixture.detectChanges();
    expect(component.state).toEqual(TriStateEnum.State3);

    component.changeState();
    fixture.detectChanges();
    expect(component.state).toEqual(TriStateEnum.State1);

    // invalid state
    component.state = undefined;
    component.checkState();

  });
});
