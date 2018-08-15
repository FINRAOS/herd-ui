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

// Only implements params and part of snapshot.params

import { Injectable, Directive, Input} from '@angular/core';
import {
  NavigationStart, NavigationEnd, NavigationError,
  NavigationCancel, Event
} from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private paramsSubject = new ReplaySubject(this.testParams);
  params = this.paramsSubject.asObservable();
  private queryParamsSubject = new ReplaySubject(this.testQueryParams);
  queryParams = this.queryParamsSubject.asObservable();
  private dataSubject = new ReplaySubject(this.testData);
  data = this.dataSubject.asObservable();

  outlet: string;


  // Test parameters
  private _testQueryParams: any = {};
  get testQueryParams(): any { return this._testQueryParams; }
  set testQueryParams(queryParams: any) {
    this._testQueryParams = queryParams;
    this.queryParamsSubject.next(queryParams);
  }


  // Test parameters
  private _testParams: any = {};
  get testParams(): any { return this._testParams; }
  set testParams(params: any) {
    this._testParams = params;
    this.paramsSubject.next(params);
  }

  // Test data
  private _testData: any = {};
  get testData(): any { return this._testData; }
  set testData(data: any) {
    this._testData = data;
    this.dataSubject.next(data);
  }

  private _children: ActivatedRouteStub[] = [];

  setChildren(children: ActivatedRouteStub[]) {
    this._children = children
  }

  get snapshot() {
    return {
      outlet: this.outlet,
      params: this.testParams,
      data: this.testData,
      queryParams: this.testQueryParams,
      children: this._children.map((rs) => {
        return rs.snapshot;
      })
    };
  }
}

@Injectable()
export class RouterStub {
  private eventsSubject = new ReplaySubject<Event>();
  private state: any;
  private id = 1;
  navigateByUrl = jasmine.createSpy('navigateByUrl');
  navigate = jasmine.createSpy('navigate');
  routeReuseStrategy = {
    shouldAttach: jasmine.createSpy('shouldAttach'),
    retrieve: jasmine.createSpy('retrieve'),
    store: jasmine.createSpy('store'),
    shouldDetach: jasmine.createSpy('shouldDetach'),
    shouldReuseRoute: jasmine.createSpy('shouldReuseRoute'),
    makeKey: jasmine.createSpy('makeKey'),
    getStorageUnit: jasmine.createSpy('getStorageUnit')
  }

  // Router.events is Observable
  events: Observable<Event>;
  routerState: { root: ActivatedRouteStub, snapshot: any }

  constructor() {
    this.events = this.eventsSubject.asObservable();
    this.routerState = { root: new ActivatedRouteStub, snapshot: {} };
  }

  emitStart(id: number = 1, url: string = 'testUrl.com/test') {
    this.eventsSubject.next(new NavigationStart(this.id, url));
  }
  emitEnd(id: number = 1, url: string = 'testUrl.com/test') {
    this.eventsSubject.next(new NavigationEnd(this.id, url, url));
  }
  emitCancel(id: number = 1, url: string = 'testUrl.com/test', reason: string = 'Test Reason') {
    this.eventsSubject.next(new NavigationCancel(this.id, url, reason));
  }
  emitError(id: number = 1, url: string = 'testUrl.com/test', error: string = 'Test Error') {
    this.eventsSubject.next(new NavigationError(this.id, url, error));
  }

  createUrlTree() {
    return '';
  }

  serializeUrl() {
    return '';
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLink]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(click)': 'onClick()'
  }
})
export class RouterLinkStubDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}




