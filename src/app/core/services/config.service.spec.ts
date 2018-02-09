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
import { MockBackend } from '@angular/http/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [{
        provide: XHRBackend,
        useClass: MockBackend
      }, ConfigService]
    });
  });

  it('should return an Observable<any> for the app config',
    inject([ConfigService, XHRBackend, Http], (service: ConfigService, mock: MockBackend, http: Http) => {
      const mockResponse = {
        'restBaseUri': 'https://exampleUri.com',
        'otherConfig': {
          'test': 'Another test value'
        }
      };

      spyOn(http, 'get').and.callThrough();

      mock.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      service.load().subscribe((resp) => {
        expect(http.get).toHaveBeenCalledWith('/configuration.json', { withCredentials: true });
        expect(resp.restBaseUri).toBe('https://exampleUri.com');
        expect(resp.otherConfig.test).toBe('Another test value');
      });
    }));

  it('should return an Observable<any> as empty object when body DNE',
    inject([ConfigService, XHRBackend], (service: ConfigService, mock: MockBackend) => {
      mock.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
        })));
      });

      service.load().subscribe((resp) => {
        expect(resp).toBeDefined();
        expect(Object.keys(resp).length).toBe(0);
      })
    })
  );

});
