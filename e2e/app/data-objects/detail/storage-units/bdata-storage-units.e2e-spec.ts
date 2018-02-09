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

import { DataManager } from '../../../../util/DataManager';
import { DataObjectDetailPage } from '../data-object-detail.po';
import { S3Manager } from '../../../../util/S3Manager';
import { BaseDetail } from '../base-detail';
import { Data } from './operations/data';
import { Operations } from './operations/operations';

describe('data-objects storage units', function () {

  const constants = require('./../../../../config/conf.e2e.json');
  const baseDetail = new BaseDetail();
  const dataManager = new DataManager();
  const s3m = new S3Manager();
  const operations = new Operations();
  const data = new Data();
  const page = new DataObjectDetailPage();

  let storageUnitsTag;
  let storageUnitsRepeater;

  beforeAll(async () => {
    // set up initial data
    // create required files then create the corresponding storage unit data-objects
    const s3Requests = operations.AWSRequests();
    s3Requests.options.map(function (op) {
      s3m.createObject(op);
      const requests = operations.postRequests();
      return dataManager.setUp(requests.options);
    });

    storageUnitsTag = page.storageUnitsSection;
    storageUnitsRepeater = page.storageUnitsRepeater;

  });

  afterAll(async () => {
    // delete initial data
    // requests have deleteFiles=true so explicit S3Manager deletes are not required
    const requests = operations.deleteRequests();
    dataManager.tearDown(requests.options);
  });

  describe(
    'static checks: BData details page'
    , () => {

      beforeAll(async () => {
        await baseDetail.initiateBrowser(data.versionTestV2, null, 0, 3);
      });

      it('static checks: BData details page', async () => {
          expect(await page.storageUnitsSectionLabel.getText()).toBe('Storage Units');
          expect(await page.getSingleStorageUnit(0).columnsLabel.getText()).toBe('Storage name\nStatus\nDetails');
          expect(await page.getSingleStorageUnit(0).filesSectionLabel.getText()).toBe('Files');
          expect(await page.getSingleStorageUnit(0).filesSectionColumnsLabel.getText()).toBe('File path\nFile size\nRows');
          /*element.all(by.tagName('select')).getInnerHtml().then(function (text) {
            expect(text.length).toBe(0);
          });*/
        });

      it('single storage unit checks, bucket name: BData details page', async () => {
          expect(await storageUnitsRepeater.count()).toBe(1);
          const unit = page.getSingleStorageUnit(0);
          expect(await unit.storageName).toBe(data.versionTestV2.storageUnits[0].storageName);
          expect(await unit.storageStatus).toBe('ENABLED');
          expect(await unit.bucketNameLabel.isPresent()).toBe(true);
          // TODO put bucket name back here but as variable @ani
          expect(await unit.bucketNameLabel.getText()).toContain('{{bucketnamehere}}');
          expect(await unit.directoryPath).toBe(data.versionTestV2.storageUnits[0].storageDirectory.directoryPath);
        });

      it('single storage unit checks, file: BData details page'
        , async () => {
          const file = page.getSingleStorageUnit(0).getSingleFile(0);
          expect(await page.getSingleStorageUnit(0).filesRepeater.count()).toBe(data.versionTestV2.storageUnits[0].storageFiles.length);
          expect(await file.filePath).toBe(data.versionTestV2.storageUnits[0].storageFiles[0].filePath);
          expect(await file.fileSize)
            .toBe((data.versionTestV2.storageUnits[0].storageFiles[0].fileSizeBytes / 1024).toPrecision(1) + ' kB');
          expect(await file.rowCount).toBe(data.versionTestV2.storageUnits[0].storageFiles[0].rowCount.toString());
        });

    });

  describe('A single storage unit with multiple files', () => {

    it('single storage unit, multiple files, file: BData details page',
      async () => {
        await baseDetail.initiateBrowser(data.versionTestV2, null, 0, 3);
        const unit = page.getSingleStorageUnit(0);
        expect(await unit.filesRepeater.count()).toBe(2);

        const expectedUnit = data.versionTestV2.storageUnits[0];
        const f1 = unit.getSingleFile(0);
        expect(await f1.filePath).toBe(expectedUnit.storageFiles[0].filePath);
        expect(await f1.fileSize).toBe((expectedUnit.storageFiles[0].fileSizeBytes / 1024).toPrecision(1) + ' kB');
        expect(await f1.rowCount).toBe('1'); //  didn't put a row count in for the auto generated file

        const f2 = unit.getSingleFile(1);
        expect(await f2.filePath).toBe(expectedUnit.storageFiles[1].filePath);
        expect(await f2.fileSize).toBe((expectedUnit.storageFiles[1].fileSizeBytes / 1024).toPrecision(1) + ' kB');
        expect(await f2.rowCount).toBe('1'); //  didn't put a row count in for the auto generated file

        /*const f3 = unit.getSingleFile(2);
        expect(await f3.filePath).toBe(expectedUnit.storageFiles[2].filePath);
        expect(await f3.fileSize).toBe((expectedUnit.storageFiles[2].fileSizeBytes / 1024).toPrecision(1) + ' kB');
        expect(await f3.rowCount).toBe('');*/ //  didn't put a row count in for the auto generated file
      });

  });

  describe('multiple storage units', () => {

    it('multiple storage unit, multiple files, file: BData details page', async () => {
      // await baseDetail.initiateBrowser(data.multipleStorageUnits);
      await baseDetail.initiateBrowser(data.versionTestV2, null, 0, 3);

      const expectedUnit2 = data.versionTestV2.storageUnits[0]; // non s3
      const expectedUnit1 = data.versionTestV2.storageUnits[1]; // s3

      expect(await page.storageUnitsRepeater.count()).toBe((data.versionTestV2.storageUnits.length - 1));
      const unit1 = page.getSingleStorageUnit(0);
      expect(await unit1.storageName).toBe(expectedUnit1.storageName);
      expect(await unit1.storageStatus).toBe('ENABLED');
      expect(await unit1.bucketNameLabel.isPresent()).toBe(true);
      expect(unit1.bucketNameLabel.getText()).toBe(s3m.bucketName);
      expect(await unit1.directoryPath).toBe(expectedUnit1.storageDirectory.directoryPath);

      const unit2 = page.getSingleStorageUnit(1);
      expect(await unit2.bucketNameLabel.isPresent()).toBe(false);
      expect(await unit2.storageName).toBe(expectedUnit2.storageName);
      expect(await unit2.storageStatus).toBe('ENABLED');
      expect(await unit2.directoryPath).toBe(expectedUnit2.storageDirectory.directoryPath);

      expect(await unit1.filesRepeater.count()).toBe(1);
      const s3File = unit1.getSingleFile(0);
      expect(await s3File.filePath).toBe(expectedUnit1.storageFiles[0].filePath);
      expect(await s3File.fileSize)
        .toBe((expectedUnit1.storageFiles[0].fileSizeBytes / 1024).toPrecision(1) + ' kB');
      expect(await s3File.rowCount).toBe(''); // didn't set row count

      expect(await unit2.filesRepeater.count()).toBe(1);
      const file = unit2.getSingleFile(0);
      expect(await file.filePath).toBe(expectedUnit2.storageFiles[0].filePath);
      expect(await file.fileSize)
        .toBe((expectedUnit2.storageFiles[0].fileSizeBytes / 1024).toPrecision(1) + ' kB');
      expect(await file.rowCount).toBe(''); //  didn't set row count
    });
  });

  describe('multiple storage unit, multiple files, file: BData details page', () => {
    it('No files found', async () => {
      // await baseDetail.initiateBrowser(data.noStorageFiles);
      await baseDetail.initiateBrowser(data.versionTestV2, null, 0, 1);
      expect(await page.getSingleStorageUnit(0).emptyFilesLabel.getText()).toEqual('No files found');
    });

  });

});
