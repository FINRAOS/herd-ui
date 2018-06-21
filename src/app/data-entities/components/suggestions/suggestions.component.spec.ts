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

import { Suggestions, SuggestionsComponent } from './suggestions.component';
import { DiffMatchPatchModule } from 'ng-diff-match-patch/dist';
import { AlertService } from '../../../core/services/alert.service';
import { BusinessObjectDefinitionDescriptionSuggestionService, Configuration } from '@herd/angular-client';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';


describe('SuggestionsComponent', () => {
  let component: SuggestionsComponent;
  let fixture: ComponentFixture<SuggestionsComponent>;
  let businessObjectDefinitionDescriptionSuggestionService: BusinessObjectDefinitionDescriptionSuggestionService;

  const suggestions: Array<any> = [
    {
      id: 618,
      businessObjectDefinitionDescriptionSuggestionKey: {
        namespace: 'testnamespace',
        businessObjectDefinitionName: 'test-bdef-name',
        userId: 'testuserid'
      },
      descriptionSuggestion: 'test suggestion',
      status: 'PENDING',
      createdByUserId: 'somecreateduserid',
      createdOn: 1529528217975,
      newSuggestion: 'somecreateduserid',
      editMode: false
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DiffMatchPatchModule,
        CKEditorModule,
        HttpModule
      ],
      declarations: [
        SuggestionsComponent
      ],
      providers: [
        AlertService,
        BusinessObjectDefinitionDescriptionSuggestionService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsComponent);
    component = fixture.componentInstance;

    // component.suggestions = suggestions;
    fixture.detectChanges();
    businessObjectDefinitionDescriptionSuggestionService = fixture
      .debugElement.injector.get(BusinessObjectDefinitionDescriptionSuggestionService);

    spyOn(businessObjectDefinitionDescriptionSuggestionService,
      'businessObjectDefinitionDescriptionSuggestionAcceptBusinessObjectDefinitionDescriptionSuggestion').and.returnValue(
      Observable.of(suggestions)
    );

    spyOn(businessObjectDefinitionDescriptionSuggestionService,
      'businessObjectDefinitionDescriptionSuggestionUpdateBusinessObjectDefinitionDescriptionSuggestion').and.returnValue(
      Observable.of(suggestions)
    );

  });

  it('should create', async () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(' removeHtmlTag should remove html tag from string', async () => {
    const noHtmlString = component.removeHtmlTag('<span style="color:red">not red</span>');
    expect(noHtmlString).toBe('not red');
  });
});
