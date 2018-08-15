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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Suggestions, SuggestionsComponent } from './suggestions.component';
import { DiffMatchPatchModule } from 'ng-diff-match-patch/dist';
import { AlertService } from '../../../core/services/alert.service';
import { BusinessObjectDefinitionDescriptionSuggestionService, Configuration } from '@herd/angular-client';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('SuggestionsComponent', () => {
  let component: SuggestionsComponent;
  let fixture: ComponentFixture<SuggestionsComponent>;
  let businessObjectDefinitionDescriptionSuggestionService: BusinessObjectDefinitionDescriptionSuggestionService;
  const index = 0;

  function query(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

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
        HttpClientModule
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
    businessObjectDefinitionDescriptionSuggestionService = fixture
      .debugElement.injector.get(BusinessObjectDefinitionDescriptionSuggestionService);
    component.suggestions = suggestions;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    component.suggestions = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(' removeHtmlTag should remove html tag from string', async () => {
    const noHtmlString = component.removeHtmlTag('<span style="color:red">not red</span>');
    expect(noHtmlString).toBe('not red');
  });

  it(' should show edit icon on mouse enter', async () => {
    component.suggestions = suggestions;
    component.suggestions[0].editMode = true;
    component.onMouseEnter({ someevent: 'nothing '}, index);
    component.suggestions[0].editMode = false;
    component.onMouseEnter({ someevent: 'nothing '}, index);
    fixture.detectChanges();
    expect(query('.editing-block' + index).nativeElement.style.border).toBe('1px solid rgb(177, 174, 174)');
    expect(query('.content-edit-icon' + index).nativeElement.style.backgroundColor)
      .toBe('rgb(221, 221, 221)');
    expect(query('.content-edit-icon' + index).nativeElement.style.display)
      .toBe('inline-block');
  });

  it(' should remove edit icon on mouse leave', async () => {
    component.suggestions = suggestions;
    component.suggestions[0].editMode = true;
    component.onMouseLeave({ someevent: 'nothing '}, index);
    component.suggestions[0].editMode = false;
    component.onMouseLeave({ someevent: 'nothing '}, index);
    expect(query('.content-edit-icon' + index).nativeElement.style.display).toBe('none');
  });

  it(' enterEditMode should activate the edit mode on that card', async () => {
    component.suggestions = suggestions;
    component.disableEdit = true;
    component.enterEditMode(index);
    component.disableEdit = false;
    component.enterEditMode(index);
    expect(query('.card-suggest' + index).nativeElement.style.boxShadow)
      .toBe('rgb(71, 143, 191) 1px 2px 8px');
    expect(query('.content-diff' + index).nativeElement.style.display)
      .toBe('none');
    expect(query('.content-edit' + index).nativeElement.style.display).toBe('');
    expect(query('.content-edit-icon' + index).nativeElement.style.display).toBe('none');
  });

  it(' editDone should display the suggestion difference and come out of edit mode', async () => {
    component.suggestions = suggestions;
    component.editDone(index, { stopPropagation: () => {}, preventDefault: () => {} });
    expect(query('.card-suggest' + index).nativeElement.style.boxShadow)
      .toBe('rgb(221, 221, 221) 1px 2px 2px 0px');
    expect(query('.content-diff' + index).nativeElement.style.display).toBe('');
    expect(query('.content-edit' + index).nativeElement.style.display).toBe('none');
  });

  it(' save should not save the edit of suggestion on error', async () => {
    const error = spyOn(businessObjectDefinitionDescriptionSuggestionService,
      'businessObjectDefinitionDescriptionSuggestionUpdateBusinessObjectDefinitionDescriptionSuggestion').and.returnValue(
      throwError({error: 'this is a error'})
    );
    suggestions[0].newSuggestion = 'error suggestion';
    component.save(suggestions[0] as Suggestions, index);
    expect(component.suggestions[0].descriptionSuggestion).toBe('test suggestion');
    expect(error).toHaveBeenCalled();
  });

  it(' save should save the edit of suggestion to herd', async () => {
    spyOn(businessObjectDefinitionDescriptionSuggestionService,
      'businessObjectDefinitionDescriptionSuggestionUpdateBusinessObjectDefinitionDescriptionSuggestion').and.returnValue(
      of(suggestions)
    );
    suggestions[0].newSuggestion = 'test suggestion';
    component.save(suggestions[0] as Suggestions, index);
    expect(component.suggestions[0].descriptionSuggestion).toBe('test suggestion');
    suggestions[0].newSuggestion = 'changed suggestion';
    component.save(suggestions[0] as Suggestions, index);
    expect(component.suggestions[0].descriptionSuggestion).toBe('changed suggestion');
  });

  it(' approve should not accept the suggestion  on error', async () => {
    spyOn(businessObjectDefinitionDescriptionSuggestionService,
      'businessObjectDefinitionDescriptionSuggestionAcceptBusinessObjectDefinitionDescriptionSuggestion').and.returnValue(
      throwError({error: 'this is approval error'})
    );
    suggestions[0].newSuggestion = 'error suggestion';
    component.approve(suggestions[0] as Suggestions, index);
    expect(component.suggestions.length).toBe(1);
  });

  it(' approve should accept the suggestion and descrption to new suggestion', async () => {
    spyOn(businessObjectDefinitionDescriptionSuggestionService,
      'businessObjectDefinitionDescriptionSuggestionAcceptBusinessObjectDefinitionDescriptionSuggestion').and.returnValue(
      of(suggestions)
    );
    component.suggestions = suggestions;
    fixture.detectChanges();
    component.approve(suggestions[0] as Suggestions, index, { stopPropagation: () => {}, preventDefault: () => {} });
    expect(component.suggestions.length).toBe(0);
  });

});
