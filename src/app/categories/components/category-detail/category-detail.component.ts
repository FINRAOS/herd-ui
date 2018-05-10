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
import {Component, OnInit} from '@angular/core';
import {default as AppIcons} from '../../../shared/utils/app-icons';
import {Action} from '../../../shared/components/side-action/side-action.component';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Tag, TagService, TagSearchRequest, Facet,
  IndexSearchResult, IndexSearchKey, Highlight
} from '@herd/angular-client'
import {Subscription} from 'rxjs/Subscription';
import {SearchService} from '../../../shared/services/search.service';

@Component({
  selector: 'sd-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  lastFacetChange: Subscription;
  sideActions: Action[];
  category: Tag;
  tagChildren: Tag[];
  parent: Observable<Tag> | any;
  private tagTypeCode: string;
  private tagCode: string;
  match = '';

  // variables for related data entity
  public newSearch = true;
  public loading = false;
  public results: Array<IndexSearchResult> = [];
  public facets: Array<Facet>;
  public totalIndexSearchResults;
  public indexSearchFilters: any;
  private fields = 'dataProviderName,shortDescription,displayName';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchService: SearchService,
              private tagApi: TagService
  ) {
  }

  ngOnInit() {
    // Subscribe to the route params
    this.route.params.subscribe(params => {
      this.tagTypeCode = params['tagTypeCode'];
      this.tagCode = params['tagCode'];
    });

    this.category = this.route.snapshot.data.resolvedData.category;
    this.getCategoryDetails();

    // populate side actions
    this.populateSideActions();

    // build related data entities
    this.facetChange({facets: [], newSearch: true});

  }

  getCategoryDetails() {

    const tagSearchRequest: TagSearchRequest = {
      tagSearchFilters: [{
        tagSearchKeys: [{
          tagTypeCode: this.tagTypeCode,
          parentTagCode: this.tagCode,
          isParentTagNull: false
        }]
      }]
    };

    const fields = 'displayName,description,parentTagKey,hasChildren';

    if (this.category.parentTagKey !== null) {
      this.parent = this.tagApi.tagGetTag(this.tagTypeCode, this.category.parentTagKey.tagCode)
        .map((parent) => {
          return parent;
        });
    }
    this.tagApi.tagSearchTags(tagSearchRequest, fields).subscribe((tagChildren) => {
      this.tagChildren = tagChildren.tags;
    });
  }

  /*
  * Populate the side actions
  *
  */
  private populateSideActions() {
    this.sideActions = [
      new Action(AppIcons.shareIcon, 'Share'),
      new Action(AppIcons.saveIcon, 'Save'),
      new Action(AppIcons.watchIcon, 'Watch')
    ]
  }

  public onCategoryLinkClick(tag) {
    this.router.navigate(['categories', tag.tagKey.tagTypeCode, tag.tagKey.tagCode]);
  }

  public facetChange(event) {
    this.loading = true;
    this.newSearch = event.newSearch;
    this.facets = event.facets || [];
    this.indexSearchFilters = [];

    if (this.lastFacetChange && !this.lastFacetChange.closed) {
      this.lastFacetChange.unsubscribe();
    }

    this.indexSearchFilters.push({
      indexSearchKeys: [{
        tagKey: {tagTypeCode: this.tagTypeCode, tagCode: this.tagCode},
        includeTagHierarchy: true
      }],
      isExclusionSearchFilter: false
    });

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

  public search() {
    this.loading = true;

    this.searchService.search(null, this.indexSearchFilters, this.match).subscribe((response) => {
      this.results = response.indexSearchResults;
      this.facets = response.facets;
      this.totalIndexSearchResults = response.totalIndexSearchResults;
      this.loading = false;
    });
  }

}



