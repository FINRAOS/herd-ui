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
/**
 * SQL queries grouped by (!) each table
 */

export default {

  cnfgn: {
    // Use [configurationName, configurationValue]
    insertCnfgn: 'INSERT INTO cnfgn values($1,$2,null)',
    // Use [configurationName]
    deleteCnfgn: 'DELETE FROM cnfgn where cnfgn_nm = $1',
    // Use [configurationName, configurationValue]
    updateCnfgn: 'UPDATE cnfgn SET cnfgn_value_ds = $2 WHERE cnfgn_key_nm = $1'
  }


};
