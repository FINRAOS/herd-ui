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
import {RouterStub, ActivatedRouteStub} from 'testing/router-stubs';
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {
  DataEntityDetailComponent,
  DataEntityLineageNode,
  DAGNodeTypeColor,
  DAGNodeType, HierarchialGraph, DataEntityWithFormatColumn
} from './data-entity-detail.component';
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {SideActionComponent} from '../../../shared/components/side-action/side-action.component';
import {
  CurrentUserService,
  SubjectMatterExpertService, BusinessObjectDefinitionSubjectMatterExpertService,
  TagService, TagTypeService, BusinessObjectDefinitionTagService, SubjectMatterExpert,
  BusinessObjectDefinitionSubjectMatterExpertKeys,
  BusinessObjectFormat, BusinessObjectDefinition, UploadAndDownloadService,
  BusinessObjectDefinitionColumnService, BusinessObjectFormatService,
  BusinessObjectDefinitionService, BusinessObjectDefinitionColumn,
  BusinessObjectDefinitionColumnSearchResponse,
  BusinessObjectFormatKey,
  Configuration, UserAuthorizations,
  NamespaceAuthorization, BusinessObjectDefinitionDescriptiveInformationUpdateRequest, BusinessObjectDefinitionDescriptionSuggestionService
} from '@herd/angular-client';
import {HttpModule, Headers} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AlertService, SuccessAlert, DangerAlert, WarningAlert} from '../../../core/services/alert.service';
import {UserService} from '../../../core/services/user.service';
import {EncryptionService} from '../../../shared/services/encryption.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditComponent, EditEvent} from 'app/shared/components/edit/edit.component';
import {TagsComponent} from 'app/data-entities/components/tags/tags.component';
import {SideActionsComponent} from 'app/shared/components/side-actions/side-actions.component';
import {FileDownloaderDirective} from 'app/shared/directive/file-downloader/file-downloader.directive';
import {AuthorizedDirective} from 'app/shared/directive/authorized/authorized.directive';
import {EllipsisOverflowComponent} from 'app/shared/components/ellipsis-overflow/ellipsis-overflow.component';
import {DataTableModule} from 'primeng/components/datatable/datatable';
import {ButtonModule} from 'primeng/components/button/button';
import {GenericViewComponent} from 'app/shared/components/generic-view/generic-view.component';
import {CodemirrorModule} from 'ng2-codemirror/lib';
import {ClipboardModule} from 'ngx-clipboard';
import {BrowserModule, By} from '@angular/platform-browser';
import {SelectModule} from 'ng-select';
import {MockCkeditorComponent} from 'testing/mock-ckeditor.component';
import {SpinnerComponent} from 'app/shared/components/spinner/spinner.component';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {InlineSVGModule} from 'ng-inline-svg';
import {APP_BASE_HREF} from '@angular/common';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ContactsComponent} from '../contacts/contacts.component';
import { SuggestionsComponent } from '../suggestions/suggestions.component';
import { DiffMatchPatchModule } from 'ng-diff-match-patch/dist';

describe('DataEntityDetailComponent', () => {
  let component: DataEntityDetailComponent;
  let fixture: ComponentFixture<DataEntityDetailComponent>;
  let spyBdefSmeApi, spySmeApi;
  let spyTagApi, spyTagTypeApi, spyBdefTagApi, spyTagSearch;
  let spyBdefFormatApi, spyDownloadApi, spyBdefColApi, spyBdefFormatAllApi, spyBdefFormatDDLApi;
  let spyBusinessObjectDefinitionApi, spyBusinessObjectDefinitionDescriptionSuggestionServiceApi;

  const response = {
    'resp': [
      {
        'tagDisplayName': 'test tag display name 1',
        'tagTypeDisplayName': 'test tag type display name 1'
      },
      {
        'tagDisplayName': 'test tag display name 2',
        'tagTypeDisplayName': 'test tag type display name 2'
      }
    ]
  };

  const ddl = 'select random string that represents ddl';

  const expectedBdefTags = {
    'businessObjectDefinitionTagKeys': [
      {
        'businessObjectDefinitionKey': {
          'namespace': 'test_ns_1',
          'businessObjectDefinitionName': 'test_bdef'
        },
        'tagKey': {
          'tagTypeCode': 'Code_1',
          'tagCode': 'tag_code_1'
        },
        'tagDisplayName': 'Tag Display Name for tag_code_1',
        'tagTypeDisplayName': 'Tag Type Display Name for code_1'
      }, {
        'businessObjectDefinitionKey': {
          'namespace': 'test_ns_2',
          'businessObjectDefinitionName': 'test_bdef2'
        },
        'tagKey': {
          'tagTypeCode': 'Code_2',
          'tagCode': 'tag_code_2'
        },
        'tagDisplayName': 'Tag Display Name for tag_code_2',
        'tagTypeDisplayName': 'Tag Type Display Name for code_2'
      }]
  };

  const tagType = {
    'tagType': {
      'tagTypeKey': {'tagTypeCode': 'test_type'},
      'displayName': 'Test Type',
      'tagTypeOrder': 2,
      'description': ''
    }
  };

  const tag = {
    'tag': {
      'id': null,
      'tagKey': {'tagTypeCode': 'test_tagtype_tag', 'tagCode': 'tag_code'},
      'displayName': 'Tag Code',
      'description': null,
      'userId': null,
      'lastUpdatedByUserId': null,
      'updatedTime': null,
      'parentTagKey': null,
      'hasChildren': null
    }
  };

  const bdefSmes: BusinessObjectDefinitionSubjectMatterExpertKeys = {
    'businessObjectDefinitionSubjectMatterExpertKeys': [{
      'namespace': 'namespace',
      'businessObjectDefinitionName': 'name',
      'userId': 'id1'
    },
      {
        'namespace': 'namespace',
        'businessObjectDefinitionName': 'name',
        'userId': 'id2'
      }]
  };

  const sme: SubjectMatterExpert = {
    subjectMatterExpertKey: {
      userId: '1'
    },
    contactDetails: {
      fullName: 'user full name',
      jobTitle: 'sme job title',
      emailAddress: 'emailAddress',
      telephoneNumber: '8989898'
    }
  };

  const expectedSmes: SubjectMatterExpert[] = [sme, sme];

  let descriptiveFormat: BusinessObjectFormat = {
    namespace: 'ns',
    businessObjectDefinitionName: 'name',
    businessObjectFormatUsage: 'SRC',
    businessObjectFormatFileType: 'TXT',
    businessObjectFormatVersion: 1,
    partitionKey: 'TEST_KEY',
    schema: {
      columns: [{
        name: 'col',
        type: 'string',
        size: 'varchar',
        required: true,
        defaultValue: 'string',
        description: 'string'
      }, {
        name: 'testcol',
        type: 'string',
        size: null,
        required: true,
        defaultValue: 'string',
        description: 'string'
      }]
    }
  };

  const formatKeys: BusinessObjectFormatKey[] = [
    {
      namespace: 'ns',
      businessObjectDefinitionName: 'name',
      businessObjectFormatUsage: 'SRC',
      businessObjectFormatFileType: 'TXT',
      businessObjectFormatVersion: 1
    },
    {
      namespace: 'ns',
      businessObjectDefinitionName: 'name',
      businessObjectFormatUsage: 'SRC',
      businessObjectFormatFileType: 'CSV',
      businessObjectFormatVersion: 1
    }
  ];

  const expectedFormats = {businessObjectFormatKeys: formatKeys};

  const formats: BusinessObjectFormat[] = [descriptiveFormat];

  let expectedBdef: BusinessObjectDefinition = {
    namespace: 'ns',
    businessObjectDefinitionName: 'bdef',
    dataProviderName: 'dp',
    displayName: 'display name',
    sampleDataFiles: [{
      directoryPath: '/tmp',
      fileName: 'test'
    }
    ],
    descriptiveBusinessObjectFormat: {
      businessObjectFormatUsage: descriptiveFormat.businessObjectFormatUsage,
      businessObjectFormatFileType: descriptiveFormat.businessObjectFormatFileType,
      businessObjectFormatVersion: descriptiveFormat.businessObjectFormatVersion
    }
  };


  let bdefCol1: BusinessObjectDefinitionColumn = {
    businessObjectDefinitionColumnKey: {
      namespace: 'ns',
      businessObjectDefinitionName: 'name',
      businessObjectDefinitionColumnName: 'col'
    },
    schemaColumnName: 'col',
    description: 'desc'
  };

  let bdefCol2: BusinessObjectDefinitionColumn = {
    businessObjectDefinitionColumnKey: {
      namespace: 'ns',
      businessObjectDefinitionName: 'name',
      businessObjectDefinitionColumnName: 'col'
    },
    schemaColumnName: 'col2',
    description: 'desc'
  };

  let bdefCols: BusinessObjectDefinitionColumn[] = [bdefCol1, bdefCol2];

  let bdefColSearchResponse: BusinessObjectDefinitionColumnSearchResponse = {
    businessObjectDefinitionColumns: bdefCols
  };

  let expectedCols: DataEntityWithFormatColumn[] = [{
    businessObjectDefinitionColumnName: 'col',
    description: 'desc',
    schemaColumnName: 'col',
    type: 'string (varchar)',
    exists: true
  }, {
    businessObjectDefinitionColumnName: '',
    description: '',
    schemaColumnName: 'testcol',
    type: 'string',
    exists: false
  }];

  const sampleDataResponse = {
    preSignedUrl: '/test/url'
  };

  const bdefSuggestion = {
    'businessObjectDefinitionDescriptionSuggestions': [
      {
        'id': 12345,
        'businessObjectDefinitionDescriptionSuggestionKey': {
          'namespace': 'fakenamspace',
          'businessObjectDefinitionName': 'fakebdefname',
          'userId': 'fakeuserid'
        },
        'descriptionSuggestion': 'falesuggestion',
        'status': 'PENDING',
        'createdByUserId': 'fakeuserid'
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        BrowserModule,
        RouterTestingModule,
        HttpModule,
        DataTableModule,
        ButtonModule,
        FormsModule,
        CodemirrorModule,
        ClipboardModule,
        ReactiveFormsModule,
        SelectModule,
        NgxGraphModule,
        NgxChartsModule,
        InlineSVGModule,
        DiffMatchPatchModule
      ],
      declarations: [
        DataEntityDetailComponent,
        EditComponent,
        ContactsComponent,
        TagsComponent,
        SideActionsComponent,
        SideActionComponent,
        FileDownloaderDirective,
        AuthorizedDirective,
        EllipsisOverflowComponent,
        GenericViewComponent,
        MockCkeditorComponent,
        SpinnerComponent,
        SuggestionsComponent,
      ],
      providers: [
        {
          provide: Configuration,
          useValue: {} as Configuration,
          multi: false
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        {
          provide: UserService,
          useValue: {
            user: Observable.of({
              userId: 'test_user'
            } as UserAuthorizations)
          }
        },
        EncryptionService,
        CurrentUserService,
        {
          provide: AlertService,
          useValue: {
            alert: jasmine.createSpy('alert')
          }
        },
        {
          provide: BusinessObjectDefinitionDescriptionSuggestionService,
          useValue: {
            businessObjectDefinitionDescriptionSuggestionSearchBusinessObjectDefinitionDescriptionSuggestions:
              jasmine.createSpy('businessObjectDefinitionDescriptionSuggestionSearchBusinessObjectDefinitionDescriptionSuggestions'),
            configuration: {}
          }
        },
        {
          provide: BusinessObjectDefinitionSubjectMatterExpertService,
          useValue: {
            businessObjectDefinitionSubjectMatterExpertGetBusinessObjectDefinitionSubjectMatterExpertsByBusinessObjectDefinition:
              jasmine.createSpy(
                'businessObjectDefinitionSubjectMatterExpertGetBusinessObjectDefinitionSubjectMatterExpertsByBusinessObjectDefinition'),
            configuration: {}
          }
        },
        {
          provide: SubjectMatterExpertService,
          useValue: {
            subjectMatterExpertGetSubjectMatterExpert: jasmine.createSpy('subjectMatterExpertGetSubjectMatterExpert'),
            configuration: {}
          }
        },
        {
          provide: TagTypeService,
          useValue: {
            tagTypeGetTagType: jasmine.createSpy('tagTypeGetTagType'),
            configuration: {}
          }
        },
        {
          provide: TagService,
          useValue: {
            tagGetTag: jasmine.createSpy('tagGetTag'),
            tagSearchTags: jasmine.createSpy('tagSearchTags'),
            configuration: {}
          }
        }, {
          provide: BusinessObjectDefinitionTagService,
          useValue: {
            businessObjectDefinitionTagGetBusinessObjectDefinitionTagsByBusinessObjectDefinition:
              jasmine.createSpy('businessObjectDefinitionTagGetBusinessObjectDefinitionTagsByBusinessObjectDefinition'),
            configuration: {}
          }
        }, {
          provide: BusinessObjectDefinitionService,
          useValue: {
            businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation:
              jasmine.createSpy('businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation'),
            businessObjectDefinitionGetBusinessObjectDefinition:
              jasmine.createSpy('businessObjectDefinitionGetBusinessObjectDefinition'),
            configuration: {}
          }
        },
        {
          provide: UploadAndDownloadService,
          useValue: {
            uploadandDownloadInitiateDownloadSingleSampleFile:
              jasmine.createSpy('uploadandDownloadInitiateDownloadSingleSampleFile'),
            configuration: {}
          }
        },
        {
          provide: BusinessObjectFormatService,
          useValue: {
            businessObjectFormatGetBusinessObjectFormat: jasmine.createSpy('businessObjectFormatGetBusinessObjectFormat'),
            businessObjectFormatGetBusinessObjectFormats: jasmine.createSpy('businessObjectFormatGetBusinessObjectFormats'),
            businessObjectFormatGenerateBusinessObjectFormatDdl: jasmine.createSpy('businessObjectFormatGenerateBusinessObjectFormatDdl'),
            defaultHeaders: new Headers(),
            configuration: {
              withCredentials: true
            }
          }
        },
        {
          provide: BusinessObjectDefinitionColumnService,
          useValue: {
            defaultHeaders: new Headers(),
            businessObjectDefinitionColumnSearchBusinessObjectDefinitionColumns:
              jasmine.createSpy('businessObjectDefinitionColumnSearchBusinessObjectDefinitionColumns'),
            businessObjectDefinitionColumnUpdateBusinessObjectDefinitionColumn:
              jasmine.createSpy('businessObjectDefinitionColumnUpdateBusinessObjectDefinitionColumn'),
            businessObjectDefinitionColumnDeleteBusinessObjectDefinitionColumn:
              jasmine.createSpy('businessObjectDefinitionColumnDeleteBusinessObjectDefinitionColumn'),
            businessObjectDefinitionColumnCreateBusinessObjectDefinitionColumn:
              jasmine.createSpy('businessObjectDefinitionColumnCreateBusinessObjectDefinitionColumn'),
            configuration: {}
          }
        }
        , {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        {provide: Router, useClass: RouterStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntityDetailComponent);
    component = fixture.componentInstance;
  });

  beforeEach(async(inject([
      BusinessObjectDefinitionSubjectMatterExpertService,
      SubjectMatterExpertService,
      TagTypeService,
      TagService,
      BusinessObjectDefinitionTagService,
      BusinessObjectDefinitionService,
      UploadAndDownloadService,
      BusinessObjectFormatService,
      BusinessObjectDefinitionColumnService,
      ActivatedRoute,
      BusinessObjectDefinitionDescriptionSuggestionService
    ],
    (
      bdefSmeApi: BusinessObjectDefinitionSubjectMatterExpertService,
     smeApi: SubjectMatterExpertService,
     tagTypeApi: TagTypeService,
     tagApi: TagService,
     bdefTagApi: BusinessObjectDefinitionTagService,
     bdefApi: BusinessObjectDefinitionService,
     downloadApi: UploadAndDownloadService,
     bformatApi: BusinessObjectFormatService,
     bColApi: BusinessObjectDefinitionColumnService,
      activeRoute: ActivatedRouteStub,
      businessObjectDefinitionDescriptionSuggestionService: BusinessObjectDefinitionDescriptionSuggestionService
    ) => {

      // Spy on the services
      spyBdefFormatApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormat).and.returnValue(
        Observable.of(descriptiveFormat));
      spyBdefColApi = (<jasmine.Spy>bColApi.businessObjectDefinitionColumnSearchBusinessObjectDefinitionColumns).and.returnValue(
        Observable.of(bdefColSearchResponse));
      spyBdefFormatAllApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormats)
        .and.returnValue(Observable.of(expectedFormats));

      spyBdefFormatDDLApi = (<jasmine.Spy>bformatApi.businessObjectFormatGenerateBusinessObjectFormatDdl)
        .and.returnValue(Observable.of({ddl: ddl}));

      spyDownloadApi = (<jasmine.Spy>downloadApi.uploadandDownloadInitiateDownloadSingleSampleFile).and.returnValue(
        Observable.of(sampleDataResponse));

      spyBdefTagApi = (<jasmine.Spy>bdefTagApi.businessObjectDefinitionTagGetBusinessObjectDefinitionTagsByBusinessObjectDefinition)
        .and.returnValue(Observable.of(expectedBdefTags));

      spyBusinessObjectDefinitionApi = (<jasmine.Spy>bdefApi.businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation)
        .and.returnValue(Observable.of(expectedBdef));

      spyTagApi = (<jasmine.Spy>tagApi.tagGetTag).and.returnValue(Observable.of(tag.tag));
      spyTagSearch = (<jasmine.Spy>tagApi.tagSearchTags).and.returnValue(Observable.of({tags: []}));
      spyTagTypeApi = (<jasmine.Spy>tagTypeApi.tagTypeGetTagType).and.returnValue(Observable.of(tagType.tagType));

      spyBdefSmeApi = (<jasmine.Spy>bdefSmeApi
        .businessObjectDefinitionSubjectMatterExpertGetBusinessObjectDefinitionSubjectMatterExpertsByBusinessObjectDefinition)
        .and.returnValue(Observable.of(bdefSmes));
      spySmeApi = (<jasmine.Spy>smeApi.subjectMatterExpertGetSubjectMatterExpert)
        .and.returnValue(Observable.of(sme));

      spyBusinessObjectDefinitionDescriptionSuggestionServiceApi = (<jasmine.Spy>businessObjectDefinitionDescriptionSuggestionService
        .businessObjectDefinitionDescriptionSuggestionSearchBusinessObjectDefinitionDescriptionSuggestions)
        .and.returnValue(Observable.of(bdefSuggestion));
    })));

  it('should set all data onInit', async(inject([ActivatedRoute], (activeRoute: ActivatedRouteStub) => {

    activeRoute.testData = {
      resolvedData: {
        bdef: expectedBdef
      }
    };

    fixture.detectChanges();
    expect(component.bdef).toEqual(activeRoute.testData.resolvedData.bdef);
    expect(component.formats).toEqual(expectedFormats.businessObjectFormatKeys);
    expect(component.descriptiveFormat).toEqual(descriptiveFormat);
    expect(component.bdefColumns).toEqual(expectedCols);
    // expect(component.bdefTags).toEqual(expectedBdefTags.businessObjectDefinitionTagKeys);
    // expect(component.hasTag).toEqual(true);
    expect(component.smes).toEqual(expectedSmes);
    expect(component.businessObjectDefinitionDescriptionSuggestions).toEqual(bdefSuggestion.businessObjectDefinitionDescriptionSuggestions);

    component.onSampleDataClick();
    expect(component.sampleDataFileUrl).toEqual(sampleDataResponse.preSignedUrl);
    expect(spyDownloadApi.calls.count()).toEqual(1);

    expect(spyBdefColApi.calls.count()).toEqual(1);
    expect(spyBdefFormatApi.calls.count()).toEqual(1);
    expect(spyBdefFormatAllApi.calls.count()).toEqual(1);

    expect(spyBdefSmeApi.calls.count()).toEqual(1);
    expect(spySmeApi.calls.count()).toEqual(2);
    expect(spyBusinessObjectDefinitionDescriptionSuggestionServiceApi.calls.count()).toEqual(1);

    expect(spyTagApi.calls.count()).toEqual(2);
    expect(spyTagTypeApi.calls.count()).toEqual(2);
    expect(spyBdefTagApi.calls.count()).toEqual(1);

    component.sideActions[3].onAction();
  })));

  it('should show error when suggestions call fails and ',
    async(inject([BusinessObjectDefinitionDescriptionSuggestionService, AlertService],
    (businessObjectDefinitionDescriptionSuggestionService: BusinessObjectDefinitionDescriptionSuggestionService, alerter: AlertService) => {

      const bdefSuggestionSpy = businessObjectDefinitionDescriptionSuggestionService
        .businessObjectDefinitionDescriptionSuggestionSearchBusinessObjectDefinitionDescriptionSuggestions as jasmine.Spy;
      const alertSpy = alerter.alert as jasmine.Spy;

      // for failure on delete
      bdefSuggestionSpy.and.returnValue(Observable.throw({status: 404}));


      // fixture.detectChanges();
      component.getAllPendingSuggestion('xxx', 'yyy', 'PENDING');
      expect(component.businessObjectDefinitionDescriptionSuggestions).toEqual(undefined);
      expect(bdefSuggestionSpy.calls.count()).toEqual(1);
      expect(alertSpy.calls.count()).toEqual(1);

  })));

  it(' suggestionApprove should approve description suggestion', () => {
    component.open('');
    component.businessObjectDefinitionDescriptionSuggestions = [bdefSuggestion];
    component.suggestionApproved({text: 'xxx'});
    component.businessObjectDefinitionDescriptionSuggestions = [];
    component.suggestionApproved({text: 'xxx'});
    expect(component.bdef.description).toEqual('xxx');
  });

  it('should catch error when sme is invalid, should catch error when no access to formats, bdef with no descriptive format',
    async((inject([
        BusinessObjectDefinitionSubjectMatterExpertService,
        SubjectMatterExpertService,
        BusinessObjectFormatService,
        BusinessObjectDefinitionColumnService, ActivatedRoute],
      (
        bdefSmeApi: BusinessObjectDefinitionSubjectMatterExpertService,
        smeApi: SubjectMatterExpertService,
        bformatApi: BusinessObjectFormatService,
        bColApi: BusinessObjectDefinitionColumnService, activeRoute: ActivatedRouteStub) => {

        // bdef with no descriptive format
        expectedBdef = {
          namespace: 'ns',
          businessObjectDefinitionName: 'bdef',
          dataProviderName: 'dp',
          displayName: 'display name'
        };
        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };

        // throw error when sme is invalid
        spyBdefSmeApi = (<jasmine.Spy>bdefSmeApi
            .businessObjectDefinitionSubjectMatterExpertGetBusinessObjectDefinitionSubjectMatterExpertsByBusinessObjectDefinition
        ).and.returnValue(Observable.of(bdefSmes));
        spySmeApi = (<jasmine.Spy>smeApi.subjectMatterExpertGetSubjectMatterExpert)
          .and.returnValue(Observable.throw(new Error()));
        // throw error when no access to formats
        spyBdefFormatAllApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormats)
          .and.returnValue(Observable.throw(new Error()));

        fixture.detectChanges();
        expect(component.bdef).toEqual(activeRoute.testData.resolvedData.bdef);
        // expect(component.descriptiveFormat).toEqual(expe);
        expect(component.bdefColumns).toEqual([]);
        expect(component.smes).toEqual([]);
        expect(component.formats).toEqual([]);

        expect(spyBdefSmeApi.calls.count()).toEqual(1);
        expect(spySmeApi.calls.count()).toEqual(2);
        expect(spyBdefFormatAllApi.calls.count()).toEqual(1);

      }))));

  it('bdef with descriptive format and no schema columns',
    async((inject([
        BusinessObjectFormatService,
        BusinessObjectDefinitionColumnService, ActivatedRoute],
      (
        bformatApi: BusinessObjectFormatService,
        bColApi: BusinessObjectDefinitionColumnService, activeRoute: ActivatedRouteStub) => {

        // bdef with descriptive format and no schema columns
        descriptiveFormat = {
          namespace: 'ns',
          businessObjectDefinitionName: 'name',
          businessObjectFormatUsage: 'SRC',
          businessObjectFormatFileType: 'TXT',
          businessObjectFormatVersion: 1,
          partitionKey: 'TEST_KEY'
        };

        expectedBdef = {
          namespace: 'ns',
          businessObjectDefinitionName: 'bdef',
          dataProviderName: 'dp',
          displayName: 'display name',
          sampleDataFiles: [{
            directoryPath: '/tmp',
            fileName: 'test'
          }
          ],
          descriptiveBusinessObjectFormat: descriptiveFormat
        };

        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };

        // spy on the services
        spyBdefFormatApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormat).and.returnValue(
          Observable.of(descriptiveFormat));
        spyBdefColApi = (<jasmine.Spy>bColApi.businessObjectDefinitionColumnSearchBusinessObjectDefinitionColumns).and.returnValue(
          Observable.of(bdefColSearchResponse));

        fixture.detectChanges();
        expect(component.descriptiveFormat).toEqual(descriptiveFormat);
        expect(component.bdefColumns).toEqual([]);

        expect(spyBdefColApi.calls.count()).toEqual(1);
        expect(spyBdefFormatApi.calls.count()).toEqual(1);

      }))));

  it('bdef with descriptive format and schema columns - with no matching schema column names ',
    async((inject([
        BusinessObjectFormatService,
        BusinessObjectDefinitionColumnService, ActivatedRoute],
      (
        bformatApi: BusinessObjectFormatService,
        bColApi: BusinessObjectDefinitionColumnService, activeRoute: ActivatedRouteStub) => {

        descriptiveFormat = {
          namespace: 'ns',
          businessObjectDefinitionName: 'name',
          businessObjectFormatUsage: 'SRC',
          businessObjectFormatFileType: 'TXT',
          businessObjectFormatVersion: 1,
          partitionKey: 'TEST_KEY',
          schema: {
            columns: [{
              name: 'col',
              type: 'string',
              size: 'varchar',
              required: true,
              defaultValue: 'string',
              description: 'string'
            }]
          }
        };

        expectedBdef = {
          namespace: 'ns',
          businessObjectDefinitionName: 'bdef',
          dataProviderName: 'dp',
          displayName: 'display name',
          sampleDataFiles: [{
            directoryPath: '/tmp',
            fileName: 'test'
          }
          ],
          descriptiveBusinessObjectFormat: descriptiveFormat
        };

        bdefCol1 = {
          businessObjectDefinitionColumnKey: {
            namespace: 'ns',
            businessObjectDefinitionName: 'name',
            businessObjectDefinitionColumnName: 'col'
          },
          schemaColumnName: 'col2',
          description: 'desc'
        };

        bdefCol2 = {
          businessObjectDefinitionColumnKey: {
            namespace: 'ns',
            businessObjectDefinitionName: 'name',
            businessObjectDefinitionColumnName: 'col'
          },
          schemaColumnName: 'col2',
          description: 'desc'
        };

        bdefCols = [bdefCol1, bdefCol2];

        bdefColSearchResponse = {
          businessObjectDefinitionColumns: bdefCols
        };

        expectedCols = [{
          businessObjectDefinitionColumnName: '',
          description: '',
          schemaColumnName: 'col',
          type: 'string (varchar)',
          exists: false
        }];


        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };

        // spy on the services
        spyBdefFormatApi = (<jasmine.Spy>bformatApi.businessObjectFormatGetBusinessObjectFormat).and.returnValue(
          Observable.of(descriptiveFormat));
        spyBdefColApi = (<jasmine.Spy>bColApi.businessObjectDefinitionColumnSearchBusinessObjectDefinitionColumns).and.returnValue(
          Observable.of(bdefColSearchResponse));

        fixture.detectChanges();
        expect(component.descriptiveFormat).toEqual(descriptiveFormat);
        expect(component.bdefColumns).toEqual(expectedCols);

        expect(spyBdefColApi.calls.count()).toEqual(1);
        expect(spyBdefFormatApi.calls.count()).toEqual(1);

      }))));

  it('Should save edited display name on click of save button and alert success',
    inject([BusinessObjectDefinitionService, AlertService, ActivatedRoute],
      (defApi: BusinessObjectDefinitionService, alerter: AlertService, activeRoute: ActivatedRouteStub) => {
        const alertSpy = alerter.alert as jasmine.Spy;
        const updateSpy = defApi.businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation as jasmine.Spy;
        const expectedDisplayName = expectedBdef.displayName;
        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };
        fixture.detectChanges();
        component.saveDataEntityDisplayName({text: 'new save text'});

        expect(updateSpy).toHaveBeenCalledWith(component.bdef.namespace, component.bdef.businessObjectDefinitionName, {
          description: component.bdef.description,
          displayName: 'new save text',
          descriptiveBusinessObjectFormat: component.bdef.descriptiveBusinessObjectFormat
        } as BusinessObjectDefinitionDescriptiveInformationUpdateRequest);
        expect(alertSpy).toHaveBeenCalledWith(new SuccessAlert('Success!', 'Your edit saved successfully.', ''));
        expect(component.bdef.displayName).toEqual('new save text');
      }));

  it('Should not save edited display name and alert failure on error',
    inject([BusinessObjectDefinitionService, AlertService, ActivatedRoute],
      (defApi: BusinessObjectDefinitionService, alerter: AlertService, activeRoute: ActivatedRouteStub) => {
        const alertSpy = alerter.alert as jasmine.Spy;
        const updateSpy = defApi.businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation as jasmine.Spy;
        updateSpy.and.returnValue(Observable.throw('the error'));
        const expectedDisplayName = expectedBdef.displayName;

        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };

        fixture.detectChanges();
        component.saveDataEntityDisplayName({text: 'new save text'});

        expect(updateSpy).toHaveBeenCalledWith(component.bdef.namespace, component.bdef.businessObjectDefinitionName, {
          description: component.bdef.description,
          displayName: 'new save text',
          descriptiveBusinessObjectFormat: component.bdef.descriptiveBusinessObjectFormat
        } as BusinessObjectDefinitionDescriptiveInformationUpdateRequest);
        expect(alertSpy).toHaveBeenCalledWith(new DangerAlert('Failure!',
          'Unable to save your edit. Try again or contact support team.',
          ''));
        // was never set through lifecycle changes which is fine.
        expect(component.bdef.displayName).toEqual(expectedDisplayName)
      }));

  it('Should save edited description on click of save button and alert success',
    inject([BusinessObjectDefinitionService, AlertService, ActivatedRoute],
      (defApi: BusinessObjectDefinitionService, alerter: AlertService, activeRoute: ActivatedRouteStub) => {
        const alertSpy = alerter.alert as jasmine.Spy;
        const updateSpy = defApi.businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation as jasmine.Spy;
        const expectedDescription = expectedBdef.description;
        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };
        fixture.detectChanges();
        component.saveDataEntityDescription({text: 'new save text'});

        expect(updateSpy).toHaveBeenCalledWith(component.bdef.namespace, component.bdef.businessObjectDefinitionName, {
          description: 'new save text',
          displayName: component.bdef.displayName,
          descriptiveBusinessObjectFormat: component.bdef.descriptiveBusinessObjectFormat
        } as BusinessObjectDefinitionDescriptiveInformationUpdateRequest);
        expect(alertSpy).toHaveBeenCalledWith(new SuccessAlert('Success!', 'Your edit saved successfully.', ''));
        expect(component.bdef.description).toEqual('new save text');
      }));

  it('Should not save edited description and alert failure on error',
    inject([BusinessObjectDefinitionService, AlertService, ActivatedRoute],
      (defApi: BusinessObjectDefinitionService, alerter: AlertService, activeRoute: ActivatedRouteStub) => {
        const alertSpy = alerter.alert as jasmine.Spy;
        const updateSpy = defApi.businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation as jasmine.Spy;
        updateSpy.and.returnValue(Observable.throw('the error'));
        const expectedDescription = expectedBdef.description;

        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };

        fixture.detectChanges();
        component.saveDataEntityDescription({text: 'new save text'});

        expect(updateSpy).toHaveBeenCalledWith(component.bdef.namespace, component.bdef.businessObjectDefinitionName, {
          description: 'new save text',
          displayName: component.bdef.displayName,
          descriptiveBusinessObjectFormat: component.bdef.descriptiveBusinessObjectFormat
        } as BusinessObjectDefinitionDescriptiveInformationUpdateRequest);
        expect(alertSpy).toHaveBeenCalledWith(new DangerAlert('Failure!',
          'Unable to save your edit. Try again or contact support team.',
          ''));
        // was never set through lifecycle changes which is fine.
        expect(component.bdef.description).toEqual(expectedDescription)
      }));

  // TODO: fix this test to actually verify modal information by giving it ddl
  it('Should open ddl model on click of Generate Format DDL', () => {
    const modal = component.open('test ddl code');
    // this ddl will be blank as we did not passed any ddl
    expect(component.ddl).toEqual('');

    modal.close();
  });

  it('should alert successful copy information', inject([AlertService, ActivatedRoute],
    (a: AlertService, activeRoute: ActivatedRouteStub) => {
      const alertSpy = (a.alert as jasmine.Spy);

      component.alertSuccessfulCopy();

      expect(alertSpy).toHaveBeenCalledWith(new SuccessAlert('Success!', '', 'DDL Successfully copied to clipboard'));
    }));


  it('should close current modal on cloes()', () => {
    const modal = component.open('test modal close');
    spyOn(modal, 'close').and.callThrough();
    component.close();
    expect(modal.close).toHaveBeenCalled();
  });

  it('should properly decide if the descriptive format has lineage', () => {

    component.descriptiveFormat = undefined;
    expect(component.hasDescriptiveLineage()).toBe(false);

    component.descriptiveFormat = {} as BusinessObjectFormat;
    // no children or parents
    expect(component.hasDescriptiveLineage()).toBe(false);

    component.descriptiveFormat.businessObjectFormatChildren = [];
    component.descriptiveFormat.businessObjectFormatParents = [];
    // no children or parents (in the list);
    expect(component.hasDescriptiveLineage()).toBe(false);

    component.descriptiveFormat.businessObjectFormatParents
      .push({
        namespace: 'test',
        businessObjectFormatUsage: 'usg',
        businessObjectDefinitionName: 'testName',
        businessObjectFormatFileType: 'fTp'
      });
    // has just parents
    expect(component.hasDescriptiveLineage()).toBe(true);

    component.descriptiveFormat.businessObjectFormatChildren
      .push({
        namespace: 'test',
        businessObjectFormatUsage: 'usg',
        businessObjectDefinitionName: 'testname2',
        businessObjectFormatFileType: 'ftp2'
      });
    // has parents and children
    expect(component.hasDescriptiveLineage()).toBe(true);

    component.descriptiveFormat.businessObjectFormatParents = [];
    // just children
    expect(component.hasDescriptiveLineage()).toBe(true);
  });

  it('should update format to recommended format or show error in case of fail',
    async(inject([ActivatedRoute, BusinessObjectDefinitionService],
      (activeRoute: ActivatedRouteStub, businessObjectDefinitionApi: BusinessObjectDefinitionService) => {
        const detailsSpy = spyOn(component, 'getBdefDetails');
        const putSpy = businessObjectDefinitionApi
          .businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation as jasmine.Spy;
        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };

        fixture.detectChanges();
        detailsSpy.calls.reset();

        const bdefWithDescriptiveFormat: BusinessObjectDefinition = {...expectedBdef, descriptiveBusinessObjectFormat: formatKeys[1]};
        putSpy.and.returnValue(Observable.of(bdefWithDescriptiveFormat));
        component.updateDescriptiveFormat(formatKeys[1], false);
        expect(component.bdef).toEqual(bdefWithDescriptiveFormat);
        expect(detailsSpy).toHaveBeenCalled();
        detailsSpy.calls.reset();

        const withoutDescriptiveFormat: BusinessObjectDefinition = {...expectedBdef, descriptiveBusinessObjectFormat: null};
        putSpy.and.returnValue(Observable.of(withoutDescriptiveFormat));
        component.updateDescriptiveFormat(formatKeys[1], true);
        expect(component.bdef).toEqual(withoutDescriptiveFormat);
        expect(detailsSpy).toHaveBeenCalled();
        detailsSpy.calls.reset();

        putSpy.and.returnValue(Observable.throw('error in updating desc format'));
        component.updateDescriptiveFormat(formatKeys[1], false);
        expect(component.bdef).toEqual(withoutDescriptiveFormat);
        expect(detailsSpy).not.toHaveBeenCalled();

      })));

  it('should call processParents for a parent node on showFurther', inject([BusinessObjectFormatService],
    (formatApi: BusinessObjectFormatService) => {
      const parentFormat: BusinessObjectFormat = {
        namespace: 'test',
        businessObjectDefinitionName: 'testBdef',
        businessObjectFormatUsage: 'usg',
        businessObjectFormatFileType: 'ftp',
        partitionKey: 'test-key',
        businessObjectFormatParents: [{
          namespace: 'testNamespace',
          businessObjectDefinitionName: 'testBdef',
          businessObjectFormatUsage: 'testUSG',
          businessObjectFormatFileType: 'TestFTP'
        }]
      };
      const getFormatSpy = (formatApi.businessObjectFormatGetBusinessObjectFormat as jasmine.Spy);
      getFormatSpy.and.returnValue(Observable.of(parentFormat));

      const grandParent: DataEntityLineageNode = {
        id: 'test__grand__parent',
        bdefKey: 'testNamespace:testBdef',
        type: DAGNodeType.parent,
        label: 'displayNameText',
        tooltip: 'testUSG:TestFTP',
        loadLineage: true,
        color: DAGNodeTypeColor.parent
      };
      const parentToShowFurther: DataEntityLineageNode = {
        id: 'test__parent',
        label: 'testLabel',
        tooltip: 'usg:ftp',
        type: DAGNodeType.parent,
        bdefKey: 'test:testBdef',
        loadLineage: true,
        color: DAGNodeTypeColor.parent
      };

      const center: DataEntityLineageNode = {
        id: 'test__center',
        label: 'testLabel',
        tooltip: 'testToolTip',
        type: DAGNodeType.center,
        bdefKey: 'someSpace:someBdef',
        loadLineage: false
      };

      // mock out processParents to make the spec smaller
      spyOn(component, 'processParents').and
        .returnValue(Observable.of({
          nodes: [grandParent], links: [
            {
              source: grandParent.id,
              target: parentToShowFurther.id
            }
          ]
        }));

      component.hierarchialGraph = {
        nodes: [center, parentToShowFurther],
        links: [{source: parentToShowFurther.id, target: center.id}]
      };
      const expectedGraph = {
        nodes: [...component.hierarchialGraph.nodes],
        links: [...component.hierarchialGraph.links]
      };
      expectedGraph.nodes.push(grandParent);
      expectedGraph.links.push({source: grandParent.id, target: parentToShowFurther.id});
      component.popover = {close: () => {}} as NgbPopover;
      component.showFurther(parentToShowFurther);

      // goes throguh the hierarchialGraph and makes the loadlineage false
      // as we will not be reloading it
      expect(parentToShowFurther.loadLineage).toBeFalsy();
      expect(getFormatSpy).toHaveBeenCalledWith(
        parentFormat.namespace,
        parentFormat.businessObjectDefinitionName,
        parentFormat.businessObjectFormatUsage,
        parentFormat.businessObjectFormatFileType
      );
      expect(component.processParents).toHaveBeenCalledWith(parentToShowFurther, parentFormat);
      expect(component.hierarchialGraph.nodes).toEqual(expectedGraph.nodes);
      expect(component.hierarchialGraph.links).toEqual(expectedGraph.links);
      expect(component.hierarchialGraph.loaded).toBe(true);

    }));

  it('should call processChildren for a child node on showFurther', inject([BusinessObjectFormatService],
    (formatApi: BusinessObjectFormatService) => {
      const childFormat: BusinessObjectFormat = {
        namespace: 'test',
        businessObjectDefinitionName: 'testBdef',
        businessObjectFormatUsage: 'usg',
        businessObjectFormatFileType: 'ftp',
        partitionKey: 'test-key',
        businessObjectFormatParents: [{
          namespace: 'testNamespace',
          businessObjectDefinitionName: 'testBdef',
          businessObjectFormatUsage: 'testUSG',
          businessObjectFormatFileType: 'TestFTP'
        }]
      };
      const getFormatSpy = (formatApi.businessObjectFormatGetBusinessObjectFormat as jasmine.Spy);
      getFormatSpy.and.returnValue(Observable.of(childFormat));

      const grandChild: DataEntityLineageNode = {
        id: 'test__grand__child',
        bdefKey: 'testNamespace:testBdef',
        type: DAGNodeType.child,
        label: 'displayNameText',
        tooltip: 'testUSG:TestFTP',
        loadLineage: true,
        color: DAGNodeTypeColor.child
      };
      const childToShowFurther: DataEntityLineageNode = {
        id: 'test__child',
        label: 'testLabel',
        tooltip: 'usg:ftp',
        type: DAGNodeType.child,
        bdefKey: 'test:testBdef',
        loadLineage: true,
        color: DAGNodeTypeColor.child
      };

      const center: DataEntityLineageNode = {
        id: 'test__center',
        label: 'testLabel',
        tooltip: 'testToolTip',
        type: DAGNodeType.center,
        bdefKey: 'someSpace:someBdef',
        loadLineage: false
      };

      // mock out processParents to make the spec smaller
      spyOn(component, 'processChildren').and
        .returnValue(Observable.of({
          nodes: [grandChild], links: [
            {
              target: grandChild.id,
              source: childToShowFurther.id
            }
          ]
        }));

      component.hierarchialGraph = {
        nodes: [center, childToShowFurther],
        links: [{target: childToShowFurther.id, source: center.id}]
      };
      const expectedGraph = {
        nodes: [...component.hierarchialGraph.nodes],
        links: [...component.hierarchialGraph.links]
      };
      expectedGraph.nodes.push(grandChild);
      expectedGraph.links.push({target: grandChild.id, source: childToShowFurther.id});
      component.popover = {close: () => {}} as NgbPopover;
      component.showFurther(childToShowFurther);

      // goes throguh the hierarchialGraph and makes the loadlineage false
      // as we will not be reloading it
      expect(childToShowFurther.loadLineage).toBeFalsy();
      expect(getFormatSpy).toHaveBeenCalledWith(
        childFormat.namespace,
        childFormat.businessObjectDefinitionName,
        childFormat.businessObjectFormatUsage,
        childFormat.businessObjectFormatFileType
      );
      expect(component.processChildren).toHaveBeenCalledWith(childToShowFurther, childFormat);
      expect(component.hierarchialGraph.nodes).toEqual(expectedGraph.nodes);
      expect(component.hierarchialGraph.links).toEqual(expectedGraph.links);
      expect(component.hierarchialGraph.loaded).toBe(true);

    }));


  it('should alert when no more child or parent lineage can be shown', inject([BusinessObjectFormatService, AlertService],
    (formatApi: BusinessObjectFormatService, alerter: AlertService) => {

      const toShowFurther: DataEntityLineageNode = {
        id: 'test',
        label: 'testLabel',
        tooltip: 'usg:ftp',
        type: DAGNodeType.child,
        bdefKey: 'test:testBdef',
        loadLineage: true,
        color: DAGNodeTypeColor.child
      };

      const center: DataEntityLineageNode = {
        id: 'test__center',
        label: 'testLabel',
        tooltip: 'testToolTip',
        type: DAGNodeType.center,
        bdefKey: 'someSpace:someBdef',
        loadLineage: false
      };

      // mock out processParents to make the spec smaller
      spyOn(component, 'processChildren').and
        .returnValue(Observable.of({
          nodes: [], links: []
        }));

      spyOn(component, 'processParents').and
        .returnValue(Observable.of({
          nodes: [], links: []
        }));

      component.hierarchialGraph = {
        nodes: [center, toShowFurther],
        links: [{target: toShowFurther.id, source: center.id}]
      };
      const expectedGraph = {
        nodes: [...component.hierarchialGraph.nodes],
        links: [...component.hierarchialGraph.links]
      };
      component.popover = {close: () => {}} as NgbPopover;
      component.showFurther(toShowFurther);

      expect(alerter.alert).toHaveBeenCalledWith(new WarningAlert('No Further Lineage', '',
        toShowFurther.label + ' does not have any more children.', 5));
      expect(component.hierarchialGraph.nodes).toEqual(expectedGraph.nodes);
      expect(component.hierarchialGraph.links).toEqual(expectedGraph.links);
      expect(component.hierarchialGraph.loaded).toBe(true);

      toShowFurther.type = DAGNodeType.parent;
      toShowFurther.color = DAGNodeTypeColor.parent;
      component.showFurther(toShowFurther);
      expect(alerter.alert).toHaveBeenCalledWith(new WarningAlert('No Further Lineage', '',
        toShowFurther.label + ' does not have any more parents.', 5));
      expect(component.hierarchialGraph.nodes).toEqual(expectedGraph.nodes);
      expect(component.hierarchialGraph.links).toEqual(expectedGraph.links);
      expect(component.hierarchialGraph.loaded).toBe(true);
    }));

  it('should not call either prcoess method when the selected node is not a parent or child',
    async(inject([AlertService],
      (alerter: AlertService) => {

        const center: DataEntityLineageNode = {
          id: 'test__center',
          label: 'bdefdisplayname',
          tooltip: 'testToolTip',
          type: DAGNodeType.center,
          bdefKey: 'someSpace:someBdef',
          loadLineage: false
        };

        spyOn(component, 'processParents');
        spyOn(component, 'processChildren');

        expect((() => component.showFurther(center))).toThrow('invalidNodeType');
        expect(component.processParents).not.toHaveBeenCalled();
        expect(component.processChildren).not.toHaveBeenCalled();
      })));


  it('should have groupResultsBy that accepts a node and returns the node type', () => {
    expect(component.groupResultsBy({
      id: 'test__center',
      label: 'bdefdisplayname',
      tooltip: 'testToolTip',
      type: DAGNodeType.center,
      bdefKey: 'someSpace:someBdef',
      loadLineage: false
    })).toEqual(DAGNodeType.center);
  });

  it('should not create new lineage data on getLineage if it exists', () => {
    // as long nodes exist and get lineage is called we will not get new data
    spyOn(component, 'processParents');
    spyOn(component, 'processChildren');
    spyOn(component, 'createNode');
    spyOn(component, 'open');
    component.hierarchialGraph.nodes = [{
      id: 'test__center',
      label: 'bdefdisplayname',
      tooltip: 'testToolTip',
      type: DAGNodeType.center,
      bdefKey: 'someSpace:someBdef',
      loadLineage: false
    }];

    component.getLineage();
    expect(component.open).toHaveBeenCalledWith(component.viewLineage, 'view-lineage');
    expect(component.processChildren).not.toHaveBeenCalled();
    expect(component.processParents).not.toHaveBeenCalled();
    expect(component.createNode).not.toHaveBeenCalled();
    expect(component.hierarchialGraph.loaded).toBe(true);
  });


  it('should create new lineage data on getLineage', () => {

    const center: DataEntityLineageNode = {
      id: ['testNS', 'testBdefName', 'testUsage', 'testFTp'].join(component.idDelimiter),
      label: 'label for the display name',
      tooltip: ['testUsage', 'testFTp'].join(component.displayDelimiter),
      type: DAGNodeType.center,
      bdefKey: 'testNS:testBdefName',
      loadLineage: false
    };

    const parentsGraph: HierarchialGraph = {
      nodes: [{
        id: ['test', 'parent', 'node', 'id'].join(component.idDelimiter),
        label: 'label for the parent display name',
        tooltip: ['testPUsage', 'testPftp'].join(component.displayDelimiter),
        type: DAGNodeType.parent,
        bdefKey: 'testNS:testPBdefName',
        loadLineage: true,
        color: DAGNodeTypeColor.parent
      }],
      links: [{source: ['test', 'parent', 'node', 'id'].join(component.idDelimiter), target: center.id}]
    };

    const childrenGraph: HierarchialGraph = {
      nodes: [{
        id: ['test', 'child', 'node', 'id'].join(component.idDelimiter),
        label: 'label for the child display name',
        tooltip: ['testCUsage', 'testCftp'].join(component.displayDelimiter),
        type: DAGNodeType.child,
        bdefKey: 'testNS:testCBdefName',
        loadLineage: true,
        color: DAGNodeTypeColor.child
      }],
      links: [{target: ['test', 'child', 'node', 'id'].join(component.idDelimiter), source: center.id}]
    };

    spyOn(component, 'processParents').and.returnValue(Observable.of(parentsGraph));
    spyOn(component, 'processChildren').and.returnValue(Observable.of(childrenGraph));
    spyOn(component, 'createNode').and.returnValue(center);
    spyOn(component, 'open');

    component.getLineage();

    // opens a viewlineage modal
    expect(component.open).toHaveBeenCalledWith(component.viewLineage, 'view-lineage');
    expect(component.hierarchialGraph.nodes).toEqual(parentsGraph.nodes.concat(center).concat(childrenGraph.nodes));
    expect(component.hierarchialGraph.links).toEqual(parentsGraph.links.concat(childrenGraph.links));
    expect(component.hierarchialGraph.loaded).toBe(true);
  });

  it('should create a node that fits the schema for the graph data', () => {
    const testBdef: BusinessObjectDefinition = {
      namespace: 'test',
      businessObjectDefinitionName: 'testname',
      displayName: 'test Display Name'
    };

    const testNoDisplayName: BusinessObjectDefinition = {
      namespace: 'test',
      businessObjectDefinitionName: 'testName2',
    };

    const testFormatKey: BusinessObjectFormatKey = {
      namespace: testBdef.namespace,
      businessObjectDefinitionName: testBdef.businessObjectDefinitionName,
      businessObjectFormatUsage: 'testUSG',
      businessObjectFormatFileType: 'testFiletype'
    };

    // testing the increment of the idDictionary items by using the same bdef / format for each one.
    const expectedCenterNode: DataEntityLineageNode = {
      id: [testFormatKey.namespace, testFormatKey.businessObjectDefinitionName, testFormatKey.businessObjectFormatUsage,
        testFormatKey.businessObjectFormatFileType].join(component.idDelimiter) + component.idDelimiter + '1',
      label: testBdef.displayName,
      tooltip: [testFormatKey.businessObjectFormatUsage, testFormatKey.businessObjectFormatFileType].join(component.displayDelimiter),
      type: DAGNodeType.center,
      bdefKey: [testBdef.namespace, testBdef.businessObjectDefinitionName].join(component.displayDelimiter),
      loadLineage: false,
      color: undefined
    };

    const expectedParentNode: DataEntityLineageNode = {
      id: [testFormatKey.namespace, testFormatKey.businessObjectDefinitionName, testFormatKey.businessObjectFormatUsage,
        testFormatKey.businessObjectFormatFileType].join(component.idDelimiter) + component.idDelimiter + '2',
      label: testBdef.displayName,
      tooltip: [testFormatKey.businessObjectFormatUsage, testFormatKey.businessObjectFormatFileType].join(component.displayDelimiter),
      type: DAGNodeType.parent,
      bdefKey: [testBdef.namespace, testBdef.businessObjectDefinitionName].join(component.displayDelimiter),
      loadLineage: true,
      color: DAGNodeTypeColor.parent
    };
    const expectedChildNode: DataEntityLineageNode = {
      id: [testFormatKey.namespace, testFormatKey.businessObjectDefinitionName, testFormatKey.businessObjectFormatUsage,
        testFormatKey.businessObjectFormatFileType].join(component.idDelimiter) + component.idDelimiter + '3',
      label: testNoDisplayName.businessObjectDefinitionName,
      tooltip: [testFormatKey.businessObjectFormatUsage, testFormatKey.businessObjectFormatFileType].join(component.displayDelimiter),
      type: DAGNodeType.child,
      bdefKey: [testNoDisplayName.namespace, testNoDisplayName.businessObjectDefinitionName].join(component.displayDelimiter),
      loadLineage: true,
      color: DAGNodeTypeColor.child
    };

    expect(component.createNode(testBdef, testFormatKey, DAGNodeType.center)).toEqual(expectedCenterNode);
    expect(component.createNode(testBdef, testFormatKey, DAGNodeType.parent)).toEqual(expectedParentNode);
    expect(component.createNode(testNoDisplayName, testFormatKey, DAGNodeType.child)).toEqual(expectedChildNode);
  });


  it('should use fetchBdefs and constructGraph to processParents', () => {

    const center: DataEntityLineageNode = {
      id: ['testNS', 'testBdefName', 'testUsage', 'testFTp'].join(component.idDelimiter),
      label: 'label for the display name',
      tooltip: ['testUsage', 'testFTp'].join(component.displayDelimiter),
      type: DAGNodeType.center,
      bdefKey: 'testNS:testBdefName',
      loadLineage: false
    };

    const parentsGraph: HierarchialGraph = {
      nodes: [{
        id: ['testNS', 'testPBdefName', 'node', 'id'].join(component.idDelimiter),
        label: 'label for the parent display name',
        tooltip: ['testPUsage', 'testPftp'].join(component.displayDelimiter),
        type: DAGNodeType.parent,
        bdefKey: 'testNS:testPBdefName',
        loadLineage: true,
        color: DAGNodeTypeColor.parent
      }],
      links: [{source: ['testNS', 'testPBdefName', 'node', 'id'].join(component.idDelimiter), target: center.id}]
    }

    const format: BusinessObjectFormat = {
      namespace: 'testNS',
      businessObjectDefinitionName: 'testBdefName',
      businessObjectFormatUsage: 'testUsage',
      businessObjectFormatFileType: 'testFTp',
      partitionKey: 'testKey',
      businessObjectFormatParents: [{
        namespace: 'testNS',
        businessObjectDefinitionName: 'testPBdefName',
        businessObjectFormatUsage: 'node',
        businessObjectFormatFileType: 'id'
      }]
    };
    spyOn(component, 'fetchBdefs').and.returnValue(Observable.of([]));
    spyOn(component, 'constructGraph').and.returnValue(Observable.of(parentsGraph));


    component.processParents(center, format).subscribe((actualGraph) => {
      expect(actualGraph).toBe(parentsGraph);
      expect(component.fetchBdefs).toHaveBeenCalledWith(format.businessObjectFormatParents);
      expect(component.constructGraph).toHaveBeenCalledWith([], format.businessObjectFormatParents, DAGNodeType.parent, center)
    });
  });

  it('should use fetchBdefs and constructGraph to processParents', () => {
    const center: DataEntityLineageNode = {
      id: ['testNS', 'testBdefName', 'testUsage', 'testFTp'].join(component.idDelimiter),
      label: 'label for the display name',
      tooltip: ['testUsage', 'testFTp'].join(component.displayDelimiter),
      type: DAGNodeType.center,
      bdefKey: 'testNS:testBdefName',
      loadLineage: false
    };
    const childrenGraph: HierarchialGraph = {
      nodes: [{
        id: ['testNS', 'testCBdefName', 'node', 'id'].join(component.idDelimiter),
        label: 'label for the child display name',
        tooltip: ['testPUsage', 'testCftp'].join(component.displayDelimiter),
        type: DAGNodeType.child,
        bdefKey: 'testNS:testCBdefName',
        loadLineage: true,
        color: DAGNodeTypeColor.child
      }],
      links: [{target: ['testNS', 'testCBdefName', 'node', 'id'].join(component.idDelimiter), source: center.id}]
    };
    const format: BusinessObjectFormat = {
      namespace: 'testNS',
      businessObjectDefinitionName: 'testBdefName',
      businessObjectFormatUsage: 'testUsage',
      businessObjectFormatFileType: 'testFTp',
      partitionKey: 'testKey',
      businessObjectFormatChildren: [{
        namespace: 'testNS',
        businessObjectDefinitionName: 'testPBdefName',
        businessObjectFormatUsage: 'node',
        businessObjectFormatFileType: 'id'
      }]
    };
    spyOn(component, 'fetchBdefs').and.returnValue(Observable.of([]));
    spyOn(component, 'constructGraph').and.returnValue(Observable.of(childrenGraph));

    component.processChildren(center, format).subscribe((actualGraph) => {
      expect(actualGraph).toBe(childrenGraph);
      expect(component.fetchBdefs).toHaveBeenCalledWith(format.businessObjectFormatChildren);
      expect(component.constructGraph).toHaveBeenCalledWith([], format.businessObjectFormatChildren, DAGNodeType.child, center)
    });
  });

  it('should not fetch bdefs for empty format keys array', inject([BusinessObjectDefinitionService],
    (bdefApi: BusinessObjectDefinitionService) => {
      component.fetchBdefs([]).subscribe((bdefs) => {
        expect(bdefs).toEqual([]);
        expect(bdefApi.businessObjectDefinitionGetBusinessObjectDefinition).not.toHaveBeenCalled();
      });
    }));

  it('should fetch bdefs for each format key', inject([BusinessObjectDefinitionService], (bdefApi: BusinessObjectDefinitionService) => {

    const testFormatKeys = [{
      namespace: 'ns',
      businessObjectDefinitionName: 'name',
      businessObjectFormatUsage: 'EFW',
      businessObjectFormatFileType: 'TXT'
    },
      {
        namespace: 'ns',
        businessObjectDefinitionName: 'name2',
        businessObjectFormatUsage: 'QQA',
        businessObjectFormatFileType: 'CSV'
      }];

    (bdefApi.businessObjectDefinitionGetBusinessObjectDefinition as jasmine.Spy).and.returnValues(
      Observable.of({namespace: 'ns', businessObjectDefinitionName: 'name'}),
      Observable.of({namespace: 'ns', businessObjectDefinitionName: 'name2', displayName: 'test display Name'}));


    component.fetchBdefs(testFormatKeys).subscribe((bdefs) => {
      expect(bdefs).toEqual([{
        namespace: 'ns', businessObjectDefinitionName: 'name'
      }, {namespace: 'ns', businessObjectDefinitionName: 'name2', displayName: 'test display Name'}]);
      expect(bdefApi.businessObjectDefinitionGetBusinessObjectDefinition).toHaveBeenCalledWith(
        testFormatKeys[0].namespace,
        testFormatKeys[0].businessObjectDefinitionName
      );
      expect(bdefApi.businessObjectDefinitionGetBusinessObjectDefinition).toHaveBeenCalledWith(
        testFormatKeys[1].namespace,
        testFormatKeys[1].businessObjectDefinitionName
      )
    });
  }));

  it('should construct a graph for parents of a given node', () => {
    const testBdefs: BusinessObjectDefinition[] = [{namespace: 'testNS', businessObjectDefinitionName: 'testName'},
      {namespace: 'testNS', businessObjectDefinitionName: 'testName2', displayName: 'test display Name'}];

    const testFormatKeys = [{
      namespace: 'testNS',
      businessObjectDefinitionName: 'testName',
      businessObjectFormatUsage: 'EFW',
      businessObjectFormatFileType: 'TXT'
    },
      {
        namespace: 'testNS',
        businessObjectDefinitionName: 'testName2',
        businessObjectFormatUsage: 'QQA',
        businessObjectFormatFileType: 'CSV'
      }];

    const center: DataEntityLineageNode = {
      id: ['testNS', 'testBdefName', 'testUsage', 'testFTp'].join(component.idDelimiter),
      label: 'label for the display name',
      tooltip: ['testUsage', 'testFTp'].join(component.displayDelimiter),
      type: DAGNodeType.center,
      bdefKey: 'testNS:testBdefName',
      loadLineage: false
    };

    const parentNode1: DataEntityLineageNode = {
      id: [testFormatKeys[0].namespace, testBdefs[0].businessObjectDefinitionName, testFormatKeys[0].businessObjectFormatUsage,
        testFormatKeys[0].businessObjectFormatFileType].join(component.idDelimiter) + component.idDelimiter + '1',
      label: testBdefs[0].businessObjectDefinitionName,
      tooltip: [testFormatKeys[0].businessObjectFormatUsage, testFormatKeys[0].businessObjectFormatFileType]
        .join(component.displayDelimiter),
      type: DAGNodeType.parent,
      bdefKey: [testBdefs[0].namespace, testBdefs[0].businessObjectDefinitionName].join(component.displayDelimiter),
      loadLineage: true,
      color: DAGNodeTypeColor.parent
    };

    const parentNode2: DataEntityLineageNode = {
      id: [testFormatKeys[1].namespace, testBdefs[1].businessObjectDefinitionName, testFormatKeys[1].businessObjectFormatUsage,
        testFormatKeys[1].businessObjectFormatFileType].join(component.idDelimiter) + component.idDelimiter + '1',
      label: testBdefs[1].displayName,
      tooltip: [testFormatKeys[1].businessObjectFormatUsage, testFormatKeys[1].businessObjectFormatFileType]
        .join(component.displayDelimiter),
      type: DAGNodeType.parent,
      bdefKey: [testBdefs[1].namespace, testBdefs[1].businessObjectDefinitionName].join(component.displayDelimiter),
      loadLineage: true,
      color: DAGNodeTypeColor.parent
    };

    const expectedGraph: HierarchialGraph = {
      nodes: [parentNode1, parentNode2],
      links: [{source: parentNode1.id, target: center.id}, {source: parentNode2.id, target: center.id}]
    };


    component.constructGraph(testBdefs, testFormatKeys, DAGNodeType.parent, center).subscribe((parentsGraph) => {
      expect(parentsGraph.nodes).toEqual(expectedGraph.nodes);
      expect(parentsGraph.links).toEqual(expectedGraph.links);
    });
  });


  it('should construct a graph for children of a given node', () => {
    const testBdefs: BusinessObjectDefinition[] = [{namespace: 'testNS', businessObjectDefinitionName: 'testName'},
      {namespace: 'testNS', businessObjectDefinitionName: 'testName2', displayName: 'test display Name'}];

    const testFormatKeys = [{
      namespace: 'testNS',
      businessObjectDefinitionName: 'testName',
      businessObjectFormatUsage: 'EFW',
      businessObjectFormatFileType: 'TXT'
    },
      {
        namespace: 'testNS',
        businessObjectDefinitionName: 'testName2',
        businessObjectFormatUsage: 'QQA',
        businessObjectFormatFileType: 'CSV'
      }];

    const center: DataEntityLineageNode = {
      id: ['testNS', 'testBdefName', 'testUsage', 'testFTp'].join(component.idDelimiter),
      label: 'label for the display name',
      tooltip: ['testUsage', 'testFTp'].join(component.displayDelimiter),
      type: DAGNodeType.center,
      bdefKey: 'testNS:testBdefName',
      loadLineage: false
    };

    const childNode1: DataEntityLineageNode = {
      id: [testFormatKeys[0].namespace, testBdefs[0].businessObjectDefinitionName, testFormatKeys[0].businessObjectFormatUsage,
        testFormatKeys[0].businessObjectFormatFileType].join(component.idDelimiter) + component.idDelimiter + '1',
      label: testBdefs[0].businessObjectDefinitionName,
      tooltip: [testFormatKeys[0].businessObjectFormatUsage, testFormatKeys[0].businessObjectFormatFileType]
        .join(component.displayDelimiter),
      type: DAGNodeType.child,
      bdefKey: [testBdefs[0].namespace, testBdefs[0].businessObjectDefinitionName].join(component.displayDelimiter),
      loadLineage: true,
      color: DAGNodeTypeColor.child
    };

    const childNode2: DataEntityLineageNode = {
      id: [testFormatKeys[1].namespace, testBdefs[1].businessObjectDefinitionName, testFormatKeys[1].businessObjectFormatUsage,
        testFormatKeys[1].businessObjectFormatFileType].join(component.idDelimiter) + component.idDelimiter + '1',
      label: testBdefs[1].displayName,
      tooltip: [testFormatKeys[1].businessObjectFormatUsage, testFormatKeys[1].businessObjectFormatFileType]
        .join(component.displayDelimiter),
      type: DAGNodeType.child,
      bdefKey: [testBdefs[1].namespace, testBdefs[1].businessObjectDefinitionName].join(component.displayDelimiter),
      loadLineage: true,
      color: DAGNodeTypeColor.child
    };

    const expectedGraph: HierarchialGraph = {
      nodes: [childNode1, childNode2],
      links: [{target: childNode1.id, source: center.id}, {target: childNode2.id, source: center.id}]
    };


    component.constructGraph(testBdefs, testFormatKeys, DAGNodeType.child, center).subscribe((parentsGraph) => {
      expect(parentsGraph.nodes).toEqual(expectedGraph.nodes);
      expect(parentsGraph.links).toEqual(expectedGraph.links);
    });
  });

  it('should set ddl error when get ddl fails', inject([BusinessObjectFormatService], (formatApi: BusinessObjectFormatService) => {
    component.descriptiveFormat = {
      namespace: 'testNS',
      businessObjectDefinitionName: 'testName',
      businessObjectFormatUsage: 'testUSG',
      businessObjectFormatFileType: 'testFileType',
      partitionKey: 'testKey'
    };

    const ddlSpy = (formatApi.businessObjectFormatGenerateBusinessObjectFormatDdl as jasmine.Spy);
    ddlSpy.and.returnValue(Observable.throw({
      status: '500',
      statusText: 'Internal Server Error',
      url: 'theDDLURL',
      json: () => {
        return {message: 'Stuff blew up'}
      }
    }));
    component.getDDL();
    expect(component.ddlError).toEqual(new DangerAlert('HTTP Error: 500 Internal Server Error', 'URL: theDDLURL', 'Info: Stuff blew up'));
    expect(formatApi.defaultHeaders.get('skipAlert')).toBe(null);
  }));

  it('should process description updates properly', async(inject([BusinessObjectDefinitionColumnService, AlertService],
    (columnApi: BusinessObjectDefinitionColumnService, alerter: AlertService) => {
      component.bdef = {
        namespace: 'test_ns',
        businessObjectDefinitionName: 'test_bdef'
      };

      const initialMockColumn: DataEntityWithFormatColumn = {
        businessObjectDefinitionColumnName: 'testName',
        schemaColumnName: 'testSchemaColumnName',
        exists: true,
        description: 'test current description',
        type: 'varchar (30)'
      };
      let mockColumn = {...initialMockColumn};
      const mockEvent: EditEvent = {
        text: 'test new description'
      };

      const successResponse: BusinessObjectDefinitionColumn = {
        businessObjectDefinitionColumnKey: {
          namespace: 'test_ns',
          businessObjectDefinitionColumnName: 'testName',
          businessObjectDefinitionName: 'test_bdef'
        },
        schemaColumnName: 'testSchemaColumnName',
        description: mockEvent.text
      };

      const successOutput = {...mockColumn, description: mockEvent.text};

      const updateSpy = columnApi.businessObjectDefinitionColumnUpdateBusinessObjectDefinitionColumn as jasmine.Spy
      updateSpy.and.returnValue(Observable.of(successResponse));
      const alertSpy = alerter.alert as jasmine.Spy;

      // for success
      component.saveDataEntityColumnDescriptionChange(mockEvent, mockColumn);

      expect(updateSpy).toHaveBeenCalledWith(component.bdef.namespace,
        component.bdef.businessObjectDefinitionName,
        mockColumn.businessObjectDefinitionColumnName, {description: mockEvent.text});

      expect(columnApi.defaultHeaders.get('skipAlert')).toBeNull();
      // updates the text on success
      expect(mockColumn).toEqual(successOutput);
      expect(alertSpy).toHaveBeenCalledWith(
        new SuccessAlert('Success!', '', 'Your column edit was saved.')
      );

      updateSpy.calls.reset();

      // should do absolutely nothing when the description didn't change
      mockEvent.text = mockColumn.description;
      component.saveDataEntityColumnDescriptionChange(mockEvent, mockColumn);

      expect(updateSpy).not.toHaveBeenCalled();

      updateSpy.calls.reset();

      mockColumn = {...initialMockColumn};
      // for failure
      updateSpy.and.returnValue(Observable.throw({status: 404}));
      component.saveDataEntityColumnDescriptionChange(mockEvent, mockColumn);

      expect(updateSpy).toHaveBeenCalledWith(component.bdef.namespace,
        component.bdef.businessObjectDefinitionName,
        mockColumn.businessObjectDefinitionColumnName, {description: mockEvent.text});

      expect(columnApi.defaultHeaders.get('skipAlert')).toBeNull();
      // does not update the text on error
      expect(mockColumn).toEqual(initialMockColumn);
      expect(alertSpy).toHaveBeenCalledWith(
        new DangerAlert('Failure!', '', 'Your column description edit could not be saved. Try again or contact the support team.')
      );
    })));

  it('should process name updates properly', async(inject([BusinessObjectDefinitionColumnService, AlertService],
    (columnApi: BusinessObjectDefinitionColumnService, alerter: AlertService) => {
      component.bdef = {
        namespace: 'test_ns',
        businessObjectDefinitionName: 'test_bdef'
      };

      const mockColumn: DataEntityWithFormatColumn = {
        businessObjectDefinitionColumnName: 'testName',
        schemaColumnName: 'testSchemaColumnName',
        exists: true,
        description: 'test current description',
        type: 'varchar (30)'
      };

      const mockEvent: EditEvent = {
        text: 'test new name'
      };

      const succesCreateResponse: BusinessObjectDefinitionColumn = {
        businessObjectDefinitionColumnKey: {
          namespace: component.bdef.namespace,
          businessObjectDefinitionColumnName: mockEvent.text,
          businessObjectDefinitionName: component.bdef.businessObjectDefinitionName
        },
        schemaColumnName: mockColumn.schemaColumnName,
        description: mockColumn.description
      };

      const succesDeleteResponse: BusinessObjectDefinitionColumn = {
        businessObjectDefinitionColumnKey: {
          namespace: component.bdef.namespace,
          businessObjectDefinitionColumnName: mockColumn.businessObjectDefinitionColumnName,
          businessObjectDefinitionName: component.bdef.businessObjectDefinitionName
        },
        schemaColumnName: mockColumn.schemaColumnName,
        description: mockColumn.description
      };

      const deleteSpy = columnApi.businessObjectDefinitionColumnDeleteBusinessObjectDefinitionColumn as jasmine.Spy;
      const createSpy = columnApi.businessObjectDefinitionColumnCreateBusinessObjectDefinitionColumn as jasmine.Spy;

      const alertSpy = alerter.alert as jasmine.Spy;

      const failedOutput = {...mockColumn};

      // for failure on delete
      deleteSpy.and.returnValue(Observable.throw({status: 404}));
      component.saveDataEntityColumnNameChange(mockEvent, mockColumn);

      expect(deleteSpy).toHaveBeenCalledWith(component.bdef.namespace,
        component.bdef.businessObjectDefinitionName,
        'testName');

      expect(columnApi.defaultHeaders.get('skipAlert')).toBeNull();
      // does not update the text on success
      expect(mockColumn).toEqual(failedOutput);
      expect(alertSpy).toHaveBeenCalledWith(
        new DangerAlert('Failure!', '', 'Your column create or name change could not be saved. Try again or contact the support team.')
      );

      deleteSpy.calls.reset();

      // for failure after delete on create
      deleteSpy.and.returnValue(Observable.of(succesDeleteResponse));
      createSpy.and.returnValue(Observable.throw({status: 500}));
      component.saveDataEntityColumnNameChange(mockEvent, mockColumn);

      expect(deleteSpy).toHaveBeenCalledWith(component.bdef.namespace,
        component.bdef.businessObjectDefinitionName,
        'testName');
      expect(createSpy).toHaveBeenCalledWith(succesCreateResponse);

      expect(columnApi.defaultHeaders.get('skipAlert')).toBeNull();
      // does not update the text on error
      expect(mockColumn).toEqual(failedOutput);
      expect(alertSpy).toHaveBeenCalledWith(
        new DangerAlert('Failure!', '', 'Your column create or name change could not be saved. Try again or contact the support team.')
      );

      deleteSpy.calls.reset();
      createSpy.calls.reset();

      // success for when column exists
      deleteSpy.and.returnValue(Observable.of(succesDeleteResponse));
      createSpy.and.returnValue(Observable.of(succesCreateResponse));
      component.saveDataEntityColumnNameChange(mockEvent, mockColumn);

      expect(deleteSpy).toHaveBeenCalledWith(component.bdef.namespace,
        component.bdef.businessObjectDefinitionName,
        'testName');
      expect(createSpy).toHaveBeenCalledWith(succesCreateResponse);

      expect(columnApi.defaultHeaders.get('skipAlert')).toBeNull();
      const successOutput1: DataEntityWithFormatColumn = {
        ...mockColumn,
        businessObjectDefinitionColumnName: mockEvent.text
      };
      // does not update the text on error
      expect(mockColumn).toEqual(successOutput1);
      expect(alertSpy).toHaveBeenCalledWith(
        new SuccessAlert('Success!', '', 'Your column creation was saved.')
      );

      deleteSpy.calls.reset();
      createSpy.calls.reset();

      succesCreateResponse.description = '';
      mockColumn.businessObjectDefinitionColumnName = '';
      mockColumn.description = '';
      mockColumn.exists = false;
      // success for when column does not exist exists
      createSpy.and.returnValue(Observable.of(succesCreateResponse));
      component.saveDataEntityColumnNameChange(mockEvent, mockColumn);

      expect(deleteSpy).not.toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith(succesCreateResponse);

      expect(columnApi.defaultHeaders.get('skipAlert')).toBeNull();
      const successOutput2: DataEntityWithFormatColumn = {
        ...mockColumn,
        exists: true,
        businessObjectDefinitionColumnName: succesCreateResponse.businessObjectDefinitionColumnKey.businessObjectDefinitionColumnName
      };
      // does not update the text on error
      expect(mockColumn).toEqual(successOutput2);
      expect(alertSpy).toHaveBeenCalledWith(
        new SuccessAlert('Success!', '', 'Your column creation was saved.')
      );

      deleteSpy.calls.reset();
      createSpy.calls.reset();

      // should do absolutely nothing when the name didn't change;
      mockEvent.text = mockColumn.businessObjectDefinitionColumnName;
      component.saveDataEntityColumnNameChange(mockEvent, mockColumn);

      expect(deleteSpy).not.toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();

    })));

  it('should hide or show editing based on access level',
    inject([UserService, ActivatedRoute],
      (us: UserService, activeRoute: ActivatedRouteStub) => {

        const testAuthorizations: UserAuthorizations = {
          userId: 'test_user',
          namespaceAuthorizations: [],
          securityFunctions: []
        };

        spyOn(component, 'getBdefDetails').and.callFake(() => {
          component.bdefColumns = [
            {
              businessObjectDefinitionColumnName: 'test name',
              description: 'test description',
              schemaColumnName: 'testSchemaColumnName',
              type: 'varchar (30)',
              exists: true
            }
          ]
        });

        activeRoute.testData = {
          resolvedData: {
            bdef: expectedBdef
          }
        };


        const userSubject = new ReplaySubject<UserAuthorizations>();
        // using a mocked UserService
        (us as any).user = userSubject.asObservable();
        // no namespace or roles set
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateColumnsNotAuthorizaed();

        // namespace but no write
        testAuthorizations.namespaceAuthorizations = [{
          namespace: expectedBdef.namespace,
          namespacePermissions: [NamespaceAuthorization.NamespacePermissionsEnum.READ]
        }];
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateColumnsNotAuthorizaed();

        // namespace with write but no role
        testAuthorizations.namespaceAuthorizations[0].namespacePermissions.push(NamespaceAuthorization.NamespacePermissionsEnum.WRITE);
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateColumnsNotAuthorizaed();

        // role but no namespace rights
        testAuthorizations.securityFunctions = ['FN_BUSINESS_OBJECT_DEFINITION_COLUMNS_POST'];
        userSubject.next(testAuthorizations);
        fixture.detectChanges();
        validateColumnsAuthorizaed();
      }));

  function validateColumnsNotAuthorizaed() {
    // make sure we are on the columns tab
    fixture.debugElement.query(By.css('ngb-tabset .nav-item:nth-child(2) .nav-link')).nativeElement.click();
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tr.ui-widget-content'));
    rows.forEach((row) => {
      const data = row.queryAll(By.css('td'));
      expect(data[0].query(By.css('sd-edit')).nativeElement.style.display).toEqual('none');
      expect(data[0].query(By.css('.no-auth-name')).nativeElement.style.display).toEqual('');

      expect(data[1].query(By.css('sd-edit')).nativeElement.style.display).toEqual('none');
      expect(data[1].query(By.css('.no-auth-description')).nativeElement.style.display).toEqual('');
    });
  }

  function validateColumnsAuthorizaed() {
    // make sure we are on the columns tab
    fixture.debugElement.query(By.css('ngb-tabset .nav-item:nth-child(2) .nav-link')).nativeElement.click();
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tr.ui-widget-content'));
    rows.forEach((row) => {
      const data = row.queryAll(By.css('td'));
      expect(data[0].query(By.css('.no-auth-name')).nativeElement.style.display).toEqual('');
      expect(data[0].query(By.css('sd-edit')).nativeElement.style.display).toEqual('none');

      expect(data[1].query(By.css('.no-auth-description')).nativeElement.style.display).toEqual('');
      expect(data[1].query(By.css('sd-edit')).nativeElement.style.display).toEqual('none');
    });
  }
});

