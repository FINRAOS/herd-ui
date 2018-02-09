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
export class RelatedDataEntities {


  private _relatedDataEntities = {
    'businessObjectDefinitions': [{
      'id': null,
      'namespace': 'TESTNMS',
      'businessObjectDefinitionName': 'ADMIN',
      'dataProviderName': 'reuters',
      'description': null,
      'shortDescription': 'st desc.',
      'displayName': 'TEST - Admin',
      'attributes': null,
      'descriptiveBusinessObjectFormat': null,
      'sampleDataFiles': null,
      'createdByUserId': null,
      'lastUpdatedByUserId': null,
      'lastUpdatedOn': null
    }, {
      'id': null,
      'namespace': 'TESTNMS1',
      'businessObjectDefinitionName': 'BDEFNAME',
      'dataProviderName': 'reuters',
      'description': null,
      'shortDescription': 'This is test short description',
      'displayName': 'dname',
      'attributes': null,
      'descriptiveBusinessObjectFormat': null,
      'sampleDataFiles': null,
      'createdByUserId': null,
      'lastUpdatedByUserId': null,
      'lastUpdatedOn': null
    }],
    'facets': [{
      'facetDisplayName': 'Data Category',
      'facetCount': 73,
      'facetType': 'TagType',
      'facetId': 'DATA_CTGRY',
      'facets': [{
        'facetDisplayName': 'Reference',
        'facetCount': 73,
        'facetType': 'Tag',
        'facetId': 'RFRNC',
        'facets': null
      }, {
        'facetDisplayName': 'Code Lookup',
        'facetCount': 42,
        'facetType': 'Tag',
        'facetId': 'CD_LKP',
        'facets': null
      }]
    }, {
      'facetDisplayName': 'External Data Source',
      'facetCount': 73,
      'facetType': 'TagType',
      'facetId': 'XTRNL_DATA_SRC',
      'facets': [{
        'facetDisplayName': 'Thomson Reuters',
        'facetCount': 73,
        'facetType': 'Tag',
        'facetId': 'TRI',
        'facets': null
      }]
    }]
  }

  get relatedDataEntities() {
    return this._relatedDataEntities;
  }
}
