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
import { SimpleChanges } from '@angular/core';
import { FileDownloaderDirective } from './file-downloader.directive';

describe('FileDownloaderDirective', () => {
  it('should create an instance', () => {
    const directive = new FileDownloaderDirective();
    expect(directive).toBeTruthy();
  });

  it('should call download file when url changes and does not when invalid', () => {
    const directive = new FileDownloaderDirective();
    directive.sampleDataFileUrl = 'http://herd-ui.test';
    let fc = true;
    const downloadSpy = spyOn(directive, 'download');
    const changeObj: SimpleChanges = {
      sampleDataFileUrl : {
        currentValue : 'http://test.url',
        previousValue : directive.sampleDataFileUrl,
        firstChange: true,
        isFirstChange : () => fc
      }
    };

    // download should not be called on the first change
    directive.ngOnChanges(changeObj);
    expect(downloadSpy).not.toHaveBeenCalled();

    // download should not be called when url is empty
    fc = false;
    changeObj.sampleDataFileUrl.currentValue = '';
    directive.ngOnChanges(changeObj);
    expect(downloadSpy).not.toHaveBeenCalled();

    // download should get called when the value changes
    changeObj.sampleDataFileUrl.currentValue = 'http://newval.url';
    directive.ngOnChanges(changeObj);
    expect(downloadSpy).toHaveBeenCalledWith(changeObj.sampleDataFileUrl.currentValue);
  });
});
