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
import { TestBed, inject, async } from '@angular/core/testing';
import {FormatResolverService, FormatResolverServiceData} from './format-resolver.service';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {RouterStub} from '../../testing/router-stubs';

describe('FormatResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormatResolverService,
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    });
  });

  it('should be created', inject([FormatResolverService], (service: FormatResolverService) => {
    expect(service).toBeTruthy();
  }));

  it('resolve should resolve data', async(inject(
    [FormatResolverService, Router],
    (service: FormatResolverService, router: RouterStub) => {

      const searchResolveData: FormatResolverServiceData = {
        businessObjectFormatDetail: null,
        title: ''
      };

      const testParams: any = {
        formatUsage: 'USG',
        formatFileType: 'TYP',
        formatVersion: '4'
      };

      (service.resolve({params: testParams} as ActivatedRouteSnapshot,
         {} as RouterStateSnapshot) as Observable<FormatResolverServiceData>)
        .subscribe((data) => {
          // resolves properly when it is a completely new route
          expect(data.title).toBe('Format - USG:TYP:4');
        });

        // when using cached data should just return the title
        router.routeReuseStrategy.shouldAttach.and.returnValue(true);
        const retVal = (service.resolve({params: testParams} as ActivatedRouteSnapshot,
           {} as RouterStateSnapshot) as FormatResolverServiceData);

        expect(retVal.title).toBe('Format - USG:TYP:4');
    })));

});
