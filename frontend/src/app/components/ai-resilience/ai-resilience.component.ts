import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIResilienceReport, ComponentNode } from '../../models/graph.model';

@Component({
  selector: 'app-ai-resilience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto my-6 text-slate-100">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">AI Outage Resilience & Vulnerability Inspector</h2>
            <p class="text-xs text-slate-400">Automated AI architectural security & resilience audit</p>
          </div>
        </div>

        <button (click)="close.emit()" class="text-slate-400 hover:text-white transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Select Component -->
      <div class="flex flex-wrap items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-6">
        <label class="text-xs font-semibold text-slate-300">Select Service to Audit:</label>
        <select
          [ngModel]="selectedComponentId"
          (ngModelChange)="onSelectComponent($event)"
          class="flex-grow bg-slate-900 text-sm text-slate-100 font-medium border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer">
          <option *ngFor="let node of allNodes" [value]="node.id">
            {{ node.name }} ({{ node.type }})
          </option>
        </select>
        <button
          (click)="runAudit()"
          class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Run AI Audit</span>
        </button>
      </div>

      <!-- Report Results -->
      <div *ngIf="report" class="space-y-6">
        <!-- Overview Score Banner -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Audited Component</span>
            <span class="text-lg font-bold text-emerald-400 mt-1">{{ report.componentName }}</span>
            <span class="text-[11px] text-slate-500 font-mono">System Health</span>
          </div>

          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Resilience Score</span>
            <div class="flex items-baseline space-x-2 mt-1">
              <span class="text-3xl font-extrabold"
                    [ngClass]="{
                      'text-emerald-400': report.resilienceScore >= 80,
                      'text-amber-400': report.resilienceScore >= 55 && report.resilienceScore < 80,
                      'text-rose-400': report.resilienceScore < 55
                    }">
                {{ report.resilienceScore }} / 100
              </span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="h-1.5 rounded-full"
                   [style.width.%]="report.resilienceScore"
                   [ngClass]="{
                     'bg-emerald-500': report.resilienceScore >= 80,
                     'bg-amber-500': report.resilienceScore >= 55 && report.resilienceScore < 80,
                     'bg-rose-500': report.resilienceScore < 55
                   }">
              </div>
            </div>
          </div>

          <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span class="text-xs text-slate-400 font-medium">Outage Vulnerability Rating</span>
            <span class="text-xl font-extrabold px-3 py-1 rounded-lg inline-block w-max mt-1"
                  [ngClass]="{
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40': report.riskLevel === 'LOW',
                    'bg-amber-500/20 text-amber-400 border border-amber-500/40': report.riskLevel === 'MEDIUM',
                    'bg-rose-500/20 text-rose-400 border border-rose-500/40': report.riskLevel === 'HIGH',
                    'bg-red-600/30 text-red-400 border border-red-500/60': report.riskLevel === 'CRITICAL'
                  }">
              {{ report.riskLevel }} RISK
            </span>
            <span class="text-[11px] text-slate-500">AI Safety Index</span>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-slate-950/70 border border-slate-800 p-4 rounded-xl text-xs text-slate-300">
          <span class="font-bold text-white block mb-1">Audit Executive Summary</span>
          <p>{{ report.summaryText }}</p>
        </div>

        <!-- Single Points of Failure -->
        <div *ngIf="report.singlePointsOfFailure.length > 0" class="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4">
          <h4 class="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <i class="fa-solid fa-triangle-exclamation text-rose-400"></i>
            <span>Single Points of Failure (SPOF) Identified</span>
          </h4>
          <ul class="space-y-1.5 text-xs text-rose-200">
            <li *ngFor="let spof of report.singlePointsOfFailure" class="flex items-start space-x-2">
              <i class="fa-solid fa-circle-dot text-[10px] text-rose-400 mt-1"></i>
              <span>{{ spof }}</span>
            </li>
          </ul>
        </div>

        <!-- Mitigations -->
        <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <i class="fa-solid fa-lightbulb text-emerald-400"></i>
            <span>Recommended Mitigation Strategies</span>
          </h4>
          <ul class="space-y-2 text-xs text-slate-300">
            <li *ngFor="let item of report.recommendedMitigations" class="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg flex items-center space-x-2.5">
              <i class="fa-solid fa-shield-check text-emerald-400 text-sm"></i>
              <span class="font-medium text-slate-200">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class AIResilienceComponent {
  @Input() allNodes: ComponentNode[] = [];
  @Input() report: AIResilienceReport | null = null;
  @Input() selectedComponentId: number = 0;

  @Output() runAuditAction = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  onSelectComponent(id: number): void {
    this.selectedComponentId = id;
  }

  runAudit(): void {
    if (this.selectedComponentId) {
      this.runAuditAction.emit(this.selectedComponentId);
    }
  }
}
