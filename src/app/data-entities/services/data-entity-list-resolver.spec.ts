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
import { TestBed, inject } from '@angular/core/testing';

import { DataEntityListResolverService, DataEntityListResolverData } from './data-entity-list-resolver';
import { Observable } from 'rxjs/Observable';
import { BusinessObjectDefinitionService } from '@herd/angular-client';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { async } from '@angular/core/testing';

describe('Data Entity List Resolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataEntityListResolverService,
                {
                    provide: BusinessObjectDefinitionService, useValue: {
                        businessObjectDefinitionGetBusinessObjectDefinitions:
                        jasmine.createSpy('businessObjectDefinitionGetBusinessObjectDefinitions'),
                        configuration: {}
                    }
                }]
        });
    });

    it('should return filtered data',
        async(inject([DataEntityListResolverService, BusinessObjectDefinitionService], (service: DataEntityListResolverService,
            bdef: BusinessObjectDefinitionService) => {
            const expectedKeys = [{ namespace: 'ns', businessObjectDefinitionName: 'bdef1' }, {
                namespace: 'ns', businessObjectDefinitionName: 'bdef2'
            }, {
                namespace: 'vsn2', businessObjectDefinitionName: 'bdef3'
            }];

            const bdefSpy = (<jasmine.Spy>bdef.businessObjectDefinitionGetBusinessObjectDefinitions);
            bdefSpy.and.returnValue(Observable.of({businessObjectDefinitionKeys: expectedKeys}));

            // no search term
            (service.resolve(({ queryParams: {} } as any) as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot) as Observable<DataEntityListResolverData>)
                .subscribe((data) => {
                    expect((data as DataEntityListResolverData).dataEntities).toEqual(expectedKeys);
                    expect((data as DataEntityListResolverData).total).toEqual(expectedKeys.length);
                    expect((data as DataEntityListResolverData).title).toEqual('Data Entities');
                    expect(bdefSpy).toHaveBeenCalled();
                });

            bdefSpy.calls.reset();

            // search term = 'ns'
            Observable.of(service.resolve(({ queryParams: { searchTerm: 'ns' } } as any) as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot)).subscribe((data) => {
                    expect((data as DataEntityListResolverData).dataEntities)
                        .toEqual([{ namespace: 'ns', businessObjectDefinitionName: 'bdef1' }, {
                            namespace: 'ns', businessObjectDefinitionName: 'bdef2'
                        }]);
                    expect((data as DataEntityListResolverData).total).toEqual(3);
                    expect((data as DataEntityListResolverData).title).toEqual('Data Entities');
                    expect(bdefSpy).not.toHaveBeenCalled();
                });


            // search term = 'bdef3'
            Observable.of(service.resolve(({ queryParams: { searchTerm: 'bdef3' } } as any) as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot)).subscribe((data) => {
                    expect((data as DataEntityListResolverData).dataEntities)
                        .toEqual([{
                            namespace: 'vsn2', businessObjectDefinitionName: 'bdef3'
                        }]);
                    expect((data as DataEntityListResolverData).total).toEqual(3);
                    expect((data as DataEntityListResolverData).title).toEqual('Data Entities');
                    expect(bdefSpy).not.toHaveBeenCalled();
                });

        })));
});
