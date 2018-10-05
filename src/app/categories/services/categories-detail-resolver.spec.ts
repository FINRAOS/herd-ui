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
import { async, inject, TestBed } from '@angular/core/testing';

import { CategoryDetailResolverData, CategoryDetailResolverService } from './categories-detail-resolver';
import { Observable, of } from 'rxjs';
import { Tag, TagService } from '@herd/angular-client';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterStub } from 'testing/router-stubs';
import { SearchService } from '../../shared/services/search.service';

describe('Category Detail Resolver', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SearchService,
          useValue: {
            search: jasmine.createSpy('search'),
            configuration: {}
          }
        },
        CategoryDetailResolverService,
        {
          provide: TagService,
          useValue: {
            tagGetTag: jasmine.createSpy('tagGetTag'),
            configuration: {}
          }
        }, {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
  });

  it('should return category data initially',
    async(inject([CategoryDetailResolverService, TagService, Router, SearchService],
      (categoryDetailResolverService: CategoryDetailResolverService, tagApi: TagService, r: Router, searchService: SearchService) => {
        const expectedTag: Tag = {
          tagKey: {
            tagTypeCode: 'tagTypeCode',
            tagCode: 'tagCode'
          },
          displayName: 'tagCode'
        };
        const searchResult: any = {
          indexSearchResults: [],
          facets: [],
          totalIndexSearchResults: 90
        };

        const tagSpy = (<jasmine.Spy>tagApi.tagGetTag).and.returnValue(of(expectedTag));
        const searchSpy = (<jasmine.Spy>searchService.search).and.returnValue(of(searchResult));

        (<jasmine.Spy>r.routeReuseStrategy.shouldAttach).and.returnValue(false);

        (categoryDetailResolverService.resolve(
          ({
            params: {
              tagTypeCode: 'ttcode',
              tagCode: 'tcode',
              searchText: 'testsearch'
            },
            queryParams: {
              match: []
            }
          } as any) as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<any>)
          .subscribe((data) => {
            expect((data as CategoryDetailResolverData).category).toEqual(expectedTag);
            expect((data as CategoryDetailResolverData).title).toEqual('Category - tagCode ( search: testsearch )');
            expect(tagSpy).toHaveBeenCalled();
            expect(searchSpy).toHaveBeenCalled();
          });

      })));

  it('should go through without search term and match',
    async(inject([CategoryDetailResolverService, TagService, Router, SearchService],
      (categoryDetailResolverService: CategoryDetailResolverService, tagApi: TagService, r: Router, searchService: SearchService) => {
        const expectedTag: Tag = {
          tagKey: {
            tagTypeCode: 'tagTypeCode',
            tagCode: 'tagCode'
          },
          displayName: 'tagCode'
        };
        const searchResult: any = {
          indexSearchResults: [],
          facets: [],
          totalIndexSearchResults: 90
        };

        const tagSpy = (<jasmine.Spy>tagApi.tagGetTag).and.returnValue(of(expectedTag));
        const searchSpy = (<jasmine.Spy>searchService.search).and.returnValue(of(searchResult));

        (<jasmine.Spy>r.routeReuseStrategy.shouldAttach).and.returnValue(false);

        (categoryDetailResolverService.resolve(
          ({
            params: {
              tagTypeCode: 'ttcode',
              tagCode: 'tcode'
            }
          } as any) as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<any>)
          .subscribe((data) => {
            expect((data as CategoryDetailResolverData).category).toEqual(expectedTag);
            expect((data as CategoryDetailResolverData).title).toEqual('Category - tagCode');
            expect(tagSpy).toHaveBeenCalled();
            expect(searchSpy).toHaveBeenCalled();
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
        };


        const tagSpy = (<jasmine.Spy>tag.tagGetTag);
        tagSpy.and.returnValue(of(expectedTag));

        const shouldAttachSpy = (<jasmine.Spy>r.routeReuseStrategy.shouldAttach);
        shouldAttachSpy.and.returnValue(true);

        const retrieveSpy = (<jasmine.Spy>r.routeReuseStrategy.retrieve);
        retrieveSpy.and.returnValue({
          route: {
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

        const returnValue = service.resolve(
          ({params: {tagTypeCode: 'ttcode', tagCode: 'tcode'}} as any) as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot) as CategoryDetailResolverData;
        expect(returnValue.title).toEqual('Category - tagCode');
        expect(tagSpy).not.toHaveBeenCalled();
      })));
});
