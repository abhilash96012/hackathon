import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GraphData,
  Dataset,
  OutageSimulationResult,
  ChangeImpactResult,
  EcosystemMetrics,
  AIResilienceReport
} from '../models/graph.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Dynamic API URL for environment/Docker deployment
  private baseUrl = (window as any)['env']?.['apiUrl'] || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${this.baseUrl}/datasets`);
  }

  getDefaultDataset(): Observable<Dataset> {
    return this.http.get<Dataset>(`${this.baseUrl}/datasets/default`);
  }

  uploadYamlDataset(datasetName: string, description: string, yamlContents: string[]): Observable<Dataset> {
    return this.http.post<Dataset>(`${this.baseUrl}/datasets/upload`, {
      datasetName,
      description,
      yamlContents
    });
  }

  getGraphData(datasetId: number): Observable<GraphData> {
    return this.http.get<GraphData>(`${this.baseUrl}/graph/${datasetId}`);
  }

  simulateOutage(datasetId: number, componentId: number): Observable<OutageSimulationResult> {
    const params = new HttpParams()
      .set('datasetId', datasetId.toString())
      .set('componentId', componentId.toString());
    return this.http.get<OutageSimulationResult>(`${this.baseUrl}/outage/simulate`, { params });
  }

  analyzeImpact(datasetId: number, componentId: number): Observable<ChangeImpactResult> {
    const params = new HttpParams()
      .set('datasetId', datasetId.toString())
      .set('componentId', componentId.toString());
    return this.http.get<ChangeImpactResult>(`${this.baseUrl}/impact/analyze`, { params });
  }

  getMetrics(datasetId: number): Observable<EcosystemMetrics> {
    return this.http.get<EcosystemMetrics>(`${this.baseUrl}/metrics/${datasetId}`);
  }

  getAIResilienceAudit(datasetId: number, componentId: number): Observable<AIResilienceReport> {
    const params = new HttpParams()
      .set('datasetId', datasetId.toString())
      .set('componentId', componentId.toString());
    return this.http.get<AIResilienceReport>(`${this.baseUrl}/ai-resilience/audit`, { params });
  }
}
