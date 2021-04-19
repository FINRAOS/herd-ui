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
import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[sdFileDownloader]'
})
export class FileDownloaderDirective implements OnChanges {

  @Input() sampleDataFileUrl: string;

  constructor() {
  }

  public ngOnChanges(changesObj: SimpleChanges) {
    const urlChange = changesObj['sampleDataFileUrl'];
    if (!urlChange.isFirstChange() && urlChange.currentValue) {
      this.download(urlChange.currentValue);
    }
  }

  public download(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FileData';
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
