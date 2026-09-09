import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentNode, OutageSimulationResult } from '../../models/graph.model';

@Component({
  selector: 'app-outage-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto my-6 text-slate-100">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xl">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Service Outage Simulator & Blast Radius Analysis</h2>
            <p class="text-xs text-slate-400">Simulate component failure and analyze cascading ecosystem impact</p>
          </div>
        </div>

        <button (click)="close.emit()" class="text-slate-400 hover:text-white transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Select Component to Fail -->
      <div class="flex flex-wrap items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-6">
        <label class="text-xs font-semibold text-slate-300">Select Target Service to Fail:</label>
        <select
          [ngModel]="selectedComponentId"
          (ngModelChange)="onSelectComponent($event)"
          class="flex-grow bg-slate-900 text-sm text-white font-semibold border border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-rose-500 cursor-pointer">
          <option *ngFor="let node of allNodes" [value]="node.id" class="bg-slate-900 text-white font-medium">
            {{ node.name }} ({{ node.type }})
          </option>
        </select>
        <button
          (click)="runSimulation()"
          class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all">
          <i class="fa-solid fa-bolt"></i>
          <span>Run Outage Blast Radius Test</span>
        </button>
      </div>

      <!-- Simulation Results -->
      <div *ngIf="result" class="space-y-6">
        <!-- Overview Banner -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-rose-300 font-medium">Simulated Failed Component</span>
            <span class="text-lg font-bold text-rose-400 mt-1">{{ result.failedComponent.name }}</span>
            <span class="text-[11px] text-slate-400 font-mono">{{ result.failedComponent.type }}</span>
          </div>

          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Total Impacted Systems</span>
            <div class="flex items-baseline space-x-2 mt-1">
              <span class="text-3xl font-extrabold text-white">{{ result.totalImpactedCount }}</span>
              <span class="text-xs text-slate-500">Components Offline</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-rose-500 h-1.5 rounded-full" [style.width.%]="result.blastRadiusPercentage"></div>
            </div>
          </div>

          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Ecosystem Blast Radius</span>
            <span class="text-3xl font-extrabold text-amber-400 mt-1">{{ result.blastRadiusPercentage }}%</span>
            <span class="text-[11px] text-slate-500">Overall System Disruption</span>
          </div>
        </div>

        <!-- Affected Touchpoint Applications -->
        <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <i class="fa-solid fa-mobile-screen-button text-purple-400"></i>
            <span>Disabled User Applications & Touchpoints ({{ result.affectedApplications.length }})</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let app of result.affectedApplications"
                  class="px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center space-x-1.5">
              <i class="fa-solid fa-triangle-exclamation text-rose-400 text-[10px]"></i>
              <span>{{ app }}</span>
            </span>
            <span *ngIf="result.affectedApplications.length === 0" class="text-xs text-slate-500 italic">
              No end-user applications directly disrupted.
            </span>
          </div>
        </div>

        <!-- Direct vs Indirect Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Direct Impact -->
          <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h4 class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
              Direct Consumers ({{ result.directImpactComponents.length }})
            </h4>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div *ngFor="let c of result.directImpactComponents" class="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800 text-xs">
                <span class="font-medium text-slate-200">{{ c.name }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ c.type }}</span>
              </div>
            </div>
          </div>

          <!-- Indirect Impact -->
          <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h4 class="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
              Cascading Indirect Downstream ({{ result.indirectImpactComponents.length }})
            </h4>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div *ngFor="let c of result.indirectImpactComponents" class="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800 text-xs">
                <span class="font-medium text-slate-200">{{ c.name }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ c.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Impact Propagation Chains -->
        <div *ngIf="result.impactPropagationChains.length > 0" class="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <i class="fa-solid fa-route text-amber-400"></i>
            <span>Failure Propagation Chains</span>
          </h4>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div *ngFor="let chain of result.impactPropagationChains" class="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono flex items-center flex-wrap gap-2">
              <ng-container *ngFor="let nodeName of chain; let last = last">
                <span [class]="last ? 'text-rose-400 font-bold' : 'text-slate-300'">{{ nodeName }}</span>
                <i *ngIf="!last" class="fa-solid fa-arrow-right text-[10px] text-slate-600"></i>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OutageSimulatorComponent {
  @Input() allNodes: ComponentNode[] = [];
  @Input() result: OutageSimulationResult | null = null;
  @Input() selectedComponentId: number = 0;

  @Output() runOutage = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  onSelectComponent(id: number): void {
    this.selectedComponentId = id;
  }

  runSimulation(): void {
    if (this.selectedComponentId) {
      this.runOutage.emit(this.selectedComponentId);
    }
  }
}
