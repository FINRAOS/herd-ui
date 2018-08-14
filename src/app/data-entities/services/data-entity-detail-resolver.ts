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
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, DetachedRouteHandle
} from '@angular/router';
import {
    BusinessObjectDefinition, BusinessObjectDefinitionService
} from '@herd/angular-client';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';


export interface TitleResolverData {
    title?: string;
}

export interface DataEntityDetailResolverData extends TitleResolverData {
    bdef: BusinessObjectDefinition | any;
}

@Injectable()
export class DataEntityDetailResolverService implements Resolve<any> {

    constructor(private router: Router,
        private businessObjectDefinitionApi: BusinessObjectDefinitionService,
        private title: Title) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DataEntityDetailResolverData> |
        DataEntityDetailResolverData | TitleResolverData {
        // if we don't currently bdef then fetch the bdef and its details
        if (!this.router.routeReuseStrategy.shouldAttach(route)) {
            // Subscribe to the bdef
            return this.businessObjectDefinitionApi.businessObjectDefinitionGetBusinessObjectDefinition(
                route.params.namespace, route.params.dataEntityName).pipe(map((res) => {
                    const retVal: DataEntityDetailResolverData = {
                        bdef: res,
                        title: 'Data Entity - ' + (res.displayName || res.businessObjectDefinitionName)
                    }
                    return retVal;
                }));

        } else {
            // If we do have the bdef return the title
            const handle: DetachedRouteHandle = this.router.routeReuseStrategy.retrieve(route);
            const retVal: DataEntityDetailResolverData = {
                title: ((handle as any).route.value.data as any)._value.resolvedData.title,
                bdef: ((handle as any).route.value.data as any)._value.resolvedData.bdef };
            return retVal;
        }
    }
}
