import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-yaml-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto my-6 text-slate-100">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-xl">
            <i class="fa-solid fa-file-code"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Ingest YAML Dependency Dataset</h2>
            <p class="text-xs text-slate-400">Upload or paste YAML dependency definitions to generate an ecosystem graph</p>
          </div>
        </div>

        <button (click)="close.emit()" class="text-slate-400 hover:text-white transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Dataset Metadata Inputs -->
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Dataset Title / Name:</label>
          <input
            type="text"
            [(ngModel)]="datasetName"
            placeholder="e.g. UPS Smart Logistics Microservices v2"
            class="w-full bg-slate-950 text-xs text-slate-100 border border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Dataset Description:</label>
          <input
            type="text"
            [(ngModel)]="description"
            placeholder="e.g. Production microservices topology for UPS campus hackathon"
            class="w-full bg-slate-950 text-xs text-slate-100 border border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500">
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-xs font-semibold text-slate-300">YAML Definition File(s) Content:</label>
            <button (click)="loadSampleYaml()" class="text-xs text-sky-400 hover:underline">
              Load Sample YAML Template
            </button>
          </div>
          <textarea
            [(ngModel)]="yamlContent"
            rows="12"
            placeholder="Paste your YAML content here...
service: auth-service
type: API
dependencies: []
consumers:
  - Customer Portal
  - Admin Console"
            class="w-full bg-slate-950 text-xs font-mono text-slate-200 border border-slate-700 rounded-xl p-3.5 focus:outline-none focus:border-sky-500">
          </textarea>
        </div>
      </div>

      <!-- Submit Action -->
      <div class="flex justify-end space-x-3 border-t border-slate-800 pt-4">
        <button
          (click)="close.emit()"
          class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
          Cancel
        </button>
        <button
          (click)="submitDataset()"
          [disabled]="!datasetName || !yamlContent"
          class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center space-x-2">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <span>Ingest & Build Graph</span>
        </button>
      </div>
    </div>
  `
})
export class YamlUploadComponent {
  datasetName: string = '';
  description: string = '';
  yamlContent: string = '';

  @Output() uploadDataset = new EventEmitter<{ name: string; desc: string; yaml: string[] }>();
  @Output() close = new EventEmitter<void>();

  loadSampleYaml(): void {
    this.datasetName = 'Custom UPS Regional Ecosystem';
    this.description = 'Sample 4-service YAML dataset test';
    this.yamlContent = `---
service: Auth Service
type: API
dependencies: []
consumers:
  - Customer Portal
  - Operations Dashboard
---
service: Dispatch Service
type: API
dependencies:
  - Auth Service
  - Customer DB
consumers:
  - Operations Dashboard
---
service: Customer DB
type: DATABASE
dependencies: []
consumers:
  - Dispatch Service
---
service: Operations Dashboard
type: APPLICATION
dependencies:
  - Auth Service
  - Dispatch Service
consumers: []`;
  }

  submitDataset(): void {
    if (this.datasetName && this.yamlContent) {
      this.uploadDataset.emit({
        name: this.datasetName,
        desc: this.description,
        yaml: [this.yamlContent]
      });
    }
  }
}
