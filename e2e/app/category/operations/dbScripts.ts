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
export class DbScripts {

  constructor() {
  }

  public categoryDbScript(index) {
    switch (index) {
      case 0:
        return this.query(
          'DELETE FROM tag_prnt WHERE tag_id IN (SELECT t.tag_id FROM tag t INNER JOIN tag_prnt tp ' +
          'ON t.tag_id = tp.tag_id WHERE t.tag_type_cd IN (\'Bb_Test_CTGRY\'))');
      case 1:
        return this.query('DELETE FROM bus_objct_dfntn_tag WHERE tag_id IN(SELECT tag_id FROM tag ' +
          'WHERE tag_type_cd IN(\'Bb_Test_CTGRY\')');
      case 2:
        return this.query(
          'DELETE FROM bus_objct_dfntn_tag WHERE bus_objct_dfntn_id IN(SELECT bus_objct_dfntn_id ' +
          'FROM bus_objct_dfntn WHERE name_space_cd = \'NS_PROTRACTOR_TEST_TAG\')');
      case 3:
        return this.query('DELETE FROM tag WHERE tag_type_cd ' +
          'IN(\'Bb_Test_CTGRY\', \'BbbCCCDDCEEE_bdef_CTGRY\', \'BbCCDDEE_Test_CTGRY\')');
      case 4:
        return this.query('DELETE FROM tag_type WHERE tag_type_cd ' +
          'IN(\'Bb_Test_CTGRY\', \'BbbCCCDDCEEE_bdef_CTGRY\', \'BbCCDDEE_Test_CTGRY\')');
      case 5:
        return this.query('DELETE FROM bus_objct_dfntn WHERE name_space_cd = \'NS_PROTRACTOR_TEST_TAG\'');
      case 6:
        return this.query('DELETE FROM data_prvdr WHERE data_prvdr_cd = \'DP_PROTRACTOR_TEST_TAG\'');
      case 7:
        return this.query('DELETE FROM name_space WHERE name_space_cd = \'NS_PROTRACTOR_TEST_TAG\'');
    }
  }

  private query(queryInput: string) {
  }

}

