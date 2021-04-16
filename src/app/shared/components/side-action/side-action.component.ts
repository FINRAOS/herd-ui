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
import { Component, Input, OnInit } from '@angular/core';

export class Action {
  /**
   * @parameter icon string representing the icon
   * @parameter label string representing the label for the action
   * @parameter onAction optional call back function to be executed when the action is clicked
   * @parameter isDisabled Function to control whether or not the action should occur
   */
  constructor(public icon: string,
              public label: string,
              public onAction?: () => any,
              public isDisabled?: boolean | (() => boolean)) {
  }
}

@Component({
  selector: 'sd-side-action',
  templateUrl: './side-action.component.html',
  styleUrls: ['./side-action.component.scss']
})
export class SideActionComponent implements OnInit {

  @Input() action: Action;

  constructor() {
  }

  ngOnInit() {

  }

  public checkDisabled(): boolean {

    if (this.action.onAction) {
      // make enabled if nothing is passed in otherwise use the passed in variable
      if (typeof this.action.isDisabled === 'boolean') {
        return this.action.isDisabled;
      } else if (typeof this.action.isDisabled === 'function') {
        // make sure to just pass back true or false and not a value
        return !!this.action.isDisabled();
      } else {
        // if action exists by default make enabled
        return false;
      }
    }
    // by default make disabled if no action exists
    return true;
  }

}

