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
import { Injectable } from '@angular/core';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot, DetachedRouteHandle
} from '@angular/router';
import {
  Tag, TagService, IndexSearchResult, Facet
} from '@herd/angular-client';

import { Title } from '@angular/platform-browser';
import { SearchService } from '../../shared/services/search.service';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


export interface TitleResolverData {
  title?: string;
}

export interface CategoryDetailResolverData extends TitleResolverData {
  category?: Tag | any;
  indexSearchResults?: IndexSearchResult[];
  facets?: Facet[];
  totalIndexSearchResults?: number;
}

@Injectable()
export class CategoryDetailResolverService implements Resolve<any> {

  category: Tag | any;

  constructor(
    private router: Router,
    private tagApi: TagService,
    private searchService: SearchService,
    private title: Title
  ) {
    this.category = {};
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CategoryDetailResolverData> |
    CategoryDetailResolverData | TitleResolverData {

    const indexSearchFilters = [{
      indexSearchKeys: [{
        tagKey: {tagTypeCode: route.params.tagTypeCode, tagCode: route.params.tagCode},
        includeTagHierarchy: true
      }],
      isExclusionSearchFilter: false
    }];

    let searchText = null;
    let match = '';
    if (route.params.searchText) {
      searchText = route.params.searchText;
    }
    if (route.queryParams && route.queryParams.match) {
      match = route.queryParams.match.join(',');
    }

    // fetch the category and its details
    if (!this.router.routeReuseStrategy.shouldAttach(route)) {
      return forkJoin(
        this.tagApi.tagGetTag(route.params.tagTypeCode, route.params.tagCode),
        this.searchService.search(searchText, indexSearchFilters, match)
      ).pipe(
        map((data) => {
        const retval: CategoryDetailResolverData = {
          category: data[0],
          title: 'Category - ' + data[0].displayName + (route.params.searchText ? ' ( search: ' + route.params.searchText + ' )' : ''),
          indexSearchResults: data[1].indexSearchResults,
          facets: data[1].facets,
          totalIndexSearchResults: data[1].totalIndexSearchResults,
        };
        return retval;
      })
      );
    } else {
      // If we do have the category return the title and prev stored category details
      const handle: DetachedRouteHandle = this.router.routeReuseStrategy.retrieve(route);
      const retval: CategoryDetailResolverData = {
        title: ((handle as any).route.value.data._value).resolvedData.title,
      };
      return retval;
    }
  }
}

