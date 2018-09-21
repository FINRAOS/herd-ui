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
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { PartitionValueFilter } from '@herd/angular-client';
import { merge } from 'rxjs';
import { pairwise } from 'rxjs/operators';

@Component({
    selector: 'sd-partition-filter',
    templateUrl: './partition-filter.component.html',
    styleUrls: ['./partition-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartitionFilterComponent implements OnInit, OnChanges {
    @Input() filter: PartitionValueFilter;
    @Output() filterChange = new EventEmitter<PartitionValueFilter>();
    @Output() filterDeleted = new EventEmitter<PartitionValueFilter>();
    showValidation = false;
    showContent = true;
    titlePrefix = 'Partition:';
    title = '';
    partitionFilterForm: FormGroup;
    get filterAsFormValues() {
        if (this.filter) {
            return {
                key: this.filter.partitionKey || '',
                value: this.filter.partitionValues && this.filter.partitionValues.join(',') || '',
                min: this.filter.partitionValueRange && this.filter.partitionValueRange.startPartitionValue || '',
                max: this.filter.partitionValueRange && this.filter.partitionValueRange.endPartitionValue || ''
            };
        } else {
            return {
                key: '',
                value: '',
                min: '',
                max: ''
            };
        }
    }

    constructor(private fb: FormBuilder) {
        this.partitionFilterForm = this.fb.group({ key: '', value: '', min: '', max: '' },
            { validator: this.partitionFormValidator });

        this.partitionFilterForm.get('value').valueChanges.subscribe((val) => {
            if (!val) {
                this.partitionFilterForm.get('min').enable({ emitEvent: false });
                this.partitionFilterForm.get('max').enable({ emitEvent: false });
            } else {
                this.partitionFilterForm.get('min').disable({ emitEvent: false });
                this.partitionFilterForm.get('max').disable({ emitEvent: false });
            }
        });

        // collect all changes from min and max and compare them 2 at a time.
        // if 2 changes 1 after the other are falsey that means we are allowed to
        // change the partitionValue again
        merge(this.partitionFilterForm.get('max').valueChanges,
            this.partitionFilterForm.get('min').valueChanges)
            .pipe(pairwise()).subscribe((val) => {
                if (!val.filter((minOrMax) => {
                    return !!minOrMax;
                }).length) {
                    this.partitionFilterForm.get('value').enable({ emitEvent: false });
                } else {
                    this.partitionFilterForm.get('value').disable({ emitEvent: false });
                }
            });
    }

    ngOnInit() {
        this.setTitle();
        if (this.filter) {
            this.partitionFilterForm.setValue(this.filterAsFormValues);
        } else {
            this.filter = {};
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filter'] && !changes['filter'].firstChange) {
            this.filter = changes['filter'].currentValue;
            this.partitionFilterForm.reset(this.filterAsFormValues);
        } else {
            this.filter = {};
            this.clear();
        }

        this.setTitle();
    }

    clear() {
        this.partitionFilterForm.reset({ key: '', value: '', min: '', max: '' });
    }

    delete() {
        this.filterDeleted.emit(this.filter);
    }

    cancel() {
        this.partitionFilterForm.reset(this.filterAsFormValues);
        this.close();
    }

    apply() {
        this.partitionFilterForm.updateValueAndValidity();
        if (this.partitionFilterForm.valid) {

            if (this.partitionFilterForm.value.value) {
                this.filter = {
                    partitionKey: this.partitionFilterForm.value.key,
                    partitionValues: this.partitionFilterForm.value.value.split(','),
                };
            } else {
                this.filter = {
                    partitionKey: this.partitionFilterForm.value.key,
                    partitionValueRange: {
                        startPartitionValue: this.partitionFilterForm.value.min,
                        endPartitionValue: this.partitionFilterForm.value.max
                    }
                };
            }

            this.setTitle();
            this.filterChange.emit(this.filter);
            this.close();
        } else {
            Object.keys(this.partitionFilterForm.controls).forEach((key) => {
                this.partitionFilterForm.controls[key].markAsTouched();
            })
        }
    }

    close() {
        this.showContent = false;
    }

    partitionFormValidator(fg: FormGroup): ValidationErrors | null {
        fg.markAsUntouched();
        let retval: ValidationErrors;
        const keyCtrl = fg.controls['key'];
        const valCtrl = fg.controls['value'];
        const minCtrl = fg.controls['min'];
        const maxCtrl = fg.controls['max'];
        if (!keyCtrl.value) {
            retval = { ...retval, keyRequired: 'Partition Key is required.' };
        }

        // If there is no partitionValue set check to see if we have min and max values set
        if (!valCtrl.value) {
            if (minCtrl.value && maxCtrl.value) {
                // if we have min and max values set check to make sure that the min value is less than the max
                if (minCtrl.value > maxCtrl.value) {
                    retval = { ...retval, rangeStartTooLarge: 'Min value must be smaller than max value.' }
                }
                // if we only have 1 value for min or max let them know that you have to send both
            } else if (minCtrl.value || maxCtrl.value) {
                retval = { ...retval, fullRangeRequired: 'Min and Max values are required' }
            } else {
                // this is the case that we have no values at all.
                retval = { ...retval, valueRequired: 'Must enter a partition value set or min value max value set.' }
            }
        }

        return retval || null;
    }

    private setTitle() {
        let tempTitle = '';
        if (this.filter) {
            if (this.filter.partitionValues) {
                tempTitle = `${this.filter.partitionKey}: ${this.filter.partitionValues.join(',')}`
            } else if (this.filter.partitionValueRange) {
                tempTitle = `${this.filter.partitionKey}: ` +
                    `${this.filter.partitionValueRange.startPartitionValue} - ${this.filter.partitionValueRange.endPartitionValue}`
            }
        }

        this.title =  this.titlePrefix + (tempTitle ? ' ' + tempTitle : tempTitle);
    }

}
