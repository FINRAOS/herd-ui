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

import {Data} from './data';
import * as schema from '../../../../util/JsonSchema';
const data = new Data();
/**
 * Generate the post requests for namespace, data provider
 * business object definitions, tag types and tags
 * @returns {{options: *[]}}
 */

export const postRequests = function () {
const smePostUrl = new schema.BusinessObjectDefinitionSmes().postUrl();
const bdefPostUrl = new schema.BusinessObjectDefinitions().postUrl();

  return {
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
        'body': data.defaultBdef()
      }, {
        'order': 3,
        'url': bdefPostUrl,
        'body': data.badBdef()
      }, {
        'order': 3,
        'url': bdefPostUrl,
        'body': data.emptyBdef()
      }, {
        'order': 4,
        'url': smePostUrl,
        'body': new schema.BusinessObjectDefinitionSmes().postBody(
          data.defaultNamespace, data.defaultBdef().businessObjectDefinitionName, data.userId1)
      }, {
        'order': 4,
        'url': smePostUrl,
        'body': new schema.BusinessObjectDefinitionSmes().postBody(
          data.defaultNamespace, data.defaultBdef().businessObjectDefinitionName, data.userId2)
      }, {
        'order': 4,
        'url': smePostUrl,
        'body': new schema.BusinessObjectDefinitionSmes().postBody(
          data.defaultNamespace, data.badBdef().businessObjectDefinitionName, 'badsmes')
      }, {
        'order': 4,
        'url': smePostUrl,
        'body': new schema.BusinessObjectDefinitionSmes().postBody(
          data.defaultNamespace, data.badBdef().businessObjectDefinitionName, data.userId1)
      }
    ]
  };
};

/**
 * Generate the requests to delete bdefs, namespace and data providers
 * tag types and tags
 * @returns {{options: *[]}}
 */
export const deleteRequests = function () {
  return {
    'options': [
      {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.defaultBdef().businessObjectDefinitionName)
      }, {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.badBdef().businessObjectDefinitionName)
      }, {
        'order': 1,
        'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.emptyBdef().businessObjectDefinitionName)
      }, {
        'order': 2,
        'url': new schema.Namespace().deleteUrl(data.defaultNamespace)
      }, {
        'order': 2,
        'url': new schema.DataProvider().deleteUrl(data.defaultDataProvider)
      }
    ]
  };
};

export const initRequests = {
  posts: {
    options: postRequests().options
  }
};

export const tearDownRequests = {
  deletes:  {
    options: deleteRequests().options
  }
};
