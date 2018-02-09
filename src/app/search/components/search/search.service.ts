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
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IndexSearchResponse, IndexSearchService, IndexSearchRequest, IndexSearchFilter, Highlight} from '@herd/angular-client';
import {HighlightDisplayMapping} from './highlight-display-mapping';

export enum HitMatchTypes {
  column = 'column'
}

@Injectable()
export class SearchService {
  private facetFields = ['Tag', 'ResultType'];
  private fields = 'displayName,shortDescription';

  constructor(private indexSearchApi: IndexSearchService) {
  }


  public search(searchText: string, indexSearchFilters: IndexSearchFilter[], match: string = ''): Observable<IndexSearchResponse> {
    const indexSearchRequest: IndexSearchRequest = {
      searchTerm: searchText,
      facetFields: this.facetFields,
      indexSearchFilters: indexSearchFilters.length === 0 ? null : indexSearchFilters,
      enableHitHighlighting: true,
    };

   return this.indexSearchApi.indexSearchIndexSearch(indexSearchRequest, this.fields, match)
      .map((response) => {
        // Include Result type
        const resultType = {
          facetDisplayName: 'Result Type',
          facetCount: 0,
          facetType: 'ResultType',
          facetId: 'ResultType',
          facets: []
        };

        const toSlice = [];
        response.facets = response.facets.map((val, ind) => {
          if (val.facetType === 'ResultType') {
            const dispalyName = (val.facetId.match('TAG')) ? 'Category' : 'Data Entity';
            resultType.facets.push({
              facetDisplayName: dispalyName,
              facetCount: val.facetCount,
              facetType: val.facetType,
              facetId: val.facetId,
              facets: null
            });
            toSlice.unshift(ind);
          } else {
            return val;
          }
        });

        toSlice.forEach((i) => {
          response.facets.splice(i, 1);
        });

        if (resultType.facets.length) {
          response.facets.push(resultType);
        }
        return response;
      });
  }

  public joinHighlight(highlight: Highlight) {
    const highlightDisplayMapping = new HighlightDisplayMapping();
    let returnValue = '';
    highlight.fields.map((value, index, array) => {
      returnValue += '<span class="found">Found in - '
        + highlightDisplayMapping.getMapping(value.fieldName) + '</span>&nbsp';
      returnValue += value.fragments.join(' | ') + '</br>';
    });
    return returnValue;
  }
}
