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
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  BusinessObjectDefinitionDescriptionSuggestion
} from '@herd/angular-client/dist/model/businessObjectDefinitionDescriptionSuggestion';

@Component({
  selector: 'sd-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {

  @Input() original: string;
  @Input() suggestions: Array<BusinessObjectDefinitionDescriptionSuggestion>;

  constructor(
  ) {
  }

  ngOnInit() {
  }

  removeHtmlTag(string) {
    return String(string).replace(/<[^>]+>/gm, '');
  }
}
