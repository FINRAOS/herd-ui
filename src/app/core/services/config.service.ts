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
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigService {
  public config: any;
  private configObs: Observable<any>;

  constructor(private http: Http) {
   }

  public load(): Observable<any> {
    if ( this.config ) {
      return Observable.of(this.config);
    } else if (!this.configObs) {
      this.configObs = this.http.get('/configuration.json', { withCredentials: true }).map((res) => {

        this.config = this.config || res.json() || {};
        return this.config;
      });
    }

    return this.configObs;
  }
}
