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
import { DataManager } from '../../../../util/DataManager';

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
                'body': data.bdefTestNoDF()
            }, {
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().postUrl(),
                'body': data.bdefTestDFNoSchema()
            },
            {
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().postUrl(),
                'body': data.bdefTestDF()
            },
            {
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().postUrl(),
                'body': data.bdefTestDFSchemaWith_Partitions()
            },
            {
                'order': 4,
                'url': new schema.BusinessObjectFormats().postUrl(),
                'body': data.bdefTestDF_FORMAT()
            },
            {
                'order': 4,
                'url': new schema.BusinessObjectFormats().postUrl(),
                'body': data.bdefTestDFNoSchema_FORMAT()
            },
            {
                'order': 4,
                'url': new schema.BusinessObjectFormats().postUrl(),
                'body': data.bdefTestDF_FORMAT_WithPartitions()
            },
            {
                'order': 5,
                'url': new schema.BusinessObjectDefinitionColumns().postUrl(),
                'body': new schema.BusinessObjectDefinitionColumns().postBody(data.defaultNamespace,
                    data.bdefTestDF().businessObjectDefinitionName,
                    data.bdefColumnName1, data.bdefTestDF_FORMAT().schema.columns[0].name,
                    data.bdefTestDF_FORMAT().schema.columns[0].description)
            },
            {
                'order': 5,
                'url': new schema.BusinessObjectDefinitionColumns().postUrl(),
                'body': new schema.BusinessObjectDefinitionColumns().postBody(data.defaultNamespace,
                    data.bdefTestDF().businessObjectDefinitionName, data.bdefColumnName2, data.bdefTestDF_FORMAT().schema.columns[1].name,
                    data.bdefTestDF_FORMAT().schema.columns[1].description)
            }
        ]
    };
    return setupOptions;
};

/**
 * Generate requests to put bdef descriptive format
 */

export const putDescriptiveFormatRequests = function () {
    const setupOptions = {
        'options': [
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                    data.bdefTestDF().businessObjectDefinitionName),
                'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.bdefTestDF().description,
                    data.bdefTestDF().displayName, data.bdefTestDF_FORMAT().businessObjectFormatUsage,
                    data.bdefTestDF_FORMAT().businessObjectFormatFileType)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                    data.bdefTestDFNoSchema().businessObjectDefinitionName),
                'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.bdefTestDFNoSchema().description,
                    data.bdefTestDFNoSchema().displayName, data.bdefTestDFNoSchema_FORMAT().businessObjectFormatUsage,
                    data.bdefTestDFNoSchema_FORMAT().businessObjectFormatFileType)
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                    data.bdefTestDFSchemaWith_Partitions().businessObjectDefinitionName),
                'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.bdefTestDFSchemaWith_Partitions().description,
                    data.bdefTestDFSchemaWith_Partitions().displayName, data.bdefTestDF_FORMAT_WithPartitions().businessObjectFormatUsage,
                    data.bdefTestDF_FORMAT_WithPartitions().businessObjectFormatFileType)
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
                'url': new schema.BusinessObjectDefinitionColumns().deleteUrl(data.bdefTestDF().namespace,
                    data.bdefTestDF().businessObjectDefinitionName, data.bdefColumnName1)
            }, {
                'order': 1,
                'url': new schema.BusinessObjectDefinitionColumns().deleteUrl(data.bdefTestDF().namespace,
                    data.bdefTestDF().businessObjectDefinitionName, data.bdefColumnName2)
            },
            {
                'order': 2,
                'url': new schema.BusinessObjectFormats()
                    .deleteUrl(data.bdefTestDF().namespace, data.bdefTestDF().businessObjectDefinitionName,
                    data.bdefTestDF_FORMAT().businessObjectFormatUsage, data.bdefTestDF_FORMAT().businessObjectFormatFileType, 0)
            },
            {
                'order': 2,
                'url': new schema.BusinessObjectFormats().deleteUrl(data.bdefTestDFNoSchema().namespace,
                    data.bdefTestDFNoSchema().businessObjectDefinitionName,
                    data.bdefTestDFNoSchema_FORMAT()
                        .businessObjectFormatUsage, data.bdefTestDFNoSchema_FORMAT().businessObjectFormatFileType, 0)
            }, {
                'order': 2,
                'url': new schema.BusinessObjectFormats().deleteUrl(data.bdefTestDFSchemaWith_Partitions().namespace,
                    data.bdefTestDFSchemaWith_Partitions().businessObjectDefinitionName,
                    data.bdefTestDF_FORMAT_WithPartitions().businessObjectFormatUsage,
                    data.bdefTestDF_FORMAT_WithPartitions().businessObjectFormatFileType, 0)
            },
            {
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
                    data.bdefTestDFNoSchema().businessObjectDefinitionName)
            },
            {
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
                    data.bdefTestDF().businessObjectDefinitionName)
            },
            {
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
                    data.bdefTestNoDF().businessObjectDefinitionName)
            },
            {
                'order': 3,
                'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
                    data.bdefTestDFSchemaWith_Partitions().businessObjectDefinitionName)
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


/**
 * Generate requests to clear bdef descriptive format
 */

export const clearDescriptiveFormatRequests = function () {
    const setupOptions = {
        'options': [
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                    data.bdefTestDF().businessObjectDefinitionName),
                'body': {}
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                    data.bdefTestDFNoSchema().businessObjectDefinitionName),
                'body': {}
            },
            {
                'order': 1,
                'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                    data.bdefTestDFSchemaWith_Partitions().businessObjectDefinitionName),
                'body': {}
            }
        ]
    };
    return setupOptions;
};

// due to running tests in parallel each tested browser for editing needs its own
// to edit this function allows the browser to setup its own data as opposed to the
// normal generic parallel setup.
export const editableDataSetup = () => {
    const dm = new DataManager();

    const posts = [
        {
            'order': 1,
            'url': new schema.BusinessObjectDefinitions().postUrl(),
            'body': data.editColumnBdef
        }, {
            'order': 2,
            'url': new schema.BusinessObjectFormats().postUrl(),
            'body': data.editableColumnsFormat
        },
    ];

    const updates = [
        {
            'order': 1,
            'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                data.editColumnBdef.businessObjectDefinitionName),
            'body': new schema.BusinessObjectDefinitions().putDescriptiveInformation(data.editColumnBdef.description,
                data.editColumnBdef.displayName, data.editableColumnsFormat.businessObjectFormatUsage,
                data.editableColumnsFormat.businessObjectFormatFileType)
        }
    ];

    dm.setUp(posts);
    dm.update(updates);
};

// due to running tests in parallel each tested browser for editing needs its own
// to edit this function allows the browser to delete its own data
export const editableDataTearDown = () => {
    const dm = new DataManager();

    const updates = [
        {
            'order': 1,
            'url': new schema.BusinessObjectDefinitions().updateDescriptiveInformationUrl(data.defaultNamespace,
                data.editColumnBdef.businessObjectDefinitionName),
            'body': {}
        }
    ];
    const deletes = [
        {
            'order': 2,
            'url': new schema.BusinessObjectFormats()
                .deleteUrl(data.editableColumnsFormat.namespace, data.editableColumnsFormat.businessObjectDefinitionName,
                data.editableColumnsFormat.businessObjectFormatUsage, data.editableColumnsFormat.businessObjectFormatFileType, 0)
        },
        {
            'order': 3,
            'url': new schema.BusinessObjectDefinitions().deleteUrl(data.defaultNamespace,
                data.editColumnBdef.businessObjectDefinitionName)
        },
    ];

    dm.update(updates);
    dm.tearDown(deletes);
};

export const initRequests = {
    posts: postRequests(),
    updates: putDescriptiveFormatRequests()
};

export const tearDownRequests = {
    updates: clearDescriptiveFormatRequests(),
    deletes: deleteRequests()
};
