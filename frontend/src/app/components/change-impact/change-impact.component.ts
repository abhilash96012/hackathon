import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeImpactResult, ComponentNode } from '../../models/graph.model';

@Component({
  selector: 'app-change-impact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto my-6 text-slate-100">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
            <i class="fa-solid fa-code-compare"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Change Impact & Suggested Test Scope Recommender</h2>
            <p class="text-xs text-slate-400">Determine blast radius of code modifications and automate test plan generation</p>
          </div>
        </div>

        <button (click)="close.emit()" class="text-slate-400 hover:text-white transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Select Component to Modify -->
      <div class="flex flex-wrap items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-6">
        <label class="text-xs font-semibold text-slate-300">Select Modified Component:</label>
        <select
          [ngModel]="selectedComponentId"
          (ngModelChange)="onSelectComponent($event)"
          class="flex-grow bg-slate-900 text-sm text-white font-semibold border border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer">
          <option *ngFor="let node of allNodes" [value]="node.id" class="bg-slate-900 text-white font-medium">
            {{ node.name }} ({{ node.type }})
          </option>
        </select>
        <button
          (click)="runAnalysis()"
          class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all">
          <i class="fa-solid fa-magnifying-glass-chart"></i>
          <span>Analyze Change Impact</span>
        </button>
      </div>

      <!-- Impact Analysis Results -->
      <div *ngIf="result" class="space-y-6">
        <!-- Risk & Summary Banner -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Modified Service</span>
            <span class="text-lg font-bold text-indigo-400 mt-1">{{ result.modifiedComponent.name }}</span>
            <span class="text-[11px] text-slate-500 font-mono">{{ result.modifiedComponent.type }}</span>
          </div>

          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Deployment Risk Rating</span>
            <div class="mt-1">
              <span class="text-xl font-extrabold px-3 py-1 rounded-lg inline-block"
                    [ngClass]="{
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40': result.riskLevel === 'LOW',
                      'bg-amber-500/20 text-amber-400 border border-amber-500/40': result.riskLevel === 'MEDIUM',
                      'bg-rose-500/20 text-rose-400 border border-rose-500/40': result.riskLevel === 'HIGH',
                      'bg-red-600/30 text-red-400 border border-red-500/60': result.riskLevel === 'CRITICAL'
                    }">
                {{ result.riskLevel }} RISK
              </span>
            </div>
            <span class="text-[11px] text-slate-500">Based on Graph Blast Radius</span>
          </div>

          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Total Impacted Systems</span>
            <span class="text-3xl font-extrabold text-white mt-1">{{ result.directImpact.length + result.indirectImpact.length }}</span>
            <span class="text-[11px] text-slate-500">Direct + Indirect Services</span>
          </div>
        </div>

        <!-- Rationale Text -->
        <div class="bg-slate-950/70 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 flex items-start space-x-3">
          <i class="fa-solid fa-circle-info text-indigo-400 text-base mt-0.5"></i>
          <div>
            <span class="font-bold text-white block mb-0.5">Change Propagation Rationale</span>
            <p>{{ result.rationale }}</p>
          </div>
        </div>

        <!-- Suggested Test Scope -->
        <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
          <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <i class="fa-solid fa-list-check text-emerald-400"></i>
            <span>Recommended Automated Test Scope ({{ result.suggestedTestScope.length }} Suites)</span>
          </h4>

          <div class="space-y-2">
            <div *ngFor="let testItem of result.suggestedTestScope" class="bg-slate-900 border border-slate-800/80 p-3 rounded-lg flex items-center space-x-3 text-xs">
              <input type="checkbox" checked class="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer">
              <span class="text-slate-200 font-medium">{{ testItem }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ChangeImpactComponent {
  @Input() allNodes: ComponentNode[] = [];
  @Input() result: ChangeImpactResult | null = null;
  @Input() selectedComponentId: number = 0;

  @Output() runImpact = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  onSelectComponent(id: number): void {
    this.selectedComponentId = id;
  }

  runAnalysis(): void {
    if (this.selectedComponentId) {
      this.runImpact.emit(this.selectedComponentId);
    }
  }
}
