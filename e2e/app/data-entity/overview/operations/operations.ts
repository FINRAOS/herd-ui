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
 * Utilizes the data specified in jsonnew schema.js and data.js
 */

import { Data } from './data';
import * as schema from '../../../../util/JsonSchema';
import { DMOption } from '../../../../util/DataManager';

const tagTypePostUrl = new schema.TagType().postUrl();
const tagPostUrl = new schema.Tags().postUrl();
const data = new Data();


/**
 * Generate the post requests for namespace, data provider
 * business object definitions, tag types and tags
 * @returns options: *[]
 */

export const postRequests = function () {
  const setupOptions: { options: DMOption[] } = {
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
        'body': data.bdefNoTagsNoSchema()
      }, {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.bdefTest()
      }, {
        'order': 4,
        'url': tagTypePostUrl,
        'body': new schema.TagType().postBody(data.tagTypeCode().code, data.tagTypeCode().displayName,
          data.tagTypeCode().order, 'desc')
      }, {
        'order': 5,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode().code, data.tagTypeCode().tags[0].code,
          data.tagTypeCode().tags[0].displayName, data.description)
      },
      {
        'order': 5,
        'url': tagPostUrl,
        'body': new schema.Tags().postBodyWithoutParent(data.tagTypeCode().code, data.tagTypeCode().tags[1].code,
          data.tagTypeCode().tags[1].displayName, data.description)
      },
      {
        'order': 5,
        'url': new schema.BusinessObjectDefinitionSuggestions().postUrl(),
        'body': data.bdefSuggestion()
      }
    ]
  };
  return setupOptions;
};

/**
 * Generate requests to post bdef-tag associations
 * @returns options: *[]
 */
export const postBdefTagRequests = function () {

  const setupOptions: { options: DMOption[] } = {
    'options': [
      {
        'order': 6,
        'url': new schema.BusinessObjectDefinitionTags().postUrl(),
        'body': new schema.BusinessObjectDefinitionTags().postBody(data.defaultNamespace,
          data.bdefTest().businessObjectDefinitionName,
          data.tagTypeCode().code, data.tagTypeCode().tags[0].code)
      }, {
        'order': 6,
        'url': new schema.BusinessObjectDefinitionTags().postUrl(),
        'body': new schema.BusinessObjectDefinitionTags().postBody(data.defaultNamespace,
          data.bdefTest().businessObjectDefinitionName,
          data.tagTypeCode().code, data.tagTypeCode().tags[1].code)
      }
    ]
  };
  return setupOptions;
};

/**
 * Generate requests to put bdef descriptive format for lineage test
 */

export const putDescriptiveFormatRequests = function () {
  return {
    'options': [
      {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
          data.bdefTest().businessObjectDefinitionName),
        'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.bdefTest().description,
          data.bdefTest().displayName,
          data.formatTestEditDescriptiveFormat().businessObjectFormatUsage,
          data.formatTestEditDescriptiveFormat().businessObjectFormatFileType)
      }
    ]
  };
};

export const putLineageRequests = (): { options: DMOption[] } => {
  const single = data.bdefTestSingleFormatVersion();
  return {
    options: [
      {
        'order': 5,
        'url': new schema.BusinessObjectFormats().putParentsUrl(single.namespace,
          single.businessObjectDefinitionName,
          single.businessObjectFormatUsage,
          single.businessObjectFormatFileType),
        'body': new schema.BusinessObjectFormats().putParentsBody([data.bdefTestMultipleFormatVersions()])
      }
    ]
  };
};


/**
 * Generate requests to post bdef formats
 * @returns options: *[]
 */
export const postBdefFormatRequests = function () {

  const single = data.bdefTestSingleFormatVersion();
  const setupOptions = {
    'options': [
      {
        'order': 4,
        'url': new schema.BusinessObjectFormats().postUrl(),
        'body': data.bdefTestMultipleFormatVersions()
      },
      {
        'order': 4,
        'url': new schema.BusinessObjectFormats().postUrl(),
        'body': data.bdefTestMultipleFormatVersions()
      },
      {
        'order': 4,
        'url': new schema.BusinessObjectFormats().postUrl(),
        'body': data.bdefTestSingleFormatVersion()
      }
    ]
  };
  return setupOptions;
};


/**
 * Generate the requests to delete bdefs, namespace and data providers
 * tag types and tags
 * @returns options: *[]
 */
export const deleteRequests = function () {

  const teardownOptions = {
    'options': [
      {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
          data.bdefNoTagsNoSchema().businessObjectDefinitionName)
      },
      {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.bdefTest().businessObjectDefinitionName)
      },
      {
        'order': 4,
        'url': new schema.Namespace().deleteUrl(data.defaultNamespace)
      },
      {
        'order': 4,
        'url': new schema.DataProvider().deleteUrl(data.defaultDataProvider)
      }, {
        'order': 1,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[0].code)
      },
      {
        'order': 1,
        'url': new schema.Tags().deleteUrl(data.tagTypeCode().code, data.tagTypeCode().tags[1].code)
      },
      {
        'order': 2,
        'url': new schema.TagType().deleteUrl(data.tagTypeCode().code)
      },
      {
        'order': 2,
        'url': new schema.BusinessObjectDefinitionSuggestions().deleteUrl(
          data.bdefSuggestion().businessObjectDefinitionDescriptionSuggestionKey.namespace,
          data.bdefSuggestion().businessObjectDefinitionDescriptionSuggestionKey.businessObjectDefinitionName,
          data.bdefSuggestion().businessObjectDefinitionDescriptionSuggestionKey.userId
        )
      }
    ]
  };

  return teardownOptions;
};


/**
 * Generate requests to clear bdef descriptive format
 */

export const clearDescriptiveFormatRequests = function () {

  const setupOptions = {
    'options': [
      {
        'order': 0,
        'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
          data.bdefTest().businessObjectDefinitionName),
        'body': new schema.BusinessObjectDefinitions().clearDescriptiveInformation(data.bdefTest().description,
          data.bdefTest().displayName)
      }
    ]
  };
  return setupOptions;
};

export const clearLineageRequets = () => {
  const single = data.bdefTestSingleFormatVersion();
  return {
    options: [
      {
        'order': 0,
        'url': new schema.BusinessObjectFormats().putParentsUrl(single.namespace,
          single.businessObjectDefinitionName,
          single.businessObjectFormatUsage,
          single.businessObjectFormatFileType),
        'body': new schema.BusinessObjectFormats().putParentsBody([])
      }
    ]
  };
};

/**
 * Generate the requests to delete bdef formats
 * @returns options: *[]
 */

export const deleteBDefFormatRequests = function () {
  const teardownOptions = {
    'options': [
      {
        'order': 2,
        'url': new schema.BusinessObjectFormats().deleteUrl(data.bdefTestMultipleFormatVersions().namespace,
          data.bdefTestMultipleFormatVersions().businessObjectDefinitionName,
          data.bdefTestMultipleFormatVersions().businessObjectFormatUsage,
          data.bdefTestMultipleFormatVersions().businessObjectFormatFileType, 0)
      }, {
        'order': 1,
        'url': new schema.BusinessObjectFormats().deleteUrl(data.bdefTestMultipleFormatVersions().namespace,
          data.bdefTestMultipleFormatVersions().businessObjectDefinitionName,
          data.bdefTestMultipleFormatVersions().businessObjectFormatUsage,
          data.bdefTestMultipleFormatVersions().businessObjectFormatFileType, 1)
      }, {
        'order': 2,
        'url': new schema.BusinessObjectFormats().deleteUrl(data.bdefTestSingleFormatVersion().namespace,
          data.bdefTestSingleFormatVersion().businessObjectDefinitionName,
          data.bdefTestSingleFormatVersion().businessObjectFormatUsage,
          data.bdefTestSingleFormatVersion().businessObjectFormatFileType, 0)
      }
    ]
  };

  return teardownOptions;
};

// data for editing bdef descriptive information
export const postEditDescInfoTestData: { options: DMOption[] } = {
  options: [
    {
      order: 1,
      url: new schema.BusinessObjectDefinitions().postUrl(),
      body: data.editBdefTestData()
    },
    {
      order: 2,
      url: new schema.BusinessObjectFormats().postUrl(),
      body: data.formatTestEditDescriptiveFormat()
    },
    {
      order: 2,
      url: new schema.BusinessObjectFormats().postUrl(),
      body: data.formatTestEditDescriptiveFormat2()
    }
  ]
};
export const deleteEditDescInfoTestData: { options: DMOption[] } = {
  options: [
    {
      order: 2,
      url: new schema.BusinessObjectDefinitions().deleteUrl(
        data.editBdefTestData().namespace,
        data.editBdefTestData().businessObjectDefinitionName
      )
    },
    {
      order: 1,
      url: new schema.BusinessObjectFormats().deleteUrl(
        data.formatTestEditDescriptiveFormat().namespace,
        data.formatTestEditDescriptiveFormat().businessObjectDefinitionName,
        data.formatTestEditDescriptiveFormat().businessObjectFormatUsage,
        data.formatTestEditDescriptiveFormat().businessObjectFormatFileType,
        0
      )
    },
    {
      order: 1,
      url: new schema.BusinessObjectFormats().deleteUrl(
        data.formatTestEditDescriptiveFormat2().namespace,
        data.formatTestEditDescriptiveFormat2().businessObjectDefinitionName,
        data.formatTestEditDescriptiveFormat2().businessObjectFormatUsage,
        data.formatTestEditDescriptiveFormat2().businessObjectFormatFileType,
        0
      )
    }
  ]
};
export const clearEditDescInfoFrmt: { options: DMOption[] } = {
  options: [{
    order: 1,
    url: new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(
      data.editBdefTestData().namespace,
      data.editBdefTestData().businessObjectDefinitionName),
    body: new schema.BusinessObjectDefinitions().clearDescriptiveInformation(data.editBdefTestData().description,
      data.editBdefTestData().displayName)
  }]
};


export const initRequests = {
  posts: {
    options: postRequests().options
      .concat(postBdefTagRequests().options)
      .concat(postBdefFormatRequests().options)
  },
  updates: {
    options: putLineageRequests().options.concat(putDescriptiveFormatRequests().options)
  }
};

export const tearDownRequests = {
  updates: {
    options: clearLineageRequets().options.concat(clearDescriptiveFormatRequests().options as any)
  },
  deletes: {
    options: deleteRequests().options
      .concat(deleteBDefFormatRequests().options)
  }
};
