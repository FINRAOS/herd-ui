<!--
 Copyright 2018 herd-ui contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

## configuration required to test.

You reached here because you are trying to test the project and conf.e2e.json is not available.

You need to create your own conf.e2e.json or you need to ask it from the owner of the community who is developing it.

Keeping in mind, this code is open source and can be used in any purpose with any data, The specific data related to
particular project is not checked in. While testing, you need to provide your sample configuration file (conf.e2e.json)
data so that it will test the code with your data.

#### sample data:

Below is a sample json which is similar what testing would except but not as it is. You will also get the JSON file
avilable there and need to provide environemnt configuration to run test successfully. Make sure to provide your data
like backend url, home page link, other page link, specific data, etc.

```json
{
    "baseUrlLocal": "http://localhost:4200",
    "baseUrl8443": "https://xyz.com:8443",
    "baseUrl": "https://xyz.com",
    "herdHost": "https://backend.xyz.com:8443/rest",
    "homePage": "/",
    "globalSearchPage": "/GlobalSearch",
    "buildInfoPage": "/DisplayBuildInfo",
    "dataEntityDetailPath": "/data-entities",
    "categoryDetailPath": "/categories/",
    "bdataListPath": "data-objects/{namespace}/{definitionName}/{usage}/{fileType}/{version}",
    "bdataListPath": "/data-objects/{namespace}/{definitionName}",
    "bdataDetailPath": "/data-objects/{namespace}/{definitionName}/{usage}/{fileType}/{formatVersion}/{partitionValue}/{dataVersion}/{subPartitions}",
    "defaultPrefix": "",
    "sauceUser": "[your-sauce-userid]",
    "sauceKey": "[your-saucelab-userkey]",
    "sauceSeleniumAddress": "http://localhost:4445/......",
}
```
