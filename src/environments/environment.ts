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
  restBaseUri: '{{HERD_REST_BASE_URI}}',
  basicAuthRestBaseUri: '{{HERD_REST_BASE_URI2}}',
  helpUrl: '{{ORG_HELP_URL}}',
  supportEmail: '{{ORG_SUPPORT_EMAIL}}',
  brandHeader: '{{BRAND_HEADER}}',
  brandMotto: '{{BRAND_MOTO}}',
  docTitlePrefix: 'UDC',
  useBasicAuth: false,
  fipAuthCookieName: '{{FIP_AUTH_COOKIE_NAME}}',
  fipAuthEndpoint: '{{FIP_AUTH_ENDPOINT}}',
  alertDelayInSeconds: 10,
  trackAnalytics: true,
  ga: {
    key: '{{GA_KEY}}',
    iv: '{{GA_IV}}',
    trackingId: '{{TRACKING_ID}}'
  },
  dataObjectListPermissionsResolution: 'Please consult <a href="https://products.finra.org/display/UDC/UDC+User+Permissions" ' +
    'target="_blank" rel="noopener noreferrer">UDC User Permissions</a> for details.'
};

