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
import { BeastComponents } from './beast-components.enum';
import { environment } from '../../../environments/environment.prod';

declare let beast: Function;

export interface BeastEvent {
  eventId: string;
  ags: string;
  component: string;
  eventTime: string;
  userId: string;
  orgId: string;
  orgClass: string;
  action: string;
  details: any;
  eventDataVersion: string;
  resource: string;
}

@Injectable()
export class BeastService {

  /**
   * This is first initialized in the app shell (app component)
   * therefore it is fine to put the ga('create') in its constructor.
   */
  constructor(private cu: UserService) {
  }

  public postEvent(postParams: BeastEvent) {
    let url: string;
    try {
      url = environment.bs.beastEndpointUrl;
      if (url && url !== '') {
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
        xhr.send(event);
      }
    } catch (e) {
      console.error(e);
    }
  }

   createEvent(postParams: BeastEvent) {

    if (!postParams.details) {
      postParams.details = {};
    }

    const pos = this.cu.userAuthorizations.userId.indexOf('@');
    const userId = this.cu.userAuthorizations.userId.substring(0, pos);
    const event: BeastEvent = <BeastEvent>{};
    event.eventId = userId;
    event.ags = environment.bs.beastAgs;
    event.component = postParams.component;
    event.eventTime = (new Date()).toISOString();
    event.userId = userId;
    event.action = postParams.action;
    event.eventDataVersion = '1.0.0';
    event.details = postParams.details;
    event.orgId = '1';
    event.orgClass = 'FINRA';
    event.resource = postParams.resource;

    return JSON.stringify(event);
  }

  public mapUrlToComponent(url: string) {
    let redirectComponent: string;
    if (url.indexOf('/search') !== -1) {
      redirectComponent = BeastComponents.globalSearch;
    } else if (url.indexOf('/tag') !== -1) {
      redirectComponent = BeastComponents.tag;
    } else if (url.indexOf('/data-entities') !== -1) {
      redirectComponent = BeastComponents.dataEntities;
    } else if (url.indexOf('/data-objects') !== -1) {
      redirectComponent = BeastComponents.dataObjects;
    } else if (url.indexOf('/formats') !== -1) {
      redirectComponent = BeastComponents.formats;
    } else {
      // default to be 'Homepage'
      redirectComponent = BeastComponents.default;
    }
    return redirectComponent;
  }

  public sendBeastActionEvent(action: string, component: string, namespace: string | undefined, bdefName: string | undefined) {
    const postParams: BeastEvent = <BeastEvent>{};
    postParams.component = component;
    postParams.action = action;
    if (namespace && bdefName) {
      postParams.resource = namespace + '|' + bdefName;
    }
    this.postEvent(postParams);
  }

  public getDataEntityDataFromUrl(url: string) {
    // The data entity url has the format "domain/data-entity/namespaec/bdefName/...".
    // Split the url.
    const splittedUrl = url.split('/', 4);

    if (splittedUrl.length < 4) {
      return;
    }

    // Join the namespaec and bdefName with pipe.
    return splittedUrl[2] + '|' + splittedUrl[3];
  }
}
