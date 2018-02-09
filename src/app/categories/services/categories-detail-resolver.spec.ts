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

import { CategoryDetailResolverService, CategoryDetailResolverData } from './categories-detail-resolver';
import { Observable } from 'rxjs/Observable';
import {
    Tag, TagService, TagKey, TagSearchRequest
} from '@herd/angular-client';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { RouterStub } from 'testing/router-stubs';

describe('Category Detail Resolver', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CategoryDetailResolverService,
                {
                    provide: TagService, useValue: {
                        tagGetTag:
                        jasmine.createSpy('tagGetTag'),
                        configuration: {}
                    }
                }, {
                    provide: Router,
                    useClass: RouterStub
                }]
        });
    });

    it('should return category data initially',
        async(inject([CategoryDetailResolverService, TagService, Router],
            (service: CategoryDetailResolverService,
                tagApi: TagService, r: Router) => {
                const expectedTag: Tag = {
                    tagKey: {
                        tagTypeCode: 'tagTypeCode',
                        tagCode: 'tagCode'
                    },
                    displayName: 'tagCode'
                }

                const tagSpy = (<jasmine.Spy>tagApi.tagGetTag);
                tagSpy.and.returnValue(Observable.of(expectedTag));


                const shouldAttachSpy = (<jasmine.Spy>r.routeReuseStrategy.shouldAttach)
                shouldAttachSpy.and.returnValue(false);

                (service.resolve(
                    ({ params: { tagTypeCode: 'ttcode', tagCode: 'tcode' } } as any) as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot) as Observable<any>).subscribe((data) => {
                        expect((data as CategoryDetailResolverData).category)
                            .toEqual(expectedTag);
                        expect((data as CategoryDetailResolverData).title).toEqual('Category - tagCode');
                        expect(tagSpy).toHaveBeenCalled();
             });

            })));

    it('should return saved category data',
        async(inject([CategoryDetailResolverService, TagService, Router],
            (service: CategoryDetailResolverService,
                tag: TagService, r: Router) => {
                const expectedTag: Tag = {
                    tagKey: {
                        tagTypeCode: 'tagTypeCode',
                        tagCode: 'tagCode'
                    }
                }


                const tagSpy = (<jasmine.Spy>tag.tagGetTag);
                tagSpy.and.returnValue(Observable.of(expectedTag));

                const shouldAttachSpy = (<jasmine.Spy>r.routeReuseStrategy.shouldAttach)
                shouldAttachSpy.and.returnValue(true);

                const retrieveSpy = (<jasmine.Spy>r.routeReuseStrategy.retrieve)
                retrieveSpy.and.returnValue({
                        route : {
                            value: {
                                data: {
                                    _value: {
                                        resolvedData: {
                                            title: 'Category - tagCode',
                                            category: expectedTag
                                        }
                                    }
                                }
                            }
                        }
                });

              const returnValue =  service.resolve(
                  ({ params: { tagTypeCode: 'ttcode', tagCode: 'tcode' } } as any) as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot) as CategoryDetailResolverData;
              expect(returnValue.category).toEqual(expectedTag);
              expect(returnValue.title).toEqual('Category - tagCode');
              expect(tagSpy).not.toHaveBeenCalled();
     })));
});
