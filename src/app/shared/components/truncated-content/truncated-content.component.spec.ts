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
import { TruncatedContentComponent } from './truncated-content.component';
import { click } from '../../utils/click-helper';
import { SimpleChanges } from '@angular/core';


describe('TruncatedContentComponent', () => {
  let component: TruncatedContentComponent;
  let fixture: ComponentFixture<TruncatedContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TruncatedContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruncatedContentComponent);
    component = fixture.componentInstance;

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should hold default values', () => {
    const cont = '<p> test block </p><br> <p> test block </p> <br><p> test block </p>';
    component.content = cont;
    fixture.detectChanges();

    const element: HTMLElement = fixture.debugElement.query(By.css('.toggle-content')).nativeElement;
    expect(element.innerText).toEqual('');
    expect(component.showLines).toEqual(1);
    expect(component.readMoreText).toEqual('');
    expect(component.showLessText).toEqual('');
    click(element);
    expect(element.innerText).toEqual('');
  });

  it('should expose showlines, content, readMoreText, showLessText and process click events', () => {
    const cont = '<p> test block </p><br> <p> test block </p> <br><p> test block </p>';
    component.showLines = 2;
    component.readMoreText = 'readMoreText';
    component.showLessText = 'showLessText';
    component.content = cont;
    spyOn(component, 'processToggle').and.callThrough();
    fixture.detectChanges();

    const element: HTMLElement = fixture.debugElement.query(By.css('.toggle-content')).nativeElement;
    expect(element.innerText).toEqual('ReadMoreText');
    expect(component.wrapper.style.maxHeight).toBe(component.baseLines);
    // proves clicking proplery changes toggle-content text
    click(element);
    fixture.detectChanges();
    expect(component.processToggle).toHaveBeenCalledTimes(1);
    expect(component.wrapper.style.maxHeight).toBe(parseFloat(component.contentStyles.height) +
      parseFloat(component.contentStyles.marginTop) + parseFloat(component.contentStyles.marginBottom) + 'px');
    expect(element.innerText).toEqual('ShowLessText');
    click(element);
    fixture.detectChanges();
    expect(component.processToggle).toHaveBeenCalledTimes(2);
    expect(component.wrapper.style.maxHeight).toBe(component.baseLines);
    expect(element.innerText).toEqual('ReadMoreText');
  });


  it('should hide toggleContent when there isn\'t enough content to need toggling', () => {
    const cont = '<p> test block </p><br> <p> test block </p> <br><p> test block </p>';
    component.content = cont;
    component.showLines = 10;
    fixture.detectChanges();

    expect(component.toggle.classList.contains('hide')).toBe(true);
    expect(component.toggle.style.width).toBe('');
    expect(component.toggle.style.height).toBe('');
  });
});

