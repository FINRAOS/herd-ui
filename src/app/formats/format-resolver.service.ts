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
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface TitleResolverData {
  title?: string;
}

export interface FormatResolverServiceData extends TitleResolverData {
  businessObjectFormatDetail: any;
}

@Injectable()
export class FormatResolverService implements Resolve<any> {

  constructor(private router: Router) { }

  public resolve(route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Observable<FormatResolverServiceData> | TitleResolverData {

    if (!this.router.routeReuseStrategy.shouldAttach(route)) {
      const retval: FormatResolverServiceData = {
        businessObjectFormatDetail: null,
        title: 'Format - ' + route.params.formatUsage + ':'
        + route.params.formatFileType + ':' + route.params.formatVersion
      };
      return of(retval as any);

    } else {
      return {
        title: 'Format - ' + route.params.formatUsage + ':'
        + route.params.formatFileType + ':' + route.params.formatVersion
      }
    }
  }

}
