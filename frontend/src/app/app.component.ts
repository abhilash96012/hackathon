import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import {
  GraphData,
  Dataset,
  OutageSimulationResult,
  ChangeImpactResult,
  EcosystemMetrics,
  AIResilienceReport
} from './models/graph.model';

import { NavbarComponent } from './components/navbar/navbar.component';
import { MetricsBarComponent } from './components/metrics-bar/metrics-bar.component';
import { GraphCanvasComponent } from './components/graph-canvas/graph-canvas.component';
import { OutageSimulatorComponent } from './components/outage-simulator/outage-simulator.component';
import { ChangeImpactComponent } from './components/change-impact/change-impact.component';
import { YamlUploadComponent } from './components/yaml-upload/yaml-upload.component';
import { AIResilienceComponent } from './components/ai-resilience/ai-resilience.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MetricsBarComponent,
    GraphCanvasComponent,
    OutageSimulatorComponent,
    ChangeImpactComponent,
    YamlUploadComponent,
    AIResilienceComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <!-- Navbar -->
      <app-navbar
        [activeMode]="activeMode"
        [datasets]="datasets"
        [selectedDatasetId]="selectedDatasetId"
        (modeChange)="onModeChange($event)"
        (datasetChange)="onDatasetChange($event)">
      </app-navbar>

      <!-- KPI Metrics Summary Bar -->
      <app-metrics-bar [metrics]="metrics"></app-metrics-bar>

      <!-- Main Canvas Container -->
      <main class="flex-grow relative flex flex-col">
        <!-- Interactive Graph View -->
        <div *ngIf="activeMode === 'EXPLORE'" class="w-full flex-grow relative min-h-[650px] h-[calc(100vh-140px)] flex flex-col">
          <app-graph-canvas
            class="w-full h-full flex-grow relative"
            [graphData]="graphData"
            [highlightedNodeIds]="highlightedNodeIds"
            [directNodeIds]="directNodeIds"
            [indirectNodeIds]="indirectNodeIds"
            [failedNodeId]="failedNodeId"
            (actionSimulateOutage)="triggerOutageSimulation($event)"
            (actionAnalyzeImpact)="triggerChangeImpact($event)"
            (actionAIAudit)="triggerAIAudit($event)"
            (clearHighlightsAction)="clearHighlights()">
          </app-graph-canvas>
        </div>

        <!-- Outage Simulator View -->
        <div *ngIf="activeMode === 'OUTAGE'" class="p-6">
          <app-outage-simulator
            [allNodes]="graphData?.nodes || []"
            [result]="outageResult"
            [selectedComponentId]="selectedComponentId"
            (runOutage)="runOutageSimulation($event)"
            (viewInGraph)="onModeChange('EXPLORE')"
            (close)="onModeChange('EXPLORE')">
          </app-outage-simulator>
        </div>

        <!-- Change Impact View -->
        <div *ngIf="activeMode === 'IMPACT'" class="p-6">
          <app-change-impact
            [allNodes]="graphData?.nodes || []"
            [result]="impactResult"
            [selectedComponentId]="selectedComponentId"
            (runImpact)="runChangeImpact($event)"
            (viewInGraph)="onModeChange('EXPLORE')"
            (close)="onModeChange('EXPLORE')">
          </app-change-impact>
        </div>

        <!-- AI Resilience View -->
        <div *ngIf="activeMode === 'AI_AUDIT'" class="p-6">
          <app-ai-resilience
            [allNodes]="graphData?.nodes || []"
            [report]="aiReport"
            [selectedComponentId]="selectedComponentId"
            (runAuditAction)="runAIAudit($event)"
            (close)="onModeChange('EXPLORE')">
          </app-ai-resilience>
        </div>

        <!-- YAML Upload View -->
        <div *ngIf="activeMode === 'YAML_UPLOAD'" class="p-6">
          <app-yaml-upload
            (uploadDataset)="handleYamlUpload($event)"
            (close)="onModeChange('EXPLORE')">
          </app-yaml-upload>
        </div>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {
  activeMode: string = 'EXPLORE'; // EXPLORE, OUTAGE, IMPACT, AI_AUDIT, YAML_UPLOAD
  datasets: Dataset[] = [];
  selectedDatasetId: number = 1;

  graphData: GraphData | null = null;
  metrics: EcosystemMetrics | null = null;

  selectedComponentId: number = 0;
  outageResult: OutageSimulationResult | null = null;
  impactResult: ChangeImpactResult | null = null;
  aiReport: AIResilienceReport | null = null;

  highlightedNodeIds: Set<number> = new Set();
  directNodeIds: Set<number> = new Set();
  indirectNodeIds: Set<number> = new Set();
  failedNodeId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDatasets();
  }

  loadDatasets(): void {
    this.apiService.getDatasets().subscribe({
      next: (dsList) => {
        this.datasets = dsList;
        if (dsList.length > 0) {
          const defaultDs = dsList.find(d => d.isDefault) || dsList[0];
          this.selectedDatasetId = defaultDs.id;
        } else {
          this.selectedDatasetId = 1;
        }
        this.loadGraphAndMetrics();
      },
      error: () => {
        this.selectedDatasetId = 1;
        this.loadGraphAndMetrics();
      }
    });
  }

  loadGraphAndMetrics(): void {
    if (!this.selectedDatasetId) this.selectedDatasetId = 1;

    this.apiService.getGraphData(this.selectedDatasetId).subscribe({
      next: (data) => {
        this.graphData = data;
        if (data.nodes.length > 0 && !this.selectedComponentId) {
          this.selectedComponentId = data.nodes[0].id;
        }
      }
    });

    this.apiService.getMetrics(this.selectedDatasetId).subscribe({
      next: (m) => this.metrics = m
    });
  }

  onModeChange(mode: string): void {
    this.activeMode = mode;
  }

  onDatasetChange(id: number): void {
    this.selectedDatasetId = id;
    this.clearHighlights();
    this.loadGraphAndMetrics();
  }

  triggerOutageSimulation(componentId: number): void {
    this.selectedComponentId = componentId;
    this.activeMode = 'OUTAGE';
    this.runOutageSimulation(componentId);
  }

  runOutageSimulation(componentId: number): void {
    this.selectedComponentId = componentId;
    this.apiService.simulateOutage(this.selectedDatasetId, componentId).subscribe({
      next: (res) => {
        this.outageResult = res;
        this.failedNodeId = componentId;
        this.highlightedNodeIds = new Set(res.impactedNodeIds);
        this.directNodeIds = new Set(res.directImpactComponents.map(c => c.id));
        this.indirectNodeIds = new Set(res.indirectImpactComponents.map(c => c.id));
      }
    });
  }

  triggerChangeImpact(componentId: number): void {
    this.selectedComponentId = componentId;
    this.activeMode = 'IMPACT';
    this.runChangeImpact(componentId);
  }

  runChangeImpact(componentId: number): void {
    this.selectedComponentId = componentId;
    this.apiService.analyzeImpact(this.selectedDatasetId, componentId).subscribe({
      next: (res) => {
        this.impactResult = res;
        this.failedNodeId = componentId;
        this.directNodeIds = new Set(res.directImpact.map(c => c.id));
        this.indirectNodeIds = new Set(res.indirectImpact.map(c => c.id));
        this.highlightedNodeIds = new Set([...res.directImpact.map(c => c.id), ...res.indirectImpact.map(c => c.id)]);
      }
    });
  }

  triggerAIAudit(componentId: number): void {
    this.selectedComponentId = componentId;
    this.activeMode = 'AI_AUDIT';
    this.runAIAudit(componentId);
  }

  runAIAudit(componentId: number): void {
    this.selectedComponentId = componentId;
    this.apiService.getAIResilienceAudit(this.selectedDatasetId, componentId).subscribe({
      next: (rep) => {
        this.aiReport = rep;
      }
    });
  }

  handleYamlUpload(event: { name: string; desc: string; yaml: string[] }): void {
    this.apiService.uploadYamlDataset(event.name, event.desc, event.yaml).subscribe({
      next: (newDataset) => {
        this.selectedDatasetId = newDataset.id;
        this.activeMode = 'EXPLORE';
        this.loadDatasets();
      }
    });
  }

  clearHighlights(): void {
    this.failedNodeId = null;
    this.highlightedNodeIds = new Set();
    this.directNodeIds = new Set();
    this.indirectNodeIds = new Set();
  }
}
