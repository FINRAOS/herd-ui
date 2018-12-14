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

export class Data {
    description = 'Sample description text for testing purpose. Used for all description fields';
    defaultDataProvider = 'DP_PROTRACTOR_TEST_EI';
    defaultNamespace = 'NS_PROTRACTOR_TEST_EI';
    defaultBdef = 'BDEF_PROTRACTOR_TEST_EI';
    defaultFormatUsage = 'FMT_PROTRACTOR_TEST_EI';
    defaultFormatFileType = "TXT";
    defaultExternalInterface = "EI_PROTRACTOR_TEST_EI";
    invalidExternalInterface = "EI_PROTRACTOR_TEST_EI_INVALID";
    invalidExternalInterfaceDescription = 'Bad description #elseif';
    displayName = 'display name of ';

    bdefTest = {
        'namespace': this.defaultNamespace,
        'dataProviderName': this.defaultDataProvider,
        'businessObjectDefinitionName': this.defaultBdef,
        'description': this.description,
        'displayName': this.displayName + this.defaultBdef
    };

    businessObjectFormatTest = {
        'namespace': this.defaultNamespace,
        'businessObjectDefinitionName': this.defaultBdef,
        'businessObjectFormatUsage': this.defaultFormatUsage,
        'businessObjectFormatFileType': this.defaultFormatFileType,
        'partitionKey': 'TEST_KEY',
        'description': 'Nam et interdum quam, hendrerit varius magna.'
    };

    externalInterfaceTest = {
        "externalInterfaceKey": {
          "externalInterfaceName": this.defaultExternalInterface
        },
        "displayName": this.displayName + this.defaultExternalInterface,
        "description": this.description
      };


    externalInterfaceBadDescriptionTest = {
        "externalInterfaceKey": {
          "externalInterfaceName": this.invalidExternalInterface
      },
        "displayName": this.displayName + this.invalidExternalInterface,
        "description": this.invalidExternalInterfaceDescription
    };

    businessObjectFormatExternalInterfaceTest = {
        "businessObjectFormatExternalInterfaceKey": {
          "namespace": this.defaultNamespace,
          "businessObjectDefinitionName": this.defaultBdef,
          "businessObjectFormatUsage": this.defaultFormatUsage,
          "businessObjectFormatFileType": this.defaultFormatFileType,
          "externalInterfaceName": this.defaultExternalInterface
        }
    };


  businessObjectFormatInvalidExternalInterfaceTest = {
      "businessObjectFormatExternalInterfaceKey": {
        "namespace": this.defaultNamespace,
        "businessObjectDefinitionName": this.defaultBdef,
        "businessObjectFormatUsage": this.defaultFormatUsage,
        "businessObjectFormatFileType": this.defaultFormatFileType,
        "externalInterfaceName": this.invalidExternalInterface
      }
    };
}
