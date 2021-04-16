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

import { SideActionsComponent } from './side-actions.component';
import { Action, SideActionComponent } from '../side-action/side-action.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { default as AppIcons } from '../../../shared/utils/app-icons';

describe('SideActionsComponent', () => {
  let component: SideActionsComponent;
  let fixture: ComponentFixture<SideActionsComponent>;
  let expectedActions: Action[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule
      ],
      declarations: [SideActionsComponent, SideActionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideActionsComponent);
    component = fixture.componentInstance;
    expectedActions = [new Action(AppIcons.shareIcon, 'Share', () => 'clicked share.', true),
      new Action(AppIcons.watchIcon, 'Watch', () => 'clicked watch.', true)];
    component.actions = expectedActions;
    fixture.detectChanges();

  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose "Actions" object', () => {
    component.actions.forEach(function (action, index) {
      expect(action).toBeDefined();
      expect(action.icon).toEqual(expectedActions[index].icon);
      expect(action.label).toEqual(expectedActions[index].label);
      expect(action.onAction).toEqual(expectedActions[index].onAction);
      expect(action.isDisabled).toEqual(expectedActions[index].isDisabled);
    });
  });
});
