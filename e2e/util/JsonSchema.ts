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


import {BusinessObjectFormatKey, BusinessObjectFormatParentsUpdateRequest} from '@herd/angular-client';

/**
 * This file maintains all the URLS, request body for posting data to HERD
 * @type {;
 * {postUrl: expor
 * public tagType.postUrl, postBody: export class tagType.postBody, deleteUrl: export class tagType.deleteUrl}}
 */

export class TagType {

  public postUrl() {
    return '/tagTypes';
  };

  public postBody(tagTypeKey, tagTypeDisplayName, tagTypeOrder, tagTypeDescription?) {
    return {
      'tagTypeKey': {
        'tagTypeCode': tagTypeKey
      }, 'displayName': tagTypeDisplayName, 'tagTypeOrder': tagTypeOrder, 'description': tagTypeDescription
    };
  }

  public deleteUrl(tagTypeKey) {
    return '/tagTypes/' + tagTypeKey;
  }
};

export class Tags {
  public postUrl() {
    return '/tags';
  };

  public postBodyWithParent(tagTypeCode, tagCode, displayName, description, parentTagTypeCode, parentTagCode) {
    return {
      'tagKey': {
        'tagTypeCode': tagTypeCode, 'tagCode': tagCode
      }, 'displayName': displayName, 'description': description, 'parentTagKey': {
        'tagTypeCode': parentTagTypeCode, 'tagCode': parentTagCode
      }
    };
  };

  public postBodyWithoutParent(tagTypeCode, tagCode, displayName, description) {
    return {
      'tagKey': {
        'tagTypeCode': tagTypeCode, 'tagCode': tagCode
      }, 'displayName': displayName, 'description': description
    };
  };

  public putBody(tagTypeCode, tagCode, displayName, description) {
    return {
      'displayName': displayName, 'description': description
    };
  };

  public deleteUrl(tagTypeCode, tagCode) {
    return '/tags/tagTypes/' + tagTypeCode + '/tagCodes/' + tagCode
  }
};

export class Namespace {
  public postUrl() {
    return '/namespaces';
  };

  public postBody(namespace) {
    return {
      'namespaceCode': namespace
    };
  };

  public deleteUrl(namespaceCode) {
    return '/namespaces/' + namespaceCode;
  }
};

export class DataProvider {
  public postUrl() {
    return '/dataProviders';
  };

  public postBody(dataProvider) {
    return {
      'dataProviderName': dataProvider
    };
  };

  public deleteUrl(dataProviderName) {
    return '/dataProviders/' + dataProviderName;
  }
};

export class BusinessObjectDefinitions {
  public postUrl() {
    return '/businessObjectDefinitions';
  };

  public deleteUrl(namespaceCode, businessObjectDefinitionName) {
    return '/businessObjectDefinitions/namespaces/' + namespaceCode + '/businessObjectDefinitionNames/' + businessObjectDefinitionName;
  };

  public updateDescriptiveInformationUrl(namespace, businessObjectDefinitionName) {
    return '/businessObjectDefinitionDescriptiveInformation/namespaces/' + namespace
      + '/businessObjectDefinitionNames/' + businessObjectDefinitionName;
  };

  public putDescriptiveInformation(description, displayName, businessObjectFormatUsage, businessObjectFormatFileType) {
    return {
      'description': description, 'displayName': displayName, 'descriptiveBusinessObjectFormat': {
        'businessObjectFormatUsage': businessObjectFormatUsage,
        'businessObjectFormatFileType': businessObjectFormatFileType
      }
    };
  };

  public clearDescriptiveInformation(description, displayName) {
    return {
      'description': description, 'displayName': displayName
    };
  }
};

export class BusinessObjectDefinitionSuggestions {
  public postUrl() {
    return '/businessObjectDefinitionDescriptionSuggestions';
  };

  public deleteUrl(namespaceCode, businessObjectDefinitionName, userId) {
    return '/businessObjectDefinitionDescriptionSuggestions/namespaces/'
      + namespaceCode + '/businessObjectDefinitionNames/' + businessObjectDefinitionName + '/userIds/' + userId;
  };
};

export class BusinessObjectDefinitionSmes {
  public postUrl() {
    return '/businessObjectDefinitionSubjectMatterExperts';
  };

  public postBody(namespace, businessObjectDefinitionName, userId) {
    return {
      'businessObjectDefinitionSubjectMatterExpertKey': {
        'namespace': namespace, 'businessObjectDefinitionName': businessObjectDefinitionName, 'userId': userId
      }
    };
  }
};

export class BusinessObjectDefinitionTags {
  public postUrl() {
    return '/businessObjectDefinitionTags';
  };

  public postBody(namespace, businessObjectDefinitionName, tagTypeCode, tagCode) {
    return {
      'businessObjectDefinitionTagKey': {
        'businessObjectDefinitionKey': {
          'namespace': namespace, 'businessObjectDefinitionName': businessObjectDefinitionName
        }, 'tagKey': {
          'tagTypeCode': tagTypeCode, 'tagCode': tagCode
        }
      }
    };
  }

  public deleteUrl(namespaceCode, businessObjectDefinitionName, tagTypeCode, tagCode) {
    return '/businessObjectDefinitionTags/namespaces/' + namespaceCode + '/businessObjectDefinitionNames/' + businessObjectDefinitionName
      + '/tagTypes/' + tagTypeCode + '/tagCodes/' + tagCode;
  }
};

export class BusinessObjectFormats {
  public postUrl() {
    return '/businessObjectFormats';
  }

  public deleteUrl(namespace, businessObjectDefinitionName,
    businessObjectFormatUsage, businessObjectFormatFileType, businessObjectFormatVersion) {
    return '/businessObjectFormats/namespaces/' + namespace + '/businessObjectDefinitionNames/' + businessObjectDefinitionName +
      '/businessObjectFormatUsages/' + businessObjectFormatUsage + '/businessObjectFormatFileTypes/' + businessObjectFormatFileType +
      '/businessObjectFormatVersions/' + businessObjectFormatVersion;
  }

  public putParentsUrl(namespace, businessObjectDefinitionName,
    businessObjectFormatUsage, businessObjectFormatFileType) {
    return '/businessObjectFormatParents/namespaces/' + namespace + '/businessObjectDefinitionNames/' + businessObjectDefinitionName +
      '/businessObjectFormatUsages/' + businessObjectFormatUsage + '/businessObjectFormatFileTypes/' + businessObjectFormatFileType;
  }

  public putParentsBody(parents: BusinessObjectFormatKey[]): BusinessObjectFormatParentsUpdateRequest {
    return {
      businessObjectFormatParents: parents
    }
  }
};

export class BusinessObjectDefinitionColumns {
  public postUrl() {
    return '/businessObjectDefinitionColumns';
  }

  public postBody(namespace, bdefName, bdefColName, schemaColName, description) {
    return {
      'businessObjectDefinitionColumnKey': {
        'namespace': namespace,
        'businessObjectDefinitionName': bdefName,
        'businessObjectDefinitionColumnName': bdefColName
      }, 'schemaColumnName': schemaColName, 'description': description
    };
  }

  public deleteUrl(namespace, businessObjectDefinitionName, businessObjectDefinitionColumnName) {
    return '/businessObjectDefinitionColumns/namespaces/' + namespace + '/businessObjectDefinitionNames/' + businessObjectDefinitionName +
      '/businessObjectDefinitionColumnNames/' + businessObjectDefinitionColumnName;
  }
};

export class BusinessObjectDataAttribute {

  public postUrl() {
    return '/businessObjectDataAttributes';
  };

  public deleteUrl(namespace, businessObjectDefinitionName, businessObjectFormatUsage,
    businessObjectFormatFileType, businessObjectFormatVersion,
    partitionValue, businessObjectDataVersion, businessObjectDataAttributeName) {
    return '/businessObjectDataAttributes/namespaces/' + namespace
      + '/businessObjectDefinitionNames/' + businessObjectDefinitionName +
      '/businessObjectFormatUsages/' + businessObjectFormatUsage
      + '/businessObjectFormatFileTypes/' + businessObjectFormatFileType +
      '/businessObjectFormatVersions/' + businessObjectFormatVersion + '/partitionValues/' + partitionValue
      + '/businessObjectDataVersions/' +
      businessObjectDataVersion + '/businessObjectDataAttributeNames/' + businessObjectDataAttributeName;
  }

};

export class BusinessObjectDefinitionData {
  public putStatusUrl(namespace, bdefName, formatUsage, formatFileType, formatVersion, partitionValue, dataVersion) {
    return '/businessObjectDataStatus/namespaces/' + namespace + '/businessObjectDefinitionNames/' + bdefName
      + '/businessObjectFormatUsages/' + formatUsage + '/businessObjectFormatFileTypes/' + formatFileType
      + '/businessObjectFormatVersions/' + formatVersion
      + '/partitionValues/' + partitionValue + '/businessObjectDataVersions/' + dataVersion;
  };

  public postUrl() {
    return '/businessObjectData';
  }

  public deleteWith4SubPartitionsUrl(namespace, businessObjectDefinitionName, businessObjectFormatUsage, businessObjectFormatFileType,
    businessObjectFormatVersion, partitionValue, subPartition1Value, subPartition2Value,
    subPartition3Value, subPartition4Value, businessObjectDataVersion, deleteFiles) {
    return '/businessObjectData/namespaces/' + namespace + '/businessObjectDefinitionNames/'
      + businessObjectDefinitionName + '/businessObjectFormatUsages/' +
      businessObjectFormatUsage + '/businessObjectFormatFileTypes/' + businessObjectFormatFileType
      + '/businessObjectFormatVersions/' + businessObjectFormatVersion + '/partitionValues/' + partitionValue
      + '/subPartition1Values/' + subPartition1Value + '/subPartition2Values/' +
      subPartition2Value + '/subPartition3Values/' + subPartition3Value + '/subPartition4Values/' + subPartition4Value
      + '/businessObjectDataVersions/' + businessObjectDataVersion + '?deleteFiles=' + deleteFiles;
  };

  public deleteWith1SubPartitionsUrl(namespace, businessObjectDefinitionName, businessObjectFormatUsage,
    businessObjectFormatFileType, businessObjectFormatVersion, partitionValue,
    subPartition1Value, businessObjectDataVersion, deleteFiles) {
    return '/businessObjectData/namespaces/' + namespace + '/businessObjectDefinitionNames/' + businessObjectDefinitionName
      + '/businessObjectFormatUsages/' + businessObjectFormatUsage + '/businessObjectFormatFileTypes/' + businessObjectFormatFileType
      + '/businessObjectFormatVersions/' + businessObjectFormatVersion + '/partitionValues/' + partitionValue
      + '/subPartition1Values/' + subPartition1Value + '/businessObjectDataVersions/' + businessObjectDataVersion
      + '?deleteFiles=' + deleteFiles;
  };

  public deleteWithoutSubPartitionsUrl(namespace, businessObjectDefinitionName, businessObjectFormatUsage, businessObjectFormatFileType,
    businessObjectFormatVersion, partitionValue, businessObjectDataVersion, deleteFiles) {
    return '/businessObjectData/namespaces/' + namespace + '/businessObjectDefinitionNames/' + businessObjectDefinitionName
      + '/businessObjectFormatUsages/' + businessObjectFormatUsage + '/businessObjectFormatFileTypes/'
      + businessObjectFormatFileType + '/businessObjectFormatVersions/' + businessObjectFormatVersion
      + '/partitionValues/' + partitionValue + '/businessObjectDataVersions/' + businessObjectDataVersion + '?deleteFiles=' + deleteFiles;
  }

};

