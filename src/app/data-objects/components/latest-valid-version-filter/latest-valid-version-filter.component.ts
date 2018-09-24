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
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sd-latest-valid-version-filter',
  templateUrl: './latest-valid-version-filter.component.html',
  styleUrls: ['./latest-valid-version-filter.component.scss']
})
export class LatestValidVersionFilterComponent implements OnInit {

  title = 'Latest Valid Version';
  @Output() filterDeleted: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  delete() {
    this.filterDeleted.emit('Latest Valid Version');
  }

}
