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
const conf = require('./e2e/config/conf.e2e.json');
const { SpecReporter } = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');
const fs = require('fs');
const path = require('path');

exports.config = {
  SELENIUM_PROMISE_MANAGER: 0,
  allScriptsTimeout: 11000,
  suites: {
    home: './e2e/**/home/**/*.e2e-spec.ts',
    search: './e2e/**/search/**/*.e2e-spec.ts',
    category: './e2e/**/category/**/*.e2e-spec.ts',
    format: './e2e/**/format/**/*.e2e-spec.ts',
    dataEntityOverview: './e2e/**/data-entity/overview/**/*.e2e-spec.ts',
    dataEntitySme: './e2e/**/data-entity/sme/**/*.e2e-spec.ts',
    dataEntitySampleData: './e2e/**/data-entity/sampledata/**/*.e2e-spec.ts',
    dataEntityList: './e2e/**/data-entity/list/**/*.e2e-spec.ts',
    dataEntityColumns: './e2e/**/data-entity/columns/**/*.e2e-spec.ts',
    dataObjectList: './e2e/**/data-objects/list/**/*.e2e-spec.ts',
    dataObjectDetail: './e2e/**/data-objects/detail/*.e2e-spec.ts',
    dataObjectDetailLineage: './e2e/**/data-objects/detail/lineage/**/*.e2e-spec.ts',
    dataObjectDetailStorageUnits: './e2e/**/data-objects/detail/storage-units/**/*.e2e-spec.ts'
  },
  baseUrl: 'http://localhost:4200/',
  // suite: 'dataObjectDetailStorageUnits',
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      prefs: {
        'credentials_enable_service': false,
        'profile': {
          'password_manager_enabled': false
        },
        'download': {
          'prompt_for_download': false,
          'default_directory': 'C:/Temp'
        }
      },
      args: [
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0',
        '--v8-cache-options=off',
        '--no-sandbox',
        '--test-type=browser'
      ]
    }
  },
  // 4 minute timeout set for browser page loads
  getPageTimeout: 240000,
  // 4 minute timeout set for protractor scripts
  allScriptsTimeout: 240000,
  directConnect: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    // 4 minute Async test timeout for jasmine
    defaultTimeoutInterval: 240000,
    print: function () { }
  },
  beforeLaunch: function () {
    if (fs.existsSync('processed.txt')) {
      fs.unlinkSync("processed.txt");
    }
  },
  afterLaunch: function () {
    // tear down all data that was setup.
    const dataManager = require(path.resolve(__dirname + '/e2e/util/DataManager.ts')).DataManager;
    return dataManager.tearDownData();
  },

  onPrepare: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    return browser.getProcessedConfig().then((c) => {
      // used to change the namespace for the data.
      process.env.CURRENT_BROWSER = c.capabilities.browserName.replace(new RegExp(' ', 'g'), '-');
      // shorten the browser idetifier for herd requests.
      process.env.CURRENT_BROWSER = process.env.CURRENT_BROWSER.replace('internet-explorer', 'ie');
      process.env.CURRENT_BROWSER = process.env.CURRENT_BROWSER.replace('microsoftedge', 'edge');
      jasmine.getEnv().addReporter(
        new jasmineReporters.JUnitXmlReporter({
          filePrefix: c.capabilities.browserName,
          consolidateAll: true,
          modifySuiteName: function (generatedSuiteName, suite) {
            // this will produce distinct suite names for each capability,
            // e.g. 'firefox.login tests' and 'chrome.login tests'
            return c.capabilities.browserName + '.' + generatedSuiteName;
          }
        })
      );

      // for each browser run, ask that browser's process to try to initialize as much data a possible.
      const dataManager = require(path.resolve(__dirname + '/e2e/util/DataManager.ts')).DataManager;
      return dataManager.initializeData(c.specs);
    });
  }
};

