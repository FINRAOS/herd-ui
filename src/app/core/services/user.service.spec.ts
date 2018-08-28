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
import {EncryptionService} from './../../shared/services/encryption.service';
import { of } from 'rxjs';
import {TestBed, inject} from '@angular/core/testing';

import {UserService} from './user.service';
import {CurrentUserService, Configuration} from '@herd/angular-client';
import {environment} from '../../../environments/environment';

describe('CurrentUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Configuration,
          useValue: {} as Configuration,
          multi: false
        },
        {
          provide: CurrentUserService,
          useValue: {
            currentUserGetCurrentUser:
              jasmine.createSpy('currentUserGetCurrentUser')
                .and.returnValue(of({userId: 'userid'})),
            configuration: {}
          }
        },
        UserService,
        {
          provide: EncryptionService,
          useValue: {
            encryptAndGet:
              jasmine.createSpy('encryptAndGet').and.returnValue('encryptedUserIdentifier')
          }
        }]
    });
  });

  it('should populate encrypted user', inject([UserService, CurrentUserService, EncryptionService],
    (service: UserService, currentUserApi: CurrentUserService, encryptionService: EncryptionService) => {
      const spyCuApi = (<jasmine.Spy>currentUserApi.currentUserGetCurrentUser);
      const spyEncrypt = (<jasmine.Spy>encryptionService.encryptAndGet);
      // this proves that we proply set and sent the observable info.
      service.user.subscribe((userInfo) => {
        expect(userInfo).toEqual(service.userAuthorizations);
      });
      service.getCurrentUser().subscribe((data) => {
        expect(data).toEqual({
          userId: 'userid'
        });
        expect(spyCuApi).toHaveBeenCalledTimes(1);
        expect(spyEncrypt).toHaveBeenCalledWith('userid');
        expect(service.encryptedUserIdentifier).toBe('encryptedUserIdentifier');
        expect(service.userAuthorizations).toEqual({
          userId: 'userid'
        });
      });
    }));

  it('should set username and password if basic auth is used and username and password are passed',
    inject([UserService, CurrentUserService, EncryptionService, Configuration],
      (service: UserService,
       currentUserApi: CurrentUserService,
       encryptionService: EncryptionService,
       apiConf: Configuration
      ) => {

        // initial values
        expect(apiConf.username).not.toBeDefined();
        expect(apiConf.password).not.toBeDefined();

        service.getCurrentUser();
        // no useBasicAuth
        expect(apiConf.username).not.toBeDefined();
        expect(apiConf.password).not.toBeDefined();

        environment.useBasicAuth = true;
        service.getCurrentUser();
        // no username or password passed
        expect(apiConf.username).not.toBeDefined();
        expect(apiConf.password).not.toBeDefined();

        service.getCurrentUser('tstUser');
        // no password passed
        expect(apiConf.username).not.toBeDefined();
        expect(apiConf.password).not.toBeDefined();

        service.getCurrentUser('tstUser', 'tstPassword');
        // happy path
        expect(apiConf.username).toBe('tstUser');
        expect(apiConf.password).toBe('tstPassword');
      }));

  it('should return truthy isAuthenticated if user information exists', inject([UserService],
    (service: UserService) => {
      service.userAuthorizations = {
        userId: 'userid'
      };

      expect(service.isAuthenticated).toBeTruthy();
    }));

  it('should return falsey isAuthenticated if user information doens\'t exist', inject([UserService],
    (service: UserService) => {
      // no userAuthrizations
      expect(service.isAuthenticated).toBeFalsy();

      service.userAuthorizations = { userId: '' };
      // user authorizations but no userId set in them
      expect(service.isAuthenticated).toBeFalsy();
    }));
});
