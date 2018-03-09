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
const req = require('request-promise-native');
const fs = require('fs');
const path = require('path');


const build = process.env.JENKINS_BUILD_NUMBER || ('localTestBuildNumber__' + Date.now());
const shartTestFiles = false;
const maxInstances = 1;
const seleniumVersion = '3.4.0';
const tunnelId = process.env.SCP_TUNNEL;
const screenResolution = '1400x1050';

let browsers = [{
  screenResolution,
  'tunnel-identifier': tunnelId,
  build,
  seleniumVersion: "3.5.0",
  name: "Windows 10 chrome Latest-1",
  username: conf.sauceUser,
  accessKey: conf.sauceKey,
  platform: "Windows 10",
  browserName: "chrome",
  chromeOptions: {
    prefs: {
      'credentials_enable_service': false,
      'profile': {
        'password_manager_enabled': false
      }
    },
    args: [
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disk-cache-size=0',
      '--v8-cache-options=off'
    ]
  },
  version: "latest-1",
  maxInstances,
  shartTestFiles
}];
const otherBrowsers = [

  {
    screenResolution,
    'tunnel-identifier': tunnelId,
    build,
    seleniumVersion,
    name: "Windows 10 Firefox latest-1",
    username: conf.sauceUser,
    accessKey: conf.sauceKey,
    platform: "Windows 10",
    browserName: "firefox",
    maxInstances,
    shartTestFiles,
    version: 'latest-1'
  },
  {
    build,
    seleniumVersion,
    screenResolution,
    "name": "Mac 10.12 safari 11.0",
    "username": conf.sauceUser,
    "accessKey": conf.sauceKey,
    "tunnel-identifier": tunnelId,
    "platform": "macOS 10.12",
    "browserName": "safari",
    "version": "11.0",
    maxInstances,
    shartTestFiles
  },
  {
    screenResolution,
    'tunnel-identifier': tunnelId,
    build,
    seleniumVersion: "3.5.0",
    name: "Windows 10 Edge latest",
    username: conf.sauceUser,
    accessKey: conf.sauceKey,
    platform: "Windows 10",
    version: 'latest',
    browserName: "microsoftedge",
    maxInstances,
    shartTestFiles
  },
  {
    screenResolution,
    'tunnel-identifier': tunnelId,
    build,
    iedriverVersion: seleniumVersion,
    'ie.ensureCleanSession': true,
    'ie.enableElementCacheCleanup': true,
    name: "Windows 10 IE 11",
    username: conf.sauceUser,
    accessKey: conf.sauceKey,
    platform: "Windows 10",
    browserName: "internet explorer",
    version: "11",
    unexpectedAlertBehaviour: "ignore",
    maxInstances,
    shartTestFiles
  }
];

if ( !process.env.RUN_CHROME_ONLY) {
  browsers = browsers.concat(otherBrowsers);
}

exports.config = {
  SELENIUM_PROMISE_MANAGER: 0,
  seleniumAddress: conf.sauceSeleniumAddress,
  multiCapabilities: browsers,
  maxSessions: 10,
  getPageTimeout: 240000,
  allScriptsTimeout: 240000,
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
  baseUrl: conf.baseUrl8443,
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 240000,
    print: function () {
    }
  },
  beforeLaunch() {
    // a file that is watched to see what data needs cleaned up or not while running tests in parallel.
    // delete on every start before tests start so that data will be setup / toredown no matter what.
    if (fs.existsSync('processed.txt')) {
      fs.unlinkSync("processed.txt");
    }
  },
  afterLaunch() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    // ending properties file with quotes for the proplery converted property of SAUCE_SLACK_URLS
    if (fs.existsSync('urls.txt')) {
      const urls = fs.readFileSync('urls.txt').toString();
      fs.appendFileSync('slack.properties', 'SAUCE_SLACK_URLS="' + urls + '"');
    }

    // tear down all data that was setup.
    const dataManager = require(path.resolve(__dirname + '/e2e/util/DataManager.ts')).DataManager;
    return dataManager.tearDownData();
  },
  onPrepare() {
    let capabilities

    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    jasmine.getEnv().addReporter({
      specDone: function (result) {
        // this is used to report pass or fail to SauceLabs
        // only check to set for the first failure after it has been set to passed.
        if (capabilities.passed === true || capabilities.passed === undefined || capabilities.passed === null) {
          capabilities.passed = !!(result.failedExpectations.length === 0 && result.status !== 'failed');
        }
      }
    });

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: true }
    }));

    return browser.getProcessedConfig().then((c) => {
      capabilities = c.capabilities;

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
  },

  onComplete() {
    return browser.getProcessedConfig().then(function (c) {
      return browser.getSession().then(function (session) {
        const authInfo = Buffer(conf.sauceUser + ':' + conf.sauceKey).toString('base64');
        // File writes for reporting to slack with jenkins
        const separator = fs.existsSync('urls.txt') ? '  ' : '';
        const slackUrl = separator + '(' + process.env.CURRENT_BROWSER + ') http://saucelabs.com/tests/' + session.getId();
        fs.appendFileSync('urls.txt', slackUrl);

        // required to be here so saucelabs picks up reports to put in jenkins
        console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + c.capabilities.name);
        // this request marks the particular job as passed or failed for reporting
        return req({
          url: 'https://saucelabs.com/rest/v1/' + conf.sauceUser + '/jobs/' + session.getId(),
          method: 'put',
          body: {
            passed: !!c.capabilities.passed,
          },
          json: true,
          headers: {
            'Authorization': 'Basic ' + authInfo
          }
        }).then(function (e) {
          console.log('Session: ' + session.getId() + ' of job ' + c.capabilities.name + ' successfully marked as ' + (c.capabilities.passed ? 'passed' : 'failed'));
        }).catch(function (e) {
          console.log('Session: ' + session.getId() + ' of job ' + c.capabilities.name + ' unsuccessfully marked as ' + (c.capabilities.passed ? 'passed' : 'failed'));
          console.log('Error in request');
          console.log(e);
        });
      });
    });
  }
};
