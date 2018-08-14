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
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { GlobalSearchComponent } from '../../../shared/components/global-search/global-search.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { RouterTestingModule } from '@angular/router/testing';
import { TagService, TagTypeService } from '@herd/angular-client';
import { Observable } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TruncatedContentComponent } from 'app/shared/components/truncated-content/truncated-content.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../testing/router-stubs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const tagTypes = {
    'tagTypes': [{
      'tagTypeKey': {'tagTypeCode': 'TEST_CTGRY'},
      'displayName': 'Data Category',
      'tagTypeOrder': 1,
      'description': 'test description, Transaction.'
    }, {
      'tagTypeKey': {'tagTypeCode': 'TEST_TYPE'},
      'displayName': 'Product Type',
      'tagTypeOrder': 2,
      'description': 'test Fixed Income or Option.'
    }, {
      'tagTypeKey': {'tagTypeCode': 'TEST_SRC'},
      'displayName': 'External Data Source',
      'tagTypeOrder': 3,
      'description': 'some test external data provided ny vendors'
    }, {
      'tagTypeKey': {'tagTypeCode': 'TEST_TRANS_TYPE'},
      'displayName': 'Transaction Type',
      'tagTypeOrder': 4,
      'description': 'some quote data from sources.'
    }, {
      'tagTypeKey': {'tagTypeCode': 'test_five'},
      'displayName': 'Test Five',
      'tagTypeOrder': 5,
      'description': 'test5'
    }, {
      'tagTypeKey': {'tagTypeCode': 'test_six'},
      'displayName': 'Test Six',
      'tagTypeOrder': 6,
      'description': 'test5'
    }, {
      'tagTypeKey': {'tagTypeCode': 'test_seven'},
      'displayName': 'Test Seven',
      'tagTypeOrder': 7,
      'description': 'test7'
    }]
  };

  const tags = {
    'tags': [{
      'id': null,
      'tagKey': {'tagTypeCode': 'TEST_PRDCT_TYPE', 'tagCode': 'EQTY'},
      'displayName': 'Equity',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }, {
      'id': null,
      'tagKey': {'tagTypeCode': 'PRDCT_TYPE', 'tagCode': 'FIXED_INCM'},
      'displayName': 'Fixed Income',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }, {
      'id': null,
      'tagKey': {'tagTypeCode': 'PRDCT_TYPE', 'tagCode': 'INDEX'},
      'displayName': 'Index',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }, {
      'id': null,
      'tagKey': {'tagTypeCode': 'PRDCT_TYPE', 'tagCode': 'OPTN'},
      'displayName': 'Option',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }]
  };

  const brandHeader = '{{BRAND_HEADER}}';
  const motto = '{{BRAND_MOTO}}';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        InlineSVGModule,
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        GlobalSearchComponent,
        HomeComponent,
        TruncatedContentComponent
      ],
      providers: [
        {
          provide: TagService,
          useValue: {
            tagSearchTags: jasmine.createSpy('tagSearchTags').and.returnValue(Observable.of(tags))
          }
        },
        {
          provide: TagTypeService,
          useValue: {
            tagTypeSearchTagTypes: jasmine.createSpy('tagTypeSearchTagTypes').and.returnValue(Observable.of(tagTypes))
          }
        },
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate ro search page on search', inject([Router], (mock: RouterStub) => {
    component.search({searchText: 'test search', match: []});
    fixture.detectChanges();
    expect(mock.navigate).toHaveBeenCalledWith(['search', 'test search'], {
      queryParams: {
        match: ''
      }
    });
  }));

  it('should set TagType and tag data', async(() => {

    const tagApi = fixture.debugElement.injector.get(TagService);
    const tagTypeApi = fixture.debugElement.injector.get(TagTypeService);

    const spyTagType = tagTypeApi.tagTypeSearchTagTypes as jasmine.Spy;
    const spyTag = tagApi.tagSearchTags as jasmine.Spy;

    fixture.detectChanges();

    expect(spyTag.calls.count()).toEqual(6); // called once per tag type to show
    expect(spyTagType.calls.count()).toEqual(1);
    expect(component.brandHeader).toEqual(brandHeader);
    expect(component.brandMotto).toEqual(motto);
    component.tagTypes.subscribe((data) => {
      expect(data.length).toEqual(6);
      // since the same tag data is returned per tag search request we should expect
      // every one of them to be the same tags.
      data.forEach((d) => {
        expect((d as any).tags).toEqual(tags.tags);
      });
    });
  }));
});
