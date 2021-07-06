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
// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  var conf = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-scss-preprocessor')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      }
    },
    files: [

      { pattern: './src/**/*.scss', watched: false, included: false, served: true },
      { pattern: './node_modules/primeng/resources/themes/omega/**/*.+(woff2|woff|ttf)', watched: false, included: false, served: true },
      { pattern: './node_modules/font-awesome/fonts/*.+(woff2|woff|ttf)', watched: false, included: false, served: true },
      "./node_modules/bootstrap/scss/bootstrap.scss",
      "./node_modules/font-awesome/scss/font-awesome.scss",
      "./node_modules/primeng/resources/primeng.min.css",
      "./node_modules/primeng/resources/themes/omega/theme.css",
      "./node_modules/codemirror/lib/codemirror.css",
    ],
    scssPreprocessor: {
      options: {
        sourceMap: true
      }
    },
    preprocessors: {
      './src/**/*.scss': ['scss'],
      './node_modules/font-awesome/scss/font-awesome.scss': ['scss'],
      './node_modules/bootstrap/scss/bootstrap.scss': ['scss'],
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'cobertura'],
      fixWebpackSourcePaths: true
    },
    junitReporter: {
      outputDir: 'coverage/junit'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul', 'junit', 'kjhtml']
      : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browserNoActivityTimeout: 60000,
    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9222']
      },
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false
  };

  if(process.env.TRAVIS) {
    conf.browsers = ['ChromeHeadlessNoSandbox'];
    conf.singleRun = true;
  } else {
    conf.browsers = ['ChromeDebugging'];
    conf.singleRun = false;
  }
  config.set(conf);
};
