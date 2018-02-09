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
import {By} from '@angular/platform-browser';
import { SideActionComponent } from './side-action.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {Action} from './side-action.component';
import {click} from '../../utils/click-helper';

describe('SideActionComponent', () => {
  let component: SideActionComponent;
  let fixture: ComponentFixture<SideActionComponent>;
  let expectedAction: Action;
  let divElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
          imports: [
            NgbModule.forRoot()],
          declarations: [ SideActionComponent ]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideActionComponent);
    component = fixture.componentInstance;
    expectedAction = new Action('<i class=\'fa fa-share-alt\'></i>',
        'Share', () => {return 'clicked share.' }, true);
    component.action = expectedAction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose "Action" object', () => {
    expect(component.action).toBeDefined();
    expect(component.action.icon).toEqual(expectedAction.icon);
    expect(component.action.label).toEqual(expectedAction.label);
    expect(component.action.onAction).toEqual(expectedAction.onAction);
    expect(component.action.isDisabled).toEqual(expectedAction.isDisabled);
  });

  describe('template is loaded', () => {
    let onActionSpy;
    beforeEach(() => {
      divElement = fixture.debugElement.query(By.css('div'));
      onActionSpy = jasmine.createSpy('onAction');
      component.action.onAction = onActionSpy;

    });

    it('should not call the "onAction" binding when clicked and component is disabled as boolean', () => {
      click(divElement);
      expect(onActionSpy).not.toHaveBeenCalled();
    });

    it('should not call the "onAction" binding when clicked and component is disabled as function', () => {
      component.action.isDisabled = function () {
        return true;
      }
      click(divElement);
      expect(onActionSpy).not.toHaveBeenCalled();
    });

    it('should call the "onAction" binding when clicked and component is enabled as function', () => {
      component.action.isDisabled = function () {
        return false;
      }
      click(divElement);
      expect(onActionSpy).toHaveBeenCalled();
    });

    it('should call the "onAction" binding when clicked and component is enabled as boolean', () => {
      component.action.isDisabled = false;
      click(divElement);
      expect(onActionSpy).toHaveBeenCalled();
    });

    it('should not call the "onAction" binding when it is not set', () => {
      component.action.onAction = null;
      component.action.isDisabled = false;
      click(divElement);
      expect(onActionSpy).not.toHaveBeenCalled();
    });

    it('should not call the "onAction" when disabled is undefined', () => {
      component.action.isDisabled = undefined;
      click(divElement);
      expect(onActionSpy).toHaveBeenCalled();
    });

  });
});
