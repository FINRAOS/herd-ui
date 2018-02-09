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
/**
 * This file maintains all the data to be posted to HERD and validated against in tests.
 * Use this data in specs.
 * @type {{}}
 */
const dataProviderName = 'DP_PROTRACTOR_TEST_DL_GLOBAL';
const namespace = 'NS_PROTRACTOR_TEST_DL_GLOBAL';
const description = 'This is sample desc text';

// Add whitespace to the search term to avoid this
// getting concatenated with some other string and elasticsearch not picking it up while analyzing
const searchTerm = 'GlobalSearch';
const searchTermWithResult = 'monalisa';

const bdefOne = {
  'namespace': namespace,
  'dataProviderName': dataProviderName,
  'businessObjectDefinitionName': 'bdefNameOne' + searchTerm,
  'description': 'Data Entity used for global search tests ' + searchTerm,
  'displayName': 'Search Test Entity'
};

const bdefTwo = {
  'namespace': namespace,
  'dataProviderName': dataProviderName,
  'businessObjectDefinitionName': 'bdefNameTwo' + searchTerm,
  'description': 'Data Entity used for global search tests ' + searchTerm,
  'displayName': 'Search Test Entity'
};

const bdefThree = {
  'namespace': namespace,
  'dataProviderName': dataProviderName,
  'businessObjectDefinitionName': 'bdefNameThree' + searchTerm,
  'description': 'Data Entity used for global search tests ' + searchTerm,
  'displayName': 'Search Test Entity'
};

const bdefFour = {
  'namespace': namespace,
  'dataProviderName': dataProviderName,
  'businessObjectDefinitionName': 'bdefNameFour' + searchTerm,
  'description': 'Data Entity used for global search tests ' + searchTerm,
  'displayName': 'Search Test Entity'
};

const bdefFive = {
  'namespace': namespace,
  'dataProviderName': dataProviderName,
  'businessObjectDefinitionName': 'bdefNameFive' + searchTerm,
  'description': 'Data Entity used for global search tests ' + searchTerm,
  'displayName': 'Search Test Entity'
};

const bdefSix = {
  'namespace': namespace,
  'dataProviderName': dataProviderName,
  'businessObjectDefinitionName': 'bdefNameSix' + searchTerm,
  'description': 'Data Entity used for global search tests ' + searchTerm,
  'displayName': 'Search Test Entity'
};

const tagTypeOne = {
  tagTypeKey: {
    tagTypeCode: 'GlobalSearchTagTypeOne'
  }, displayName: 'GlobalSearchTagTypeOne', tagTypeOrder: '100', description: 'some description'
};

const tagTypeTwo = {
  tagTypeKey: {
    tagTypeCode: 'GlobalSearchTagTypeTwo'
  }, displayName: 'GlobalSearchTagTypeTwo', tagTypeOrder: '101', description: 'some description'
};

const tagTypeThree = {
  tagTypeKey: {
    tagTypeCode: 'GlobalSearchTagTypeThree'
  }, displayName: 'GlobalSearchTagTypeThree', tagTypeOrder: '102', description: 'some description'
};

const tagOne = {
  tagKey: {
    tagTypeCode: tagTypeOne.tagTypeKey.tagTypeCode, tagCode: 'GS_TAG_ONE'
  }, displayName: 'GSTagOne ', description: searchTerm
};

const tagOneOne = {
  tagKey: {
    tagTypeCode: tagTypeOne.tagTypeKey.tagTypeCode, tagCode: 'GS_TAG_ONE_ONE'
  }, displayName: 'GSTagOneOne ', description: searchTerm
};

const tagTwo = {
  tagKey: {
    tagTypeCode: tagTypeTwo.tagTypeKey.tagTypeCode, tagCode: 'GS_TAG_TWO'
  }, displayName: 'GSTagTwo ', description: searchTerm
};

const tagTwoTwo = {
  tagKey: {
    tagTypeCode: tagTypeTwo.tagTypeKey.tagTypeCode, tagCode: 'GS_TAG_TWO_TWO'
  }, displayName: 'GSTagTwoTwo ', description: searchTerm
};

const tagThree = {
  tagKey: {
    tagTypeCode: tagTypeThree.tagTypeKey.tagTypeCode, tagCode: 'GS_TAG_THREE'
  }, displayName: 'GSTagThree ', description: searchTerm
};

const tagThreeThree = {
  tagKey: {
    tagTypeCode: tagTypeThree.tagTypeKey.tagTypeCode, tagCode: 'GS_TAG_THREE_THREE'
  }, displayName: 'GSTagThreeThree ', description: searchTerm
};

export default {
  tagTypeOne,
  tagTypeTwo,
  tagTypeThree,
  tagOne,
  tagOneOne,
  tagTwo,
  tagTwoTwo,
  tagThree,
  tagThreeThree,
  bdefOne,
  bdefTwo,
  bdefThree,
  bdefFour,
  bdefFive,
  bdefSix,
  dataProviderName,
  namespace,
  searchTerm,
  searchTermWithResult,
  description
};
