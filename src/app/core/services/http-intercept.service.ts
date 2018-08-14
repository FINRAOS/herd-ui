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
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs';
import { tap } from 'rxjs/operators';
import { AlertService, DangerAlert } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptService implements HttpInterceptor {

  skipDictionary: { [path: string]: number };

  constructor(
    private alertService: AlertService
  ) {
    this.skipDictionary = {};
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // modify request
    if (request && request.headers && request.headers.get('skipAlert')) {
      const key = request + (request.search && request.search.toString() ? `?${request.search.toString()}` : '');
      const value = this.skipDictionary[key];
      request.headers.delete('skipAlert');
      this.skipDictionary[key] = value ? value + 1 : 1;
    }

    console.log('----request----');
    console.log(request);
    console.log('--- end of request---');


    return next.handle(request)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            if (event.url) {
              if (!this.skipDictionary[event.url] || this.skipDictionary[event.url] === 0) {
                this.alertService.alert(new DangerAlert('HTTP Error: ' + event.status + ' ' + event.statusText,
                  'URL: ' + event.url, 'Info: ' + event));
              } else {
                this.skipDictionary[event.url]--;
              }
            }
            // http response status code
            console.log('----response----');
            console.log(event);
            console.log('----response----');
          }
        }, error => {
          // http response status code
          console.log('----response error----');
          console.error('status code:');
          console.error(error.status);
          console.error(error.message);
          console.log('--- end of response---');

        })
      )

  };

}
