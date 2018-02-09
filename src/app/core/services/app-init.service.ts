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
import { ConfigService } from './config.service';
import { Observable } from 'rxjs/Observable';

export function appInitFactory(init: AppInitService): () => Promise<any> {
  return () => init.load().toPromise();
}


@Injectable()
export class AppInitService {

  constructor(private config: ConfigService) { }

  public load(): Observable<any> {
    return this.config.load().map((res) => {
      // can run other app initializations here that must be run after the config has been loaded
      // can also run then in other APP_INITIALIZERS
      return res;
    })
  }
}
