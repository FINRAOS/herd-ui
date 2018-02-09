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
export class HighlightDisplayMapping {

  private _mappings = {
    'displayName': 'Name',
    'displayName.stemmed': 'Name',
    'displayName.ngrams': 'Name',
    'name': 'Physical Name',
    'name.stemmed': 'Physical Name',
    'name.ngrams': 'Physical Name',
    'namespace.code': 'Namespace',
    'namespace.code.stemmed': 'Namespace',
    'namespace.code.ngrams': 'Namespace',
    'description': 'Description',
    'description.stemmed': 'Description',
    'description.ngrams': 'Description',
    'columns.name': 'Column Name',
    'columns.name.stemmed': 'Column Name',
    'columns.name.ngrams': 'Column Name',
    'columns.description': 'Column Description',
    'columns.description.stemmed': 'Column Description',
    'columns.description.ngrams': 'Column Description',
    'descriptiveBusinessObjectFormat.schemaColumns.name': 'Column Physical Name',
    'descriptiveBusinessObjectFormat.schemaColumns.name.stemmed': 'Column Physical Name',
    'descriptiveBusinessObjectFormat.schemaColumns.name.ngrams': 'Column Physical Name',
    'businessObjectDefinitionTags.tag.displayName': 'Category Name',
    'businessObjectDefinitionTags.tag.displayName.stemmed': 'Category Name',
    'businessObjectDefinitionTags.tag.displayName.ngrams': 'Category Name',
    'subjectMatterExperts.userId': 'Contact Information',
    'subjectMatterExperts.userId.stemmed': 'Contact Information',
    'subjectMatterExperts.userId.ngrams': 'Contact Information'
  };

  public getMapping(name: string) {
    return this._mappings[name] || name;
  }
}
