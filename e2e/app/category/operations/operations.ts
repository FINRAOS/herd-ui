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
 * Generates requests for posting to HERD
 * Utilizes the data specified in jsonnew new schema.js and data.js
 */

import {Data} from './data';
import * as schema from '../../../util/JsonSchema';
const data = new Data();

const tagTypePostUrl = new schema.TagType().postUrl();
const tagPostUrl = new schema.Tags().postUrl();

/**
 * Generate the post requests for namespace, data provider
 * business object definitions, tag types and tags
 * @returns {{options: *[]}}
 */

export const postRequests = function () {
  const setupOptions = {
    'options': [
      {
        'order': 1,
        'url': new schema.Namespace().postUrl(),
        'body': new schema.Namespace().postBody(data.defaultNamespace)
      }, {
        'order': 2,
        'url': new schema.DataProvider().postUrl(),
        'body': new schema.DataProvider().postBody(data.defaultDataProvider)
      }, {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.bdefLongDescription()
      }, {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.bdefShortDescription()
      }, {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.bdefNoDescription()
      }, {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.bdefNoDisplayName()
      }, {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.lordUniqueBdef()
      }, {
        'order': 4,
        'url': tagTypePostUrl,
        'body': new schema.TagType().postBody(data.tagTypeCode().code,
        data.tagTypeCode().displayName, data.tagTypeCode().order, 'desc')
      }, {
        'order': 4,
        'url': tagTypePostUrl,
        'body': new schema.TagType().postBody(data.tagTypeCode2().code, data.tagTypeCode2().displayName,
        data.tagTypeCode2().order, 'desc')
      }, {
        'order': 4,
        'url': tagTypePostUrl,
        'body': new schema.TagType().postBody(data.tagTypeCode3().code, data.tagTypeCode3().displayName,
        data.tagTypeCode3().order, 'desc')
      }, {
        'order': 5,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode().code,
        data.tagTypeCode().tags[0].code, data.tagTypeCode().tags[0].displayName, data.description)
      },
      {
        'order': 5,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode().code, data.tagTypeCode().tags[1].code,
        data.tagTypeCode().tags[1].displayName, data.description)
      },
      {
        'order': 5,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode().code, data.tagTypeCode().tags[2].code,
        data.tagTypeCode().tags[2].displayName, data.description)
      },
      {
        'order': 42,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithParent(data.tagTypeCode().code, data.tagTypeCode().tags[3].code,
                data.tagTypeCode().tags[3].displayName, data.description,
                data.tagTypeCode().code, data.tagTypeCode().tags[3].parentCode)
      },
      {
        'order': 43,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithParent(data.tagTypeCode().code, data.tagTypeCode().tags[4].code,
                data.tagTypeCode().tags[4].displayName, data.description,
                data.tagTypeCode().code, data.tagTypeCode().tags[4].parentCode)
      },
      {
        'order': 5,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode2().code, data.tagTypeCode2().tags[0].code,
                data.tagTypeCode2().tags[0].displayName, data.description)
      },
      {
        'order': 5,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode3().code, data.tagTypeCode3().tags[0].code,
                data.tagTypeCode3().tags[0].displayName, data.description)
      }
    ]
  };
  return setupOptions;
};

/**
 * Generate requests to post bdef-tag associations
 * @returns {{options: *[]}}
 */
export const postBdefTagRequests = function () {
  let ops = [];

  function processTagToOption(tag) {
    const tagType = this;
    ops = ops.concat(tag.bdefs.map(function (bdef) {
      return {
        'order': 99,
        'url': new schema.BusinessObjectDefinitionTags().postUrl(),
        'body': new schema.BusinessObjectDefinitionTags().postBody(data.defaultNamespace, data[bdef.name]().businessObjectDefinitionName,
        tagType.code, tag.code)
      }
    }));
  }

  // foreach accepts a cllback and as a second argument a variable to make point to this
  // simply pass along the tagTypeCode as this in order to get all the arguments needed to construct
  // the array of options
  data.tagTypeCode().tags.forEach(processTagToOption, data.tagTypeCode());

  data.tagTypeCode2().tags.forEach(processTagToOption, data.tagTypeCode2());

  data.tagTypeCode3().tags.forEach(processTagToOption, data.tagTypeCode3());

  return {'options': ops};
};


/**
 * Generate the requests to delete bdefs, namespace and data providers
 * tag types and tags
 * @returns {{options: *[]}}
 */
export const deleteRequests = function () {
  return {
    'options': [{
      'order': 2,
      'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
      data.bdefLongDescription().businessObjectDefinitionName)
    }, {
      'order': 2,
      'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
      data.bdefShortDescription().businessObjectDefinitionName)
    }, {
      'order': 2,
      'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.bdefNoDescription().businessObjectDefinitionName)
    }, {
      'order': 2,
      'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.bdefNoDisplayName().businessObjectDefinitionName)
    }, {
      'order': 2,
      'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.lordUniqueBdef().businessObjectDefinitionName)
    }, {
      'order': 3, 'url': new schema.Namespace().deleteUrl(data.defaultNamespace)
    }, {
      'order': 3, 'url': new schema.DataProvider().deleteUrl(data.defaultDataProvider)
    }, {
      'order': 4, 'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[0].code)
    }, {
      'order': 4, 'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[1].code)
    }, {
      'order': 4, 'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[2].code)
    }, {
      'order': 4, 'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[3].code)
    }, {
      'order': 4, 'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[4].code)
    }, {
      'order': 4, 'url': new schema.Tags().deleteUrl(data.tagTypeCode2().code, data.tagTypeCode2().tags[0].code)
    }, {
      'order': 4, 'url': new schema.Tags().deleteUrl(data.tagTypeCode3().code, data.tagTypeCode3().tags[0].code)
    }, {
      'order': 5, 'url': new schema.TagType().deleteUrl(data.tagTypeCode().code)
    }, {
      'order': 5, 'url': new schema.TagType().deleteUrl(data.tagTypeCode2().code)
    }, {
      'order': 5, 'url': new schema.TagType().deleteUrl(data.tagTypeCode3().code)
    }]
  };
};

/**
 * Generate the requests to delete bdef tag associations
 * @returns {{options: *[]}}
 */

export const deleteBDefTagRequests = function () {
  let ops = [];

  function processTeardownOption(tag) {
    const tagType = this;
    ops = ops.concat(tag.bdefs.map(function (bdef) {
      if (tagType.code.toString() !== 'BbbCCCDDCEEE_bdef_CTGRY') {
        return {
          'order': -1,
          'url': new schema.BusinessObjectDefinitionTags().deleteUrl(data.defaultNamespace,
          data[bdef.name]().businessObjectDefinitionName, tagType.code, tag.code)
        }
      }
    }));
    ops = ops.filter(function (n) {
      return n != null
    });
  }

   // foreach accepts a callback and as a second argument a variable to make point to this
  //  simply pass along the tagTypeCode as this in order to get all the arguments needed to construct the array of options
  data.tagTypeCode().tags.forEach(processTeardownOption, data.tagTypeCode());

  data.tagTypeCode2().tags.forEach(processTeardownOption, data.tagTypeCode2());

  data.tagTypeCode3().tags.forEach(processTeardownOption, data.tagTypeCode3());

  return {'options': ops};

};


/*
 * This method is used to remove association between tag and tag parent
 * Only then tags can be deleted
 *
 */
export const updateRequests = function () {
  return {
    'options': [{
      'order': 1,
      'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[3].code),
      'body': new schema.Tags().putBody(data.tagTypeCode().code, data.tagTypeCode().tags[3].code,
      data.tagTypeCode().tags[3].displayName, data.description)
    }, {
      'order': 2,
      'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[4].code),
      'body': new schema.Tags().putBody(data.tagTypeCode().code, data.tagTypeCode().tags[4].code,
      data.tagTypeCode().tags[4].displayName, data.description)
    }]
  };
};


export const initRequests = {
  posts: {
    options: postRequests().options.concat(postBdefTagRequests().options)
  }
};

export const tearDownRequests = {
  updates: updateRequests(),
  deletes:  {
    options: deleteRequests().options.concat(deleteBDefTagRequests().options)
  }
};
