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
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TagSearchRequest, TagService, TagType, TagTypeService } from '@herd/angular-client';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'sd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  public tagTypes: Observable<TagType[]>;
  public brandMotto: string;
  public brandHeader: string;
  private DEFAULT_TAG_NUMBER = 6;
  private MAX_TAG_NUMBER = 15;

  constructor(
    private tagTypeApi: TagTypeService,
    private router: Router,
    private tagApi: TagService
  ) {
  }

  showTags(tagNumber: number) {
    this.brandMotto = environment.brandMotto;
    this.brandHeader = environment.brandHeader;
    this.tagTypes = this.tagTypeApi
      .tagTypeSearchTagTypes({}, 'displayName,tagTypeOrder,description').pipe(
        map((data) => {
          data.tagTypes = data.tagTypes.slice(0, tagNumber);
          data.tagTypes.forEach((tagType) => {
            const body: TagSearchRequest = {
              tagSearchFilters: [{
                tagSearchKeys: [{
                  tagTypeCode: tagType.tagTypeKey.tagTypeCode,
                  isParentTagNull: true
                }]
              }]
            };

            this.tagApi
              .tagSearchTags(body, 'displayName')
              .subscribe((value: any) => {
                (tagType as any).tags = value.tags;
              });
          });

          return data.tagTypes;
        }));
  }

  ngOnInit() {
    this.showTags(this.DEFAULT_TAG_NUMBER);
  }

  showAllTags() {
    this.showTags(this.MAX_TAG_NUMBER);
  }

  search(event) {
    this.router.navigate(['search', event.searchText], {
      queryParams: {
        match: event.match.join(',')
      }
    });
  }

}
