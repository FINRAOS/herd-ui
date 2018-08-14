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

import { DataEntityDetailResolverService, DataEntityDetailResolverData } from './data-entity-detail-resolver';
import { Observable } from 'rxjs';
import { BusinessObjectDefinitionService, BusinessObjectDefinition } from '@herd/angular-client';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlSegment } from '@angular/router';
import { async } from '@angular/core/testing';
import { RouterStub } from 'testing/router-stubs';

describe('Data Entity Detail Resolver', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataEntityDetailResolverService,
                {
                    provide: BusinessObjectDefinitionService, useValue: {
                        businessObjectDefinitionGetBusinessObjectDefinition:
                        jasmine.createSpy('businessObjectDefinitionGetBusinessObjectDefinition'),
                        configuration: {}
                    }
                }, {
                    provide: Router,
                    useClass: RouterStub
                }]
        });
    });

    it('should return bdef data initially',
        async(inject([DataEntityDetailResolverService, BusinessObjectDefinitionService, Router],
            (service: DataEntityDetailResolverService,
                bdef: BusinessObjectDefinitionService, r: Router) => {
                const expectedBdef: BusinessObjectDefinition = {
                    namespace: 'ns',
                    businessObjectDefinitionName: 'bdef',
                    dataProviderName: 'dp',
                    displayName: 'display name',
                    sampleDataFiles: [{
                        directoryPath: '/tmp',
                        fileName: 'test'
                    }]
                }

                const bdefSpy = (<jasmine.Spy>bdef.businessObjectDefinitionGetBusinessObjectDefinition);
                bdefSpy.and.returnValue(Observable.of(expectedBdef));


                const shouldAttachSpy = (<jasmine.Spy>r.routeReuseStrategy.shouldAttach)
                shouldAttachSpy.and.returnValue(false);

                (service.resolve(
                    ({ params: { namespace: 'ns', dataEntityName: 'dn' } } as any) as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot) as Observable<DataEntityDetailResolverData>).subscribe((data) => {
                        expect(data.bdef)
                            .toEqual(expectedBdef);
                        expect(data.title).toEqual('Data Entity - display name');
                        expect(bdefSpy).toHaveBeenCalled();
             });

            })));

    it('should return saved bdef data',
        async(inject([DataEntityDetailResolverService, BusinessObjectDefinitionService, Router],
            (service: DataEntityDetailResolverService,
                bdef: BusinessObjectDefinitionService, r: Router) => {
                const expectedBdef: BusinessObjectDefinition = {
                    namespace: 'ns',
                    businessObjectDefinitionName: 'bdef',
                    dataProviderName: 'dp',
                    displayName: 'display name',
                    sampleDataFiles: [{
                        directoryPath: '/tmp',
                        fileName: 'test'
                    }]
                }

                const bdefSpy = (<jasmine.Spy>bdef.businessObjectDefinitionGetBusinessObjectDefinition);
                bdefSpy.and.returnValue(Observable.of(expectedBdef));

                const shouldAttachSpy = (<jasmine.Spy>r.routeReuseStrategy.shouldAttach)
                shouldAttachSpy.and.returnValue(true);

                const retrieveSpy = (<jasmine.Spy>r.routeReuseStrategy.retrieve)
                retrieveSpy.and.returnValue({
                        route : {
                            value: {
                                data: {
                                    _value: {
                                        resolvedData: {
                                            title: 'Data Entity - display name',
                                            bdef: expectedBdef
                                        }
                                    }
                                }
                            }
                        }
                });

              const returnValue =  service.resolve(({ params: { namespace: 'ns', dataEntityName: 'dn' } } as any) as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot) as DataEntityDetailResolverData;
              expect(returnValue.bdef).toEqual(expectedBdef);
              expect(returnValue.title).toEqual('Data Entity - display name');
              expect(bdefSpy).not.toHaveBeenCalled();
     })));
});
