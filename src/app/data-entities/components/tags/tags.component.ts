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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, } from '@angular/core';
import {
  BusinessObjectDefinitionTagCreateRequest,
  BusinessObjectDefinitionTagKey,
  BusinessObjectDefinitionTagService,
  NamespaceAuthorization,
  TagService,
  TagTypeService
} from '@herd/angular-client';
import { AuthMap } from '../../../shared/directive/authorized/authorized.directive';
import { BeastService } from '../../../shared/services/beast.service';
import { BeastComponents } from '../../../shared/services/beast-components.enum';
import { BeastActions } from '../../../shared/services/beast-actions.enum';

@Component({
  selector: 'sd-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements OnInit {
  authMap = AuthMap;
  @Input() namespace: string;
  @Input() dataEntityName: string;

  editDescriptiveContentPermissions = [NamespaceAuthorization.NamespacePermissionsEnum.WRITE,
    NamespaceAuthorization.NamespacePermissionsEnum.WRITEDESCRIPTIVECONTENT];
  allTags: Array<BusinessObjectDefinitionTagKey | any> = [];
  displayingTags: Array<BusinessObjectDefinitionTagKey | any> = [];
  selectedTags: Array<BusinessObjectDefinitionTagKey | any> = [];
  initialSelectedTags: Array<BusinessObjectDefinitionTagKey | any> = [];
  disabled = false;
  public hover = false;
  private unableToDeleteServer: boolean;

  private businessObjectDefinitionTagCreateRequest: BusinessObjectDefinitionTagCreateRequest;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private elementRef: ElementRef, private tagApi: TagService, private tagTypeApi: TagTypeService,
              private bs: BeastService,
              private businessObjectDefinitionTagApi: BusinessObjectDefinitionTagService) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.querySelector('.card').style.display = 'none';
    this.getExistingBdefTags();
  }

  onMouseEnter(event: any) {
    this.hover = true;
    this.elementRef.nativeElement.addClass = 'edit';
  }

  onMouseLeave(event: any) {
    this.hover = false;
    this.elementRef.nativeElement.addClass = 'un-edit';
  }

  blur(event: any) {
    if (this.unableToDeleteServer) {
      this.selectedTags = this.initialSelectedTags;
      this.unableToDeleteServer = false;
    }
  }

  click(cancelEdit: boolean) {
    this.elementRef.nativeElement.querySelector('.tags-content').style.display = cancelEdit ? '' : 'none';
    this.elementRef.nativeElement.querySelector('.card').style.display = cancelEdit ? 'none' : '';
  }

  selected(event: any) {
    this.businessObjectDefinitionTagCreateRequest = {
      businessObjectDefinitionTagKey: {
        businessObjectDefinitionKey: {
          namespace: this.namespace, businessObjectDefinitionName: this.dataEntityName
        },
        tagKey: event.tagKey
      }
    };
    this.businessObjectDefinitionTagApi
      .businessObjectDefinitionTagCreateBusinessObjectDefinitionTag(this.businessObjectDefinitionTagCreateRequest)
      .subscribe((response) => {
        this.tagApi.tagGetTag(event.tagKey.tagTypeCode, event.tagKey.tagCode)
          .subscribe((tag) => {
            (event as any).tagDisplayName = tag.displayName;
            this.tagTypeApi.tagTypeGetTagType(event.tagKey.tagTypeCode).subscribe((tagType) => {
              (event as any).tagTypeDisplayName = tagType.displayName;
            });
          });
        this.displayingTags.push(event);
      }, (error) => {
        // we tried to add tag but some how server did not add. we need to remove it in the UI
        this.selectedTags = this.selectedTags.filter((key) => {
          return !(key.tagTypeCode === event.tagKey.tagTypeCode && key.tagCode === event.tagKey.tagCode);
        });
      });
  }

  removed(event: any) {
    this.businessObjectDefinitionTagApi.businessObjectDefinitionTagDeleteBusinessObjectDefinitionTag(
      this.namespace, this.dataEntityName, event.tagKey.tagTypeCode, event.tagKey.tagCode
    ).subscribe((response) => {
      this.displayingTags = this.displayingTags.filter((key) => {
        return !(key.tagKey.tagTypeCode === event.tagKey.tagTypeCode && key.tagKey.tagCode === event.tagKey.tagCode);
      });
    }, (error) => {
      this.unableToDeleteServer = true;
    });
  }

  getExistingBdefTags() {
    this.businessObjectDefinitionTagApi.businessObjectDefinitionTagGetBusinessObjectDefinitionTagsByBusinessObjectDefinition(
      this.namespace, this.dataEntityName).subscribe((data) => {
      data.businessObjectDefinitionTagKeys.forEach((bdefTagKey) => {

        this.tagApi.tagGetTag(bdefTagKey.tagKey.tagTypeCode, bdefTagKey.tagKey.tagCode)
          .subscribe((tag) => {
            (bdefTagKey as any).tagDisplayName = tag.displayName;
            this.tagTypeApi.tagTypeGetTagType(bdefTagKey.tagKey.tagTypeCode).subscribe((tagType) => {
              (bdefTagKey as any).tagTypeDisplayName = tagType.displayName;
              this.changeDetectorRef.markForCheck();
            });
          });
      });
      this.displayingTags = data.businessObjectDefinitionTagKeys;
      this.getAllTags(this.displayingTags);
    });
  }

  getAllTags(existingTags: any) {
    this.tagApi.tagSearchTags({}, 'displayName,description').subscribe((result: any) => {
      this.allTags = result.tags.map((tag) => {
        tag.label = tag.displayName;
        tag.value = tag.tagKey;
        existingTags.map((existingTag) => {
          if (tag.tagKey.tagTypeCode.toLowerCase() === existingTag.tagKey.tagTypeCode.toLowerCase()
            && tag.tagKey.tagCode.toLowerCase() === existingTag.tagKey.tagCode.toLowerCase()
          ) {
            this.selectedTags.push(tag.tagKey);
          }
        });
        return tag;
      });
      this.initialSelectedTags = this.selectedTags;
    });
  }

  sendEditTagActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.editTag, BeastComponents.dataEntities, this.namespace, this.dataEntityName);
  }
}
