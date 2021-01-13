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
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EllipsisOverflowComponent } from './ellipsis-overflow.component';

describe('EllipsisOverflowComponent', () => {
  let component: EllipsisOverflowComponent;
  let fixture: ComponentFixture<EllipsisOverflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [EllipsisOverflowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipsisOverflowComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render content in the view', () => {
    component.ellipsisContent = 'I am testing my ellipsis component.';
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(div.textContent).toContain(component.ellipsisContent);
  });

  it('should not show tooltip on mouse over of the element if width is not expected', () => {
    component.ellipsisContent = 'I am testing my ellipsis component.';
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.ellipsis-overflow'));
    div.triggerEventHandler('mouseover', null);
    fixture.detectChanges();
    expect(component.tooltip.isOpen()).toBeFalsy();  // this will be false as client width and scroll width will same
    div.triggerEventHandler('mouseout', null);
    fixture.detectChanges();
    expect(component.tooltip.isOpen()).toBeFalsy();
  });

  it('should show tooltip on mouse over of the element', () => {
    // setting the width manually to test tooltip over it.
    fixture.debugElement.nativeElement.style.width = '100px';
    const div = fixture.debugElement.query(By.css('.ellipsis-overflow'));
    component.ellipsisContent = 'I am testing my ellipsis component.';
    fixture.detectChanges();

    div.triggerEventHandler('mouseover', null);
    fixture.detectChanges();
    expect(component.tooltip.isOpen()).toBeTruthy();
    div.triggerEventHandler('mouseout', null);
    fixture.detectChanges();
    expect(component.tooltip.isOpen()).toBeFalsy();
  });

});
