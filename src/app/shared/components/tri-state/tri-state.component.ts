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
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

export enum TriStateEnum {
  State1,
  State2,
  State3
}

@Component({
  selector: 'sd-tri-state',
  templateUrl: './tri-state.component.html',
  styleUrls: ['./tri-state.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriStateComponent implements OnInit {

  @Input() label: string;
  @Input() state: number;
  @Input() triStateId: number;
  @Output() propagate = new EventEmitter<Object>();

  constructor() {
  }

  ngOnInit() {
    if (!this.state) {
      this.state = TriStateEnum.State1;
    } else {
      this.state = this.state;
    }
  }

  public changeState() {
    this.state = (this.state + 1) % 3;
    this.propagate.emit({facetState: this.state});
  }

  public checkState() {
    let className: string;
    switch (this.state) {
      case TriStateEnum.State1:
        className = 'state-one';
        break;
      case TriStateEnum.State2:
        className = 'state-two';
        break;
      case TriStateEnum.State3:
        className = 'state-three';
        break;
      default:
        break;
    }

    return className;
  }

}
