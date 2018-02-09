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

import { AuthGuardService } from './auth-guard.service';
import { ConfigService } from 'app/core/services/config.service';
import { Router } from '@angular/router';
import { RouterStub } from 'testing/router-stubs';
import { UserService } from 'app/core/services/user.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        {
          provide: ConfigService,
          useValue: {
            config: {}
          },
        }, {
          provide: Router,
          useClass: RouterStub
        }, {
          provide: UserService,
          useValue: {
            getCurrentUser: jasmine.createSpy('getCurrentUser')
          }
        }
      ]
    });
  });

  it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeDefined();
  }))

  it('should not call load if already authenticated', inject([AuthGuardService, ConfigService, Router],
    (service: AuthGuardService, appConfig: ConfigService, router: Router, userService: UserService) => {
    }));

});
