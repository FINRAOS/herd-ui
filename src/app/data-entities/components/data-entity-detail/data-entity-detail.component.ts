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
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { default as AppIcons } from '../../../shared/utils/app-icons';
import { Action } from '../../../shared/components/side-action/side-action.component';
import {
  BusinessObjectDefinition,
  BusinessObjectDefinitionColumn,
  BusinessObjectDefinitionColumnCreateRequest,
  BusinessObjectDefinitionColumnSearchRequest,
  BusinessObjectDefinitionColumnService,
  BusinessObjectDefinitionColumnUpdateRequest,
  BusinessObjectDefinitionDescriptionSuggestionSearchRequest,
  BusinessObjectDefinitionDescriptionSuggestionService,
  BusinessObjectDefinitionDescriptiveInformationUpdateRequest,
  BusinessObjectDefinitionSampleDataFileKey,
  BusinessObjectDefinitionService,
  BusinessObjectDefinitionSubjectMatterExpertService,
  BusinessObjectFormat,
  BusinessObjectFormatDdlRequest,
  BusinessObjectFormatKey,
  BusinessObjectFormatService,
  DownloadBusinessObjectDefinitionSampleDataFileSingleInitiationRequest,
  NamespaceAuthorization,
  SubjectMatterExpert,
  SubjectMatterExpertService,
  UploadAndDownloadService
} from '@herd/angular-client';
import { WarningAlert } from './../../../core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService, DangerAlert, SuccessAlert } from '../../../core/services/alert.service';
import { NgbModal, NgbModalRef, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as shape from 'd3-shape';
import { EditEvent } from 'app/shared/components/edit/edit.component';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, finalize, flatMap, map } from 'rxjs/operators';
import { AuthMap } from '../../../shared/directive/authorized/authorized.directive';
import { of } from 'rxjs/internal/observable/of';
import { environment } from '../../../../environments/environment';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { DataTable } from 'primeng/components/datatable/datatable';
import { BeastService } from '../../../shared/services/beast.service';
import { BeastComponents } from '../../../shared/services/beast-components.enum';
import { BeastActions } from '../../../shared/services/beast-actions.enum';

export enum DAGNodeType {
  parent = 'parent',
  child = 'child',
  center = 'center'
}

export enum DAGNodeTypeColor {
  parent = '#05af7e',
  child = '#55ACD2'
}

export interface DAGLink {
  source: string;
  target: string;
}

export interface HierarchialGraph {
  nodes: DataEntityLineageNode[];
  links: DAGLink[];
  loaded?: boolean;
}

export interface DataEntityLineageNode {
  id: string;
  label: string;
  tooltip: string;
  type: DAGNodeType;
  bdefKey: string;
  loadLineage: boolean;
  color?: DAGNodeTypeColor;
}

export interface DataEntityWithFormatColumn {
  businessObjectDefinitionColumnName: string;
  description: string;
  schemaColumnName: string;
  type: string;
  // if the column existed when the page loaded
  exists: boolean;
}

export type ExtendedFormatKey = BusinessObjectFormatKey & {
  relationalSchemaName: string,
  relationalTableName: string
};

@Component({
  selector: 'sd-data-entity-detail',
  templateUrl: './data-entity-detail.component.html',
  styleUrls: ['./data-entity-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataEntityDetailComponent implements OnInit {
  authMap = AuthMap;
  editDescriptiveContentPermissions = [NamespaceAuthorization.NamespacePermissionsEnum.WRITE,
    NamespaceAuthorization.NamespacePermissionsEnum.WRITEDESCRIPTIVECONTENT];
  emptyColumnsMessage = '';
  sideActions: Action[];
  sampleDataFileUrl: string;
  ddl = '';
  ddlError: DangerAlert;
  config = {lineNumbers: true, mode: 'text/x-go', readOnly: true};
  businessObjectDefinitionDescriptionSuggestions: Array<any>;

  bdef: BusinessObjectDefinition = {} as BusinessObjectDefinition;
  formats: ExtendedFormatKey[] = [];
  relationalTableFileType = 'RELATIONAL_TABLE';
  disableSampleData = true;
  descriptiveFormat: BusinessObjectFormat;
  documentSchema: string;
  documentSchemaUrl: string;
  bdefColumns: DataEntityWithFormatColumn[] = [];
  bdefPartitions: DataEntityWithFormatColumn[] = [];
  mergedBdefColumns: DataEntityWithFormatColumn[] = [];
  smes: SubjectMatterExpert[];

  documentSchemaConfig = {
    lineNumbers: true,
    lineWrapping: true,
    mode: 'text/x-go',
    readOnly: true,
    scrollbarStyle: null,
    fixedGutter: true
  };

  editorOptions: JsonEditorOptions;
  documentSchemaJson: any;
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  // variables for lineage visualization
  @ViewChild('viewLineage') viewLineage: TemplateRef<any>;
  public popover: NgbPopover;
  colors: any[] = [{name: 'parent', value: '#05af7e'},
    {name: 'child', value: '#55ACD2'},
    {name: 'center', value: '#000000'}];
  hierarchialGraph: HierarchialGraph = {nodes: [], links: []};
  curve: any = shape.curveBundle;
  modalReference: NgbModalRef;
  displayDelimiter = ':';
  idDelimiter = '__';
  dataObjectListPermissionsResolution = environment.dataObjectListPermissionsResolution;

  nodeIdCount: { [baseId: string]: number } = {};

  bdefCols = [
    {
      templateField: 'businessObjectDefinitionColumnName',
      field: 'businessObjectDefinitionColumnName',
      header: 'Business Name',
      hide: false,
      sortable: true,
      style: {'width': '100px'}
    }, {
      templateField: 'description',
      field: 'description',
      header: 'Description',
      hide: false,
      sortable: true,
      style: {'width': '250px'}
    }, {
      templateField: 'schemaColumnName',
      field: 'schemaColumnName',
      header: 'Physical Name',
      hide: false,
      sortable: true,
      style: {'width': '100px'}
    }, {
      templateField: 'type',
      field: 'type',
      header: 'Data Type',
      hide: false,
      sortable: true,
      style: {'width': '100px'}
    }];

  constructor(
    private route: ActivatedRoute,
    private businessObjectDefinitionApi: BusinessObjectDefinitionService,
    private uploadAndDownloadApi: UploadAndDownloadService,
    private businessObjectFormatApi: BusinessObjectFormatService,
    private businessObjectDefinitionColumnApi: BusinessObjectDefinitionColumnService,
    private businessObjectDefinitionSubjectMatterExpertApi: BusinessObjectDefinitionSubjectMatterExpertService,
    private subjectMatterExpertApi: SubjectMatterExpertService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private bs: BeastService,
    private businessObjectDefinitionDescriptionSuggestionService: BusinessObjectDefinitionDescriptionSuggestionService
  ) {
  }

  groupResultsBy = (node: DataEntityLineageNode) => node.type;

  ngOnInit() {
    this.bdef = this.route.snapshot.data.resolvedData.bdef;

    // get all description suggestion
    this.getAllPendingSuggestion(this.bdef.namespace, this.bdef.businessObjectDefinitionName, 'PENDING');

    // Load bdef details
    this.getBdefDetails();

    // Load the formats
    this.getFormats();

    // Load the smes
    this.getSMEContactDetails().subscribe((data: any) => {
      this.smes = data;
    });

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'tree'];
  }

  alertForEditingSchema(event = null) {
    this.alertService.alert(new WarningAlert('Editing document schema is not supported. Any changes made will be lost.',
      '', '', 8));
  }

  alertSuccessfulCopy() {
    this.alertService.alert(new SuccessAlert(
      'Success!', '', 'DDL Successfully copied to clipboard'
    ));
  }

  export(e: DataTable) {
    this.bs.sendBeastActionEvent(BeastActions.downloadCsv, BeastComponents.dataObjects,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
    e.exportCSV();
  }

  sendViewDataObjectListActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.viewDataObejctList, BeastComponents.dataObjects,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
  }

  sendViewDocumentSchemaActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.viewDocumentSchema, BeastComponents.dataObjects,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
  }

  sendViewColumnsActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.viewColumns, BeastComponents.dataObjects,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
  }

  sendEditDescriptionActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.editDescription, BeastComponents.dataEntities,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
  }

  sendDownloadSampleDataActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.downloadSampleData, BeastComponents.dataEntities,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
  }

  sendViewLineageActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.viewLineage, BeastComponents.dataEntities,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
  }

  sendEditNameActionEvent() {
    this.bs.sendBeastActionEvent(BeastActions.editName, BeastComponents.dataEntities,
      this.bdef.namespace, this.bdef.businessObjectDefinitionName);
  }

  saveDataEntityColumnNameChange(event: EditEvent, col: DataEntityWithFormatColumn) {
    const createColumn = (): Observable<BusinessObjectDefinitionColumn> => {
      const request: BusinessObjectDefinitionColumnCreateRequest = {
        description: col.description,
        schemaColumnName: col.schemaColumnName,
        businessObjectDefinitionColumnKey: {
          namespace: this.bdef.namespace,
          businessObjectDefinitionName: this.bdef.businessObjectDefinitionName,
          businessObjectDefinitionColumnName: event.text
        }
      };
      return this.businessObjectDefinitionColumnApi.businessObjectDefinitionColumnCreateBusinessObjectDefinitionColumn(request);
    };

    let obs: Observable<BusinessObjectDefinitionColumn>;

    // if it exists and we are changing values then we must delete the previous and then create the new column
    this.businessObjectDefinitionColumnApi.defaultHeaders.append('skipAlert', 'true');
    if (col.exists) {
      if (event.text !== col.businessObjectDefinitionColumnName) {
        obs = this.businessObjectDefinitionColumnApi
          .businessObjectDefinitionColumnDeleteBusinessObjectDefinitionColumn(this.bdef.namespace,
            this.bdef.businessObjectDefinitionName, col.businessObjectDefinitionColumnName).pipe(flatMap(createColumn));
      } else {
        // don't do anything at all if the names are the same.
        return;
      }
    } else {
      // otherwise we can safely create the column
      obs = createColumn();
    }

    obs.pipe(finalize(() => {
      this.businessObjectDefinitionColumnApi.defaultHeaders.delete('skipAlert');
    })).subscribe((resp) => {
      col.exists = true;
      col.businessObjectDefinitionColumnName = resp.businessObjectDefinitionColumnKey.businessObjectDefinitionColumnName;
      this.alertService.alert(new SuccessAlert('Success!', '', 'Your column creation was saved.'));
      return resp;
    }, (error) => {
      this.alertService.alert(
        new DangerAlert('Failure!', '', 'Your column create or name change could not be saved. Try again or contact the support team.')
      );
    });
  }

  // this can never be called unless the column exists due to the editor being disabled
  // for description unless the column existed when the page first loaded
  saveDataEntityColumnDescriptionChange(event: EditEvent, col: DataEntityWithFormatColumn) {
    this.businessObjectDefinitionColumnApi.defaultHeaders.append('skipAlert', 'true');
    const request: BusinessObjectDefinitionColumnUpdateRequest = {
      description: event.text
    };

    if (col.description !== event.text) {
      this.businessObjectDefinitionColumnApi
        .businessObjectDefinitionColumnUpdateBusinessObjectDefinitionColumn(this.bdef.namespace,
          this.bdef.businessObjectDefinitionName, col.businessObjectDefinitionColumnName, request)
        .pipe(finalize(() => {
          this.businessObjectDefinitionColumnApi.defaultHeaders.delete('skipAlert');
        })).subscribe((resp) => {
        col.description = resp.description;
        this.alertService.alert(new SuccessAlert('Success!', '', 'Your column edit was saved.'));
      }, (error) => {
        this.alertService.alert(
          new DangerAlert('Failure!', '', 'Your column description edit could not be saved. Try again or contact the support team.'));
      });
    }
  }

  saveDataEntityDisplayName(event: EditEvent) {
    const bdefUpdateRequest: BusinessObjectDefinitionDescriptiveInformationUpdateRequest = {
      description: this.bdef.description,
      displayName: event.text,
      descriptiveBusinessObjectFormat: this.bdef.descriptiveBusinessObjectFormat
    };

    this.businessObjectDefinitionApi
      .businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation(this.bdef.namespace,
        this.bdef.businessObjectDefinitionName, bdefUpdateRequest)
      .subscribe(
        (success) => {
          this.bdef.displayName = event.text;
          this.alertService.alert(new SuccessAlert('Success!', 'Your edit saved successfully.', ''));
        },
        (error) => {
          this.alertService.alert(new DangerAlert('Failure!', 'Unable to save your edit. Try again or contact support team.', ''));
        });

    this.sendEditNameActionEvent();
  }

  saveDataEntityDescription(event: EditEvent) {
    const bdefUpdateRequest: BusinessObjectDefinitionDescriptiveInformationUpdateRequest = {
      description: event.text,
      displayName: this.bdef.displayName,
      descriptiveBusinessObjectFormat: this.bdef.descriptiveBusinessObjectFormat
    };

    this.businessObjectDefinitionApi
      .businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation(this.bdef.namespace,
        this.bdef.businessObjectDefinitionName, bdefUpdateRequest)
      .subscribe(
        (success) => {
          this.bdef.description = event.text;
          this.alertService.alert(new SuccessAlert('Success!', 'Your edit saved successfully.', ''));
        },
        (error) => {
          this.alertService.alert(new DangerAlert('Failure!', 'Unable to save your edit. Try again or contact support team.', ''));
        });

    this.sendEditDescriptionActionEvent();
  }

  suggestionApproved(event) {
    this.bdef.description = event.text;
    if (this.businessObjectDefinitionDescriptionSuggestions.length <= 0) {
      this.close();
    }
  }

  getBdefDetails() {

    if (this.bdef.sampleDataFiles && this.bdef.sampleDataFiles.length > 0) {
      this.disableSampleData = false;
    }
    this.populateSideActions();

    const body: BusinessObjectDefinitionColumnSearchRequest = {
      businessObjectDefinitionColumnSearchFilters: [{
        businessObjectDefinitionColumnSearchKeys: [{
          namespace: this.bdef.namespace,
          businessObjectDefinitionName: this.bdef.businessObjectDefinitionName
        }]
      }]
    };

    const params = {
      fields: 'description,schemaColumnName'
    };

    // Fetch the descriptive format
    if (this.bdef.descriptiveBusinessObjectFormat) {
      this.businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat(
        this.bdef.namespace, this.bdef.businessObjectDefinitionName, this.bdef.descriptiveBusinessObjectFormat.businessObjectFormatUsage,
        this.bdef.descriptiveBusinessObjectFormat.businessObjectFormatFileType,
        this.bdef.descriptiveBusinessObjectFormat.businessObjectFormatVersion)
        .subscribe((response) => {
          this.descriptiveFormat = response;
          if (this.descriptiveFormat && (this.descriptiveFormat.documentSchema || this.descriptiveFormat.documentSchemaUrl)) {
            this.documentSchema = this.descriptiveFormat.documentSchema;
            try {
              this.documentSchemaJson = JSON.parse(this.documentSchema);
            } catch (e) {
              this.documentSchemaJson = this.documentSchema;
            }
            this.documentSchemaUrl = this.descriptiveFormat.documentSchemaUrl;
          }
          // Fetch the columns
          this.businessObjectDefinitionColumnApi.businessObjectDefinitionColumnSearchBusinessObjectDefinitionColumns(
            body, params.fields).subscribe((columns) => {
            if (this.descriptiveFormat.schema) {
              // get ddl to show in ui
              this.getDDL();
              // Fetch the columns that match the schema cols of descriptive format
              // By setting to the .map output we make sure that we treat datatable data as immutable
              this.bdefColumns = this.descriptiveFormat.schema.columns.map<DataEntityWithFormatColumn>((formatColumn) => {
                let searchColumnBusinessName = '';
                let searchColumnDescription = '';
                const exists: boolean = columns.businessObjectDefinitionColumns.some((searchColumn) => {
                  if (searchColumn.schemaColumnName === formatColumn.name) {
                    searchColumnBusinessName = searchColumn.businessObjectDefinitionColumnKey
                      .businessObjectDefinitionColumnName;
                    searchColumnDescription = searchColumn.description;
                    return true;
                  }
                  return false;
                });

                let dataType = formatColumn.type;
                if (formatColumn.size !== null) {
                  dataType += ' (' + formatColumn.size + ')';
                }
                return {
                  businessObjectDefinitionColumnName: searchColumnBusinessName,
                  description: searchColumnDescription,
                  schemaColumnName: formatColumn.name,
                  type: dataType,
                  exists
                };
              });
              this.bdefPartitions = this.descriptiveFormat.schema.partitions.map<DataEntityWithFormatColumn>((formatColumn) => {
                let searchColumnBusinessName = '';
                let searchColumnDescription = '';
                const exists: boolean = columns.businessObjectDefinitionColumns.some((searchColumn) => {
                  if (searchColumn.schemaColumnName === formatColumn.name) {
                    searchColumnBusinessName = searchColumn.businessObjectDefinitionColumnKey
                      .businessObjectDefinitionColumnName;
                    searchColumnDescription = searchColumn.description;
                    return true;
                  }
                  return false;
                });

                let dataType = formatColumn.type;
                if (formatColumn.size !== null) {
                  dataType += ' (' + formatColumn.size + ')';
                }
                return {
                  businessObjectDefinitionColumnName: searchColumnBusinessName,
                  description: searchColumnDescription,
                  schemaColumnName: formatColumn.name,
                  type: dataType,
                  exists
                };
              });
              this.getMergedBdefColumns();
            } else {
              this.emptyColumnsMessage = 'Cannot display columns - No Schema columns present in specified Descriptive Format';
            }
          });
        });
    } else {
      this.emptyColumnsMessage = 'Cannot display columns - No Descriptive Format defined for this Data Entity';
    }
  }

  // This method merges Bdef partitions and Bdef columns without duplicate
  getMergedBdefColumns() {
    // Add partition name to the hashset.
    const partitionNameSet: Set<string> = new Set<string>();
    for (let i = 0; i < this.bdefPartitions.length; i++) {
      partitionNameSet.add(this.bdefPartitions[i].schemaColumnName);
    }

    // Create a deep copy of partition entries.
    this.mergedBdefColumns = this.bdefPartitions.map(x => Object.assign({}, x));

    // Add non-duplicated bdef column to mergedBdefColumns.
    for (let i = 0; i < this.bdefColumns.length; i++) {
      if (partitionNameSet.has(this.bdefColumns[i].schemaColumnName)) {
        continue;
      }
      this.mergedBdefColumns.push(this.bdefColumns[i]);
    }
  }

  getFormats() {
    // Get the list of Business Object Formats
    this.businessObjectFormatApi.defaultHeaders.append('skipAlert', 'true');
    this.businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormats(
      this.bdef.namespace, this.bdef.businessObjectDefinitionName, true
    ).pipe(finalize(() => {
      this.businessObjectFormatApi.defaultHeaders.delete('skipAlert');
    })).subscribe((response) => {
      for (const formatKey of response.businessObjectFormatKeys) {
        const extendedFormatKey: ExtendedFormatKey = {
          namespace: formatKey.namespace,
          businessObjectDefinitionName: formatKey.businessObjectDefinitionName,
          businessObjectFormatUsage: formatKey.businessObjectFormatUsage,
          businessObjectFormatFileType: formatKey.businessObjectFormatFileType,
          businessObjectFormatVersion: formatKey.businessObjectFormatVersion,
          relationalSchemaName: undefined,
          relationalTableName: undefined
        };
        this.formats.push(extendedFormatKey);
      }
      // iterate thru format keys of type relational table, fetch the format and augment with relational
      // table information
      for (const extendableFormatKey of this.formats.filter(formatKey => this.isRelationalTable(formatKey))) {
        this.businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat(
          extendableFormatKey.namespace,
          extendableFormatKey.businessObjectDefinitionName,
          extendableFormatKey.businessObjectFormatUsage,
          extendableFormatKey.businessObjectFormatFileType,
          extendableFormatKey.businessObjectFormatVersion
        ).subscribe(getFormatResponse => {
          const index: number = this.formats.findIndex(formatKey => (
            formatKey.businessObjectFormatUsage === extendableFormatKey.businessObjectFormatUsage
            && formatKey.businessObjectFormatFileType === extendableFormatKey.businessObjectFormatFileType
            && formatKey.businessObjectFormatVersion === extendableFormatKey.businessObjectFormatVersion));

          // replace format key element in-place with a new object containing relational table information
          this.formats[index] = {
            namespace: extendableFormatKey.namespace,
            businessObjectDefinitionName: extendableFormatKey.businessObjectDefinitionName,
            businessObjectFormatUsage: extendableFormatKey.businessObjectFormatUsage,
            businessObjectFormatFileType: extendableFormatKey.businessObjectFormatFileType,
            relationalSchemaName: getFormatResponse.relationalSchemaName,
            relationalTableName: getFormatResponse.relationalTableName,
            businessObjectFormatVersion: getFormatResponse.businessObjectFormatVersion
          };
        });
      }
    }, (error) => {
      this.formats = [];
    });
  }

  updateDescriptiveFormat(format: BusinessObjectFormatKey, recommended: boolean) {
    const businessObjectDefinitionDescriptiveInformationUpdateRequest: BusinessObjectDefinitionDescriptiveInformationUpdateRequest =
      recommended ? {description: this.bdef.description, displayName: this.bdef.displayName} : {
        description: this.bdef.description,
        displayName: this.bdef.displayName,
        descriptiveBusinessObjectFormat: {
          businessObjectFormatUsage: format.businessObjectFormatUsage,
          businessObjectFormatFileType: format.businessObjectFormatFileType
        }
      };

    this.businessObjectDefinitionApi.businessObjectDefinitionUpdateBusinessObjectDefinitionDescriptiveInformation(
      format.namespace, format.businessObjectDefinitionName,
      businessObjectDefinitionDescriptiveInformationUpdateRequest
    ).subscribe(
      (businessObjectDefinition) => {
        // all we need to do is set this.bdef.descriptiveBusinessObjectFormat
        // getBdefDetails handles updating with the new proper format
        this.bdef = businessObjectDefinition;
        this.bdefColumns = undefined;
        this.bdefPartitions = undefined;
        this.mergedBdefColumns = undefined;
        this.hierarchialGraph.nodes = [];
        this.hierarchialGraph.links = [];
        this.hierarchialGraph.loaded = false;
        this.descriptiveFormat = undefined;
        this.getBdefDetails();
        this.alertService.alert(new SuccessAlert('', 'UDC Display Format changed successfully', '', 5
        ));
      },
      (error) => {
        this.alertService.alert(new DangerAlert('Unable to set UDC Display Format', '',
          `Format with businessObjectFormatUsage: ${format.businessObjectFormatUsage} and businessObjectFormatFileType:
           ${format.businessObjectFormatFileType} did not change due to some error. Try again later.`, 5
        ));
      }
    );
  }

  // this will and should only ever be called if the descriptiveFormat exists from the side action button
  getLineage() {
    this.open(this.viewLineage, 'view-lineage');

    this.hierarchialGraph.loaded = false;

    if (this.hierarchialGraph.nodes.length > 0) {
      this.hierarchialGraph.loaded = true;
      return;
    }

    const centerNode: DataEntityLineageNode = this.createNode(this.bdef, this.descriptiveFormat, DAGNodeType.center);

    const obs1: Observable<HierarchialGraph> = this.processParents(centerNode, this.descriptiveFormat);
    const obs2: Observable<HierarchialGraph> = this.processChildren(centerNode, this.descriptiveFormat);

    forkJoin([obs1, obs2]).subscribe((graphs: HierarchialGraph[]) => {
      // combine the separatly processed graphs into the final full lineage
      // graphs[0] has the processed parents
      // graphs[1] has the processed children
      this.hierarchialGraph.nodes = [...graphs[0].nodes, centerNode, ...graphs[1].nodes];
      this.hierarchialGraph.links = [...graphs[0].links, ...graphs[1].links];
      this.hierarchialGraph.loaded = true;
    });

    this.sendViewLineageActionEvent();
  }

  processParents(node: DataEntityLineageNode, format: BusinessObjectFormat): Observable<HierarchialGraph> {
    return this.fetchBdefs(format.businessObjectFormatParents).pipe(flatMap((bdefs) => {
      return this.constructGraph(bdefs, format.businessObjectFormatParents,
        DAGNodeType.parent, node);
    }));
  }

  processChildren(node: DataEntityLineageNode, format: BusinessObjectFormat): Observable<HierarchialGraph> {
    return this.fetchBdefs(format.businessObjectFormatChildren).pipe(flatMap((bdefs) => {
      return this.constructGraph(bdefs, format.businessObjectFormatChildren,
        DAGNodeType.child, node);
    }));
  }

  fetchBdefs(formatKeys: BusinessObjectFormatKey[]): Observable<BusinessObjectDefinition[]> {
    if (formatKeys.length > 0) {
      const frmtQueues = of(formatKeys as any);
      const bdefRequest = format => this.businessObjectDefinitionApi
        .businessObjectDefinitionGetBusinessObjectDefinition(format.namespace, format.businessObjectDefinitionName);
      return frmtQueues.pipe(
        // tslint:disable-next-line:deprecation
        flatMap((q: any) => forkJoin(...q.map(bdefRequest))
        ));
    } else {
      return of([] as any);
    }
  }

  constructGraph(bdefs: BusinessObjectDefinition[], formatKeys: BusinessObjectFormatKey[], type: DAGNodeType,
                 centerNode: DataEntityLineageNode): Observable<HierarchialGraph> {
    const nodes: DataEntityLineageNode[] = [];
    const links: DAGLink[] = [];
    for (let i = 0; i < bdefs.length; i++) {
      const newNode = this.createNode(bdefs[i], formatKeys[i], type);
      if (type === DAGNodeType.parent) {
        links.push({source: newNode.id, target: centerNode.id});
      } else {
        links.push({source: centerNode.id, target: newNode.id});
      }
      nodes.push(newNode);
    }
    return of({nodes, links} as any);
  }

  createNode(bdef: BusinessObjectDefinition, format: BusinessObjectFormatKey, type: DAGNodeType): DataEntityLineageNode {
    let color: DAGNodeTypeColor;

    if (type === DAGNodeType.parent) {
      color = DAGNodeTypeColor.parent;
    }

    if (type === DAGNodeType.child) {
      color = DAGNodeTypeColor.child;
    }

    const id = [format.namespace, format.businessObjectDefinitionName, format.businessObjectFormatUsage,
      format.businessObjectFormatFileType].join(this.idDelimiter).replace(/[^a-zA-Z0-9:]/gi, '_');

    const idNum = this.nodeIdCount[id] !== undefined ? ++this.nodeIdCount[id] : this.nodeIdCount[id] = 1;

    // source and target values use the id of a ndoe and must be [a-zA-Z0-9_] due to dagre used by ngx-graph
    // if there is any other special character that must be trimmed
    return {
      id: id + this.idDelimiter + idNum,
      label: bdef.displayName || bdef.businessObjectDefinitionName,
      tooltip: [format.businessObjectFormatUsage, format.businessObjectFormatFileType].join(this.displayDelimiter),
      type: type,
      bdefKey: [bdef.namespace, bdef.businessObjectDefinitionName].join(this.displayDelimiter),
      loadLineage: type === DAGNodeType.center ? false : true,
      color
    };
  }

  showFurther(selectedNode: DataEntityLineageNode) {
    this.hierarchialGraph.loaded = false;

    // namespace / bdefName / formatUsage / formatFiletype
    // each parameter is parsed from the node
    // just used strings to make sure if the chart gets huge the data isn't huge
    this.businessObjectFormatApi.businessObjectFormatGetBusinessObjectFormat(
      selectedNode.bdefKey.split(this.displayDelimiter)[0],
      selectedNode.bdefKey.split(this.displayDelimiter)[1],
      selectedNode.tooltip.split(this.displayDelimiter)[0],
      selectedNode.tooltip.split(this.displayDelimiter)[1]).pipe(
      flatMap((format) => {
        if (selectedNode.type === DAGNodeType.parent) {
          return this.processParents(selectedNode, format);
        } else if (selectedNode.type === DAGNodeType.child) {
          return this.processChildren(selectedNode, format);
        }
        // thiere is a unit test failing for this. Need to figure out why use of throwError is cause that.
        return throwError('invalidNodeType');
      })
    ).subscribe((graph: HierarchialGraph) => {
      // hide the show more link as we will not attempt to reload the parents or children
      this.hierarchialGraph.nodes.some((node) => {
        if (node.id === selectedNode.id) {
          node.loadLineage = false;
          return true;
        }
        return false;
      });

      if (graph.nodes.length === 0) {
        this.alertService.alert(new WarningAlert('No Further Lineage', '',
          `${selectedNode.label} does not have any more ${selectedNode.type === DAGNodeType.parent ? 'parents.' : 'children.'}`,
          5
        ));
      }

      this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes, ...graph.nodes];
      this.hierarchialGraph.links = [...this.hierarchialGraph.links, ...graph.links];
      this.hierarchialGraph.loaded = true;

      // close the pop up after user clicks button
      this.popover.close();
    });
  }


  /*
  * Populate the side actions
  *
  */
  populateSideActions() {
    this.sideActions = [
      new Action(AppIcons.shareIcon, 'Share'),
      new Action(AppIcons.saveIcon, 'Save'),
      new Action(AppIcons.watchIcon, 'Watch'),
      new Action(AppIcons.gridOnIcon, 'Sample Data', this.onSampleDataClick.bind(this), this.disableSampleData),
      new Action(AppIcons.flowChartIcon, 'Lineage', this.getLineage.bind(this), () => {
        return !this.hasDescriptiveLineage();
      })
    ];
  }

  /*
  * Calls the service to obtain preSignedUrl
  *
  */
  onSampleDataClick() {
    // Generate the request options
    const options: BusinessObjectDefinitionSampleDataFileKey = {
      namespace: this.bdef.namespace,
      businessObjectDefinitionName: this.bdef.businessObjectDefinitionName,
      directoryPath: this.bdef.sampleDataFiles[0].directoryPath,
      fileName: this.bdef.sampleDataFiles[0].fileName
    };

    // Generate the request
    const request: DownloadBusinessObjectDefinitionSampleDataFileSingleInitiationRequest = {
      businessObjectDefinitionSampleDataFileKey: options
    };

    // Fetch the preSignedUrl from the service and bind it to the input
    this.uploadAndDownloadApi.uploadandDownloadInitiateDownloadSingleSampleFile(request)
      .subscribe((data) => {
        this.sampleDataFileUrl = data.preSignedUrl;
      });

    this.sendDownloadSampleDataActionEvent();
  }

  isRecommendedFormat(format: BusinessObjectFormat) {
    return !!(this.descriptiveFormat && ((format.businessObjectFormatUsage ===
      this.descriptiveFormat.businessObjectFormatUsage)
      && (format.businessObjectFormatFileType ===
        this.descriptiveFormat.businessObjectFormatFileType)));
  }

  isRelationalTable(formatKey: ExtendedFormatKey) {
    return formatKey.businessObjectFormatFileType === this.relationalTableFileType;
  }

  getSMEContactDetails() {
    return this.businessObjectDefinitionSubjectMatterExpertApi
      .businessObjectDefinitionSubjectMatterExpertGetBusinessObjectDefinitionSubjectMatterExpertsByBusinessObjectDefinition(
        this.bdef.namespace, this.bdef.businessObjectDefinitionName)
      .pipe(
        flatMap((data) => {
          return forkJoin(data.businessObjectDefinitionSubjectMatterExpertKeys.map((key) => {
            return this.subjectMatterExpertApi.subjectMatterExpertGetSubjectMatterExpert(key.userId)
              .pipe(catchError(() => {
                return of(undefined);
              }));
          }));
        }), map((smes) => {
          return smes.filter((sme) => {
            return !!sme;
          });
        })
      );
  }

  getDDL() {
    const businessObjectFormatDdlRequest: BusinessObjectFormatDdlRequest = {
      namespace: this.bdef.namespace,
      businessObjectDefinitionName: this.bdef.businessObjectDefinitionName,
      businessObjectFormatUsage: this.descriptiveFormat.businessObjectFormatUsage,
      businessObjectFormatFileType: this.descriptiveFormat.businessObjectFormatFileType,
      outputFormat: BusinessObjectFormatDdlRequest.OutputFormatEnum.HIVE13DDL,
      tableName: this.bdef.businessObjectDefinitionName
    };
    this.businessObjectFormatApi.defaultHeaders.append('skipAlert', 'true');
    this.businessObjectFormatApi.businessObjectFormatGenerateBusinessObjectFormatDdl(businessObjectFormatDdlRequest)
      .pipe(finalize(() => {
        this.businessObjectFormatApi.defaultHeaders.delete('skipAlert');
      }))
      .subscribe((response) => {
        this.ddl = response.ddl;
      }, (error) => {
        this.ddlError = new DangerAlert('HTTP Error: ' + error.status + ' ' + error.statusText,
          'URL: ' + error.url, 'Info: ' + error.error.message);
      });
  }

  open(content: TemplateRef<any> | String, windowClass?: string) {
    // append the modal to the data-entity-detail container so when views are switched it goes away with taht view.
    this.modalReference = this.modalService
      .open(content, {windowClass: windowClass, size: 'lg', container: '.data-entity-detail', backdrop: 'static'});
    return this.modalReference;
  }

  getAllPendingSuggestion(namespace, businessObjectDefinitionName, status) {

    const businessObjectDefinitionDescriptionSuggestionSearchRequest: BusinessObjectDefinitionDescriptionSuggestionSearchRequest = {
      businessObjectDefinitionDescriptionSuggestionSearchFilters: [
        {
          businessObjectDefinitionDescriptionSuggestionSearchKeys: [
            {
              namespace: namespace,
              businessObjectDefinitionName: businessObjectDefinitionName,
              status: status
            }
          ]
        }
      ]
    };

    this.businessObjectDefinitionDescriptionSuggestionService
      .businessObjectDefinitionDescriptionSuggestionSearchBusinessObjectDefinitionDescriptionSuggestions(
        businessObjectDefinitionDescriptionSuggestionSearchRequest, 'status, descriptionSuggestion, createdByUserId, createdOn'
      ).pipe(
      catchError((error) => {
        this.alertService.alert(new DangerAlert('Unable to get data entity description suggestions', '',
          `Problem: ${error} : Try again later.`, 5));
        return of(error);
      })
    ).subscribe((response: any) => {
      this.businessObjectDefinitionDescriptionSuggestions = response && response.businessObjectDefinitionDescriptionSuggestions;
    }, (error) => {
      this.alertService.alert(new DangerAlert('Unable to get data entity description suggestions', '',
        `Problem: ${error} : Try again later.`, 5));
    });

  }

  close() {
    this.modalReference.close();
  }

  popupOpen(ngbPopover) {
    this.popover = ngbPopover;
    ngbPopover.isOpen() ? ngbPopover.close() : ngbPopover.open();
  }

  hasDescriptiveLineage(): boolean {
    return !!(this.descriptiveFormat &&
      ((this.descriptiveFormat.businessObjectFormatChildren && this.descriptiveFormat.businessObjectFormatChildren.length > 0) ||
        (this.descriptiveFormat.businessObjectFormatParents && this.descriptiveFormat.businessObjectFormatParents.length > 0))
    );
  }
}


