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
import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { AttributeValueFilter } from '@herd/angular-client';

@Component({
    selector: 'sd-attribute-filter',
    templateUrl: './attribute-filter.component.html',
    styleUrls: ['./attribute-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeFilterComponent implements OnInit {

    title = ''
    attributeFilterForm: FormGroup;
    @Input() filter: AttributeValueFilter;
    @Output() filterChange: EventEmitter<AttributeValueFilter> = new EventEmitter();
    @Output() filterDeleted: EventEmitter<AttributeValueFilter> = new EventEmitter();
    showContent = true;
    private titlePrefix = 'Attribute: ';

    constructor(private fb: FormBuilder) {
        this.attributeFilterForm = this.fb.group({ name: '', value: '' }, { validator: this.attributeFormValidator });
    }

    ngOnInit() {
        this.setTitle();
        if (this.filter) {
            this.attributeFilterForm.setValue({ name: this.filter.attributeName || '', value: this.filter.attributeValue || '' });
        } else {
            this.filter = {};
        }
    }

    apply() {
        this.attributeFilterForm.updateValueAndValidity();
        if (this.attributeFilterForm.valid) {
            this.filter.attributeName = this.attributeFilterForm.value.name;
            this.filter.attributeValue = this.attributeFilterForm.value.value;
            this.setTitle();
            this.filterChange.emit(this.filter);
            this.close();
        } else {
            this.attributeFilterForm.markAsTouched();
        }
    }
    close() {
        this.showContent = false;
    }

    clear() {
        this.attributeFilterForm.reset({ name: '', value: '' });
    }

    cancel() {
        this.attributeFilterForm.reset({
            name: this.filter.attributeName,
            value: this.filter.attributeValue
        });
        this.close();
    }

    delete() {
        this.filterDeleted.emit(this.filter);
    }

    attributeFormValidator(fg: FormGroup): ValidationErrors | null {
        if (!fg.value.name && !fg.value.value) {
            return { 'atLeastOneRequired': 'Must supply at least a name or a value.' }
        } else {
            return null;
        }
    }

    private setTitle() {
        this.title = `${this.titlePrefix}` + (this.filter ? this.filter.attributeName && this.filter.attributeValue ?
            `Name: ${this.filter.attributeName} - Value: ${this.filter.attributeValue}` : this.filter.attributeName ?
                `Name: ${this.filter.attributeName}` : this.filter.attributeValue ? `Value: ${this.filter.attributeValue}` : '' : '');
    }

}
