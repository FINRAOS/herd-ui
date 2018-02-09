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
import { SampleDataPage } from './sampledata.po';
import {browser} from 'protractor';
const fs = require('fs');
const conf = require('./../../../config/conf.e2e.json');

// This can only be run locally.
describe('Bdef sample data', () => {
    let page: SampleDataPage;
    const _url =  conf.dataEntityDetailPath;
    const file1 = 'C:/Temp/test1.csv';
    const file2 = 'C:/Temp/test2.csv';
    const filex = 'C:/Temp/testX.csv';

  beforeEach(() => {

    page = new SampleDataPage();
  });

  it('should display available icon when files exist and download file from S3', async () => {
    await page.navigateTo(_url + '/NODE_TEST/SAMPLE_FILES_1');
    await validateDownload(file1, 'A,B,C');
  });

  it('should download first file from S3 when multiple files exist', async () => {
    await page.navigateTo(_url + '/NODE_TEST/SAMPLE_FILES_2');
    await validateDownload(file2, 'A,B,C,D');
  });

  it('should result in error when file no longer in S3', async () => {
    // Load page
    await page.navigateTo(_url + '/NODE_TEST/SAMPLE_FILES_X');
    if (fs.existsSync(filex)) {
    // Make sure the browser doesn't have to rename the download.
    fs.unlinkSync(filex);
    }
    await page.sampleDataButton.click();
    // await download and validate no file
    browser.sleep(2000);
    expect(fs.existsSync(filex)).toBeFalsy();
  });

  it('should display disabled icon when no files exist', async () => {
    await page.navigateTo(_url + '/NODE_TEST/SAMPLE_FILES_0');
    await expect(page.sampleDataButtonColor.getCssValue('color')).toBe(page.inactiveIconColor);
  });

  async function validateDownload(file, data) {
    await expect(page.sampleDataButtonColor.getCssValue('color')).toBe(page.activeIconColor);
    await expect(page.watchButtonColor.getCssValue('color')).toBe(page.inactiveIconColor);
    if (fs.existsSync(file)) {
    // Make sure the browser doesn't have to rename the download.
    fs.unlinkSync(file);
    }
    await page.sampleDataButton.click();
    // await download
    await browser.driver.wait(function () {
      // Wait until the file has been downloaded.
    // We need to wait thus as otherwise protractor has a nasty habit of
    // trying to do any following tests while the file is still being
    // downloaded and hasn't been moved to its final location.
    return fs.existsSync(file);
    }, 30000).then(function () {
    // Do whatever checks you need here.  This is a simple comparison;
    // for a larger file you might want to do calculate the file's MD5
    // hash and see if it matches what you expect.
    expect(fs.readFileSync(file, {encoding: 'utf8'})).toEqual(data);
    });
  }
});
