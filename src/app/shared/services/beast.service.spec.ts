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
import { BeastService, BeastEvent } from './beast.service';
import { inject, TestBed } from '@angular/core/testing';

declare var window: any;
let beast: jasmine.Spy;
let warn: jasmine.Spy | Function;
const originalWarn = window.console.warn;

fdescribe('Beast Service', () => {

  const beastEvent: BeastEvent = <BeastEvent>{};
  beastEvent.sessionId = 'postParams.sessionId';
  beastEvent.correlationId = 'postParams.correlationId';
  beastEvent.eventId = 'postParams.eventId';
  beastEvent.ags = 'DATAMGT';
  beastEvent.component = 'postParams.component';
  beastEvent.eventTime = '(new Date()).toISOString()';
  beastEvent.userId = 'postParams.userId';
  beastEvent.serviceAccountId = '';
  beastEvent.orgId = 'postParams.orgId';
  beastEvent.orgClass = 'postParams.orgClass';
  beastEvent.action = 'postParams.action';
  beastEvent.resource = 'postParams.resource';
  beastEvent.detailsFormatVersion = 'postParams.detailsFormatVersion';
  beastEvent.details = 'postParams.details';
  beastEvent.eventDataVersion = '1.0.0';
  // const beastServic: BeastService = new BeastService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BeastService,
        {
          provide: UserService,
          useValue: {
            encryptedUserIdentifier: 'encryptedUserIdentifier'
          }
        }
      ]
    });

    window.beast = beast = jasmine.createSpy('beast');
    // for the test take out the warnings to clear logs a bit
    window.console.warn = warn = jasmine.createSpy('warn');
  });

  afterAll(() => {
    // set the warn back
    window.console.warn = originalWarn;
  });

  describe('with beast service turned on', () => {


    it('should initialize beast service',
      inject([BeastService], (beastService: BeastService) => {
        expect(beast).toHaveBeenCalled();
      }));

    it('should send data to beast service', inject([BeastService, UserService], (
      service: BeastService, cu: UserService) => {
      service.postEvent(beastEvent);
      expect(beastEvent).toHaveBeenCalled();
    }));

  });

  describe('with beast service send event', () => {


    it('should send event',
      inject([BeastService], (beastService: BeastService) => {
        expect(beast).toHaveBeenCalled();
      }));

    // fit('should send data to beast service', inject([BeastService, UserService], (
    //   service: BeastService, cu: UserService) => {
    //   const res = service.sendEvent();
    //   expect(res).toEqual(true);
    // }));

  });

  fdescribe('with beast service send async request', () => {

    it('tests that makeRequest async / await works',  () => {
      const beastServic: BeastService = new BeastService();
      const res2 = beastServic.sendEvent();
      const url = 'https://beast-api-int.dev.finra.org/events';
      const postParams: BeastEvent = <BeastEvent>{};
      postParams.eventId = '20211101-1741449131466494';
      postParams.ags = 'DATAMGT';
      postParams.component = 'Homepage';
      postParams.userId = 'K30199';
      postParams.action = 'view';
      const event = JSON.stringify(postParams);
      const res = beastServic.makeRequest('POST', url, event);
      console.log('res', res);
      console.log('sending event...');

      expect(res).toEqual(true);
      expect(res2).toEqual(true);
    });
  });

});
