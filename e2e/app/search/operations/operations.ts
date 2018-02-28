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
import data from './data';
import * as schema from '../../../util/JsonSchema';
const tagTypePostUrl = new schema.TagType().postUrl();
const tagPostUrl = new schema.Tags().postUrl();

export const postRequests = function () {
  return {
    'options': [{
      'order': 1, 'url': new schema.Namespace().postUrl(), 'body': new schema.Namespace().postBody(data.namespace)
    }, {
      'order': 2, 'url': new schema.DataProvider().postUrl(), 'body': new schema.DataProvider().postBody(data.dataProviderName)
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdefOne
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdefTwo
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdefThree
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdefFour
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdefFive
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdefSix
    }, {
      'order': 4,
      'url': tagTypePostUrl,
      'body': new schema.TagType().postBody(data.tagTypeOne.tagTypeKey.tagTypeCode,
              data.tagTypeOne.displayName, data.tagTypeOne.tagTypeOrder, data.description)
    }, {
      'order': 4,
      'url': tagTypePostUrl,
      'body': new schema.TagType().postBody(data.tagTypeTwo.tagTypeKey.tagTypeCode, data.tagTypeTwo.displayName,
      data.tagTypeTwo.tagTypeOrder, data.description)
    }, {
      'order': 4,
      'url': tagTypePostUrl,
      'body': new schema.TagType().postBody(data.tagTypeThree.tagTypeKey.tagTypeCode, data.tagTypeThree.displayName,
      data.tagTypeThree.tagTypeOrder)
    }, {
      'order': 5,
      'url': tagPostUrl,
      'body': new schema.Tags().postBodyWithoutParent(data.tagOne.tagKey.tagTypeCode, data.tagOne.tagKey.tagCode,
      data.tagOne.displayName, data.tagOne.description)
    }, {
      'order': 5,
      'url': tagPostUrl,
      'body': new schema.Tags().postBodyWithoutParent(data.tagTwo.tagKey.tagTypeCode, data.tagTwo.tagKey.tagCode,
      data.tagTwo.displayName, data.tagTwo.description)
    }, {
      'order': 5,
      'url': tagPostUrl,
      'body': new schema.Tags().postBodyWithoutParent(data.tagThree.tagKey.tagTypeCode, data.tagThree.tagKey.tagCode,
        data.tagThree.displayName,
        data.tagThree.description)
    }, {
      'order': 5,
      'url': tagPostUrl,
      'body': new schema.Tags().postBodyWithoutParent(data.tagOneOne.tagKey.tagTypeCode, data.tagOneOne.tagKey.tagCode,
      data.tagOneOne.displayName,
        data.tagOneOne.description)
    }, {
      'order': 5,
      'url': tagPostUrl,
      'body': new schema.Tags().postBodyWithoutParent(data.tagTwoTwo.tagKey.tagTypeCode, data.tagTwoTwo.tagKey.tagCode,
      data.tagTwoTwo.displayName,
        data.tagTwoTwo.description)
    }, {
      'order': 5,
      'url': tagPostUrl,
      'body': new schema.Tags().postBodyWithoutParent(data.tagThreeThree.tagKey.tagTypeCode, data.tagThreeThree.tagKey.tagCode,
      data.tagThreeThree.displayName,
        data.tagTwo.description)
    }, {
      'order': 6,
      'url': new schema.BusinessObjectDefinitionTags().postUrl(),
      'body': new schema.BusinessObjectDefinitionTags().postBody(data.namespace, data.bdefOne.businessObjectDefinitionName,
      data.tagOne.tagKey.tagTypeCode,
        data.tagOne.tagKey.tagCode)
    }, {
      'order': 6,
      'url': new schema.BusinessObjectDefinitionTags().postUrl(),
      'body': new schema.BusinessObjectDefinitionTags().postBody(data.namespace, data.bdefTwo.businessObjectDefinitionName,
      data.tagOneOne.tagKey.tagTypeCode,
        data.tagOneOne.tagKey.tagCode)
    }]
  };
};


export const deleteRequests = function () {
  return {
    'options': [{
      'order': 0,
      'url': new schema.BusinessObjectDefinitionTags().deleteUrl(data.namespace, data.bdefOne.businessObjectDefinitionName,
      data.tagOne.tagKey.tagTypeCode,
        data.tagOne.tagKey.tagCode)
    }, {
      'order': 0,
      'url': new schema.BusinessObjectDefinitionTags().deleteUrl(data.namespace, data.bdefTwo.businessObjectDefinitionName,
      data.tagOneOne.tagKey.tagTypeCode,
        data.tagOneOne.tagKey.tagCode)
    }, {
      'order': 1, 'url': new schema.Tags().deleteUrl(data.tagOne.tagKey.tagTypeCode, data.tagOne.tagKey.tagCode)
    }, {
      'order': 1, 'url': new schema.Tags().deleteUrl(data.tagTwo.tagKey.tagTypeCode, data.tagTwo.tagKey.tagCode)
    }, {
      'order': 1, 'url': new schema.Tags().deleteUrl(data.tagThree.tagKey.tagTypeCode, data.tagThree.tagKey.tagCode)
    }, {
      'order': 1, 'url': new schema.Tags().deleteUrl(data.tagOneOne.tagKey.tagTypeCode, data.tagOneOne.tagKey.tagCode)
    }, {
      'order': 1, 'url': new schema.Tags().deleteUrl(data.tagTwoTwo.tagKey.tagTypeCode, data.tagTwoTwo.tagKey.tagCode)
    }, {
      'order': 1, 'url': new schema.Tags().deleteUrl(data.tagThreeThree.tagKey.tagTypeCode, data.tagThreeThree.tagKey.tagCode)
    }, {
      'order': 2, 'url': new schema.TagType().deleteUrl(data.tagTypeOne.tagTypeKey.tagTypeCode)
    }, {
      'order': 2, 'url': new schema.TagType().deleteUrl(data.tagTypeTwo.tagTypeKey.tagTypeCode)
    }, {
      'order': 2, 'url': new schema.TagType().deleteUrl(data.tagTypeThree.tagTypeKey.tagTypeCode)
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(data.bdefOne.namespace, data.bdefOne.businessObjectDefinitionName)
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(data.bdefTwo.namespace, data.bdefTwo.businessObjectDefinitionName)
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(data.bdefThree.namespace,
      data.bdefThree.businessObjectDefinitionName)
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(data.bdefFour.namespace,
      data.bdefFour.businessObjectDefinitionName)
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(data.bdefFive.namespace,
      data.bdefFive.businessObjectDefinitionName)
    }, {
      'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(data.bdefSix.namespace, data.bdefSix.businessObjectDefinitionName)
    }, {
      'order': 4, 'url': new schema.Namespace().deleteUrl(data.namespace)
    }, {
      'order': 5, 'url': new schema.DataProvider().deleteUrl(data.dataProviderName)
    }]
  }
};

export const initRequests = {
  posts: postRequests()
};

export const tearDownRequests = {
  deletes: deleteRequests()
};
