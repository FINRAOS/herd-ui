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
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Alert,  AlertService } from 'app/core/services/alert.service';
import { Observable } from 'rxjs/Observable';
import { take, map } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer'
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'sd-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  @Input()
  public alerts: Array<Alert> = [];
  public delay: number;

  constructor(private alerter: AlertService, private app: ConfigService) { }

  ngOnInit() {
    this.alerter.alerts.subscribe((a: Alert) => {
      this.delay = (a.closeDelay || this.app.config.alertDelayInSeconds) * 1000;
      // push it on to show
      this.alerts = this.alerts.concat(a);

      // close the alert after 5 seconds by default
      // have to use timer -> map instead of delay because delay can't currently
      // be properly unit tested due to fakeAsync issues.
      timer(this.delay).pipe(take(1), map(() => a)).subscribe((al) => this.closeAlert(al));
    });
  }

  public closeAlert(al: Alert) {
    const index: number = this.alerts.indexOf(al);
    this.alerts.splice(index, 1);
  }

}
