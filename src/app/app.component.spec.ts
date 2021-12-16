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
import { GoogleAnalyticsService } from './shared/services/google-analytics.service';
import { ActivatedRouteStub, RouterStub } from 'testing/router-stubs';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AlertsComponent } from './core/components/alerts/alerts.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { WINDOW } from 'app/core/core.module';
import { AlertService } from 'app/core/services/alert.service';
import * as rxjs from 'rxjs';
import { of, ReplaySubject } from 'rxjs';
import { EllipsisOverflowComponent } from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import { Utils } from 'app/utils/utils';
import { Component } from '@angular/core';
import { UserService } from 'app/core/services/user.service';
import { SpinnerComponent } from 'app/shared/components/spinner/spinner.component';
import { BeastService } from './shared/services/beast.service';

let ui: any = null;
// support needed here for phantomJS until we switdch to headless chrome
// TODO: take out this and simply using new UIEvent() when we switch to headless chrome
try {
  ui = new UIEvent('scroll');
} catch (e) {
  ui = document.createEvent('UIEvent');
  ui.initUIEvent('scroll', false, false, null, 0);
}

@Component({
  selector: 'sd-back-track',
  template: '<div>mock</div>'
})
class MockBackTrackComponent {

}

fdescribe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule,
        InlineSVGModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        MockBackTrackComponent,
        HeaderComponent,
        AlertsComponent,
        EllipsisOverflowComponent,
        SpinnerComponent,
      ],
      providers: [
        {
          provide: UserService,
          useValue: {
            userAuthorizations: {userId: 'K30199@gmail.com'}
          }
        },
        /*{
        provide: HttpInterceptorService, useFactory: () => {
          const int = jasmine.createSpy('addInterceptor');
          return {
            request: () => {
              return {
                addInterceptor: int
              }
            },
            response: () => {
              return {
                addInterceptor: int
              }
            }
          }

        }
      },*/ {
          provide: AlertService,
          useValue: {
            alert: jasmine.createSpy('alert'),
            alerts: of()
          }
        }, {
          provide: Router,
          useClass: RouterStub
        }, {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub
        },
        {
          provide: GoogleAnalyticsService, useValue: {
            sendPageViewData: jasmine.createSpy('sendPageViewData')
          }
        },
        BeastService,
        {
          provide: WINDOW,
          useValue: {
            history: {
              scrollRestoration: 'auto'
            },
            scrollTo: jasmine.createSpy('scrollTo')
          }
        }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should initialize http interception properly', async(inject([AlertService],
    (a: AlertService) => {
      const app = fixture.componentInstance;
    })));

  it('should send data to Google analytics on navigation end', inject([GoogleAnalyticsService, Router],
    (ga: GoogleAnalyticsService, router: RouterStub) => {
      const app = fixture.componentInstance;
      // will send on every navigation end
      router.emitEnd(1, 'awesomeUrlEnd.com');
      fixture.detectChanges();
      expect(ga.sendPageViewData).toHaveBeenCalledWith('awesomeUrlEnd.com');
    }
  ));

  fit('should send data to Beast Service on navigation end', inject([BeastService, Router],
    (bs: BeastService, router: RouterStub) => {
      const bsSpy = spyOn(bs, 'postEvent');
      const app = fixture.componentInstance;
      // will send on every navigation end
      router.emitEnd(1, 'awesomeUrlEnd.com');
      fixture.detectChanges();
      expect(bsSpy).toHaveBeenCalled();
    }
  ));

  it('should have autoscroll feature when browser supports history.scrollRestoration', fakeAsync(inject([WINDOW, Router, ActivatedRoute],
    (win: any, router: RouterStub, route: ActivatedRouteStub) => {
      const app = fixture.componentInstance;
      spyOn(Utils, 'findPrimaryRoute').and.returnValue(route.snapshot);
      fixture.detectChanges();
      // set it to manual so we handle all scorlling.
      expect(win.history.scrollRestoration).toEqual('manual');

      expect(app.isLoading).toBeFalsy();
      win.pageYOffset = 42;
      router.emitStart();
      fixture.detectChanges();

      expect(app.previousScroll).toEqual(42);
      expect(Utils.findPrimaryRoute).toHaveBeenCalledWith(route.snapshot);
      expect(app.isLoading).toBeFalsy();

      // should only show loading icon if load takes over half a second.
      tick(501);
      expect(app.isLoading).toBeTruthy();

      // return nothing for the new route and something for the previous route since it exists
      const prevSavedRoute = {route: route.snapshot, scrollPosition: undefined};
      router.routeReuseStrategy.getStorageUnit.and.returnValues(undefined, prevSavedRoute);
      router.emitEnd();
      fixture.detectChanges();
      tick(501); // to get passed debounceTime

      // should set previous scroll to saved variable to use it later.
      expect(prevSavedRoute.scrollPosition).toBe(42);
      expect(app.isLoading).toBeFalsy();
      // if the current route doens't exist in history scroll to 0, 0
      expect(win.scrollTo).toHaveBeenCalledWith(0, 0);


      // return nothing for the old route and return something for new route to mock
      router.routeReuseStrategy.getStorageUnit.and.returnValues({route: route.snapshot, scrollPosition: 42}, undefined);
      router.emitEnd();
      fixture.detectChanges();
      tick(501); // to get passed debounceTime
      expect(app.isLoading).toBeFalsy();
      expect(win.scrollTo).toHaveBeenCalledWith(0, 42);

      router.routeReuseStrategy.getStorageUnit.calls.reset();
      // should still work when there is no previous route.
      app.previousRoute = undefined;
      router.emitEnd();
      fixture.detectChanges();
      tick(501); // to get passed debounceTime
      // should be called once just to try to get the current saved route and not the previous route.
      expect(router.routeReuseStrategy.getStorageUnit).toHaveBeenCalledTimes(1);
    })
  ));

  // include this one issue fixed here https://github.com/ReactiveX/rxjs/issues/3848
  xit('should have autoscroll feature when browser does not support scrollRestoration', fakeAsync(inject([WINDOW, Router],
    (win: any, router: RouterStub) => {
      const app = fixture.componentInstance;
      win.history.scrollRestoration = undefined;
      const scrollObs = new ReplaySubject();
      const popStateObs = new ReplaySubject();

      // should capture pageYOffset on scroll after 100 ms and when the last event
      // is not a popstate event
      spyOn(rxjs, 'fromEvent').and.callFake((objMakingEvents, eventType) => {
        if (eventType === 'scroll') {
          return scrollObs.asObservable();
        } else {
          return popStateObs.asObservable();
        }
      });

      win.pageYOffset = 42;
      fixture.detectChanges();
      expect(app.previousScroll).not.toBeDefined();

      // not within 100 ms
      scrollObs.next(ui);
      tick(50);
      expect(app.previousScroll).not.toBeDefined();

      // not if last was popstate
      popStateObs.next(new PopStateEvent('popstate'));
      tick(101);
      expect(app.previousScroll).not.toBeDefined();

      scrollObs.next(ui);
      tick(101);
      expect(app.previousScroll).toEqual(42);

      win.pageYOffset = 50000;
      router.emitStart();
      tick(501);
      fixture.detectChanges();

      // previous scroll shout not change on navigation start if the browser does not support
      // history.scrollRestoration
      expect(app.previousScroll).toBe(42);
    })
  ));


});
