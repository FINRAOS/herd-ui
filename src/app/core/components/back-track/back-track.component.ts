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
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ConfigService } from 'app/core/services/config.service';
import { CustomLocation } from 'app/core/services/custom-location.service';
import { Utils } from 'app/utils/utils';
import { filter } from 'rxjs/operators'

const DATA = 'resolvedData';
const TITLE = 'title';
const PREVIOUS_TITLE = 'previousTitle';
const SEPARATOR = ' - ';

@Component({
  selector: 'sd-back-track',
  templateUrl: './back-track.component.html',
  styleUrls: ['./back-track.component.scss']
})
export class BackTrackComponent implements OnInit {

  tempPreviousTitle = '';
  previousTitle: string;
  currentTitle: string;

  constructor(
    private router: Router,
    private title: Title,
    private location: Location,
    private app: ConfigService) { }

  ngOnInit() {
    // subscribe to the NavigationEnd event
    this.router.events.pipe( filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd) )
    .subscribe(event => {
      const endRoute = Utils.findPrimaryRoute(this.router.routerState.root.snapshot);
      const historyState = (this.location as CustomLocation).getHistoryState();
      if (event instanceof NavigationStart) {
        // this happens before resolve data is set for the new title
        // If a route is to be excluded from caching then its title should not be considered for being used
        // with the backtracking feature
        if (endRoute.data && endRoute.data.excludeFromCaching) {
          // in case you are on a route that will not be stored in historyState check to see if another
          // route's history state info exists.  If it does use that information instead.
          this.tempPreviousTitle = historyState && historyState.previousTitle || '';
        } else {
          this.tempPreviousTitle = this.title.getTitle();
        }
      } else { // due to the filtering it will only be NavigationEnd here
        // take out configured prefix + separator
        // Done in 2 steps to make sure if the title is set just to the prefix it takes that out first
        this.tempPreviousTitle = (this.tempPreviousTitle && this.tempPreviousTitle.replace(this.app.config.docTitlePrefix, ''));
        this.tempPreviousTitle = (this.tempPreviousTitle && this.tempPreviousTitle.replace(SEPARATOR, ''));

        if (historyState) {
          if (endRoute.data && endRoute.data.excludeFromCaching) {
            this.currentTitle = endRoute.data[DATA] && endRoute.data[DATA][TITLE] || ''
          } else {
            this.currentTitle = historyState.title;
          }

          this.previousTitle = historyState.previousTitle;
        } else {
          this.previousTitle = this.tempPreviousTitle;
          this.currentTitle = endRoute.data[DATA] && endRoute.data[DATA][TITLE] || ''
        }

        if (!endRoute.data || endRoute.data.ignorePreviousTitle) {
          this.previousTitle = undefined;
        }

        const setTitle = this.currentTitle ?
          this.app.config.docTitlePrefix + SEPARATOR + this.currentTitle : this.app.config.docTitlePrefix

        this.title.setTitle(setTitle);

        if (!endRoute.data || !endRoute.data.excludeFromCaching) {
          (this.location as CustomLocation).mergeState({
            title: this.currentTitle,
            previousTitle: this.previousTitle
          });
        }

      }
    });
  }

  goBack() {
    this.location.back();
  }
}
