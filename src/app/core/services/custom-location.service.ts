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
import { Inject, Injectable } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { WINDOW } from 'app/core/core.module';

export interface HistoryState {
  [key: string]: any;
}


@Injectable()
/**
 * Class created to polyfill replacing browser History until Angular updates
 */
export class CustomLocation extends Location {

  constructor(private platformStrategy: LocationStrategy, @Inject(WINDOW) private w: any) {
    super(platformStrategy);
  }

  /**
   * This function was overriden to polyfill the fact that Angular as of v4.2.0.rc.1 currently doesn't support setting history state.
   * @param path path of the url to replace
   * @param query query params
   */
  public replaceState(path: string, query: string = ''): void {
    const currentState = this.getHistoryState();
    this.platformStrategy.replaceState(currentState || null, '', path, query);
  }

  /**
   * Use this function if you want to replace the current history state.
   * Created as a polyfill until Angular accepts my Issue/PR @KeniSteward
   * @param state The state you want to set the history state API to
   * @param title the title of the state
   * @param url the url that will replace the current url
   * @param queryParams query params for the url
   */
  public updateHistoryState(state: any, title: string, url: string, queryParams: string = '') {
    this.platformStrategy.replaceState(state, title, url, queryParams);
  }

  /**
   * Merges the own properties of the state that is passed in into the current history state and then replaces
   * the current state with the new merged state.
   * @param state State that you want to merge into the current history state
   */
  public mergeState(state: any) {
    let curr = this.getHistoryState();

    curr = curr || {};

    Object.keys(state).forEach((key) => {
      // functions can't be appeneded to history state
      if (typeof state[key] !== 'function') {
        curr[key] = state[key];
      }
    });

    this.updateHistoryState(curr, '', this.path(true), '');
  }

  public getHistoryState(): HistoryState {
    return this.w.history.state;
  }

  /**
   * Use this function if you want to actually set the state while pushing a new history entry.
   * Created as a polyfill until Angular accepts my Issue/PR @KeniSteward
   * @param state The state you want to set the history state API to
   * @param title the title of the state
   * @param url the url that will be pushed onto history
   * @param queryParams query params for the url
   */
  public createHistoryState(state: any, title: string, url: string, queryParams: string = '') {
    this.platformStrategy.pushState(state, title, url, queryParams);
  }

}
