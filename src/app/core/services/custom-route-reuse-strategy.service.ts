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
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { Location } from '@angular/common';

export interface CustomRouteReuseStorage {
  route: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
  scrollPosition?: number;
}

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storage: { [key: string]: CustomRouteReuseStorage } = {};
  private detach = false; // only detach when there is a config switch

  static makeKey(route: ActivatedRouteSnapshot): string {
    const calc = '/' + route.pathFromRoot.map((snap) => {
      return snap.url ? snap.url.join('/') : '';
    }).reduce((prev, curr) => {
      // if we have 2 values append curr to prev with a slash
      // if we only have 1 return the 1 that exists
      return prev && curr ? prev + '/' + curr : prev || curr;
    });

    return Location.stripTrailingSlash(calc) || '/';
  }

  getStorageUnit(route: ActivatedRouteSnapshot) {
    const path = CustomRouteReuseStrategy.makeKey(route);
    return this.storage[path];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    this.detach = !(future.routeConfig === curr.routeConfig && this.compareObjects(curr.params, future.params));
    return !this.detach;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const path = CustomRouteReuseStrategy.makeKey(route);
    // return null if the path does not have a routerConfig OR if there is no stored route for that routerConfig
    if (!route.routeConfig || !this.storage[path] || route.routeConfig.loadChildren) {
      return null;
    }
    return this.storage[path].handle;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = CustomRouteReuseStrategy.makeKey(route);
    // we aren't a lazy loaded route config item
    return !!this.detach && !!route.routeConfig && !route.routeConfig.loadChildren &&
      (!route.routeConfig.data || !route.routeConfig.data.excludeFromCaching);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = CustomRouteReuseStrategy.makeKey(route);
    const currentlyInStore = this.storage[path];
    if (!currentlyInStore) {
      this.storage[path] = {
        route,
        handle
      };
    } else {
      // retain saved scroll when storing and it has one.
      this.storage[path].route = route;
      this.storage[path].handle = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // this will be true if the route has been stored before
    const path = CustomRouteReuseStrategy.makeKey(route);
    const canAttach: boolean = !!route.routeConfig && !!this.storage[path];

    // this decides whether the route already stored should be rendered in place of the requested route, and is the return value
    // at this point we already know that the paths match because the storedResults key is the pathFromRoot url
    // so, if the route.params and route.queryParams also match, then we should reuse the component
    if (canAttach) {
      const paramsMatch: boolean = this.compareObjects(this.storage[path].route.params, route.params);
      const queryParamsMatch: boolean =
        this.compareObjects(this.storage[path].route.queryParams, route.queryParams);

      return paramsMatch && queryParamsMatch;
    } else {
      return false;
    }
  }

  private compareObjects(base: any, compare: any): boolean {
    // there is no need to be recursive as we cannot store complicated objects in params or query params
    return Object.keys(base).length === Object.keys(compare).length &&
      Object.keys(base).every((curr) => {
        return base[curr] === compare[curr];
      });

  }
}
