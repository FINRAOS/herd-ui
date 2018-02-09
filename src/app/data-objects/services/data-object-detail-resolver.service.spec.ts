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
import { BusinessObjectDataService, BusinessObjectData } from '@herd/angular-client';
import { TestBed, inject } from '@angular/core/testing';
import { DataObjectDetailResolverService, DataObjectDetailResolverData } from './data-object-detail-resolver.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { RouterStub, ActivatedRouteStub } from 'testing/router-stubs';

describe('DataObjectDetailResolverService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataObjectDetailResolverService,
                {
                    provide: BusinessObjectDataService, useValue: {
                        businessObjectDataGetBusinessObjectData:
                        jasmine.createSpy('businessObjectDataGetBusinessObjectData'),
                        configuration: {}
                    }
                }, {
                    provide: Router,
                    useClass: RouterStub
                }, {
                    provide: ActivatedRoute,
                    useClass: ActivatedRouteStub
                }]
        });
    });

    it('should fetch data from service initially', inject([DataObjectDetailResolverService,
        BusinessObjectDataService, Router, ActivatedRoute],
        (service: DataObjectDetailResolverService, dataApi: BusinessObjectDataService,
            r: Router, activatedRoute: ActivatedRouteStub) => {
            expect(service).toBeTruthy();
            activatedRoute.testParams = {
                namespace: 'ns',
                dataEntityName: 'dn',
                formatUsage: 'PRC',
                formatFileType: 'TXT',
                formatVersion: '0',
                partitionValue: '01-01-2017',
                subPartitionValues: '01-01-2017',
                dataObjectVersion: '0'
            }

            const expectedResult: BusinessObjectData = {
                namespace: 'ns',
                businessObjectDefinitionName: 'dn',
                businessObjectFormatUsage: 'PRC',
                businessObjectFormatFileType: 'TXT',
                businessObjectFormatVersion: 0,
                partitionKey: 'TEST_KEY',
                partitionValue: '01-01-2017',
                subPartitionValues: ['01-01-2017'],
                version: 0
            }
            const dataSpy = (<jasmine.Spy>dataApi.businessObjectDataGetBusinessObjectData);
            dataSpy.and.returnValue(Observable.of(expectedResult));

            const shouldAttachSpy = (<jasmine.Spy>r.routeReuseStrategy.shouldAttach)
            shouldAttachSpy.and.returnValue(false);

            (service.resolve(
                ({ params: activatedRoute.testParams } as any) as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot) as Observable<any>).subscribe((data) => {
                    expect((data as DataObjectDetailResolverData).businessObjectData)
                        .toEqual(expectedResult);
                    expect((data as DataObjectDetailResolverData).title).toEqual('Data Object - ' +
                        [expectedResult.partitionKey, expectedResult.partitionValue, expectedResult.version].join(' : '));
                    expect(dataSpy).toHaveBeenCalled();
                });

        }));

    it('should return saved data', inject([DataObjectDetailResolverService,
        BusinessObjectDataService, Router, ActivatedRoute],
        (service: DataObjectDetailResolverService, dataApi: BusinessObjectDataService,
            r: Router, activatedRoute: ActivatedRouteStub) => {
            expect(service).toBeTruthy();
            activatedRoute.testParams = {
                namespace: 'ns',
                businessObjectDefinitionName: 'dn',
                businessObjectFormatUsage: 'PRC',
                businessObjectFormatFileType: 'TXT',
                businessObjectFormatVersion: '0',
                partitionKey: 'TEST_KEY',
                partitionValue: '01-01-2017',
                subPartitionValues: '01-01-2017',
                businessObjectDataVersion: '0'
            }

            const expectedResult: BusinessObjectData = {
                namespace: 'ns',
                businessObjectDefinitionName: 'dn',
                businessObjectFormatUsage: 'PRC',
                businessObjectFormatFileType: 'TXT',
                businessObjectFormatVersion: 0,
                partitionKey: 'TEST_KEY',
                partitionValue: '01-01-2017',
                subPartitionValues: ['01-01-2017'],
                version: 0
            }
            const dataSpy = (<jasmine.Spy>dataApi.businessObjectDataGetBusinessObjectData);
            dataSpy.and.returnValue(Observable.of(expectedResult));

            const shouldAttachSpy = (<jasmine.Spy>r.routeReuseStrategy.shouldAttach)
            shouldAttachSpy.and.returnValue(true);

            const retrieveSpy = (<jasmine.Spy>r.routeReuseStrategy.retrieve)
                retrieveSpy.and.returnValue({
                        route : {
                            value: {
                                data: {
                                    _value: {
                                        resolvedData: {
                                            title: 'Data Object - ' +
                                            [expectedResult.partitionKey, expectedResult.partitionValue].join(' : '),
                                            businessObjectData: expectedResult
                                        }
                                    }
                                }
                            }
                        }
                });

            const retVal = service.resolve(
                ({ params: activatedRoute.testParams } as any) as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot) as DataObjectDetailResolverData;
           expect(retVal.businessObjectData).toEqual(expectedResult);
            expect(retVal.title).toEqual('Data Object - ' +
                [expectedResult.partitionKey, expectedResult.partitionValue].join(' : '));
            expect(dataSpy).not.toHaveBeenCalled();
        }));
});
