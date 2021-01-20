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
import { NoAuthFrameData, OverviewPage } from './overview.po';
import { protractor } from 'protractor';
import { Data } from './operations/data';
import * as operations from './operations/operations';
import { DataManager } from './../../../util/DataManager';

const conf = require('./../../../config/conf.e2e.json');

const data = new Data();

describe('Data Entity Overview Page', () => {
  const page: OverviewPage = new OverviewPage();
  const dataManager = new DataManager();
  const _url = conf.dataEntityBdefPath;
  const expectedValues = {
    pageHeading: 'DATA ENTITY',
    heading: 'OVERVIEW',
    recommendedFormat: 'Recommended Format',
    descLabel: 'Description',
    noTagsMessage: 'No associated tags for this Data Entity',
    noTagsFoundMessage: 'No Categories Found',
    noSchemaMessage: 'No schema defined for this Data Entity'
  };

  const namespace = data.defaultNamespace;
  const dataProvider = data.defaultDataProvider;

  it('static header and data populated correctly', async () => {
    await page.navigateTo(_url.replace('{namespace}', namespace)
      .replace('{businessObjectDefinitionName}', data.bdefTest().businessObjectDefinitionName));
    await validate(data.bdefTest());

    // validate tags exist
    await expect((await page.totalEditorTags.get(0).getText()).trim()).toEqual(data.tagTypeCode().tags[0].displayName);
    await expect((await page.totalEditorTags.get(1).getText()).trim()).toEqual(data.tagTypeCode().tags[1].displayName);

    // mouse over to see the tooltop over button
    // await page.mouseEnterShim(await page._tagsEditorEl);
    await page.mouseEnterShim(await page.tags_button.get(0));
    await expect(page.tag_tooltip.isDisplayed()).toBeTruthy();
    await expect(page.tag_tooltip.getText()).toEqual(data.tagTypeCode().displayName);
    await page.mouseEnterShim(await page.tags_button.get(1));
    await expect(page.tag_tooltip.getText()).toEqual(data.tagTypeCode().displayName);

    // elevated priv whiteFrames should be there
    // TODO: fix test
    /*
    const frame1 = await page.findFormatFrame(data.bdefTestMultipleFormatVersions().businessObjectFormatUsage,
      data.bdefTestMultipleFormatVersions().businessObjectFormatFileType, '1', true);
    await expect(frame1).not.toBe(null);
    let headerText = await page.getFormatFrameHeaderText(frame1);
    await expect(headerText).toContain('Usage:');
    await expect(headerText).toContain('Filetype:');
    await expect(headerText).toContain('Version:');

    const frame2 = await page.findFormatFrame(data.bdefTestSingleFormatVersion().businessObjectFormatUsage,
      data.bdefTestSingleFormatVersion().businessObjectFormatFileType, '0', true);
    await expect(frame2).not.toBe(null);
    headerText = await page.getFormatFrameHeaderText(frame2);
    await expect(headerText).toContain('Usage:');
    await expect(headerText).toContain('Filetype:');
    await expect(headerText).toContain('Version:');
     */

    await page.mouseEnterShim(await page.getRecommendedFormatIconTooltipText());
    await expect(page.format_tooltip.getText()).toEqual(expectedValues.recommendedFormat);

    // There is attribute card present in the page
    await expect(page.attributes.getText()).toContain('User-defined Attributes');

  });

  it('static header and data populated correctly for optional data', async () => {
    await page.navigateTo(_url.replace('{namespace}', namespace)
      .replace('{businessObjectDefinitionName}', data.bdefNoTagsNoSchema().businessObjectDefinitionName));
    await validate(data.bdefNoTagsNoSchema());

    // validate no tags and no formats exist
    await expect((await page.noFormatsMessage).trim()).toEqual(expectedValues.noSchemaMessage);
    await expect((await page.noTagsMessage).trim()).toEqual(expectedValues.noTagsMessage);

    // There are no atrubutes present, so it will not find nay
    await expect(page.attributes.isPresent()).toBeFalsy();
  });

  describe('Lineage Display', () => {

    it('should show lineage button as active for a data entity with lineage', async () => {
      await page.navigateTo(_url.replace('{namespace}', namespace)
        .replace('{businessObjectDefinitionName}', data.bdefTest().businessObjectDefinitionName));

      await expect(page.modal.isPresent()).toBe(false);
      await expect(page.lineageButton.getAttribute('class')).toContain('enabled');
      await page.lineageButton.click();
      await expect(page.modal.isPresent()).toBe(true);

      await page.closeModal();
      await expect(page.modal.isPresent()).toBe(false);
    });

    it('should not show lineage button as active for a data entity without lineage', async () => {
      await page.navigateTo(_url.replace('{namespace}', namespace)
        .replace('{businessObjectDefinitionName}', data.bdefNoTagsNoSchema().businessObjectDefinitionName));

      await expect(page.lineageButton.getAttribute('class')).not.toContain('enabled');
    });
  });

  describe('editing a data entity', () => {
    const usg = data.formatTestEditDescriptiveFormat().businessObjectFormatUsage;
    const ftp = data.formatTestEditDescriptiveFormat().businessObjectFormatFileType;
    const ver = '0';

    const usg2 = data.formatTestEditDescriptiveFormat2().businessObjectFormatUsage;
    const ftp2 = data.formatTestEditDescriptiveFormat2().businessObjectFormatFileType;

    const newDisplayName = 'Test New Name';

    beforeAll(() => {
      // set up bdef formats
      dataManager.setUp(operations.postEditDescInfoTestData.options);
    });

    afterAll(() => {
      // remove recommended format in case any are left from failing tests
      dataManager.update(operations.clearEditDescInfoFrmt.options);

      dataManager.tearDown(operations.deleteEditDescInfoTestData.options);
    });

    describe('with proper credentials', () => {
      beforeAll(async () => {
        await page.navigateTo(_url.replace('{namespace}', namespace)
          .replace('{businessObjectDefinitionName}', data.editBdefTestData().businessObjectDefinitionName));
      });

      // precursor test
      // TODO: fix test
      /*
      it('should change format to on when format whiteframe is clicked ', async () => {

        // TODO: also add case for switching to check to make sure columns changes / lineage information is updated
        // verify tooltip, drill-down to format
        await expect(page.getFormatTooltipText(usg, ftp, ver)).toEqual('Click to view format');

        await expect(page.isDescriptiveFormat(usg, ftp, ver)).toBe(false);
        await expect(page.isDescriptiveFormat(usg2, ftp2, ver)).toBe(false);

        // toggle first on
        await page.toggleRecommendedFormat(usg, ftp, ver);
        await expect(page.isDescriptiveFormat(usg, ftp, ver)).toBe(true);
        await expect(page.isDescriptiveFormat(usg2, ftp2, ver)).toBe(false);

        // toggle first off
        await page.toggleRecommendedFormat(usg, ftp, ver);
        await expect(page.isDescriptiveFormat(usg, ftp, ver)).toBe(false);
        await expect(page.isDescriptiveFormat(usg2, ftp2, ver)).toBe(false);

        // toggle first on then toggle second to show a switch between 2 different formats
        await page.toggleRecommendedFormat(usg, ftp, ver);
        await page.toggleRecommendedFormat(usg2, ftp2, ver);
        await expect(page.isDescriptiveFormat(usg, ftp, ver)).toBe(false);
        await expect(page.isDescriptiveFormat(usg2, ftp2, ver)).toBe(true);
      });
       */

      it('should edit the displayName', async () => {
        const expectedName = data.editBdefTestData().displayName
          || data.editBdefTestData().businessObjectDefinitionName;
        await expect((await page.getBdefTitle()).trim()).toEqual(expectedName);
        await page.editDisplayName(newDisplayName);
        await expect((await page.getBdefTitle()).trim()).toEqual(newDisplayName);
      });

      it('test to validate Edit Categories associated with data entity', async () => {
        // Validate no tags message
        await expect((await page.noTagsMessage).trim()).toEqual(expectedValues.noTagsMessage);
        // Hover mouse on tags div
        await page.mouseOverShim(page._tagsEditorEl);
        // Validate edit Tags Icon
        await page.tagsEditIcon.click();

        // Select tag and validate delete option on the tag
        await page.selectTag.click();
        await page.dropDownItems.get(0).click();
        await expect(page.deSelectOption).toBeDefined();
        await page.deSelectOption.click();

        // Validate type ahead drop down with non existent tag
        await page.typeAheadDropDown.click();
        await page.typeAheadDropDown.sendKeys('NonExistentTag');
        await page.typeAheadDropDown.sendKeys(protractor.Key.ENTER);
        await expect((await page.noTagFoundMessage.getText()).trim()).toEqual(expectedValues.noTagsFoundMessage);

        // Validate type ahead drop down and select
        await page.typeAheadDropDown.click();
        await page.typeAheadDropDown.sendKeys(data.tagTypeCode().tags[0].displayName);
        // force firefox to fire update event
        await page.typeAheadDropDown.sendKeys(protractor.Key.SPACE);
        await page.typeAheadDropDown.sendKeys(protractor.Key.BACK_SPACE);
        // todo for firefox make sure the update actually happens for the change event to get it to
        // update the dropDownItems
        await expect(page.dropDownItems.count()).toEqual(1);
        await page.typeAheadDropDown.sendKeys(protractor.Key.ENTER);
        // ie still has the dropDown open and this will make sure to close it
        await page.typeAheadDropDown.sendKeys(protractor.Key.ESCAPE);
        await page.doneButton.click();

        // Validate that the tags are added to the data entity
        await expect((await page.totalEditorTags.get(0).getText()).trim()).toEqual(data.tagTypeCode().tags[0].displayName);
        await expect(page.totalEditorTags.count()).toEqual(1);
      });
    });

    // TODO: fix test
    /*
    describe('without proper credentials', () => {
      beforeAll(async () => {
        // without permissions to edit
        await page.navigateTo(_url.replace('{namespace}', namespace).replace('{businessObjectDefinitionName}',
          data.editBdefTestData().businessObjectDefinitionName),
          conf.noAccessUser, conf.noAccessPassword);
      });
     */

      // NOTE: this test assumes the previous test (precursor test) has fully passed and leaves the second format as descriptive
      it('should not be able to select format for recommendation with out proper credentials', async () => {
        const expectedData: NoAuthFrameData = {
          headerText: 'Recommended Format',
          usageData: usg2,
          fileTypeData: ftp2,
          fileTypeFormatProperty: 'File Type',
          UsageFormatProperty: 'Usage'
        };

        await expect(page.getNoAuthFormatsFrameData(usg2, ftp2)).toEqual(expectedData);
        // elevated priv whiteFrames shouldn't be there
        const formatFrame = await page.findFormatFrame(usg2, ftp2, ver, true);
        await expect(formatFrame).toEqual(null);
      });

      it('should not be able to edit the displayName', async () => {
        // TODO: fix this test
        // await expect(page.canEditDisplayName()).toBe(false);
        await expect(page.getBdefTitle()).toBe(newDisplayName);
      });

      it('should not be able to edit Categories', async () => {
        // TODO: fix test
        //await expect(page.canEditCategories()).toBe(false);
      });
    });

    describe(' description suggestion', () => {

      it(' should not show suggestion button to unauthorized users', async () => {
        // without permissions to edit
        await page.navigateTo(_url
            .replace('{namespace}', namespace)
            .replace('{businessObjectDefinitionName}', data.bdefNoTagsNoSchema().businessObjectDefinitionName),
          conf.noAccessUser, conf.noAccessPassword);

        // Notice we are using isDisplayed here as the element will present but not displayed due to permission
        // TODO: fix test
        // await expect(page.suggestionButton.isDisplayed()).toBeFalsy();
      });

      it(' should not show suggestion button if there are no pending suggestion', async () => {
        await page.navigateTo(_url
            .replace('{namespace}', namespace)
            .replace('{businessObjectDefinitionName}', data.bdefTest().businessObjectDefinitionName));

        // Notice we are using isPresent here as the element will not present at all
        await expect(page.suggestionButton.isPresent()).toBeFalsy();
      });

      it(' should show suggestion button and able to edit, save and approve suggestion', async () => {
        await page.navigateTo(_url
          .replace('{namespace}', namespace)
          .replace('{businessObjectDefinitionName}', data.bdefNoTagsNoSchema().businessObjectDefinitionName));

        await expect((page.isDisplayedShim(page.suggestionButton))).toBeTruthy();
        await expect((page.suggestionButton.getText())).toEqual('review suggestion');

        // click the button and test the model window
        await page.suggestionButton.click();
        await expect((page.suggestionComponent.getText())).toContain('green contents for text addition');
        await expect((page.suggestionComponent.getText())).toContain('red contents for text removal');

        // Test if suggestion window is present and accessable
        await expect((page.suggestionApproveButton)).toBeTruthy();
        // TODO: fix test
        //await expect((page.suggestionDiffCard.getText()))
        //  .toContain('Leveprage agile fotramewctorks to provide a robust synopsis for hiugh lgevel stioverviews.n');

        await expect(page.isDisplayedShim(page.suggestionApproveButton)).toBeTruthy();
        await page.suggestionCard.click();
        await expect(page.suggestionSaveButton.isPresent()).toBeTruthy();

        await page.suggestionCancelButton.click();

        await page.suggestionApproveButton.click();
        await expect(page.suggestionButton.isPresent()).toBeFalsy();

      });

    });

  });

  async function validate(bdef) {
    await expect((await page.heading).trim()).toBe(expectedValues.pageHeading);
    await expect(page.getBdefTitle()).toBe(bdef.displayName);
    await expect(page.auditDetails.getText()).not.toEqual('');
    await expect((await page.overviewTab.getText()).trim()).toBe(expectedValues.heading);
    await expect(page.dataProvider.getText()).toBe(bdef.dataProviderName);
    await expect((await page.physicalName.getText()).trim()).toBe(bdef.businessObjectDefinitionName);
    await expect((await page.namespace.getText()).trim()).toBe(bdef.namespace);
    await expect(page.descLabel.getText()).toBe(expectedValues.descLabel);
    await expect(page.getDescription()).not.toEqual('');
  }
});
