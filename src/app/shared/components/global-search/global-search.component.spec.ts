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
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { GlobalSearchComponent } from './global-search.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteStub, RouterStub } from 'testing/router-stubs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let searchTextBox: DebugElement;
  let allCheckBox: DebugElement;
  let columnCheckBox: DebugElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        HttpModule,
        FormsModule
      ],
      declarations: [GlobalSearchComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    searchTextBox = fixture.debugElement.query(By.css('input[type="text"]'));
    allCheckBox = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[0];
    columnCheckBox = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'))[1];
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate when search term is large enough',
    inject([Router], (mock: RouterStub) => {
      fixture.detectChanges();
      component.search('muni');
      expect(mock.navigate).toHaveBeenCalledWith(['search', 'muni'], {
        queryParams: {
          match: ''
        }
      });
      expect(component.error).toBe(false);
    }));

  it('should display error message when searchText is less than min search length',
    inject([Router], (mock: RouterStub) => {
      fixture.detectChanges();
      component.search('m');
      expect(mock.navigate).not.toHaveBeenCalled();
      expect(component.error).toBe(true);
    }));

  it('should call search when enter is hit anywhere in the host element', async(() => {
    fixture.detectChanges();
    const searchSpy = spyOn(component, 'search');
    searchTextBox.nativeElement.value = 'testSearch';
    searchTextBox.triggerEventHandler('input', { target: searchTextBox.nativeElement});
    // keyup on the actual root element
    fixture.debugElement.triggerEventHandler('keyup.enter', {});
    expect(searchSpy).toHaveBeenCalledWith('testSearch');
    expect(component.searchText).toBe('testSearch');

    searchTextBox.nativeElement.value = 'testSearch2';
    searchTextBox.triggerEventHandler('input', { target: searchTextBox.nativeElement});

    // setup bubble keyboard event
    let ev: KeyboardEvent;

    try {
      ev = new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' });
    } catch {
      // for phantomjs
      ev = document.createEvent('KeyboardEvent');
      ev.initKeyboardEvent('keyup', true, true, window, 'Enter', 0, '', false, '');
    }

    // keyup on an internal element that bubbles to the root element
    searchTextBox.nativeElement.dispatchEvent(ev);
    expect(searchSpy).toHaveBeenCalledWith('testSearch2');
    expect(component.searchText).toBe('testSearch2');
  }));

  it('should properly set param / queryParam fields on init', inject([ActivatedRoute], (mock: ActivatedRouteStub) => {
    mock.testQueryParams = { match: 'column,others,testingMore,matches'};
    mock.testParams = { searchTerm: 'newSearch' };
    fixture.detectChanges();
    expect(component.match).toEqual(mock.snapshot.queryParams.match.split(','));
    expect(component.searchText).toEqual('newSearch');
    expect(component.hitMatch.all).toBe(false);
    expect(component.hitMatch.hitType.column).toBe(true);

    // testing setter when it doesn't include a field that is in the hittype
    component.match = ['others', 'test'];
    expect(component.hitMatch.all).toBe(false);
    expect(component.hitMatch.hitType.column).toBe(false);
  }));

  it('should properly update searchTerm and match when navigationEnd occurs',
  async(inject([ActivatedRoute, Router], (mockRoute: ActivatedRouteStub, mockRouter: RouterStub) => {
    mockRoute.testParams = {
      searchTerm: 'test search'
    }
    mockRoute.testQueryParams = {
      match: 'column'
    }
    fixture.detectChanges();

    expect(component.searchText).toEqual('test search');
    expect(component.match).toEqual(['column']);
    expect(component.hitMatch).toEqual({ all: false, hitType: { column: true }});

    mockRoute.testParams = {
      searchTerm: 'test search 2'
    }
    mockRoute.testQueryParams = {
      match: ''
    }
    mockRouter.emitEnd();

    expect(component.searchText).toEqual('test search 2');
    expect(component.match).toEqual([]);
    expect(component.hitMatch).toEqual({ all: true, hitType: { column: false }});
  })));

  it('should set match properly when checkboxes are selected', async(() => {
    fixture.detectChanges();
    expect(component.hitMatch.all).toBe(true);
    expect(allCheckBox.nativeElement.disabled).toBe(true);
    expect(component.hitMatch.hitType.column).toBe(false);

    component.showHitMatchFilter = true;
    fixture.detectChanges();

    columnCheckBox.nativeElement.checked = true;
    columnCheckBox.triggerEventHandler('change', {target: columnCheckBox.nativeElement});
    fixture.detectChanges();
    expect(component.match).toEqual(['column']);
    expect(component.hitMatch.all).toBe(false);
    expect(allCheckBox.nativeElement.disabled).toBe(false);
    expect(component.hitMatch.hitType.column).toBe(true);

    columnCheckBox.nativeElement.checked = false;
    columnCheckBox.triggerEventHandler('change', {target: columnCheckBox.nativeElement});
    fixture.detectChanges();
    expect(component.match).toEqual([]);
    expect(component.hitMatch.all).toBe(true);
    expect(allCheckBox.nativeElement.disabled).toBe(true);
    expect(component.hitMatch.hitType.column).toBe(false);

    columnCheckBox.nativeElement.checked = true;
    columnCheckBox.triggerEventHandler('change', {target: columnCheckBox.nativeElement});
    fixture.detectChanges();
    allCheckBox.nativeElement.checked = true;
    allCheckBox.triggerEventHandler('change', {target: allCheckBox.nativeElement});
    fixture.detectChanges();
    expect(component.match).toEqual([]);
    expect(component.hitMatch.all).toBe(true);
    expect(allCheckBox.nativeElement.disabled).toBe(true);
    expect(component.hitMatch.hitType.column).toBe(false);
  }));
});
