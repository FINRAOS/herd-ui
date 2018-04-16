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
import * as schema from '../../../util/JsonSchema';

const data = new Data();


export const postRequests = function () {
    const setupOptions = {
        'options': [{
            'order': 1, 'url': new schema.Namespace().postUrl(), 'body': new schema.Namespace().postBody(data.defaultNamespace)
        }, {
            'order': 2, 'url': new schema.DataProvider().postUrl(), 'body': new schema.DataProvider().postBody(data.defaultDataProvider)
        }, {
            'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdef1()
        }, {
            'order': 3, 'url': new schema.BusinessObjectDefinitions().postUrl(), 'body': data.bdef2()
        }, {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat1()
        }, {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat2()
        }, {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat3()
        }, {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat4()
        }, {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat5()
        }, {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat6()
        },
        {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat7()
        },
        {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.bformat21()
        },
        {
            'order': 4, 'url': new schema.BusinessObjectFormats().postUrl(), 'body': data.formatNoData()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata1()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata2()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata3()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata4()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata5()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata6()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata7()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata8()
        },
        {
            'order': 5,
            'url': new schema.BusinessObjectDefinitionData().postUrl(),
            'body': data.bdata21()
        }
        ]
    };
    return setupOptions;
};


export const deleteRequests = function () {
    const teardownOptions = {
        'options': [
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWith1SubPartitionsUrl(data.bdata1().namespace,
                    data.bdata1().businessObjectDefinitionName,
                    data.bdata1().businessObjectFormatUsage, data.bdata1().businessObjectFormatFileType, 0,
                    data.bdata1().partitionValue, data.bdata1().subPartitionValues[0], 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(data.bdata2().namespace,
                    data.bdata2().businessObjectDefinitionName,
                    data.bdata2().businessObjectFormatUsage, data.bdata2().businessObjectFormatFileType, 0,
                    data.bdata2().partitionValue, 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(data.bdata21().namespace,
                    data.bdata21().businessObjectDefinitionName,
                    data.bdata21().businessObjectFormatUsage, data.bdata2().businessObjectFormatFileType, 1,
                    data.bdata21().partitionValue, 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(data.bdata3().namespace,
                    data.bdata3().businessObjectDefinitionName,
                    data.bdata3().businessObjectFormatUsage, data.bdata3().businessObjectFormatFileType, 0,
                    data.bdata3().partitionValue, 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(data.bdata4().namespace,
                    data.bdata4().businessObjectDefinitionName,
                    data.bdata4().businessObjectFormatUsage, data.bdata4().businessObjectFormatFileType, 0,
                    data.bdata4().partitionValue, 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(data.bdata5().namespace,
                    data.bdata4().businessObjectDefinitionName,
                    data.bdata5().businessObjectFormatUsage, data.bdata5().businessObjectFormatFileType, 0,
                    data.bdata5().partitionValue, 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
                    data.bdata6().namespace, data.bdata6().businessObjectDefinitionName,
                    data.bdata6().businessObjectFormatUsage, data.bdata6().businessObjectFormatFileType, 0,
                    data.bdata6().partitionValue, 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
                    data.bdata7().namespace, data.bdata7().businessObjectDefinitionName,
                    data.bdata7().businessObjectFormatUsage, data.bdata7().businessObjectFormatFileType, 0,
                    data.bdata7().partitionValue, 0, true)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionData().deleteWithoutSubPartitionsUrl(
                    data.bdata8().namespace, data.bdata8().businessObjectDefinitionName,
                    data.bdata8().businessObjectFormatUsage, data.bdata8().businessObjectFormatFileType, 0,
                    data.bdata8().partitionValue, 0, true)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(data.defaultNamespace,
                data.bformat1().businessObjectDefinitionName, data.bformat1().businessObjectFormatUsage,
                data.bformat1().businessObjectFormatFileType, 0)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(data.defaultNamespace,
                data.bformat21().businessObjectDefinitionName,
                data.bformat21().businessObjectFormatUsage, data.bformat21().businessObjectFormatFileType, 1)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(data.defaultNamespace,
                data.bformat2().businessObjectDefinitionName,
                data.bformat2().businessObjectFormatUsage, data.bformat2().businessObjectFormatFileType, 0)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(data.defaultNamespace,
                data.bformat3().businessObjectDefinitionName,
                data.bformat3().businessObjectFormatUsage, data.bformat3().businessObjectFormatFileType, 0)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(
                    data.defaultNamespace, data.bformat4().businessObjectDefinitionName,
                    data.bformat4().businessObjectFormatUsage, data.bformat4().businessObjectFormatFileType, 0)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(
                    data.defaultNamespace, data.bformat5().businessObjectDefinitionName,
                    data.bformat5().businessObjectFormatUsage, data.bformat5().businessObjectFormatFileType, 0)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(
                    data.defaultNamespace, data.bformat6().businessObjectDefinitionName,
                    data.bformat6().businessObjectFormatUsage, data.bformat6().businessObjectFormatFileType, 0)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(
                    data.defaultNamespace, data.bformat7().businessObjectDefinitionName,
                    data.bformat7().businessObjectFormatUsage, data.bformat7().businessObjectFormatFileType, 0)
            },
            {
                'order': 2, 'url': new schema.BusinessObjectFormats().deleteUrl(
                    data.defaultNamespace, data.formatNoData().businessObjectDefinitionName,
                    data.formatNoData().businessObjectFormatUsage, data.formatNoData().businessObjectFormatFileType, 0)
            },
            {
                'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(
                    data.defaultNamespace, data.bdef1().businessObjectDefinitionName)
            }, {
                'order': 3, 'url': new schema.BusinessObjectDefinitions().deleteUrl(
                    data.defaultNamespace, data.bdef2().businessObjectDefinitionName)
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
  posts: {
    options: postRequests().options
  }
};

export const tearDownRequests = {
  deletes:  {
    options: deleteRequests().options
  }
};
