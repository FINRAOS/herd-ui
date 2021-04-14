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
import { Facet, IndexSearchResponse, IndexSearchResult } from '@herd/angular-client';

export class IndexSearchMockData {

  private _searchText = 'test search';
  private _indexSearchResponse: IndexSearchResponse = {
    'totalIndexSearchResults': 2,
    'indexSearchResults': [
      {
        'indexSearchResultType': 'tag',
        'indexSearchResultKey': {
          'tagKey': {'tagTypeCode': 'tagTypeCodeTest', 'tagCode': 'TestTagCode'},
          'businessObjectDefinitionKey': null
        },
        'displayName': 'displayNameTest',
        'shortDescription': 'shortDescriptionTest',
        'highlight': {
          'fields': [{
            'fieldName': 'fieldNameTest',
            'fragments': ['The <hlt class="highlight">Test</hlt> something else test <hlt class="highlight">otest</hlt> ' +
            'tst, <hlt class="highlight">otest2</hlt> othertest ']
          }]
        }
      }, {
        'indexSearchResultType': 'tag1',
        'indexSearchResultKey': {
          'tagKey': {'tagTypeCode': 'tagTypeCodeTest1', 'tagCode': 'TestTagCode1'},
          'businessObjectDefinitionKey': null
        },
        'displayName': 'displayNameTest1',
        'shortDescription': 'shortDescriptionTest1',
        'highlight': {
          'fields': [{
            'fieldName': 'fieldNameTest1',
            'fragments': ['The <hlt class="highlight">Test1</hlt> something else test <hlt class="highlight">otest1</hlt> ' +
            'tst, <hlt class="highlight">otest21</hlt> othertest1 ']
          }]
        }
      }],
    'facets': [{
      'facetDisplayName': 'test 1',
      'facetCount': 119,
      'facetType': 'TagTypeTest',
      'facetId': 'fidtest',
      'facets': [{
        'facetDisplayName': 'test 11',
        'facetCount': 69,
        'facetType': 'T',
        'facetId': 'fid21',
        'facets': null
      }, {
        'facetDisplayName': 'test 123',
        'facetCount': 42,
        'facetType': 'Tag',
        'facetId': 'fidtestre',
        'facets': null
      }, {'facetDisplayName': 'test 1', 'facetCount': 8, 'facetType': 'Tag', 'facetId': 'test45', 'facets': null}]
    }, {
      'facetDisplayName': 'ResultType',
      'facetCount': 80,
      'facetType': 'ResultType',
      'facetId': 'BUS_OBJCT_DFNTN',
      'facets': null
    }, {'facetDisplayName': 'ResultType', 'facetCount': 4, 'facetType': 'ResultType', 'facetId': 'TAG', 'facets': null}
    ]
  };

  private _noResults: IndexSearchResult[] = [];
  private _noFacets: Facet[] = [];
  private _indexSearchResponseNoResults: IndexSearchResponse = {
    'totalIndexSearchResults': 0,
    'indexSearchResults': this._noResults,
    'facets': this._noFacets
  };

  private _facets: Array<Facet> = [
    {
      'facetDisplayName': 'test 14',
      'facetCount': 119,
      'facetType': 'testre11',
      'facetId': 'fidme',
      'facets': [
        {
          'facetDisplayName': 'test 15',
          'facetCount': 69,
          'facetType': 'ResultType',
          'facetId': 'RFRNC',
          'facets': null,
        }, {
          'facetDisplayName': 'test 16',
          'facetCount': 42,
          'facetType': 'Tag',
          'facetId': 'testid34',
          'facets': null
        },
        {
          'facetDisplayName': 'test 17',
          'facetCount': 8,
          'facetType': 'Tag',
          'facetId': 'fidstest1',
          'facets': null
        }
      ]
    }, {
      'facetDisplayName': 'test 18',
      'facetCount': 2,
      'facetType': 'TagType',
      'facetId': 'number45',
      'facets': [
        {
          'facetDisplayName': 'test 19',
          'facetCount': 1,
          'facetType': 'default',
          'facetId': 'number56',
          'facets': null
        },
        {
          'facetDisplayName': 'test 20',
          'facetCount': 1,
          'facetType': 'Tag',
          'facetId': 'facetid',
          'facets': null
        }
      ]
    }
  ];

  get searchText(): string {
    return this._searchText;
  }

  get indexSearchResponse(): IndexSearchResponse {
    return this._indexSearchResponse;
  }

  get indexSearchResponseNoResponse(): IndexSearchResponse {
    return this._indexSearchResponseNoResults;
  }

  get facets(): Array<Facet> {
    return this._facets;
  }
}
