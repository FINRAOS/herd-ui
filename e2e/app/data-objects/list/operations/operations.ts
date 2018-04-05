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
import {
  Namespace,
  DataProvider,
  BusinessObjectDefinitions,
  BusinessObjectFormats, BusinessObjectDefinitionData
} from '../../../../util/JsonSchema';

const bData = new BusinessObjectDefinitionData();
const formats = new BusinessObjectFormats();
const bDefs = new BusinessObjectDefinitions();
const ns = new Namespace();
const provider = new DataProvider();


  export const postRequests = function () {
      const setupOptions = {
        'options': [
          {
            'order': 1, 'url': ns.postUrl(), 'body': ns.postBody(data.defaultNamespace)
          }, {
            'order': 2, 'url': provider.postUrl(), 'body': provider.postBody(data.defaultDataProvider)
          }, {
            'order': 3, 'url': bDefs.postUrl(), 'body': data.bdef1
          }, {
            'order': 4, 'url': formats.postUrl(), 'body': data.formatWithData
          }, {
            'order': 4, 'url': formats.postUrl(), 'body': data.formatNoData
          }, {
            'order': 4, 'url': formats.postUrl(), 'body': data.formatForFilter
          }, {
            'order': 5, 'url': bData.postUrl(), 'body': data.bdata1 // order matters for bdata for tests to get consistent list tests
          }, {
            'order': 6, 'url': bData.postUrl(), 'body': data.bdata2
          }, {
            'order': 7, 'url': bData.postUrl(), 'body': data.bdata3
          }, {
            'order': 8, 'url': bData.postUrl(), 'body': data.bdataWithSubPartitions
          }
        ]
      };
      return setupOptions;
    };


export const deleteRequests = function () {
  const setupOptions = {
    'options': [
      {
        'order': 2,
        'url': bData
          .deleteWithoutSubPartitionsUrl(data.bdata1.namespace,
            data.bdata1.businessObjectDefinitionName,
            data.bdata1.businessObjectFormatUsage,
            data.bdata1.businessObjectFormatFileType,
            0, data.bdata1.partitionValue, 0, true)
      }, {
        'order': 2,
        'url': bData
          .deleteWithoutSubPartitionsUrl(data.bdata2.namespace,
            data.bdata2.businessObjectDefinitionName,
            data.bdata2.businessObjectFormatUsage,
            data.bdata2.businessObjectFormatFileType, 0,
            data.bdata2.partitionValue, 0, true)
      }, {
        'order': 2,
        'url': bData
          .deleteWithoutSubPartitionsUrl(data.bdata3.namespace,
            data.bdata3.businessObjectDefinitionName,
            data.bdata3.businessObjectFormatUsage,
            data.bdata3.businessObjectFormatFileType, 0,
            data.bdata3.partitionValue, 0, true)
      }, {
        'order': 2,
        'url': bData
          .deleteWith4SubPartitionsUrl(data.bdataWithSubPartitions.namespace,
            data.bdataWithSubPartitions.businessObjectDefinitionName,
            data.bdataWithSubPartitions.businessObjectFormatUsage,
            data.bdataWithSubPartitions.businessObjectFormatFileType, 0,
            data.bdataWithSubPartitions.partitionValue,
            data.bdataWithSubPartitions.subPartitionValues[0],
            data.bdataWithSubPartitions.subPartitionValues[1],
            data.bdataWithSubPartitions.subPartitionValues[2],
            data.bdataWithSubPartitions.subPartitionValues[3], 0, true)
      }, {
        'order': 3,
        'url': formats.deleteUrl(data.formatForFilter.namespace,
          data.formatForFilter.businessObjectDefinitionName,
          data.formatForFilter.businessObjectFormatUsage,
          data.formatForFilter.businessObjectFormatFileType, 0)
      }, {
        'order': 3,
        'url': formats.deleteUrl(data.formatWithData.namespace,
          data.formatWithData.businessObjectDefinitionName,
          data.formatWithData.businessObjectFormatUsage,
          data.formatWithData.businessObjectFormatFileType, 0)
      }, {
        'order': 3,
        'url': formats.deleteUrl(data.formatNoData.namespace,
          data.formatNoData.businessObjectDefinitionName,
          data.formatNoData.businessObjectFormatUsage,
          data.formatNoData.businessObjectFormatFileType, 0)
      }, {
        'order': 4, 'url': bDefs.deleteUrl(data.defaultNamespace, data.bdef1.businessObjectDefinitionName)
      }, {
        'order': 5, 'url': ns.deleteUrl(data.defaultNamespace)
      }, {
        'order': 6, 'url': provider.deleteUrl(data.defaultDataProvider)
      }
    ]
  };
  return setupOptions;
};



export const initRequests = {
  posts: {
    options: postRequests().options
  }
};

export const tearDownRequests = {
  deletes: {
    options: deleteRequests().options
  }
};
