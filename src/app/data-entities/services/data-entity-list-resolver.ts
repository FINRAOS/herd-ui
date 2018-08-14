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
import { Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { BusinessObjectDefinitionService, BusinessObjectDefinitionKey } from '@herd/angular-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface TitleResolverData {
    title?: string;
}

export interface DataEntityListResolverData extends TitleResolverData {
    dataEntities: BusinessObjectDefinitionKey[];
    total: number;
}

@Injectable()
export class DataEntityListResolverService implements Resolve<any> {
    private allBdefKeys: BusinessObjectDefinitionKey[];
    constructor(private bdef: BusinessObjectDefinitionService) {
        this.allBdefKeys = [];
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DataEntityListResolverData> |
        DataEntityListResolverData {

        const titles: TitleResolverData = {};

        // if we don't currently have all the bdef keys go get them and sort by the search term if it exists.
        if (!this.allBdefKeys || !this.allBdefKeys.length) {
            return this.bdef.businessObjectDefinitionGetBusinessObjectDefinitions().pipe(
                map((resp) => {

                    this.allBdefKeys = resp.businessObjectDefinitionKeys;
                    const retval: DataEntityListResolverData = this.filter(route.queryParams.searchTerm);
                    retval.title = 'Data Entities';

                    return retval;
                }))
        } else {
            // If we do have the bdefkeys simply do the search.
            const retval = this.filter(route.queryParams.searchTerm);
            retval.title = 'Data Entities';
            return retval;
        }
    }

    private filter(searchTerm: string): DataEntityListResolverData {
        const retval: DataEntityListResolverData = {
            dataEntities: this.allBdefKeys.slice(0, 100),
            total: this.allBdefKeys.length
        };

        // simple filter based on bdef name.
        if (searchTerm && searchTerm.length > 0) {
            const filtered = this.allBdefKeys.filter((bdefKey) => {
                return bdefKey.businessObjectDefinitionName.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1 ||
                bdefKey.namespace.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1;
            });

            retval.dataEntities = filtered.slice(0, 100);
        }

        return retval;
    }
}
