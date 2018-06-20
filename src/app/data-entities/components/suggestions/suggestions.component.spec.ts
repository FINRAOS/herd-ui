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

import { SuggestionsComponent } from './suggestions.component';
import { DiffMatchPatchModule } from 'ng-diff-match-patch/dist';
import { MockCkeditorComponent } from '../../../../testing/mock-ckeditor.component';
import { AlertService } from '../../../core/services/alert.service';
import { BusinessObjectDefinitionDescriptionSuggestionService } from '@herd/angular-client';

describe('SuggestionsComponent', () => {
  let component: SuggestionsComponent;
  let fixture: ComponentFixture<SuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DiffMatchPatchModule
      ],
      declarations: [
        MockCkeditorComponent,
        SuggestionsComponent
      ],
      providers: [
        AlertService,
        {
          provide: BusinessObjectDefinitionDescriptionSuggestionService,
          useValue: {
            businessObjectDefinitionDescriptionSuggestionAcceptBusinessObjectDefinitionDescriptionSuggestion:
              jasmine.createSpy('businessObjectDefinitionDescriptionSuggestionAcceptBusinessObjectDefinitionDescriptionSuggestion'),
            businessObjectDefinitionDescriptionSuggestionUpdateBusinessObjectDefinitionDescriptionSuggestion:
              jasmine.createSpy('businessObjectDefinitionDescriptionSuggestionUpdateBusinessObjectDefinitionDescriptionSuggestion'),
            configuration: {}
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' removeHtmlTag should remove html tag from string', () => {
    const noHtmlString = component.removeHtmlTag('<span style="color:red">not red</span>');
    expect(noHtmlString).toBe('not red');
  });
});
