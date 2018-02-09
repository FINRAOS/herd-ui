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
import { TestBed, inject } from '@angular/core/testing';

import { AlertService, SuccessAlert, InfoAlert, WarningAlert, DangerAlert } from './alert.service';
import { Observable } from 'rxjs/Observable';
import { bufferCount } from 'rxjs/operators'

describe('AlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService]
    });
  });

  it('should return Observable<Alert> when alerts are accessed and alert() should send new alerts',
    inject([AlertService], (service: AlertService) => {

      service.alerts.pipe(bufferCount(4)).subscribe((values) => {
        expect(values[0] instanceof SuccessAlert).toBe(true);
        expect(values[1] instanceof InfoAlert).toBe(true);
        expect(values[2] instanceof WarningAlert).toBe(true);
        expect(values[3] instanceof DangerAlert).toBe(true);
      });

      service.alert(new SuccessAlert('test', 'testSub', 'success text'));
      service.alert(new InfoAlert('test', 'testSub', 'info text'));
      service.alert(new WarningAlert('test', 'testSub', 'warning text'));
      service.alert(new DangerAlert('test', 'testSub', 'danger text'));
    }));
});
