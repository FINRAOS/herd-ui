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
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Tag, TagService, TagType, TagTypeService, TagSearchRequest} from '@herd/angular-client';
import {Observable} from 'rxjs/Observable';
import { ConfigService } from '../../services/config.service';

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


  constructor(private tagTypeApi: TagTypeService,
              private tagApi: TagService,
              private app: ConfigService) {
  }

  ngOnInit() {
    this.brandMotto = this.app.config.brandMotto;
    this.brandHeader = this.app.config.brandHeader;
    this.tagTypes = this.tagTypeApi
      .tagTypeSearchTagTypes({}, 'displayName,tagTypeOrder,description')
      .map((data) => {
        data.tagTypes = data.tagTypes.slice(0, 6);
        data.tagTypes.forEach((tagType) => {
          const body: TagSearchRequest = {
            tagSearchFilters: [{
                tagSearchKeys: [{
                  tagTypeCode: tagType.tagTypeKey.tagTypeCode,
                  isParentTagNull: true
                }]
              }]
          }

          this.tagApi
            .tagSearchTags(body, 'displayName', tagType.tagTypeKey.tagTypeCode)
            .subscribe((value) => {
              (tagType as any).tags = value.tags;
            });
        });

        return data.tagTypes;
      });
  }

}
