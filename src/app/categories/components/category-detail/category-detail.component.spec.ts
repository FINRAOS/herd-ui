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
import {ActivatedRouteStub, RouterStub} from './../../../../testing/router-stubs';
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {CategoryDetailComponent} from './category-detail.component';
import {HttpModule} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {
  Tag, TagService, BusinessObjectDefinitionService,
  CurrentUserService, Configuration, TagSearchResponse, IndexSearchService
} from '@herd/angular-client'
import {IndexSearchMockData} from 'testing/IndexSearchMockData';
import {RelatedDataEntities} from 'testing/RelatedDataEntities';
import {GoogleAnalyticsService} from '../../../shared/services/google-analytics.service';
import {SearchService} from '../../../shared/services/search.service';

describe('CategoryDetailComponent', () => {
  const indexSearchMockData: IndexSearchMockData = new IndexSearchMockData();
  const relatedDataEntities: RelatedDataEntities = new RelatedDataEntities();
  let component: CategoryDetailComponent;
  let fixture: ComponentFixture<CategoryDetailComponent>;
  let spyBusinessObjectDefinitionApi, spyParentTagApi, spyTagSearchApi, spySearchServiceApi;

  const parentTag = {
    'tag': {
      'id': null,
      'tagKey': {'tagTypeCode': 'TagTypeCode', 'tagCode': 'TagCode'},
      'displayName': 'Equity',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }
  };

  const tags: Array<Tag> = [parentTag.tag, parentTag.tag];
  const tagSearchResponse: TagSearchResponse = {
    tags: tags
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        SharedModule,
        RouterTestingModule,
        HttpModule
      ],
      declarations: [CategoryDetailComponent],
      providers: [
        {
          provide: IndexSearchService,
          useValue: {
            indexSearchIndexSearch: jasmine.createSpy('indexSearchIndexSearch'),
            configuration: {}
          }
        },
        SearchService,
        {provide: Configuration, useValue: {}},
        {
          provide: TagService,
          useValue: {
            tagGetTag: jasmine.createSpy('tagGetTag'),
            tagSearchTags: jasmine.createSpy('tagSearchTags'),
            configuration: {}
          }
        },
        {
          provide: BusinessObjectDefinitionService,
          useValue: {
            businessObjectDefinitionIndexSearchBusinessObjectDefinitions:
              jasmine.createSpy('businessObjectDefinitionIndexSearchBusinessObjectDefinitions'),
            tagSearchTags: jasmine.createSpy('tagSearchTags'),
            configuration: {}
          }
        },
        {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        {provide: Router, useClass: RouterStub},
        {
          provide: GoogleAnalyticsService, useValue: {
            sendEventData: jasmine.createSpy('sendEventData')
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDetailComponent);
    component = fixture.componentInstance;
  });

  beforeEach(async(inject([
      IndexSearchService,
      TagService,
      BusinessObjectDefinitionService],
    (indexSearchService: IndexSearchService,
     tagApi: TagService,
     bdefApi: BusinessObjectDefinitionService) => {
      // Spy on the services
      spyBusinessObjectDefinitionApi = (<jasmine.Spy>bdefApi.businessObjectDefinitionIndexSearchBusinessObjectDefinitions)
        .and.returnValue(Observable.of(relatedDataEntities.relatedDataEntities));
      spyParentTagApi = (<jasmine.Spy>tagApi.tagGetTag).and.returnValue(Observable.of(parentTag.tag));
      spyTagSearchApi = (<jasmine.Spy>tagApi.tagSearchTags).and.returnValue(Observable.of(tagSearchResponse));
      spySearchServiceApi = (<jasmine.Spy>indexSearchService.indexSearchIndexSearch)
        .and.returnValue(Observable.of(indexSearchMockData.indexSearchResponse));
    })));
  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should set all data onInit - no parentTag', async(inject([ActivatedRoute], (activeRoute: ActivatedRouteStub) => {
    const category: Tag = {
      'id': null,
      'tagKey': {'tagTypeCode': 'TagTypeCode', 'tagCode': 'QTY'},
      'displayName': 'quity',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    };

    activeRoute.testData = {
      resolvedData: {
        category
      }
    };

    activeRoute.testParams = {
      tagTypeCode: 'TagTypeCode',
      tagCode: 'QTY'
    };

    fixture.detectChanges();
    expect(component.parent).toEqual(undefined);
    expect(component.tagChildren).toEqual(tagSearchResponse.tags);
    expect(spySearchServiceApi.calls.count()).toEqual(1);
    expect(spyParentTagApi.calls.count()).toEqual(0);
    expect(spyTagSearchApi.calls.count()).toEqual(1);
  })));

  it('should set all data onInit - with parentTag', async(inject([ActivatedRoute], (activeRoute: ActivatedRouteStub) => {

    const category = {
      'id': null,
      'tagKey': {'tagTypeCode': 'TagTypeCode', 'tagCode': 'QTY'},
      'displayName': 'quity',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': {'tagTypeCode': 'TagTypeCode', 'tagCode': 'TagCode'},
      'hasChildren': null
    };


    activeRoute.testData = {
      resolvedData: {
        category
      }
    };
    fixture.detectChanges();
    expect(component.parent).not.toEqual(undefined);
    expect(component.tagChildren).toEqual(tagSearchResponse.tags);

    expect(spySearchServiceApi.calls.count()).toEqual(1);
    expect(spyParentTagApi.calls.count()).toEqual(1);
    expect(spyTagSearchApi.calls.count()).toEqual(1);
  })));

  it('Facet change when facet exists', async(() => {

    const _facets = [
      {
        'facetDisplayName': 'test-facet-displayname',
        'facetCount': 119,
        'facetType': 'TagType',
        'facetId': 'test-facet-id1',
        'facets': [
          {
            'facetDisplayName': 'test-facet-displayname1',
            'facetCount': 69,
            'facetType': 'Tag',
            'facetId': 'test-facet-id2',
            'facets': null,
            'state': 1
          }, {
            'facetDisplayName': 'test-facet-displayname2',
            'facetCount': 42,
            'facetType': 'Tag',
            'facetId': 'test-facet-id3',
            'facets': null,
            'state': 2
          },
          {
            'facetDisplayName': 'test-facet-displayname3',
            'facetCount': 20,
            'facetType': 'Tag',
            'facetId': 'test-facet-id3',
            'facets': null,
            'state': 0
          }
        ]
      }];

    const event = {
      facets: _facets
    };
    component.facetChange(event);
    expect(component.facets).toBe(indexSearchMockData.indexSearchResponse.facets);
  }));

  it('Facet change when no inclusion and exclusion filter exists', async(() => {
    const _facets = [
      {
        'facetDisplayName': 'test-facet-displayname1',
        'facetCount': 119,
        'facetType': 'TagType',
        'facetId': 'DATA_CTGRY',
        'facets': [
          {
            'facetDisplayName': 'test-facet-displayname2',
            'facetCount': 69,
            'facetType': 'Tag',
            'facetId': 'RFRNC',
            'facets': null
          }, {
            'facetDisplayName': 'test-facet-displayname3',
            'facetCount': 42,
            'facetType': 'Tag',
            'facetId': 'CD_LKP',
            'facets': null
          },
          {
            'facetDisplayName': 'test-facet-displayname4',
            'facetCount': 20,
            'facetType': 'Tag',
            'facetId': 'LKP',
            'facets': null
          }
        ]
      }];
    const event = {
      facets: _facets
    };
    component.facetChange(indexSearchMockData.indexSearchResponse.facets);
    expect(component.facets).toBe(indexSearchMockData.indexSearchResponse.facets);
    expect(spySearchServiceApi.calls.count()).toEqual(1);
  }));

  it('Facet change when no facet exists', async(() => {
    const event = {
      nofacets: []
    };
    component.facetChange(event);
    expect(component.facets).toBe(indexSearchMockData.indexSearchResponse.facets);
    expect(spySearchServiceApi.calls.count()).toEqual(1);
  }));

  it('on category link click', async(inject([Router], (r: Router) => {
    component.onCategoryLinkClick(parentTag.tag);
  })));

});
