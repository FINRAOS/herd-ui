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
import { GoogleAnalyticsService } from './../../services/google-analytics.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { Facet } from '@herd/angular-client';
import {FacetTriState} from '../../../search/components/search/facet-tri-state.enum';
import { SimpleChanges } from '@angular/core';


@Component({
  selector: 'sd-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FacetComponent implements OnInit, OnChanges {

  @Input() facets: Facet[];
  @Output() facetChange = new EventEmitter<Object>();
  @Input() newSearch = false;
  public viewFacets: Facet[];

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
  }

  ngOnInit() {
    this.viewFacets = [...this.facets];
   }


  public ngOnChanges(changesObj: SimpleChanges) {
    if (changesObj.facets && !changesObj.facets.isFirstChange()) {
      if (this.newSearch) {
        this.viewFacets = [...changesObj.facets.currentValue];
      } else {
        this.updateFacetCount(changesObj.facets.currentValue);
      }
    }
  }

  public propagateSelection(event, childFacet: any, parentFacet: Facet) {

    childFacet.state = event.facetState;

    if (childFacet.state !== FacetTriState.default) {
    this.googleAnalyticsService.sendEventData(
      'Global Search Facets',
      FacetTriState[childFacet.state],
      parentFacet.facetDisplayName + ';' + childFacet.facetDisplayName
      );
    }

    this.facetChange.emit({facets: this.viewFacets, newSearch: false, state: event.facets});
  }

  public clearFacets() {
    this.viewFacets.map((facet: any) => {
      facet.facets.map((child) => {
        child.state = 0;
      });
    });
    this.facetChange.emit({facets: this.viewFacets});
  }

  private createFacetMap(facetArray: Facet[]) {
    const returnValue: any = {};
    facetArray.map((facet) => {
      returnValue[facet.facetId] = facet;
      facet.facets.map((child) => {
        returnValue[facet.facetId][child.facetId] = child;
      });
    });
    return returnValue;
  };

  private updateFacetCount(newFacets) {
    const newFacetsMap = this.createFacetMap(newFacets);

    this.viewFacets.map((facet) => {
      facet.facets.map((childFacet) => {
        if (newFacetsMap[facet.facetId] && newFacetsMap[facet.facetId][childFacet.facetId]) {
          childFacet.facetCount = newFacetsMap[facet.facetId][childFacet.facetId].facetCount;
        } else {
          childFacet.facetCount = 0;
        }
      });
    });
  }

}
