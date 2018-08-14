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
import { TestBed, inject } from '@angular/core/testing';
import { SearchService, HitMatchTypes } from './search.service';
import { IndexSearchService, IndexSearchResponse, Facet, Highlight } from '@herd/angular-client';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { async } from '@angular/core/testing';
import { IndexSearchMockData } from 'testing/IndexSearchMockData';


describe('SearchService', () => {
  let iSearchSpy: jasmine.Spy;
  const data = new IndexSearchMockData().indexSearchResponse;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        IndexSearchService,
        SearchService
      ]
    });
  });

  it('should be defined', inject([SearchService, IndexSearchService], (service: SearchService, indexSearchApi: IndexSearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should process search properly', async(inject([SearchService, IndexSearchService],
    (service: SearchService, indexSearchApi: IndexSearchService) => {
      const expectedResultTypeFacet: Facet =  {
        facetDisplayName: 'Result Type',
        facetCount: 0,
        facetType: 'ResultType',
        facetId: 'ResultType',
        facets: [
          {
            facetDisplayName: 'Data Entity',
            facetCount: data.facets[data.facets.length - 2].facetCount,
            facetType: data.facets[data.facets.length - 2].facetType,
            facetId: data.facets[data.facets.length - 2].facetId,
            facets: null
          },
          {
            facetDisplayName: 'Category',
            facetCount: data.facets[data.facets.length - 1].facetCount,
            facetType: data.facets[data.facets.length - 1].facetType,
            facetId: data.facets[data.facets.length - 1].facetId,
            facets: null
          }
        ]
      };

      iSearchSpy = spyOn(indexSearchApi, 'indexSearchIndexSearch').and.returnValue(Observable.of(
        {
          facets: [...data.facets],
          totalIndexSearchResults: data.totalIndexSearchResults,
          indexSearchResults: [...data.indexSearchResults]
        }
      ));

      // with no filters with match
      service.search('this is not me', [], HitMatchTypes.column).subscribe((retval) => {
        expect(iSearchSpy).toHaveBeenCalledWith({
          searchTerm: 'this is not me',
          facetFields: ['Tag', 'ResultType'],
          indexSearchFilters: null,
          enableHitHighlighting: true
        }, 'displayName,shortDescription', HitMatchTypes.column);
        expect(retval.indexSearchResults).toEqual(data.indexSearchResults);
        expect(retval.totalIndexSearchResults).toEqual(data.totalIndexSearchResults);
        expect(retval.facets).toEqual([...(data.facets.slice(0, data.facets.length - 2)), expectedResultTypeFacet ]);
      });

      // refresh data (new instance)
      iSearchSpy.and.returnValue(Observable.of(
        {
          facets: [...data.facets],
          totalIndexSearchResults: data.totalIndexSearchResults,
          indexSearchResults: [...data.indexSearchResults]
        }
      ));
      // with mocked filters no match
      service.search('this is not me 2', [{
        indexSearchKeys: [{
          tagKey: {
            tagCode: 'mock_code',
            tagTypeCode: 'mock_type_code'
          },
          indexSearchResultTypeKey:
            { indexSearchResultType: 'mockTagTypeKey' }
        }]
      }]).subscribe((retval) => {
        expect(iSearchSpy).toHaveBeenCalledWith({
          searchTerm: 'this is not me 2',
          facetFields: ['Tag', 'ResultType'],
          indexSearchFilters: [{
            indexSearchKeys: [{
              tagKey: {
                tagCode: 'mock_code',
                tagTypeCode: 'mock_type_code'
              },
              indexSearchResultTypeKey:
                { indexSearchResultType: 'mockTagTypeKey' }
            }]
          }],
          enableHitHighlighting: true
        }, 'displayName,shortDescription', '');
        expect(retval.indexSearchResults).toEqual(data.indexSearchResults);
        expect(retval.totalIndexSearchResults).toEqual(data.totalIndexSearchResults);
        expect(retval.facets).toEqual([...(data.facets.slice(0, data.facets.length - 2)), expectedResultTypeFacet ]);
      });

      // returning no facets
      iSearchSpy.and.returnValue(Observable.of({...(new IndexSearchMockData()).indexSearchResponse, facets: [] }));
      service.search('this is not me 3', []).subscribe((retval) => {
        expect(iSearchSpy).toHaveBeenCalledWith({
          searchTerm: 'this is not me 3',
          facetFields: ['Tag', 'ResultType'],
          indexSearchFilters: null,
          enableHitHighlighting: true
        }, 'displayName,shortDescription', '');
        expect(retval.indexSearchResults).toEqual(data.indexSearchResults);
        expect(retval.totalIndexSearchResults).toEqual(data.totalIndexSearchResults);
        expect(retval.facets).toEqual([]);
      });

    })));

    it('should create hit highlight results', inject([SearchService], (service: SearchService) => {
      const highlight: Highlight = {
        fields: [
          {
            fieldName: 'displayName',
            fragments: [
              '<hlt class="highlight"> test highlight <hlt>'
            ]
          }
        ]
      }
      expect(service.joinHighlight(highlight))
      .toEqual('<span class="found">Found in - Name</span>&nbsp<hlt class="highlight"> test highlight <hlt></br>');
    }));
});
