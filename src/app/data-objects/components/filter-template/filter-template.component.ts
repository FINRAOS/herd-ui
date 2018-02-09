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

@Component({
  selector: 'sd-filter-template',
  templateUrl: './filter-template.component.html',
  styleUrls: ['./filter-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTemplateComponent implements OnInit {

  @Input() title: string;
  @Input() isFilterContentShown: boolean;
  @Output() isFilterContentShownChange: EventEmitter<boolean> = new EventEmitter();
  @Output() removeFilter: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    // make shown by default
    if ( this.isFilterContentShown === null || this.isFilterContentShown === undefined) {
      this.isFilterContentShown = true;
    }
  }

  toggleContent() {
    this.isFilterContentShown = !this.isFilterContentShown;
    this.isFilterContentShownChange.emit(this.isFilterContentShown);
  }

  remove() {
    this.removeFilter.emit(null);
  }

}
