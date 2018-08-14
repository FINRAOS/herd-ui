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
import { Component, ElementRef, OnInit, ViewChild, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HitMatchTypes } from '../../services/search.service';

@Component({
  selector: 'sd-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  private MIN_SEARCH_LENGTH = 2;
  @Input() placeHolder = 'I can help you to find anything you want!';
  @Input() searchText: string;
  @Output() search = new EventEmitter<Object>();
  public error = false;
  showHitMatchFilter = false;
  hitMatchTypes = HitMatchTypes;

  private _match: string[] = [];
  get match() {
    return this._match;
  }

  set match(match: string[]) {
    this._match = match;

    if (match.length === 0) {
      this.hitMatch.all = true;
      Object.keys(this.hitMatch.hitType).forEach((key) => {
        this.hitMatch.hitType[key] = false;
      });
    } else {
      this.hitMatch.all = false;
      Object.keys(this.hitMatch.hitType).forEach((key) => {
        if (match.includes(key)) {
          this.hitMatch.hitType[key] = true;
        } else {
          this.hitMatch.hitType[key] = false;
        }
      });
    }
  }


  // defined type so we make sure to update it whenever we add more hit match types
  hitMatch: {
    all: boolean,
    hitType: {
      [hitType in keyof typeof HitMatchTypes]: boolean
    }
  } = {
    all: true,
    hitType: {
      column: false,
    }
  };

  @ViewChild('hitMatchFilter') hitMatchFilter: HTMLElement;
  @ViewChild('searchTextBox') private elementRef: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    // properly set values when component is initialized
    this.searchText = this.route.snapshot.params['searchText'];

    this.setMatch();

    // in the case that this is used with caching, the components will be set
    // to the last used one.  This resets those values to those of the route url
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.searchText = this.route.snapshot.params['searchText'];
      this.setMatch();
    });
    this.elementRef.nativeElement.focus();
  }

  setMatch() {
    if (this.route.snapshot.queryParams['match']) {
      this.showHitMatchFilter = true;
      this.match = (this.route.snapshot.queryParams['match'] as string).split(',');
    } else {
      this.showHitMatchFilter = false;
      this.match = [];
    }
  }

  processCheck(event: Event, matchValue: string) {
    const chkBox = (event.target as HTMLInputElement);

    // if they checked they want to show all hits
    // simply reset match to not include any specific hit match
    if (matchValue === '') {
      // you can't uncheck the all checkbox if all is set
      this.match = [];
    } else {
      // if they checked the box, add that value to match value builder
      // otherwise remove it
      if (chkBox.checked) {
        this.match = [...this.match, matchValue];
      } else {
        this.match = this.match.filter((matchVal) => {
          return matchVal !== matchValue;
        });
      }
    }
  }

  // whenever user hit enter anywhere in this component, makeSearch() will be called
  @HostListener('keyup.enter', ['searchText'])
  makeSearch(searchText: string) {
    if (searchText.length > this.MIN_SEARCH_LENGTH) {
      this.error = false;
      this.search.emit({searchText: searchText, match: this.match});
    } else {
      this.error = true;
    }
  }
}
