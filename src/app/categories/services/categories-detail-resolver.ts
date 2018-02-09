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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, Inject } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, DetachedRouteHandle
} from '@angular/router';
import { default as AppIcons } from '../../shared/utils/app-icons';
import { Action } from '../../shared/components/side-action/side-action.component';
import {
    Tag, TagService, TagKey, TagSearchRequest
} from '@herd/angular-client';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { Title } from '@angular/platform-browser';


export interface TitleResolverData {
    title?: string;
}

export interface CategoryDetailResolverData extends TitleResolverData {
    category: Tag | any;
}

@Injectable()
export class CategoryDetailResolverService implements Resolve<any> {

    category: Tag | any;
    constructor(private router: Router,
        private tagApi: TagService,
        private title: Title) {
        this.category = {};
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CategoryDetailResolverData> |
        CategoryDetailResolverData | TitleResolverData {
        /// fetch the category and its details
        if (!this.router.routeReuseStrategy.shouldAttach(route)) {
            return this.tagApi.tagGetTag(route.params.tagTypeCode, route.params.tagCode).map((data) => {
                const retval: CategoryDetailResolverData = {
                    category: data,
                    title: 'Category - ' + data.displayName
                }
                return retval;
            });
        } else {
            // If we do have the category return the title and prev stored category details
            const handle: DetachedRouteHandle = this.router.routeReuseStrategy.retrieve(route);
            const retval: CategoryDetailResolverData = {
                title: ((handle as any).route.value.data._value).resolvedData.title,
                category: ((handle as any).route.value.data._value).resolvedData.category
            };
            return retval;
        }
    }
}

