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
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchService } from '../../../shared/services/search.service';
import { IndexSearchService } from '@herd/angular-client';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IndexSearchMockData } from 'testing/IndexSearchMockData';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../../shared/services/google-analytics.service';
import { UserService } from '../../../core/services/user.service';
import { CurrentUserService, Configuration } from '@herd/angular-client';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { APP_BASE_HREF } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterStub } from '../../../../testing/router-stubs';

describe('SearchComponent', () => {
  const mockData: IndexSearchMockData = new IndexSearchMockData();
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        HttpModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        SearchComponent
      ],
      providers: [
        {
          provide: Configuration,
          useValue: {} as Configuration
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        {
          provide: GoogleAnalyticsService,
          useValue: {
            sendPageViewData: jasmine.createSpy('sendPageViewData'),
            sendEventData: jasmine.createSpy('sendEventData')
          }
        },
        UserService,
        EncryptionService,
        CurrentUserService,
        IndexSearchService,
        SearchService,
        {
          provide: Router,
          useClass: RouterStub
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({match: 'test search'}),
            data: Observable.of(
              {
                resolvedData: {
                  indexSearchResults: mockData.indexSearchResponse['indexSearchResults'],
                  facets: mockData.facets,
                  totalIndexSearchResults: 230,
                  title: ''
                }
              }),
            params: Observable.of({searchText: 'test search'}),
            snapshot: {
              params: {searchTerm: 'test search'},
              data: {
                resolvedData: {
                  indexSearchResults: mockData.indexSearchResponse['indexSearchResults'],
                  facets: mockData.facets,
                  totalIndexSearchResults: 230,
                  title: ''
                }
              },
              queryParams: {
                facets: []
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchService = fixture.debugElement.injector.get(SearchService);
  });

  it('should create the search component', async(() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('Search is returning index search result', async(() => {
    const searchCalled = spyOn(searchService, 'search')
      .and.returnValue(Observable.of({indexSearchResults: mockData.indexSearchResponse['indexSearchResults']}));
    component.search();
    expect(component.indexSearchResults).toEqual(mockData.indexSearchResponse['indexSearchResults']);
    expect(searchCalled).toHaveBeenCalled();
  }));

  it('should navigate ro search page on search', inject([Router], (mock: RouterStub) => {
    component.globalSearch({searchText: 'test search', match: []});
    expect(mock.navigate).toHaveBeenCalledWith(['search', 'test search'], {
      queryParams: {
        match: ''
      }
    });
  }));

  it('should navigate without any search text', inject([Router], (mock: RouterStub) => {
    component.globalSearch({});
    expect(mock.navigate).toHaveBeenCalledWith(['search', undefined], {
      queryParams: {
        match: ''
      }
    });
  }));

  it('Facet change when no facet exists', async(() => {
    const searchCalled = spyOn(searchService, 'search')
      .and.returnValue(Observable.of({indexSearchResults: mockData.indexSearchResponse['indexSearchResults']}));
    const event = {
      nofacets: []
    };
    component.facetChange(event);
    expect(component.facets).toBe(undefined);
    expect(searchCalled.calls.count()).toEqual(1);
  }));

  it('Facet change function is changing facets and effecting search result', async () => {
    const searchCalled = spyOn(searchService, 'search')
      .and.returnValue(Observable.of({indexSearchResults: mockData.indexSearchResponse['indexSearchResults']}));
    const event: any = {
      facets: mockData.facets,
      newSearch: true
    };
    event.facets[0]['facets'][0].state = 1;
    event.facets[1]['facets'][0].state = 2;
    component.facetChange(event);
    expect(component.indexSearchResults).toEqual(mockData.indexSearchResponse['indexSearchResults']);
    expect(searchCalled).toHaveBeenCalled();
  });

  it('Make highlight is joining all the high light htmls for view purpose', async(() => {
    const testHtml = '<b>testhtml</b>';
    const joinHighlightCalled = spyOn(searchService, 'joinHighlight').and.returnValue(testHtml);
    const highLightArray = {
      fields: [
        {fieldName: 'description', fragments: ['kamal', 'managets']}
      ]
    };
    const highlightResult = component.makeHighlightFull(highLightArray);
    expect(highlightResult).toBe(testHtml);
    expect(joinHighlightCalled).toHaveBeenCalled();
  }));

});
