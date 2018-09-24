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

import { HttpInterceptService } from './http-intercept.service';
import { AlertService } from './alert.service';

describe('HttpInterceptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlertService,
        HttpInterceptService
      ]
    });
  });

  it('should be created', inject([HttpInterceptService], (service: HttpInterceptService) => {
    expect(service).toBeTruthy();
  }));
});
