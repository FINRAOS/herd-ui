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


export default {
  dataPrefix: process.env.CURRENT_BROWSER || '',
  uniqueId() {
    // Retrieve today's date in the format of YYYYMMDD (ex. 20181214)
    const today = new Date().toJSON().slice(0, 10).replace(/-/g, '');
    // Generate a 4-digit random in the range of [1000, 9999]
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    // concatenate today and 4-digit number
    return '_' + today + '_' + randomNumber;
  }
};
