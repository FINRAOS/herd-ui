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
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { BackTrackComponent } from './back-track.component';
import { Injectable } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { Location } from '@angular/common';
import { By, Title } from '@angular/platform-browser';
import { ActivatedRouteStub, RouterStub } from 'testing/router-stubs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MockCustomLocation {
  public state: any;
  getHistoryState = jasmine.createSpy('getHistoryState').and.callFake(() => this.state);
  mergeState = jasmine.createSpy('mergeState').and.callFake((state) => {
    this.state = state;
  });
  path = jasmine.createSpy('getHistoryState').and.returnValue('test.url');
  back = jasmine.createSpy('back');

  clearState() {
    this.state = undefined;
  }
}


describe('BackTrackComponent', () => {
  let component: BackTrackComponent;
  let fixture: ComponentFixture<BackTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: Location, useClass: MockCustomLocation
        }, {
          provide: Title, useFactory: () => {
            let fTitle = 'Initial';
            return {
              getTitle: jasmine.createSpy('getTitle').and.returnValue(fTitle),
              setTitle: jasmine.createSpy('setTitle').and.callFake((t) => fTitle = t)
            };
          }
        }, {
          provide: Router,
          useClass: RouterStub
        }],
      declarations: [BackTrackComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call location\s back on link click', inject([Location], (loc: Location) => {
    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('click', null);
    expect(loc.back).toHaveBeenCalled();
  }));

  // happy path
  it('should set current title to data of current route and save previous route title',
    inject([Router, Location, Title], (router: RouterStub, loc: Location, title: Title) => {

      router.emitStart();
      // previous title with prefix
      expect(component.tempPreviousTitle).toBe('Initial');

      router.routerState.root.testData = {
        resolvedData: {
          title: 'Test 1'
        }
      };
      router.routerState.root.setChildren([]);

      router.emitEnd();
      // previous title without prefix
      expect(component.tempPreviousTitle).toBe('Initial');
      expect(component.currentTitle).toBe('Test 1');
      expect(component.previousTitle).toBe('Initial');
      expect(title.setTitle).toHaveBeenCalledWith(environment.docTitlePrefix + ' - Test 1');
      expect(((loc as any) as MockCustomLocation).mergeState)
        .toHaveBeenCalledWith({title: 'Test 1', previousTitle: 'Initial'});
    }));

  it('should not show data or set previous title if ignorePreviousTitle is true',
    inject([Router, Location, Title], (router: RouterStub, loc: Location, title: Title) => {
      router.emitStart();
      // previous title with prefix
      expect(component.tempPreviousTitle).toBe('Initial');
      router.routerState.root.testData = {
        resolvedData: {
          title: 'Test 1'
        },
        ignorePreviousTitle: true
      };

      router.emitEnd();
      // previous title without prefix
      expect(component.tempPreviousTitle).toBe('Initial');
      expect(component.currentTitle).toBe('Test 1');
      expect(component.previousTitle).not.toBeDefined();
      expect(title.setTitle).toHaveBeenCalledWith(environment.docTitlePrefix + ' - Test 1');
      expect(((loc as any) as MockCustomLocation).mergeState)
        .toHaveBeenCalledWith({title: 'Test 1', previousTitle: undefined});
    }));

  it('should use history state for title data if it exists',
    inject([Router, Location, Title], (router: RouterStub, loc: Location, title: Title) => {
      router.emitStart();
      // previous title with prefix
      expect(component.tempPreviousTitle).toBe('Initial');

      router.routerState.root.testData = {
        resolvedData: {
          title: 'Test 1'
        }
      };

      const mockLoc = ((loc as any) as MockCustomLocation);
      mockLoc.state = {
        title: 'Previously Stored Title',
        previousTitle: 'Previously Stored Previous Title'
      };

      router.emitEnd();
      // previous title without prefix
      expect(component.tempPreviousTitle).toBe('Initial');
      expect(component.currentTitle).toBe(mockLoc.state.title);
      expect(component.previousTitle).toBe(mockLoc.state.previousTitle);
      expect(title.setTitle).toHaveBeenCalledWith(environment.docTitlePrefix + ' - ' + mockLoc.state.title);
    }));

  it('should set current title to empty string when resovled data deson\'t exist',
    inject([Router, Location, Title], (router: RouterStub, loc: Location, title: Title) => {
      router.emitStart();
      // previous title with prefix
      expect(component.tempPreviousTitle).toBe('Initial');

      router.emitEnd();
      // previous title without prefix
      expect(component.tempPreviousTitle).toBe('Initial');
      expect(component.currentTitle).toBe('');
      expect(component.previousTitle).toBe('Initial');
      expect(title.setTitle).toHaveBeenCalledWith(environment.docTitlePrefix);
      expect(((loc as any) as MockCustomLocation).mergeState)
        .toHaveBeenCalledWith({title: '', previousTitle: 'Initial'});
    }));

  it('should process properly when excludeFromCaching is set',
    inject([Router, Location, Title], (r: RouterStub, loc: MockCustomLocation, title: Title) => {

      r.routerState.root.outlet = PRIMARY_OUTLET;
      r.routerState.root.testData = {
        resolvedData: {
          title: 'testExclude'
        },
        excludeFromCaching: true
      };

      r.emitStart();
      // due to no historyState
      expect(component.tempPreviousTitle).toBe('');

      loc.state = {};
      r.emitStart();
      // has historyState but doesn't have previousTitle defined;
      expect(component.tempPreviousTitle).toBe('');

      loc.state = {previousTitle: 'someTitle'};
      r.emitStart();
      // has historyState and previousTitle defined
      expect(component.tempPreviousTitle).toBe('someTitle');

      r.emitEnd();

      // uses history title
      expect(component.tempPreviousTitle).toBe('someTitle');
      expect(component.currentTitle).toBe('testExclude');
      // uses history title
      expect(component.previousTitle).toBe('someTitle');
      // still properly sets title
      expect(title.setTitle).toHaveBeenCalledWith(environment.docTitlePrefix + ' - testExclude');
      // does not merge state
      expect(((loc as any) as MockCustomLocation).mergeState).not.toHaveBeenCalled();

      // make sure if no title exists it is set to empty string.
      r.routerState.root.testData = {
        resolvedData: {},
        excludeFromCaching: true
      };

      r.emitEnd();

      expect(component.tempPreviousTitle).toBe('someTitle');
      // no data set for title
      expect(component.currentTitle).toBe('');
      // uses history title
      expect(component.previousTitle).toBe('someTitle');
      // still properly sets title
      expect(title.setTitle).toHaveBeenCalledWith(environment.docTitlePrefix);
      // does not merge state
      expect(((loc as any) as MockCustomLocation).mergeState).not.toHaveBeenCalled();
    }));

  it('should find primary route through a tree of snapshots',
    inject([Router, Location, Title], (router: RouterStub, loc: Location, title: Title) => {
      router.emitStart();
      // previous title with prefix
      expect(component.tempPreviousTitle).toBe('Initial');

      router.routerState.root.outlet = PRIMARY_OUTLET;

      const nonPrimaryData = {
        resolvedData: {
          title: 'notPrimary'
        }
      };
      const fc = new ActivatedRouteStub();
      fc.outlet = PRIMARY_OUTLET;
      const l1 = new ActivatedRouteStub();
      l1.outlet = 'notPrimary';
      l1.testData = nonPrimaryData;
      const l2 = new ActivatedRouteStub();
      l2.outlet = PRIMARY_OUTLET;
      l2.testData = {
        resolvedData: {
          title: 'successfully found!'
        }
      };
      const l3 = new ActivatedRouteStub();
      l3.outlet = 'notPrimary';
      l3.testData = nonPrimaryData;
      fc.setChildren([l1, l2, l3]);
      router.routerState.root.setChildren([fc]);

      router.emitEnd();
      // previous title without prefix
      expect(component.tempPreviousTitle).toBe('Initial');
      expect(component.currentTitle).toBe('successfully found!');
      expect(component.previousTitle).toBe('Initial');
      expect(title.setTitle).toHaveBeenCalledWith(environment.docTitlePrefix + ' - successfully found!');
      expect(((loc as any) as MockCustomLocation).mergeState)
        .toHaveBeenCalledWith({title: 'successfully found!', previousTitle: 'Initial'});
    }));
});
