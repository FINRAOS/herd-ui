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
import { UserService } from 'app/core/services/user.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare let beast: Function;

export interface BeastEvent {
  sessionId: string;
  correlationId: string;
  eventId: string;
  ags: string;
  component: string;
  eventTime: string;
  userId: string;
  serviceAccountId: string;
  orgId: string;
  orgClass: string;
  action: string;
  resource: string;
  detailsFormatVersion: string;
  details: any;
  eventDataVersion: string;
}

@Injectable()
export class BeastService {

  /**
   * This is first initialized in the app shell (app component)
   * therefore it is fine to put the ga('create') in its constructor.
   */
  constructor() {
  }

  public postEvent(postParams: BeastEvent) {
    let url;

    try {
      if (document.location.host.indexOf('dev.finra.org') !== -1) {
        url = 'https://beast.dev.finra.org/events';
      } else if (document.location.host.indexOf('int.finra.org') !== -1) {
        url = 'https://beast.dev.finra.org/events';
      } else if (document.location.host.indexOf('qa.finra.org') !== -1) {
        url = 'https://beast.qa.finra.org/events';
      } else if (document.location.host.indexOf('ct.finra.org') !== -1) {
        url = 'https://beast.qa.finra.org/events';
      } else if (document.location.host.indexOf('finra.org') !== -1) {
        url = 'https://beast.finra.org/events';
      }

      url = 'https://beast-api-int.dev.finra.org/events';
      if (url) {
        const event = this.createEvent(postParams);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.timeout = 2000;
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 202) {
              // recordId is returned if request is successful.
              console.log(xhr.responseText);
            }
          }
        };
        xhr.onerror = function () {
          throw new Error('An error occurred during the onerror');
        };
        xhr.ontimeout = function (e) {
          throw new Error('An error occurred during the ontimeout');
        };
        console.log('send event in postEvent');
        xhr.send(event);
        // const res = await this.makeRequest('POST', url, event);
        // console.log('res sent', res);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public makeRequest(method, url, event) {
    console.log('in make request');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.timeout = 2000;
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 202) {
          // recordId is returned if request is successful.
          console.log(xhr.responseText);
        }
      }
    };
    xhr.onerror = function () {
      throw new Error('An error occurred during the onerror');
    };
    xhr.ontimeout = function (e) {
      throw new Error('An error occurred during the ontimeout');
    };
    console.error('send event in postEvent');
    xhr.send(event);
    return true;
  }

  public createEvent(postParams: BeastEvent) {

    if (!postParams.details) {
      postParams.details = {};
    }

    const event: BeastEvent = <BeastEvent>{};
    event.eventId = postParams.eventId;
    event.ags = postParams.ags;
    event.component = postParams.component;
    event.eventTime = (new Date()).toISOString();
    event.userId = postParams.userId;
    event.action = postParams.action;
    event.eventDataVersion = '1.0.0';
    event.details = postParams.details;
    event.orgId = postParams.orgId;
    event.orgClass = postParams.orgClass;

    return JSON.stringify(event);
  }

  public sendEvent() {
    const postParams: BeastEvent = <BeastEvent>{};
    postParams.eventId = '20211101-1741449131466494';
    postParams.ags = 'DATAMGT';
    postParams.component = 'Homepage';
    postParams.userId = 'k30199';
    postParams.action = 'view';
    postParams.orgId = '1';
    postParams.orgClass = 'Finra';
    postParams.details = {
      'FilingSave': {
        'filingId': 'k30199',
        'filingName': 'Form211',
        'filingStatus': 'Saved'
      }
    };
    this.postEvent(postParams);
    return true;
  }
}
