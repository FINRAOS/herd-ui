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
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';

export interface EditEvent {
  text: string;
}

@Component({
  selector: 'sd-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() text: string;
  @Input() simpleEdit = false;
  @Input() disableEdit = false;
  @Input() required = false;
  @Input() illegalCharacters: string[] = [];
  @Output() editDone = new EventEmitter<EditEvent>();

  editMode = false;
  editForm: FormGroup;
  hover = false;

  constructor(private elementRef: ElementRef, private formBuilder: FormBuilder) {
    this.editForm = this.formBuilder.group({
      text: ''
    }, {
        validator: this.editValidator
      });
  }

  editValidator = (fg: FormGroup): ValidationErrors | null => {
    const retVal: ValidationErrors = {};
    if (this.required && !fg.value.text) {
      retVal['valueRequired'] = 'Must supply a value for this field';
    }

    if (this.containsIllegalCharacters(fg.value.text)) {
      retVal['illegalCharacters'] = 'This field contains illegal character(s). Characters not allowed: ' +
        this.illegalCharacters.join(' , ');
    }

    return Object.keys(retVal).length > 0 ? retVal : null;
  };

  containsIllegalCharacters(value: string): boolean {
    return this.illegalCharacters.some((c) => {
      return !!(value.indexOf(c) !== -1);
    });
  }

  showEditIcon() {
    return this.hover && !this.disableEdit
  }

  enterEdit() {
    if (!this.disableEdit) {
      this.editForm.setValue({ text: this.text });
      this.editMode = true;
      this.hover = false;
    }
  }

  closeEditor() {
    this.editMode = false;
    this.hover = false;
  }

  ngOnInit() {
    this.editForm.setValue({ text: this.text });
  }

  onSubmit() {
    this.editForm.updateValueAndValidity();
    if (this.editForm.valid) {
      this.closeEditor();
      this.editDone.emit(this.editForm.getRawValue());
    } else {
      this.editForm.markAsTouched();
    }
  }
}
