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
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GlobalSearchComponent} from 'app/shared/components/global-search/global-search.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SideActionComponent} from './components/side-action/side-action.component';
import {SideActionsComponent} from './components/side-actions/side-actions.component';
import {FileDownloaderDirective} from './directive/file-downloader/file-downloader.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TriStateComponent} from './components/tri-state/tri-state.component';
import {TruncatedContentComponent} from './components/truncated-content/truncated-content.component';
import {SafeHtmlPipe} from './pipes/safe-html.pipe';
import { EllipsisOverflowComponent } from './components/ellipsis-overflow/ellipsis-overflow.component';
import { GenericViewComponent } from './components/generic-view/generic-view.component';
import { ReadMoreComponent } from './read-more/read-more.component';
import {FacetComponent} from './components/facet/facet.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import {DataTableModule} from 'primeng/components/datatable/datatable';
import {ButtonModule} from 'primeng/components/button/button';
import { CKEditorModule } from 'ng2-ckeditor';
import { AuthorizedDirective } from './directive/authorized/authorized.directive';
import { EditComponent } from './components/edit/edit.component';
import {SelectModule} from 'ng-select';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { InlineSVGModule } from 'ng-inline-svg/lib';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    CKEditorModule,
    SelectModule,
    NgxGraphModule,
    NgxChartsModule,
    InlineSVGModule
  ],
  declarations: [
    GlobalSearchComponent,
    SideActionComponent,
    SideActionsComponent,
    FileDownloaderDirective,
    TriStateComponent,
    TruncatedContentComponent,
    SafeHtmlPipe,
    EllipsisOverflowComponent,
    GenericViewComponent,
    ReadMoreComponent,
    FacetComponent,
    AttributesComponent,
    AuthorizedDirective,
    EditComponent,
    SpinnerComponent
  ],
  exports: [
    InlineSVGModule,
    CommonModule,
    GlobalSearchComponent,
    SideActionComponent,
    SideActionsComponent,
    FileDownloaderDirective,
    AuthorizedDirective,
    TriStateComponent,
    TruncatedContentComponent,
    SafeHtmlPipe,
    EllipsisOverflowComponent,
    GenericViewComponent,
    ReadMoreComponent,
    FacetComponent,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AttributesComponent,
    DataTableModule,
    ButtonModule,
    EditComponent,
    CKEditorModule,
    SelectModule,
    SpinnerComponent,
    NgxGraphModule,
    NgxChartsModule
  ]
})
export class SharedModule {
}
