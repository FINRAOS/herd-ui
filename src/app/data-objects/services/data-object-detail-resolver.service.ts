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
import { DataObjectDetailRequest } from './../components/data-object-detail/data-object-detail.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BusinessObjectData, BusinessObjectDataService } from '@herd/angular-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface TitleResolverData {
  title?: string;
}

export interface DataObjectDetailResolverData extends TitleResolverData {
  businessObjectData: BusinessObjectData;
}

@Injectable()
export class DataObjectDetailResolverService implements Resolve<any> {

  private dataObjectsResolverData: DataObjectDetailResolverData;
  private request: DataObjectDetailRequest;

  constructor(private router: Router,
    private businessObjectDataApi: BusinessObjectDataService) {
    this.dataObjectsResolverData = null;
  }

  public resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<DataObjectDetailResolverData> | TitleResolverData {

    if (!this.router.routeReuseStrategy.shouldAttach(route)) {

      this.request = {
        namespace: route.params['namespace'],
        dataEntityName: route.params['dataEntityName'],
        formatUsage: route.params['formatUsage'],
        formatFileType: route.params['formatFileType'],
        partitionKey: undefined,
        partitionValue: route.params['partitionValue'],
        subPartitionValues: route.params['subPartitionValues'],
        formatVersion: route.params['formatVersion'],
        dataObjectVersion: route.params['dataObjectVersion'],
        dataObjectStatus: undefined,
        includeDataObjectStatusHistory: true,
        includeStorageUnitStatusHistory: true
      };

      const retval: DataObjectDetailResolverData = {
        title: '',
        businessObjectData: null
      };

      return this.businessObjectDataApi.businessObjectDataGetBusinessObjectData(
        this.request.namespace,
        this.request.dataEntityName,
        this.request.formatUsage,
        this.request.formatFileType,
        this.request.partitionKey,
        this.request.partitionValue,
        this.request.subPartitionValues,
        this.request.formatVersion,
        this.request.dataObjectVersion,
        this.request.dataObjectStatus,
        this.request.includeDataObjectStatusHistory,
        this.request.includeStorageUnitStatusHistory
      ).pipe(map((response) => {
        retval.businessObjectData = response;
        retval.title = 'Data Object - ' + [retval.businessObjectData.partitionKey,
        route.params.partitionValue, this.request.dataObjectVersion].join(' : ');
        return retval;
      }));

    } else {
      // TODO: change to only return title as we already have the data if we are coming back to it.
      const handle: DetachedRouteHandle = this.router.routeReuseStrategy.retrieve(route);
      const retval: DataObjectDetailResolverData = {
        title: ((handle as any).route.value.data as any)._value.resolvedData.title,
        businessObjectData: ((handle as any).route.value.data as any)._value.resolvedData.businessObjectData
      };
      return retval;
    }
  }


}
