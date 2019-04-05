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
import {Data} from "./data";
import * as schema from "../../../../util/JsonSchema";

const data = new Data();


/**
 * Generate the post requests for namespace, data provider
 * business object definitions
 * @returns options: *[]
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
        'body': data.bdefTestWithDocumentSchema()
      }, {
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.bdefTestNoDocumentSchema()
      },{
        'order': 3,
        'url': new schema.BusinessObjectDefinitions().postUrl(),
        'body': data.bdefTestWithDocumentSchemaUrl()
      },{
        'order': 4,
        'url': new schema.BusinessObjectFormats().postUrl(),
        'body': data.bdefTestWithDocumentSchema_FORMAT()
      },
      {
              'order': 4,
              'url': new schema.BusinessObjectFormats().postUrl(),
              'body': data.bdefTestWithDocumentSchemaUrl_FORMAT()
      },
      {
        'order': 4,
        'url': new schema.BusinessObjectFormats().postUrl(),
        'body': data.bdefTestDFNoSchema_FORMAT()
      }
    ]
  };
  return setupOptions;
};

export const putDescriptiveFormatRequests = function () {
  const setupOptions = {
    'options': [
      {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace, data.bdefWithDocumentSchema),
        'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.bdefTestWithDocumentSchema_FORMAT().description,
          data.bdefTestWithDocumentSchema().displayName, data.bdefTestWithDocumentSchema_FORMAT().businessObjectFormatUsage,
          data.bdefTestWithDocumentSchema_FORMAT().businessObjectFormatFileType)
      },
      {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace, data.bdefNoDocumentSchema),
        'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.bdefTestDFNoSchema_FORMAT().description,
          data.bdefTestWithDocumentSchema().displayName, data.bdefTestDFNoSchema_FORMAT().businessObjectFormatUsage,
          data.bdefTestDFNoSchema_FORMAT().businessObjectFormatFileType)
      },
       {
              'order': 1,
              'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace, data.bdefWithDocumentSchemaUrl),
              'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.bdefTestWithDocumentSchemaUrl_FORMAT().description,
                data.bdefTestWithDocumentSchemaUrl().displayName, data.bdefTestWithDocumentSchemaUrl_FORMAT().businessObjectFormatUsage,
                data.bdefTestWithDocumentSchemaUrl_FORMAT().businessObjectFormatFileType)
       }
    ]
  };
  return setupOptions;
};

export const clearDescriptiveFormatRequests = function () {
  const teardownOptions = {
    'options': [
      {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
          data.bdefWithDocumentSchema),
        'body': {}
      },
      {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
          data.bdefNoDocumentSchema),
        'body': {}
      },
       {
              'order': 1,
              'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                data.bdefWithDocumentSchemaUrl),
              'body': {}
       }
    ]
  };
  return teardownOptions;
};


/**
 * Generate the requests to delete formats, bdefs, namespace and data providers
 * @returns options: *[]
 */
export const deleteRequests = function () {
  const teardownOptions = {
    'options': [
      {
        'order': 1,
        'url': new schema.BusinessObjectFormats()
          .deleteUrl(data.bdefTestWithDocumentSchema().namespace, data.bdefTestWithDocumentSchema().businessObjectDefinitionName,
            data.bdefTestWithDocumentSchema_FORMAT().businessObjectFormatUsage, data.bdefTestWithDocumentSchema_FORMAT().businessObjectFormatFileType, 0)
      },
      {
        'order': 1,
        'url': new schema.BusinessObjectFormats().deleteUrl(data.bdefTestNoDocumentSchema().namespace,
          data.bdefTestNoDocumentSchema().businessObjectDefinitionName,
          data.bdefTestDFNoSchema_FORMAT()
            .businessObjectFormatUsage, data.bdefTestDFNoSchema_FORMAT().businessObjectFormatFileType, 0)
      },
      {
              'order': 1,
              'url': new schema.BusinessObjectFormats()
                .deleteUrl(data.bdefTestWithDocumentSchemaUrl().namespace, data.bdefTestWithDocumentSchemaUrl().businessObjectDefinitionName,
                  data.bdefTestWithDocumentSchema_FORMAT().businessObjectFormatUsage, data.bdefTestWithDocumentSchema_FORMAT().businessObjectFormatFileType, 0)
      },
      {
        'order': 2,
        'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
          data.bdefTestNoDocumentSchema().businessObjectDefinitionName)
      },
      {
        'order': 2,
        'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
          data.bdefTestWithDocumentSchema().businessObjectDefinitionName)
      },
      {
              'order': 2,
              'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
                data.bdefTestWithDocumentSchemaUrl().businessObjectDefinitionName)
      },
      {
        'order': 3,
        'url': new schema.Namespace().deleteUrl(data.defaultNamespace)
      },
      {
        'order': 4,
        'url': new schema.DataProvider().deleteUrl(data.defaultDataProvider)
      }
    ]
  };

  return teardownOptions;
};

export const initRequests = {
  posts: postRequests(),
  updates: putDescriptiveFormatRequests()
};

export const tearDownRequests = {
  updates: clearDescriptiveFormatRequests(),
  deletes: deleteRequests()
};
