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
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface Alert {
  title: string;
  subTitle: string;
  text: string;
  type: AlertType;
  closeDelay?: number;
}

export class SuccessAlert implements Alert {
  readonly type: AlertType;
  constructor (public title: string, public subTitle, public text, public closeDelay?: number) {
    this.type = 'success';
  }
}

export class InfoAlert implements Alert {
  readonly type: AlertType;
  constructor (public title: string, public subTitle, public text, public closeDelay?: number) {
    this.type = 'info';
  }
}
export class WarningAlert implements Alert {
  readonly type: AlertType;
  constructor (public title: string, public subTitle, public text, public closeDelay?: number) {
    this.type = 'warning';
  }
}
export class DangerAlert implements Alert {
  readonly type: AlertType;
  constructor (public title: string, public subTitle, public text, public closeDelay?: number) {
    this.type = 'danger';
  }
}

export type AlertType = 'success' | 'info' | 'warning' | 'danger';


@Injectable()
export class AlertService {

  private _alerts: ReplaySubject<Alert>;

  constructor() {
    this._alerts = new ReplaySubject();
   }

  /**
   * Sends a message to be seen globally.
   */
  public alert(m: Alert) {
    this._alerts.next(m);
  }

  get alerts(): Observable<Alert> {
    return this._alerts.asObservable();
  }
}
