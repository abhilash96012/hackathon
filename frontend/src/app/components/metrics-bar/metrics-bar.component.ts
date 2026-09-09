import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcosystemMetrics } from '../../models/graph.model';

@Component({
  selector: 'app-metrics-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="metrics" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 p-4 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-sm">
      <!-- Total Components -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Components</span>
          <i class="fa-solid fa-boxes-stacked text-amber-400"></i>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-xl font-bold text-white">{{ metrics.totalComponents }}</span>
          <span class="text-xs text-slate-500">Nodes</span>
        </div>
      </div>

      <!-- Total Services -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>APIs / Services</span>
          <i class="fa-solid fa-server text-blue-400"></i>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-xl font-bold text-blue-400">{{ metrics.totalServices }}</span>
          <span class="text-xs text-slate-500">Microservices</span>
        </div>
      </div>

      <!-- Total Applications -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Applications</span>
          <i class="fa-solid fa-desktop text-purple-400"></i>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-xl font-bold text-purple-400">{{ metrics.totalApplications }}</span>
          <span class="text-xs text-slate-500">Frontends/Apps</span>
        </div>
      </div>

      <!-- Total Databases -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Databases</span>
          <i class="fa-solid fa-database text-emerald-400"></i>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-xl font-bold text-emerald-400">{{ metrics.totalDatabases }}</span>
          <span class="text-xs text-slate-500">Datastores</span>
        </div>
      </div>

      <!-- Total External Systems -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>External Integrations</span>
          <i class="fa-solid fa-cloud text-amber-400"></i>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-xl font-bold text-amber-400">{{ metrics.totalExternalSystems }}</span>
          <span class="text-xs text-slate-500">APIs/Vendors</span>
        </div>
      </div>

      <!-- Most Connected Service -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Most Connected</span>
          <i class="fa-solid fa-circle-nodes text-cyan-400"></i>
        </div>
        <div class="mt-2">
          <span class="text-sm font-bold text-cyan-300 block truncate" [title]="metrics.mostConnectedService">
            {{ metrics.mostConnectedService }}
          </span>
          <span class="text-[10px] text-slate-500">Degree Centrality</span>
        </div>
      </div>

      <!-- Critical Candidate -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-rose-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Critical Candidate</span>
          <i class="fa-solid fa-shield-cat text-rose-400"></i>
        </div>
        <div class="mt-2">
          <span class="text-sm font-bold text-rose-400 block truncate" [title]="metrics.criticalServiceCandidate">
            {{ metrics.criticalServiceCandidate }}
          </span>
          <span class="text-[10px] text-slate-500">Highest In-Degree</span>
        </div>
      </div>

      <!-- Largest Blast Radius Candidate -->
      <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col justify-between hover:border-red-500/40 transition-colors">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Max Blast Radius</span>
          <i class="fa-solid fa-explosion text-red-400"></i>
        </div>
        <div class="mt-2">
          <span class="text-sm font-bold text-red-400 block truncate" [title]="metrics.largestBlastRadiusCandidate">
            {{ metrics.largestBlastRadiusCandidate }}
          </span>
          <span class="text-[10px] text-slate-500">Max Cascade Impact</span>
        </div>
      </div>
    </div>
  `
})
export class MetricsBarComponent {
  @Input() metrics: EcosystemMetrics | null = null;
}
