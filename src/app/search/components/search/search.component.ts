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
import {
  Component, OnInit, ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../../shared/services/search.service';
import {
  IndexSearchResult, Facet, IndexSearchFilter,
  IndexSearchKey, Highlight
} from '@herd/angular-client';

@Component({
  selector: 'sd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  public searchText: string;
  public newSearch: boolean;
  public totalIndexSearchResults: number;
  public indexSearchResults: IndexSearchResult[];
  public facets: Facet[] = [];
  public indexSearchFilters: IndexSearchFilter[] = [];
  public loading = false;
  match = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private searchService: SearchService) {
  }

  ngOnInit() {
    this.searchText = this.activatedRoute.snapshot.params.searchTerm;

    this.activatedRoute.data.subscribe((data) => {
      if (data.resolvedData && data.resolvedData.indexSearchResults) {
          this.newSearch = true;
          this.indexSearchResults = data.resolvedData.indexSearchResults;
          this.facets = data.resolvedData.facets;
          this.totalIndexSearchResults = data.resolvedData.totalIndexSearchResults;
      }
    });

    this.activatedRoute.queryParams.subscribe((qParams) => {
      this.match = qParams.match;
    });
  }

  public search() {
    this.loading = true;

    this.searchService.search(this.searchText, this.indexSearchFilters, this.match).subscribe((response) => {
      this.indexSearchResults = response.indexSearchResults;
      this.facets = response.facets;
      this.totalIndexSearchResults = response.totalIndexSearchResults;
      this.loading = false;
    });
  }

  public facetChange(event) {
    this.newSearch = event.newSearch;
    this.facets = event.facets || [];
    this.indexSearchFilters = [];

    // build a filter per base facet
    this.facets.forEach((facet: any) => {
      const inclusions: IndexSearchKey[] = [];
      const exclusions: IndexSearchKey[] = [];
      facet.facets.forEach((child) => {
        let keyData: IndexSearchKey;
        switch (child.facetType) {
          case 'Tag':
            keyData = {tagKey: {tagTypeCode: facet.facetId, tagCode: child.facetId}};
            break;
          case 'ResultType':
            keyData = {indexSearchResultTypeKey: {indexSearchResultType: child.facetId}};
            break;
          default:
            break;
        }

        switch (child.state) {
          case 1:
            inclusions.push(keyData);
            break;
          case 2:
            exclusions.push(keyData);
            break;
          default:
            break;
        }
      });

      // add the inclusion filter
      if (inclusions.length) {
        this.indexSearchFilters.push({indexSearchKeys: inclusions, isExclusionSearchFilter: false});
      }
      // add the exclude filter
      if (exclusions.length) {
        this.indexSearchFilters.push({indexSearchKeys: exclusions, isExclusionSearchFilter: true});
      }
    });

    this.search();
  }

  public makeHighlightFull(highlight: Highlight) {
    return this.searchService.joinHighlight(highlight)
  }

}
