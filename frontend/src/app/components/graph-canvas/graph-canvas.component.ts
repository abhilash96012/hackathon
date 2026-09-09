import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentNode, GraphData } from '../../models/graph.model';

import * as cytoscapeImport from 'cytoscape';
const cytoscape = (cytoscapeImport as any).default || cytoscapeImport;

@Component({
  selector: 'app-graph-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 650px;
      position: relative;
    }
  `],
  template: `
    <div class="relative w-full h-full min-h-[650px] flex flex-col bg-slate-950 overflow-hidden">
      <!-- Search & Filter Controls Floating Bar -->
      <div class="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 bg-slate-900/95 p-2.5 rounded-xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <!-- Search Input -->
        <div class="relative flex items-center">
          <i class="fa-solid fa-magnifying-glass absolute left-3 text-slate-400 text-xs"></i>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterGraph()"
            placeholder="Search component by name..."
            class="pl-8 pr-3 py-1.5 bg-slate-950 text-xs text-white placeholder-slate-400 font-medium border border-slate-700/80 rounded-lg focus:outline-none focus:border-amber-500 w-56 transition-colors">
        </div>

        <!-- Filter by Type -->
        <select
          [(ngModel)]="selectedTypeFilter"
          (ngModelChange)="filterGraph()"
          class="bg-slate-950 text-xs text-white border border-slate-700/80 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer">
          <option value="ALL">All Types</option>
          <option value="API">APIs / Services</option>
          <option value="APPLICATION">Applications</option>
          <option value="DATABASE">Databases</option>
          <option value="EXTERNAL_SYSTEM">External Systems</option>
        </select>

        <!-- Layout Controls -->
        <div class="flex items-center space-x-1 border-l border-slate-800 pl-2">
          <button (click)="resetLayout()" title="Fit View" class="p-2 text-slate-300 hover:text-amber-400 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 text-xs transition-colors">
            <i class="fa-solid fa-compress"></i>
          </button>
          <button (click)="zoomIn()" title="Zoom In" class="p-2 text-slate-300 hover:text-amber-400 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 text-xs transition-colors">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button (click)="zoomOut()" title="Zoom Out" class="p-2 text-slate-300 hover:text-amber-400 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 text-xs transition-colors">
            <i class="fa-solid fa-minus"></i>
          </button>
        </div>
      </div>

      <!-- Active Sub-Graph Mode Indicator Banner -->
      <div *ngIf="failedNodeId || directNodeIds.size > 0" class="absolute top-4 right-4 z-20 bg-slate-900/95 p-3 rounded-xl border border-rose-500/40 backdrop-blur-md shadow-2xl flex items-center space-x-3 text-xs">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
        <div>
          <span class="font-bold text-rose-300 block">Direct & Indirect Dependency Sub-Graph Active</span>
          <span class="text-[11px] text-slate-400">Direct 1-Hop vs Indirect Cascade Downstream Tracing</span>
        </div>
        <button (click)="clearHighlightsAction.emit()" class="ml-2 text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 font-semibold">Clear</button>
      </div>

      <!-- Legend Overlay -->
      <div class="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-3 bg-slate-900/95 px-4 py-2.5 rounded-xl border border-slate-800 text-xs backdrop-blur-md shadow-xl">
        <!-- Types -->
        <div class="flex items-center space-x-3 border-r border-slate-800 pr-3">
          <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-sm shadow-blue-500/50"></span><span class="text-white font-medium">API</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-purple-500 inline-block shadow-sm shadow-purple-500/50"></span><span class="text-white font-medium">App</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50"></span><span class="text-white font-medium">DB</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/50"></span><span class="text-white font-medium">External</span></div>
        </div>
        <!-- Dependency Status -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-red-600 border border-white inline-block"></span><span class="text-rose-400 font-bold">Target Service</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-sky-500 border border-sky-300 inline-block"></span><span class="text-sky-300 font-bold">Direct (1-Hop)</span></div>
          <div class="flex items-center space-x-1.5"><span class="w-3 h-3 rounded-full bg-purple-600 border border-rose-400 inline-block"></span><span class="text-purple-300 font-bold">Indirect Cascade</span></div>
        </div>
      </div>

      <!-- Cytoscape Canvas Container -->
      <div #cyContainer class="w-full h-full min-h-[650px] absolute inset-0 bg-[#090d16]"></div>

      <!-- Selected Node Detail Side Drawer -->
      <div *ngIf="selectedNode" class="absolute top-4 right-4 bottom-4 w-84 z-30 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-y-auto">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                  [ngClass]="{
                    'badge-api': selectedNode.type === 'API',
                    'badge-application': selectedNode.type === 'APPLICATION',
                    'badge-database': selectedNode.type === 'DATABASE',
                    'badge-external': selectedNode.type === 'EXTERNAL_SYSTEM'
                  }">
              {{ selectedNode.type }}
            </span>
            <button (click)="selectedNode = null" class="text-slate-400 hover:text-white p-1">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Component Details -->
          <h3 class="text-xl font-extrabold text-white mb-1.5">{{ selectedNode.name }}</h3>
          <p class="text-xs text-slate-300 mb-5 leading-relaxed">{{ selectedNode.description }}</p>

          <div class="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs mb-4">
            <div class="flex justify-between">
              <span class="text-slate-400">Team Owner:</span>
              <span class="font-semibold text-white">{{ selectedNode.teamOwner }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Criticality Rating:</span>
              <span class="font-extrabold text-amber-400">{{ selectedNode.criticalityScore }}/10</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Direct Consumers:</span>
              <span class="font-bold text-blue-400">{{ selectedNode.incomingDegree }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Dependencies:</span>
              <span class="font-bold text-purple-400">{{ selectedNode.outgoingDegree }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-2.5 border-t border-slate-800 pt-4">
          <button
            (click)="actionSimulateOutage.emit(selectedNode.id)"
            class="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center space-x-2 transition-all">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Simulate Outage Failure</span>
          </button>

          <button
            (click)="actionAnalyzeImpact.emit(selectedNode.id)"
            class="w-full py-2.5 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center justify-center space-x-2 transition-all">
            <i class="fa-solid fa-code-compare"></i>
            <span>Analyze Change Impact</span>
          </button>

          <button
            (click)="actionAIAudit.emit(selectedNode.id)"
            class="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center space-x-2 transition-all">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>AI Resilience Audit</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class GraphCanvasComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('cyContainer', { static: true }) cyContainer!: ElementRef;

  @Input() graphData: GraphData | null = null;
  @Input() highlightedNodeIds: Set<number> = new Set();
  @Input() directNodeIds: Set<number> = new Set();
  @Input() indirectNodeIds: Set<number> = new Set();
  @Input() failedNodeId: number | null = null;

  @Output() actionSimulateOutage = new EventEmitter<number>();
  @Output() actionAnalyzeImpact = new EventEmitter<number>();
  @Output() actionAIAudit = new EventEmitter<number>();
  @Output() clearHighlightsAction = new EventEmitter<void>();

  private cy: any;
  selectedNode: ComponentNode | null = null;
  searchQuery: string = '';
  selectedTypeFilter: string = 'ALL';

  @HostListener('window:resize')
  onResize(): void {
    if (this.cy) {
      this.cy.resize();
      this.cy.fit();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCytoscape();
    }, 50);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graphData']) {
      setTimeout(() => this.initCytoscape(), 50);
    } else if (changes['highlightedNodeIds'] || changes['failedNodeId'] || changes['directNodeIds'] || changes['indirectNodeIds']) {
      setTimeout(() => this.applyHighlights(), 80);
    }
  }

  ngOnDestroy(): void {
    if (this.cy) {
      this.cy.destroy();
    }
  }

  private initCytoscape(): void {
    if (!this.cyContainer?.nativeElement) return;
    if (!this.graphData || !this.graphData.nodes || this.graphData.nodes.length === 0) return;

    const elements: any[] = [];

    // Nodes
    this.graphData.nodes.forEach(node => {
      elements.push({
        data: {
          id: node.id.toString(),
          label: node.name,
          type: node.type,
          rawNode: node
        }
      });
    });

    // Edges (Source = Dependency, Target = Consumer)
    this.graphData.edges.forEach(edge => {
      elements.push({
        data: {
          id: `e_${edge.id}`,
          source: edge.sourceComponentId.toString(),
          target: edge.targetComponentId.toString(),
          type: edge.dependencyType
        }
      });
    });

    if (this.cy) {
      this.cy.destroy();
    }

    try {
      this.cy = cytoscape({
        container: this.cyContainer.nativeElement,
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              'label': 'data(label)',
              'color': '#ffffff',
              'font-size': '12px',
              'font-weight': 'bold',
              'text-valign': 'bottom',
              'text-margin-y': 8,
              'text-outline-color': '#020617',
              'text-outline-width': 4,
              'text-outline-opacity': 1,
              'width': 44,
              'height': 44,
              'border-width': 2.5,
              'border-color': '#64748b'
            }
          },
          {
            selector: 'node[type = "API"]',
            style: {
              'background-color': '#3b82f6',
              'border-color': '#93c5fd'
            }
          },
          {
            selector: 'node[type = "APPLICATION"]',
            style: {
              'background-color': '#a855f7',
              'border-color': '#e9d5ff',
              'shape': 'round-rectangle'
            }
          },
          {
            selector: 'node[type = "DATABASE"]',
            style: {
              'background-color': '#22c55e',
              'border-color': '#86efac',
              'shape': 'barrel'
            }
          },
          {
            selector: 'node[type = "EXTERNAL_SYSTEM"]',
            style: {
              'background-color': '#f59e0b',
              'border-color': '#fde68a',
              'shape': 'diamond'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2.5,
              'line-color': '#475569',
              'target-arrow-color': '#94a3b8',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'opacity': 0.8
            }
          },
          {
            selector: '.highlighted-failed',
            style: {
              'background-color': '#dc2626',
              'border-color': '#ffffff',
              'border-width': 6,
              'width': 58,
              'height': 58,
              'opacity': 1.0,
              'z-index': 999
            }
          },
          {
            selector: '.highlighted-direct',
            style: {
              'background-color': '#0284c7',
              'border-color': '#38bdf8',
              'border-width': 4.5,
              'width': 50,
              'height': 50,
              'opacity': 1.0,
              'z-index': 900
            }
          },
          {
            selector: '.highlighted-indirect',
            style: {
              'background-color': '#9333ea',
              'border-color': '#f43f5e',
              'border-width': 4,
              'width': 46,
              'height': 46,
              'opacity': 1.0,
              'z-index': 800
            }
          },
          {
            selector: '.edge-direct',
            style: {
              'line-color': '#38bdf8',
              'target-arrow-color': '#38bdf8',
              'width': 4.5,
              'opacity': 1.0,
              'z-index': 900
            }
          },
          {
            selector: '.edge-indirect',
            style: {
              'line-color': '#f43f5e',
              'target-arrow-color': '#f43f5e',
              'width': 3.5,
              'line-style': 'dashed',
              'opacity': 1.0,
              'z-index': 800
            }
          },
          {
            selector: '.dimmed',
            style: {
              'opacity': 0.35
            }
          }
        ]
      });

      const layout = this.cy.layout({
        name: 'breadthfirst',
        directed: true,
        padding: 50,
        spacingFactor: 1.25,
        animate: false
      });

      layout.one('layoutstop', () => {
        if (this.cy) {
          this.cy.resize();
          this.applyHighlights();
          this.cy.fit(undefined, 40);
        }
      });

      layout.run();

      this.cy.on('tap', 'node', (evt: any) => {
        const nodeData = evt.target.data('rawNode');
        this.selectedNode = nodeData;
        this.highlightNeighborhood(evt.target);
      });

      this.cy.on('tap', (evt: any) => {
        if (evt.target === this.cy) {
          this.selectedNode = null;
          this.clearHighlights();
        }
      });
    } catch (e) {
      console.error('Cytoscape initialization failed:', e);
    }
  }

  private highlightNeighborhood(node: any): void {
    if (!this.cy) return;
    this.cy.elements().removeClass('dimmed');
    const neighborhood = node.closedNeighborhood();
    this.cy.elements().not(neighborhood).addClass('dimmed');
  }

  private clearHighlights(): void {
    if (!this.cy) return;
    this.cy.elements().removeClass('dimmed highlighted-direct highlighted-indirect highlighted-failed edge-direct edge-indirect');
  }

  private applyHighlights(): void {
    if (!this.cy) return;
    this.cy.elements().removeClass('highlighted-direct highlighted-indirect highlighted-failed edge-direct edge-indirect dimmed');

    const hasHighlighting = this.failedNodeId || this.directNodeIds.size > 0 || this.indirectNodeIds.size > 0 || this.highlightedNodeIds.size > 0;

    if (hasHighlighting) {
      this.cy.nodes().forEach((node: any) => {
        const id = parseInt(node.id(), 10);
        if (id === this.failedNodeId) {
          node.addClass('highlighted-failed');
        } else if (this.directNodeIds.has(id)) {
          node.addClass('highlighted-direct');
        } else if (this.indirectNodeIds.has(id) || this.highlightedNodeIds.has(id)) {
          node.addClass('highlighted-indirect');
        } else {
          node.addClass('dimmed');
        }
      });

      this.cy.edges().forEach((edge: any) => {
        const sourceId = parseInt(edge.source().id(), 10);
        const targetId = parseInt(edge.target().id(), 10);

        if (sourceId === this.failedNodeId && this.directNodeIds.has(targetId)) {
          edge.addClass('edge-direct');
        } else if ((sourceId === this.failedNodeId || this.directNodeIds.has(sourceId) || this.indirectNodeIds.has(sourceId)) &&
                   (this.directNodeIds.has(targetId) || this.indirectNodeIds.has(targetId) || this.highlightedNodeIds.has(targetId))) {
          edge.addClass('edge-indirect');
        } else {
          edge.addClass('dimmed');
        }
      });

      // Automatically focus and fit viewport on highlighted sub-graph elements
      const subGraphElements = this.cy.nodes('.highlighted-failed, .highlighted-direct, .highlighted-indirect');
      if (subGraphElements.length > 0) {
        this.cy.fit(subGraphElements, 60);
      }
    } else {
      this.cy.fit(undefined, 40);
    }
  }

  filterGraph(): void {
    if (!this.cy) return;
    this.cy.nodes().forEach((node: any) => {
      const raw = node.data('rawNode');
      const matchesSearch = !this.searchQuery || raw.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.selectedTypeFilter === 'ALL' || raw.type === this.selectedTypeFilter;

      if (matchesSearch && matchesType) {
        node.show();
      } else {
        node.hide();
      }
    });
  }

  resetLayout(): void {
    if (this.cy) {
      this.cy.resize();
      this.cy.fit(undefined, 40);
    }
  }

  zoomIn(): void {
    if (this.cy) {
      this.cy.zoom(this.cy.zoom() * 1.2);
    }
  }

  zoomOut(): void {
    if (this.cy) {
      this.cy.zoom(this.cy.zoom() * 0.8);
    }
  }
}
