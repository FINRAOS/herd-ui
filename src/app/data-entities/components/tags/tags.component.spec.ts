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
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TagService, TagTypeService, BusinessObjectDefinitionTagService} from '@herd/angular-client';
import {TagsComponent} from './tags.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let tagApi, tagTypeApi, businessObjectDefinitionTagApi;
  const businessObjectDefinitionTagKeys = [{
    'businessObjectDefinitionKey': {
      'namespace': 'TEST_NAMESPACE',
      'businessObjectDefinitionName': 'TEST_BDEF_NAME'
    }, 'tagKey': {'tagTypeCode': 'TEST_TAGTYPE_CODE1', 'tagCode': 'TEST_TAG_CODE1'}
  }, {
    'businessObjectDefinitionKey': {
      'namespace': 'TEST_NAMESPACE',
      'businessObjectDefinitionName': 'TEST_BDEF_NAME'
    }, 'tagKey': {'tagTypeCode': 'TEST_TAGTYPE_CODE2', 'tagCode': 'TEST_TAG_CODE2'}
  }, {
    'businessObjectDefinitionKey': {
      'namespace': 'TEST_NAMESPACE',
      'businessObjectDefinitionName': 'TEST_BDEF_NAME'
    }, 'tagKey': {'tagTypeCode': 'TEST_TAGTYPE_CODE3', 'tagCode': 'TEST_TAG_CODE3'}
  }];
  const tagSearchResult = {
    'tags': [{
      'id': null,
      'tagKey': {'tagTypeCode': 'TEST_TAGTYPE_CODE1', 'tagCode': 'TEST_TAG_CODE1'},
      'displayName': 'Code Lookup',
      'searchScoreMultiplier': null,
      'description': 'Lookup table for allowable value codes and descriptions.',
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }, {
      'id': null,
      'tagKey': {'tagTypeCode': 'TEST_TAGTYPE_CODE2', 'tagCode': 'TEST_TAG_CODE2'},
      'displayName': 'Event',
      'searchScoreMultiplier': null,
      'description': 'Event data (e.g., Dividend, News Story, Filing, Alert).',
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }, {
      'id': null,
      'tagKey': {'tagTypeCode': 'TEST_TAGTYPE_CODE3', 'tagCode': 'TEST_TAG_CODE3'},
      'displayName': 'testing',
      'searchScoreMultiplier': null,
      'description': 'Wolf at the zoo, updated again.',
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }]
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      declarations: [TagsComponent],
      providers: [
        TagService,
        TagTypeService,
        BusinessObjectDefinitionTagService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    component.namespace = 'test_namespace';
    component.dataEntityName = 'test_data_entity_name';

    tagApi = TestBed.get(TagService);
    spyOn(tagApi, 'tagGetTag').and.returnValue(Observable.of({displayName: 'test-display-name'}));
    spyOn(tagApi, 'tagSearchTags').and.returnValue(Observable.of(tagSearchResult));

    tagTypeApi = TestBed.get(TagTypeService);
    spyOn(tagTypeApi, 'tagTypeGetTagType').and.returnValue(Observable.of({displayName: 'test-display-name'}));

    businessObjectDefinitionTagApi = TestBed.get(BusinessObjectDefinitionTagService);
    spyOn(businessObjectDefinitionTagApi, 'businessObjectDefinitionTagGetBusinessObjectDefinitionTagsByBusinessObjectDefinition')
      .and.returnValue(Observable.of({businessObjectDefinitionTagKeys: businessObjectDefinitionTagKeys}));
    spyOn(businessObjectDefinitionTagApi, 'businessObjectDefinitionTagCreateBusinessObjectDefinitionTag')
      .and.returnValue(Observable.of({businessObjectDefinitionTagKeys: businessObjectDefinitionTagKeys}));
    spyOn(businessObjectDefinitionTagApi, 'businessObjectDefinitionTagDeleteBusinessObjectDefinitionTag')
      .and.returnValue(Observable.of({businessObjectDefinitionTagKeys: businessObjectDefinitionTagKeys}));

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get all the tags to be selected by users', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(tagApi.tagSearchTags).toHaveBeenCalled();
    expect(component.allTags).toEqual(tagSearchResult.tags);
    expect(component).toBeTruthy();
  });

  it('should save tags to the server on select of tags from drop down', () => {
    component.selected({tagKey: {'tagTypeCode': 'TEST_TAGTYPE_CODE2', 'tagCode': 'TEST_TAG_CODE2'}});
    expect(component.selectedTags).toContain({'tagTypeCode': 'TEST_TAGTYPE_CODE2', 'tagCode': 'TEST_TAG_CODE2'});
    businessObjectDefinitionTagApi
      .businessObjectDefinitionTagCreateBusinessObjectDefinitionTag
      .and.returnValue(throwError({status: 404}));
    component.selected({tagKey: {'tagTypeCode': 'TEST_TAGTYPE_CODE2', 'tagCode': 'TEST_TAG_CODE2'}});
    fixture.detectChanges();
    expect(component.selectedTags).not.toContain({'tagTypeCode': 'TEST_TAGTYPE_CODE2', 'tagCode': 'TEST_TAG_CODE2'});
  });

  it('should remove tags from the list on click of x button', () => {
    component.removed({tagKey: {'tagTypeCode': 'TEST_TAGTYPE_CODE1', 'tagCode': 'TEST_TAG_CODE1'}});
    component.blur({});
    fixture.detectChanges();
    expect(component.selectedTags).not.toContain('{\'tagTypeCode\': \'TEST_TAGTYPE_CODE1\', \'tagCode\': \'TEST_TAG_CODE1\'}');
    businessObjectDefinitionTagApi
      .businessObjectDefinitionTagDeleteBusinessObjectDefinitionTag
      .and.returnValue(throwError({status: 404}));
    component.removed({tagKey: {'tagTypeCode': 'TEST_TAGTYPE_CODE2', 'tagCode': 'TEST_TAG_CODE2'}});
    component.blur({});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should able to see the edit icon on mouse over of tags', () => {
    component.onMouseEnter({});
    expect(component.hover).toBeTruthy();
  });

  it('should edit icon removed on mouse out of tags', () => {
    component.onMouseLeave({});
    expect(component.hover).toBeFalsy();
  });

  it('should able to edit on click on tag area', () => {
    component.click(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.tags-content').style.display).toEqual('');
    component.click(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.tags-content').style.display).toEqual('none');
  });

  it('should remove tags from server on clicking x on tags', () => {
    component.removed({tagKey: {tagTypeCode: 'test-tag-type-code', tagCode: 'test-tag-code'}});
    expect(component).toBeTruthy();
  });
});
