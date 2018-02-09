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
import { inject, TestBed } from '@angular/core/testing';

import { AppInitService, appInitFactory } from './app-init.service';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs/Observable';

describe('AppInitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: { load: jasmine.createSpy('load') } },
        {
          provide: AppInitService,
          useClass: AppInitService,
          deps: [ConfigService]
        }
      ]
    });
  });

  it('should return config\'s loaded response', inject([AppInitService, ConfigService],
    (service: AppInitService, conf: ConfigService) => {
      (conf.load as jasmine.Spy).and.returnValue(Observable.of({
        'restBaseUri': 'testUri'
      }));

      expect(service).toBeTruthy();
      service.load().subscribe((resp) => {
        expect(resp).toEqual({
          'restBaseUri': 'testUri'
        });
      });

      expect(conf.load).toHaveBeenCalled();
    }));

  describe('App Init Factory', () => {
    it('should convert AppInitService load into Promise for the App_Initializer',
      inject([AppInitService], (init: AppInitService) => {
        spyOn(init, 'load').and.returnValue(Observable.of('test value'));

        const promiseFactory = appInitFactory(init);
        expect(typeof promiseFactory).toBe('function');
        // have to actually call the function that it returns to make sure it returns a promse.
        const promise = promiseFactory();
        expect(promise.then).toBeDefined();
        expect(init.load).toHaveBeenCalled();
      }));
  });
});
