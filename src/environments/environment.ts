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
export const environment = {
  production: false,
  restBaseUri: 'https://datamgt.dev.aws.finra.org/herd-app/rest',
  basicAuthRestBaseUri: 'https://datamgt.dev.aws.finra.org:8443/herd-app/rest',
  helpUrl: 'https://products.finra.org/display/EData/Universal+Data+Catalog+User+Guide',
  supportEmail: 'DL-DataCatalog_Support@finra.org',
  brandHeader: '{{BRAND_HEADER}}',
  brandMotto: '{{BRAND_MOTO}}',
  docTitlePrefix: 'UDC',
  useBasicAuth: false,
  alertDelayInSeconds: 10,
  trackAnalytics: true,
  ga: {key: '0123456789abcdef', iv: 'fedcba987654321', trackingId: '{{TRACKING_ID}}'}
};

