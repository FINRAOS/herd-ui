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

import { Data } from './data';
import * as schema from '../../../../util/JsonSchema';

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
                'body': data.bdefTest
            }, {
                'order': 4,
                'url': new schema.BusinessObjectFormats().postUrl(),
                'body': data.businessObjectFormatTest
            },
            {
                'order': 5,
                'url': new schema.ExternalInterfaces().postUrl(),
                'body': data.externalInterfaceTest
            },
            {
              'order': 5,
              'url': new schema.ExternalInterfaces().postUrl(),
              'body': data.externalInterfaceBadDescriptionTest
            },
            {
                'order': 6,
                'url': new schema.BusinessObjectFormatExternalInterfaces().postUrl(),
                'body': data.businessObjectFormatExternalInterfaceTest
            },
            {
              'order': 6,
              'url': new schema.BusinessObjectFormatExternalInterfaces().postUrl(),
              'body': data.businessObjectFormatInvalidExternalInterfaceTest
            }
    ]

    };
    return setupOptions;
};


/**
 * Generate the requests to delete bdefs, namespace and data providers
 * @returns options: *[]
 */
export const deleteRequests = function () {
    const teardownOptions = {
        'options': [
            {
                'order': 1,
                'url': new schema.BusinessObjectFormats()
                    .deleteUrl(data.defaultNamespace, data.defaultBdef, data.defaultFormatUsage,
                      data.defaultFormatFileType, 0)
            },
            {
                'order': 2,
                'url': new schema.ExternalInterfaces().deleteUrl(data.defaultExternalInterface)
            },
            {
                'order': 2,
                'url': new schema.ExternalInterfaces().deleteUrl(data.invalidExternalInterface)
            },{
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace, data.defaultBdef)
            },
            {
                'order': 4,
                'url': new schema.Namespace().deleteUrl(data.defaultNamespace)
            },
            {
                'order': 5,
                'url': new schema.DataProvider().deleteUrl(data.defaultDataProvider)
            }
        ]
    };

    return teardownOptions;
};

export const initRequests = {
    posts: postRequests(),
};

export const tearDownRequests = {
    deletes: deleteRequests()
};
