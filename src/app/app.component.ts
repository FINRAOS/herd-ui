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
import { UserService } from 'app/core/services/user.service';
import { GoogleAnalyticsService } from './shared/services/google-analytics.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { HttpInterceptorService, Interceptable, Interceptor } from 'ng-http-interceptor';
import { AlertService, DangerAlert } from 'app/core/services/alert.service';
import { tap, debounceTime, filter } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge'
import { Observable } from 'rxjs/Observable';

import {
  Router, NavigationEnd, NavigationStart, NavigationCancel,
  NavigationError, ActivatedRoute, ActivatedRouteSnapshot, PRIMARY_OUTLET
} from '@angular/router';
import { CustomRouteReuseStrategy } from 'app/core/services/custom-route-reuse-strategy.service';
import { WINDOW } from 'app/core/core.module';
import { Utils } from 'app/utils/utils';


@Component({
  selector: 'sd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  previousRoute: ActivatedRouteSnapshot;
  previousScroll: number;
  isLoading = false;
  skipDictionary: { [path: string]: number };
  reqInterceptable: Interceptor<any[], any[]> = req => {
    // the header can't be in the request for servers that don't support it
    // In this case rip out this header and mark that we want
    // to skip this url
    if (req[1] && req[1].headers && (req[1] as RequestOptions).headers.get('skipAlert')) {
      const key = req[0] + (req[1].search && req[1].search.toString() ? `?${req[1].search.toString()}` : '');
      const value = this.skipDictionary[key];
      (req[1] as RequestOptions).headers.delete('skipAlert');
      this.skipDictionary[key] = value ? value + 1 : 1;
    }

    return req;
  };
  respInterceptable: Interceptor<Observable<Response>, Observable<Response>> = res => res.pipe(tap(null, e => {
    if (e.url) {
      if (!this.skipDictionary[e.url] || this.skipDictionary[e.url] === 0) {
        this.alerter.alert(new DangerAlert('HTTP Error: ' + e.status + ' ' + e.statusText,
          'URL: ' + e.url, 'Info: ' + e.json().message));
      } else {
        this.skipDictionary[e.url]--;
      }
    }
    return e;
  }));
  constructor(private alerter: AlertService,
    public interceptor: HttpInterceptorService,
    private router: Router,
    private ga: GoogleAnalyticsService,
    public cu: UserService,
    private route: ActivatedRoute,
    @Inject(WINDOW) private window: any
  ) {
    this.skipDictionary = {};
    // handled skipAlert flag for messaging of failed requests
    this.interceptor.request().addInterceptor(this.reqInterceptable);

    // for every request if we get an error notify the user of it
    this.interceptor.response().addInterceptor(this.respInterceptable);
  }

  ngOnInit() {
    // compatability with IE or other browsers that don't support scroll restoration
    // TODO: take this chck out when IE/EDGE supports scroll restoration
    if (this.window.history.scrollRestoration) {
      this.window.history.scrollRestoration = 'manual';
    } else {
      // Observable.fromEvent is the only way for us to copmletely test this module
      // TODO: look for ways to mock the lettable operator fromEvent and use it instead
      const scrollEvents = Observable.fromEvent<UIEvent>(this.window, 'scroll');
      const popStateEvents = Observable.fromEvent<PopStateEvent>(this.window, 'popstate');

      merge(scrollEvents, popStateEvents).pipe(debounceTime(100)).subscribe((e) => {
        if (e instanceof UIEvent) {
          this.previousScroll = this.window.pageYOffset;
        }
      });
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError),
      tap(event => {
        this.isLoading = false
        if (event instanceof NavigationEnd) {
          const savedRoute = (this.router.routeReuseStrategy as CustomRouteReuseStrategy)
            .getStorageUnit(Utils.findPrimaryRoute(this.route.snapshot));
          if (this.previousRoute) {
            const previousSavedRoute = (this.router.routeReuseStrategy as CustomRouteReuseStrategy).getStorageUnit(this.previousRoute);
            if (previousSavedRoute) {
              previousSavedRoute.scrollPosition = this.previousScroll;
            }
          }

          if (savedRoute) {
            const saved = savedRoute;
            // tried not using setTimeout and using timeout of 0 but it didn't work perfectly
            // adding this timeout helped.
            // TODO: use a better solution than setTimeout if one becomes avaialble for autoscrolling after content loads
            setTimeout(() => {
              this.window.scrollTo(0, Math.round(saved.scrollPosition));
            }, 0)
          } else {
            this.window.scrollTo(0, 0);
          }

          this.ga.sendPageViewData(event.urlAfterRedirects);
        }

        if (event instanceof NavigationStart) {
          this.previousRoute = Utils.findPrimaryRoute(this.route.snapshot);
          // TODO: take this chck out when IE/EDGE supports scroll restoration
          if (this.window.history.scrollRestoration) {
            this.previousScroll = this.window.pageYOffset;
          }
        }
      }),
      debounceTime(500),
      filter(event => event instanceof NavigationStart),
    ).subscribe(event => {
      this.isLoading = true
    });
  }

}
