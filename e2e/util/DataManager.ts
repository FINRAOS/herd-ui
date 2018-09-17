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
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import request from 'sync-request';
// import request, {FormData} from 'then-request';
import { Logger } from 'winston';


const constants = require('../config/conf.e2e.json');
const herdHost = process.env.HERD_HOST || constants.herdHost;

export interface DMOption {
  order: number,
  url: string,
  body?: any
}

// TODO refactoring the class is also needed
export class DataManager {

  static logger: Logger;

  static async initializeData(specs: string[]) {

    const processOps = async (opsLocation, spec) => {
      return new Promise(async (resolve, reject) => {
        // check for ts on normal runs and .js on generated file debug runs.
        if (fs.existsSync(opsLocation + '.ts') || fs.existsSync(opsLocation + '.js')) {
          fs.appendFileSync('processed.txt', opsLocation + 'p ');
          const op = await import(opsLocation);
          dm.setUp(op.initRequests.posts.options);
          if (op.initRequests.updates) {
            dm.update(op.initRequests.updates.options);
          }
          let doneFile = fs.readFileSync('processed.txt').toString();
          doneFile = doneFile.replace(opsLocation + 'p ', opsLocation + 'd ');
          fs.writeFileSync('processed.txt', doneFile);
        } else {
          DataManager.logger.log('info', 'Operations do not exist for spec: ' + spec);
          fs.appendFileSync('processed.txt', opsLocation + 'd ');
        }
        resolve();
      });
    };

    const dm = new DataManager();
    const waitFor: string[] = [];

    for (const spec of specs) {
      // don't process ops for the base protractor spec or any spec marked with
      // noops in the file name.
      if (!spec.includes('protractor')) {
        const opsLocation = path.resolve(spec, '../operations/operations');
        if (fs.existsSync('processed.txt')) {
          const file = fs.readFileSync('processed.txt').toString();
          if (!file.includes(opsLocation)) {
            await processOps(opsLocation, spec);
          } else {
            waitFor.push(opsLocation);
          }
        } else {
          await processOps(opsLocation, spec);
        }
        ;

      }
    }

    while (waitFor.length > 0) {
      const f = fs.readFileSync('processed.txt').toString();
      [...waitFor].forEach((w, i) => {
        if (!f.includes(w + 'p ')) {
          waitFor.splice(i, 1);
        }
      });
    }
    return Promise.resolve();
  };

  static async tearDownData() {
    const dm = new DataManager();
    let file = fs.readFileSync('processed.txt').toString();

    const opsLocations = file.split('d ');

    for (const opsLocation of opsLocations) {
      if (opsLocation.length !== 0) {
        // check for ts on normal runs and .js on generated file debug runs.
        if (fs.existsSync(opsLocation + '.ts') || fs.existsSync(opsLocation + '.js')) {
          const op = await import(opsLocation);
          if (op.tearDownRequests.updates) {
            dm.update(op.tearDownRequests.updates.options);
          }
          dm.tearDown(op.tearDownRequests.deletes.options);
        }
        file = file.replace(opsLocation + 'd ', '');
        if (file === '') {
          fs.unlinkSync('processed.txt');
        }
      }
    }
    return Promise.resolve();
  }

  constructor() {
    // Uncomment the following line to enable logging
    // winston.level = 'debug';
    DataManager.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' })
        new winston.transports.Console()
      ]
    });
  }

  // sorts the list of options according to their provided 'order'
  public sortOptions(options) {
    options.sort(function (a, b) {
      return a.order - b.order;
    });
    return options;
  };

  /**
   * Utility function to make POST requests to Herd. This is currently being used to set up test data before the specs are run.
   *
   * @param options Object which holds the complete information to make a create request to Herd.
   *                Example: {"url": "/path/to/resource", "body": {"payload":"payload"}}
   */
  public setUp(options) {

    // ensure that the list of operations are performed sequentially
    options = this.sortOptions(options);

    options.forEach(function (option) {

      option.url = herdHost + option.url;

      DataManager.logger.log('info', '------------------');
      DataManager.logger.log('info', 'Requested POST on path {' + option.url + '}');
      DataManager.logger.log('info', 'Request body ' + JSON.stringify(option.body));

      const response = request('POST', option.url, {
        json: option.body, headers: {
          'Authorization': constants.authorization.basicKey
        }
      });

      try {
        // try to get the body.  if this returns an error that means
        // the response was an error ( in most cases )
        DataManager.logger.log('warn', 'going to execute...');
        const body = response.getBody('utf8');
        DataManager.logger.log('info', 'Request succeeded.');
      } catch (e) {
        console.log(e.message);
        // DataManager.logger.log('debug', e);
      } finally {
        DataManager.logger.log('info', '------------------');
      }

    });
  };

  /**
   * Utility function to make DELETE requests to Herd. This is currently being used to tear down test data after the specs have been run.
   *
   * @param options Object which holds the complete information to make a delete request to Herd.
   *                Example: {"url": "/path/to/resource"}
   */
  public tearDown(options) {

    // ensure that the list of operations are performed sequentially
    options = this.sortOptions(options);
    options.forEach(function (option) {
      DataManager.logger.log('info', '------------------');
      DataManager.logger.log('info', 'Requested DELETE on path {' + option.url + '}');
      option.url = herdHost + option.url;

      const response = request('DELETE', option.url, {
        headers: {
          'Authorization': constants.authorization.basicKey
        }
      });

      try {
        // try to get the body.  if this returns an error that means
        // the response was an error ( in most cases )
        const body = response.getBody('utf8');
        DataManager.logger.log('info', 'Request succeeded.');
      } catch (e) {
        console.log(e.message);
        // DataManager.logger.log('debug', e);
      } finally {
        DataManager.logger.log('info', '------------------');
      }
    });
  };

  /**
   * Utility function to make PUT requests to Herd.
   *
   * @param options Object which holds the complete information to make a put request to Herd.
   *                Example: {"url": "/path/to/resource"}
   */
  public update(options) {

    // ensure that the list of operations are performed sequentially
    options = this.sortOptions(options);

    options.forEach(function (option) {
      DataManager.logger.log('info', '------------------');
      DataManager.logger.log('info', 'Requested PUT on path {' + option.url + '}');
      option.url = herdHost + option.url;

      const response = request('PUT', option.url, {
        json: option.body, headers: {
          'Authorization': constants.authorization.basicKey
        }
      });

      try {
        // try to get the body.  if this returns an error that means
        // the response was an error ( in most cases )
        const body = response.getBody('utf8');
        DataManager.logger.log('warn', 'Request succeeded.');
      } catch (e) {
        DataManager.logger.log('info', e);
      } finally {
        DataManager.logger.log('info', '------------------');
      }
    });
  };

  public validateIndexes() {
    // get indexes

    try {
      DataManager.logger.log('info', '------- Start Validate Indexes Outer Block ------ ');
      const response = request('GET', herdHost + '/searchIndexes', {
        headers: {
          'Authorization': constants.authorization.basicKey,
          'Accept': 'application/json'
        }
      });
      // try to get the body.  if this returns an error that means
      // the response was an error ( in most cases )
      const body = JSON.parse(response.getBody('utf8'));
      DataManager.logger.log('info', 'Got Search Indexes');

      body.searchIndexKeys.forEach((key, i) => {
        try {
          DataManager.logger.log('info', '-------- Attempting to validate index ' + key.searchIndexName);
          const validationResponse = request('POST', herdHost + '/searchIndexValidations', {
            json: {
              'searchIndexKey': key,
              'performFullSearchIndexValidation': true
            },
            headers: {
              'Authorization': constants.authorization.basicKey,
              'Accept': 'application/json'
            }
          });
          JSON.parse(response.getBody('utf8'));
          DataManager.logger.log('info', 'Finished validating ' + key.searchIndexName);
        } catch (e) {
          console.log(e.message);
        } finally {
          DataManager.logger.log('info', '--------- End Validation Request Block---------');
        }
      });
    } catch (e) {
      console.log(e.message);
    } finally {
      DataManager.logger.log('info', '------  End Validate Indexes Outer Block------');
    }
  }

  // TODO we need to refactor this to use the interface declared in top of this file
  public DMOption(order, url, body?) {
    return {
      order: order,
      url: url,
      body: body
    }
  };
}



