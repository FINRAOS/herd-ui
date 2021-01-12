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
import utils from '../../../util/utils';

const uniqueId = utils.uniqueId();

export default {
  description: 'Sample description text for testing purpose. Used for all description fields',
  searchBoxDescription: 'I can help you to find anything you want!',
  tagTypeCode1: function () {
    const randomNumber = Math.floor(Math.random()*9000) + 1000;
    const tagTypeCode1 = {
        'code': 'Aa_Test1_CTGRY' + uniqueId,
        'displayName': 'Aa Test1 Category' + randomNumber,
        'description': 'Test description 1',
        'order': '-50',
        'tags': [
          {
            'code': 'BMW',
            'displayName': 'Bavarian Motor Works',
            'parentCode': ''
          },
          {
            'code': 'CHVY',
            'displayName': 'Chevrolet',
            'parentCode': 'BMW'
          },
          {
            'code': 'TYTA',
            'displayName': 'Toyota',
            'parentCode': ''
          },
          {
            'code': 'FORD',
            'displayName': 'FORD COMPANY',
            'parentCode': ''
          }
        ]
      };
      return tagTypeCode1;
    }

  ,

  tagTypeCode2: function () {
      const randomNumber = Math.floor(Math.random()*9000) + 1000;
      const tagTypeCode2 = {
        'code': 'Aa_Test2_CTGRY' + uniqueId,
        'displayName': 'Aa Test2 Category' + randomNumber,
        'description': 'Test description 2',
        'order': '-49',
        'tags': [
          {
            'code': 'BMW', 'displayName': 'Bavarian Motor Works', 'parentCode': ''
          }, {
            'code': 'CHVY', 'displayName': 'Chevrolet',
            'parentCode': 'BMW'
          }, {
            'code': 'TYTA', 'displayName': 'Toyota', 'parentCode': ''
          }
        ]
      };
      return tagTypeCode2;
    }

  ,

  tagTypeCode3: function () {
      const randomNumber = Math.floor(Math.random()*9000) + 1000;
      const tagTypeCode3 = {
        'code': 'Aa_Test3_CTGRY' + uniqueId,
        'displayName': 'Aa Test3 Category' + randomNumber,
        'description': 'Test description 3',
        'order': '-48',
        'tags': [
          {
            'code': 'FORD', 'displayName': 'Ford Company', 'parentCode': ''
          }, {
            'code': 'TestTag1', 'displayName': 'Test Tag1 Company', 'parentCode': ''
          }, {
            'code': 'TestTag2', 'displayName': 'Test Tag2 Company', 'parentCode': ''
          }, {
            'code': 'SEDAN', 'displayName': 'Sedan Model Cars',
            'parentCode': 'FORD'
          }, {
            'code': 'FORD FUSION', 'displayName': 'Famous Ford Fusion',
            'parentCode': 'SEDAN'
          }
        ]
      };
      return tagTypeCode3;
    }

  ,

   tagTypeCode4: function () {
      const randomNumber = Math.floor(Math.random()*9000) + 1000;
      const tagTypeCode4 = {
        'code': 'Bb_Test4_CTGRY' + uniqueId,
        'displayName': 'Bb Test4 Category' + randomNumber,
        'description': 'Test description 4',
        'order': '-47',
        'tags': [
          {
            'code': 'Category4Tag1',
            'displayName': 'Category 4 Tag 1',
            'parentCode': ''
          },
          {
            'code': 'Category4Tag2',
            'displayName': 'Category 4 Tag 2',
            'parentCode': ''
          },
          {
            'code': 'Category4Tag3',
            'displayName': 'Category 4 Tag 3',
            'parentCode': ''
          },
          {
            'code': 'Category4Tag4',
            'displayName': 'Category 4 Tag 4',
            'parentCode': ''
          }
        ]
      };
      return tagTypeCode4;
    }

  ,

   tagTypeCode5: function () {
      const randomNumber = Math.floor(Math.random()*9000) + 1000;
      const tagTypeCode5 = {
        'code': 'bb_Test5_CTGRY' + uniqueId,
        'displayName': 'Bb Test5 Category' + randomNumber,
        'description': 'Test description 5',
        'order': '-46',
        'tags': [
          {
            'code': 'Category5Tag1',
            'displayName': 'Category 5 Tag 1',
            'parentCode': ''
          },
          {
            'code': 'Category5Tag2',
            'displayName': 'Category 5 Tag 2',
            'parentCode': ''
          },
          {
            'code': 'Category5Tag3',
            'displayName': 'Category 5 Tag 3',
            'parentCode': ''
          },
          {
            'code': 'Category5Tag4',
            'displayName': 'Category 5 Tag 4',
            'parentCode': ''
          },
          {
            'code': 'Category5Tag5',
            'displayName': 'Category 5 Tag 5',
            'parentCode': ''
          },
          {
            'code': 'Category5Tag6',
            'displayName': 'Category 5 Tag 6',
            'parentCode': ''
          },
          {
            'code': 'Category5Tag7',
            'displayName': 'Category 5 Tag 7',
            'parentCode': ''
          }
        ]
      };
      return tagTypeCode5;
    }
  ,

   tagTypeCode6: function () {
      const randomNumber = Math.floor(Math.random()*9000) + 1000;
      const tagTypeCode6 = {
        'code': 'Bb_Test6_CTGRY' + uniqueId,
        'displayName': 'Bb Test6 Category' + randomNumber,
        'description': 'Test description 6',
        'order': '-45',
        'tags': [
          {
            'code': 'Category6Tag1',
            'displayName': 'Category 6 Tag 1',
            'parentCode': ''
          },
          {
            'code': 'Category6Tag2',
            'displayName': 'Category 6 Tag 2',
            'parentCode': ''
          },
          {
            'code': 'Category6Tag3',
            'displayName': 'Category 6 Tag 3',
            'parentCode': ''
          },
          {
            'code': 'Category6Tag4',
            'displayName': 'Category 6 Tag 4',
            'parentCode': ''
          }
        ]
      };
      return tagTypeCode6;
    }
};
