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
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Facet, IndexSearchResult } from '@herd/angular-client';
import { Observable } from 'rxjs';
import { SearchService } from '../../shared/services/search.service';
import { map } from 'rxjs/operators';

export interface TitleResolverData {
  title?: string;
}

export interface SearchResolveData extends TitleResolverData {
  indexSearchResults: IndexSearchResult[];
  facets: Facet[];
  totalIndexSearchResults: number;
}

@Injectable()
export class SearchResolverService implements Resolve<any> {

  private searchResult: SearchResolveData;

  constructor(private searchService: SearchService,
              private router: Router) {

    this.searchResult = null;
  }

  public resolve(route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Observable<SearchResolveData> | TitleResolverData {

    if (!this.router.routeReuseStrategy.shouldAttach(route)) {
      const retval: SearchResolveData = {
        indexSearchResults: [],
        facets: [],
        totalIndexSearchResults: 0,
        title: ''
      };
      return this.searchService.search(route.params.searchText, [], route.queryParams.match).pipe(
        map((response) => {
          retval.indexSearchResults = response.indexSearchResults;
          retval.facets = response.facets;
          retval.totalIndexSearchResults = response.totalIndexSearchResults;
          retval.title = 'Global Search - ' + route.params.searchText;
          return retval;
        })
      ) ;

    } else {
      return {
        title: 'Global Search - ' + route.params.searchText
      }
    }
  }

}
