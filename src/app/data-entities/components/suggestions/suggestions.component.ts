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
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BusinessObjectDefinitionDescriptionSuggestion
} from '@herd/angular-client/dist/model/businessObjectDefinitionDescriptionSuggestion';
import { AlertService, DangerAlert, SuccessAlert } from '../../../core/services/alert.service';
import {
  BusinessObjectDefinitionDescriptionSuggestionService
} from '@herd/angular-client';
import { BusinessObjectDefinitionDescriptionSuggestionKey } from '@herd/angular-client/dist/model/businessObjectDefinitionDescriptionSuggestionKey';

export interface Suggestions extends BusinessObjectDefinitionDescriptionSuggestion {
  newSuggestion: string;
  editMode: boolean;
}

@Component({
  selector: 'sd-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})

export class SuggestionsComponent implements OnInit, AfterViewInit {

  @Input() original: string;
  @Input() suggestions: Array<Suggestions>;
  @Output() approveSuggestion = new EventEmitter<Object>();

  public hover = false;
  public editMode = false;
  public disableEdit = false;

  constructor(
    private elementRef: ElementRef,
    private alertService: AlertService,
    private businessObjectDefinitionDescriptionSuggestionService: BusinessObjectDefinitionDescriptionSuggestionService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.suggestions && this.suggestions.length > 0) {
      this.suggestions
        .map((value, index) => {
          this.elementRef.nativeElement.querySelector('.content-edit' + index).style.display = 'none';
          this.elementRef.nativeElement.querySelector('.content-edit-icon' + index).style.display = 'none';
        });
    }
  }

  removeHtmlTag(string) {
    return String(string).replace(/<[^>]+>/gm, '');
  }

  onMouseEnter(event: any, index: number) {
    if (!this.suggestions[index].editMode) {
      this.hover = true;
      this.elementRef.nativeElement.querySelector('.editing-block' + index).style.border = '1px solid #b1aeae';
      this.elementRef.nativeElement.querySelector('.content-edit-icon' + index).style.backgroundColor = '#dddddd';
      // this.elementRef.nativeElement.querySelector('.content-edit-icon' + index).style.display = 'inline-block';
      this.elementRef.nativeElement.querySelector('.content-edit-icon' + index).style.display = 'inline-block';
    }
  }

  onMouseLeave(event: any, index: number) {
    if (!this.suggestions[index].editMode) {
      this.hover = false;
      this.elementRef.nativeElement.querySelector('.editing-block' + index).style.border = '1px solid rgba(246, 250, 255, 0.73)';
      this.elementRef.nativeElement.querySelector('.content-edit-icon' + index).style.display = 'none';
    }
  }

  enterEditMode(index: number) {
    if (!this.disableEdit) {
      this.elementRef.nativeElement.querySelector('.editing-block' + index).style.border = '1px solid rgba(246, 250, 255, 0.73)';
      this.elementRef.nativeElement.querySelector('.card-suggest' + index).style.boxShadow = '1px 2px 8px #478fbf';
      this.elementRef.nativeElement.querySelector('.content-diff' + index).style.display = 'none';
      this.elementRef.nativeElement.querySelector('.content-edit' + index).style.display = '';
      this.elementRef.nativeElement.querySelector('.content-edit-icon' + index).style.display = 'none';
      this.suggestions[index].editMode = true;
      this.hover = false;
    }
  }

  editDone(index: number, event?: any) {
    this.elementRef.nativeElement.querySelector('.card-suggest' + index).style.boxShadow = '1px 2px 2px 0px #dddddd';
    this.elementRef.nativeElement.querySelector('.content-diff' + index).style.display = '';
    this.elementRef.nativeElement.querySelector('.content-edit' + index).style.display = 'none';
    this.suggestions[index].editMode = false;
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  editorChange(event, index) {
    this.suggestions[index].newSuggestion = event;
  }

  save(suggestion: Suggestions, index: number) {

    if (suggestion.newSuggestion !== undefined && suggestion.newSuggestion !== suggestion.descriptionSuggestion) {
      this.businessObjectDefinitionDescriptionSuggestionService
        .businessObjectDefinitionDescriptionSuggestionUpdateBusinessObjectDefinitionDescriptionSuggestion(
          suggestion.businessObjectDefinitionDescriptionSuggestionKey.namespace,
          suggestion.businessObjectDefinitionDescriptionSuggestionKey.businessObjectDefinitionName,
          suggestion.businessObjectDefinitionDescriptionSuggestionKey.userId,
          {
            descriptionSuggestion: suggestion.newSuggestion || suggestion.descriptionSuggestion
          }
        ).subscribe(
        (response) => {
          this.suggestions[index].descriptionSuggestion = suggestion.newSuggestion;
          this.alertService.alert(new SuccessAlert('Your suggestion saved successfully.', '',
            `${response}`, 5
          ));
          this.editDone(index)
        }, (error) => {
          this.alertService.alert(new DangerAlert('Unable to get data entity description suggestions', '',
            `Problem: ${error} : Try again later.`, 5
          ));
        }
      );
    } else {
      this.alertService.alert(new DangerAlert('There are no changes in the suggested description',
        'Please make some changes before submit.',
        `Try after making some change.`, 5
      ));
    }
  }

  approve(suggestion: Suggestions, index: number, event?) {

    this.businessObjectDefinitionDescriptionSuggestionService
      .businessObjectDefinitionDescriptionSuggestionAcceptBusinessObjectDefinitionDescriptionSuggestion(
        {
          businessObjectDefinitionDescriptionSuggestionKey: {
            namespace: suggestion.businessObjectDefinitionDescriptionSuggestionKey.namespace,
            businessObjectDefinitionName: suggestion.businessObjectDefinitionDescriptionSuggestionKey.businessObjectDefinitionName,
            userId: suggestion.businessObjectDefinitionDescriptionSuggestionKey.userId
          }
        }
      ).subscribe(
      (response) => {

        // we removing one item from this component but it will also reflect in parent component - data entity detail.
        this.suggestions.splice(index, 1);
        this.approveSuggestion.emit({text: suggestion.descriptionSuggestion});
        this.alertService.alert(new SuccessAlert('Success!', 'Your suggestion approved successfully.',
          `${response}`, 5
        ));
        this.editDone(index)
      }, (error) => {
        this.alertService.alert(new DangerAlert('Error!', 'Unable approve this description suggestion',
          `Problem: ${error} : Try again later.`, 5
        ));
      }
    );

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
