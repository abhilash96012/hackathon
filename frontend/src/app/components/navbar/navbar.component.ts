import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dataset } from '../../models/graph.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="bg-slate-900/95 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between shadow-lg sticky top-0 z-50 backdrop-blur-md">
      <!-- Left: Logo & Title -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20 text-black font-extrabold text-xl">
          <i class="fa-solid fa-network-wired"></i>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-lg font-bold tracking-tight text-white">UPS DependencyLens</h1>
            <span class="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">v1.0</span>
          </div>
          <p class="text-xs text-slate-400">API Dependency Visualizer & Change Impact Analyzer</p>
        </div>
      </div>

      <!-- Center: Mode Navigation Buttons -->
      <nav class="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 my-2 sm:my-0">
        <button
          (click)="modeChange.emit('EXPLORE')"
          [class]="activeMode === 'EXPLORE' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-2">
          <i class="fa-solid fa-diagram-project text-xs"></i>
          <span>Explore Graph</span>
        </button>

        <button
          (click)="modeChange.emit('OUTAGE')"
          [class]="activeMode === 'OUTAGE' ? 'bg-rose-500 text-white font-semibold shadow-sm shadow-rose-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-2">
          <i class="fa-solid fa-triangle-exclamation text-xs"></i>
          <span>Outage Simulator</span>
        </button>

        <button
          (click)="modeChange.emit('IMPACT')"
          [class]="activeMode === 'IMPACT' ? 'bg-indigo-500 text-white font-semibold shadow-sm shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-2">
          <i class="fa-solid fa-code-compare text-xs"></i>
          <span>Change Impact</span>
        </button>

        <button
          (click)="modeChange.emit('AI_AUDIT')"
          [class]="activeMode === 'AI_AUDIT' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-2">
          <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
          <span>AI Audit</span>
        </button>

        <button
          (click)="modeChange.emit('YAML_UPLOAD')"
          [class]="activeMode === 'YAML_UPLOAD' ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm shadow-sky-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-2">
          <i class="fa-solid fa-file-code text-xs"></i>
          <span>Ingest YAML</span>
        </button>
      </nav>

      <!-- Right: Dataset Switcher -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <i class="fa-solid fa-database text-xs text-amber-400"></i>
          <select
            [ngModel]="selectedDatasetId"
            (ngModelChange)="datasetChange.emit($event)"
            class="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer">
            <option *ngFor="let ds of datasets" [value]="ds.id" class="bg-slate-900 text-slate-200">
              {{ ds.name }} {{ ds.isDefault ? '(Default)' : '' }}
            </option>
          </select>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() activeMode: string = 'EXPLORE';
  @Input() datasets: Dataset[] = [];
  @Input() selectedDatasetId: number = 1;

  @Output() modeChange = new EventEmitter<string>();
  @Output() datasetChange = new EventEmitter<number>();
}
