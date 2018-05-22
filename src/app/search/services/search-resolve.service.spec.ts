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
import {TestBed, inject, async} from '@angular/core/testing';

import {SearchResolveData, SearchResolverService} from './search-resolver.service';
import {SearchService} from '../../shared/services/search.service';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {RouterStub} from '../../../testing/router-stubs';


describe('SearchResolverService', () => {

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
        SearchResolverService,
        {
          provide: Router,
          useClass: RouterStub
        }
        ]
    });

  });

  it('should be created', async(inject([SearchResolverService], (service: SearchResolverService) => {
    expect(service).toBeTruthy();
  })));

  it('resolve should resolve data', async(inject(
    [SearchResolverService, SearchService],
    (service: SearchResolverService, searchService: SearchService) => {

      const searchResolveData: SearchResolveData = {
        indexSearchResults: [],
        facets: [],
        totalIndexSearchResults: 0,
        title: ''
      };

      const searchServiceSearchSpy = (<jasmine.Spy>searchService.search);
      searchServiceSearchSpy.and.returnValue(Observable.of(searchResolveData));

      (service.resolve(({params: {searchText: 'this is not me'} , queryParams: {match: 'test'}} as any) as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot)as Observable<SearchResolveData>)
        .subscribe((data) => {
          expect((data as SearchResolveData).indexSearchResults).toEqual(searchResolveData.indexSearchResults);
          expect((data as SearchResolveData).facets).toEqual(searchResolveData.facets);
          expect((data as SearchResolveData).title).toEqual('Global Search - this is not me');
          expect(searchServiceSearchSpy).toHaveBeenCalled();
        });

    })));

});
