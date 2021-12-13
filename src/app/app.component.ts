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
import { BeastEvent, BeastService } from './shared/services/beast.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AlertService } from 'app/core/services/alert.service';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { CustomRouteReuseStrategy } from 'app/core/services/custom-route-reuse-strategy.service';
import { WINDOW } from 'app/core/core.module';
import { Utils } from 'app/utils/utils';
import { FacetTriState } from './shared/services/facet-tri-state.enum';


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

  constructor(private alerter: AlertService,
              private router: Router,
              private ga: GoogleAnalyticsService,
              private bs: BeastService,
              public cu: UserService,
              private route: ActivatedRoute,
              @Inject(WINDOW) private window: any
  ) {
    this.skipDictionary = {};
    // handled skipAlert flag for messaging of failed requests
    // this.interceptor.request().addInterceptor(this.reqInterceptable);

    // for every request if we get an error notify the user of it
    // this.interceptor.response().addInterceptor(this.respInterceptable);
  }

  ngOnInit() {
    // compatability with IE or other browsers that don't support scroll restoration
    // TODO: take this chck out when IE/EDGE supports scroll restoration
    if (this.window.history.scrollRestoration) {
      this.window.history.scrollRestoration = 'manual';
    } else {
      // Observable.fromEvent is the only way for us to copmletely test this module
      // TODO: look for ways to mock the lettable operator fromEvent and use it instead
      const scrollEvents = fromEvent<UIEvent>(this.window, 'scroll');
      const popStateEvents = fromEvent<PopStateEvent>(this.window, 'popstate');

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
        this.isLoading = false;
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
            }, 0);
          } else {
            this.window.scrollTo(0, 0);
          }

          this.ga.sendPageViewData(event.urlAfterRedirects);

          const redirectComponent = this.bs.mapUrlToComponent(event.urlAfterRedirects);
          console.log('redirectComponent', redirectComponent);
          const postParams: BeastEvent = <BeastEvent>{};
          postParams.eventId = (event.id).toString();
          postParams.component = redirectComponent;
          postParams.action = 'View';
          this.bs.postEvent(postParams);
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
      this.isLoading = true;
    });
  }

}
