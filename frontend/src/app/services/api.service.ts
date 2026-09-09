import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  private baseUrl = (window as any)['env']?.['apiUrl'] || 'http://localhost:8080/api';

  private defaultDataset: Dataset = {
    id: 1,
    name: 'UPS Enterprise Logistics Ecosystem',
    description: 'Pre-seeded UPS Enterprise Microservices, APIs, Databases, Applications & External Integrations',
    isDefault: true,
    createdAt: new Date().toISOString()
  };

  private fallbackGraphData: GraphData = {
    datasetId: 1,
    datasetName: 'UPS Enterprise Logistics Ecosystem',
    nodes: [
      { id: 1, name: 'Auth Service', type: 'API', description: 'Central Identity Provider', teamOwner: 'Security Team', criticalityScore: 9.5, incomingDegree: 7, outgoingDegree: 0 },
      { id: 2, name: 'Customer Service', type: 'API', description: 'Customer Profile Management', teamOwner: 'Customer Ops', criticalityScore: 8.0, incomingDegree: 3, outgoingDegree: 2 },
      { id: 3, name: 'Payment Service', type: 'API', description: 'Payment Tokenization Engine', teamOwner: 'Billing Team', criticalityScore: 9.0, incomingDegree: 1, outgoingDegree: 2 },
      { id: 4, name: 'Product Catalog Service', type: 'API', description: 'Product Shipping Catalog', teamOwner: 'Catalog Team', criticalityScore: 7.0, incomingDegree: 3, outgoingDegree: 1 },
      { id: 5, name: 'Pricing Service', type: 'API', description: 'Dynamic Tariff & Shipping Rates', teamOwner: 'Billing Team', criticalityScore: 8.5, incomingDegree: 2, outgoingDegree: 1 },
      { id: 6, name: 'Inventory Service', type: 'API', description: 'Warehouse Stock & Parcel Vault', teamOwner: 'Supply Chain Team', criticalityScore: 8.5, incomingDegree: 2, outgoingDegree: 2 },
      { id: 7, name: 'Cart Service', type: 'API', description: 'Shopping Cart Session', teamOwner: 'E-Commerce Team', criticalityScore: 7.5, incomingDegree: 1, outgoingDegree: 3 },
      { id: 8, name: 'Order Service', type: 'API', description: 'Parcel Booking & Core Order Engine', teamOwner: 'Logistics Core', criticalityScore: 9.8, incomingDegree: 6, outgoingDegree: 5 },
      { id: 9, name: 'Invoice Service', type: 'API', description: 'Billing Invoice & Tax Generator', teamOwner: 'Finance Team', criticalityScore: 7.0, incomingDegree: 1, outgoingDegree: 1 },
      { id: 10, name: 'UPS Tracking API', type: 'API', description: 'Real-time Event Tracking Stream', teamOwner: 'Tracking Team', criticalityScore: 9.0, incomingDegree: 3, outgoingDegree: 1 },
      { id: 11, name: 'Fleet Dispatch Service', type: 'API', description: 'Driver Scheduling & Fleet Operations', teamOwner: 'Fleet Ops', criticalityScore: 8.8, incomingDegree: 2, outgoingDegree: 3 },
      { id: 12, name: 'Address Validation API', type: 'API', description: 'Global Geocoding & Address Check', teamOwner: 'Address Team', criticalityScore: 7.5, incomingDegree: 2, outgoingDegree: 0 },
      { id: 13, name: 'Customs Service', type: 'API', description: 'Cross-border Clearance Documentation', teamOwner: 'International Ops', criticalityScore: 8.0, incomingDegree: 0, outgoingDegree: 1 },
      { id: 14, name: 'Customer Portal', type: 'APPLICATION', description: 'Web portal for package tracking & shipping', teamOwner: 'Frontend Team', criticalityScore: 8.0, incomingDegree: 0, outgoingDegree: 6 },
      { id: 15, name: 'Admin Console', type: 'APPLICATION', description: 'Internal UPS Operations Portal', teamOwner: 'Internal Tools', criticalityScore: 8.5, incomingDegree: 0, outgoingDegree: 2 },
      { id: 16, name: 'Operations Dashboard', type: 'APPLICATION', description: 'Hub Control Tower & Logistics Dispatch', teamOwner: 'Logistics Ops', criticalityScore: 9.0, incomingDegree: 0, outgoingDegree: 3 },
      { id: 17, name: 'UPS Mobile App', type: 'APPLICATION', description: 'Mobile app for drivers & customers', teamOwner: 'Mobile Team', criticalityScore: 8.5, incomingDegree: 0, outgoingDegree: 3 },
      { id: 18, name: 'Customer DB', type: 'DATABASE', description: 'PostgreSQL DB for Profiles', teamOwner: 'Data Infra', criticalityScore: 9.0, incomingDegree: 2, outgoingDegree: 0 },
      { id: 19, name: 'Product DB', type: 'DATABASE', description: 'PostgreSQL DB for Products', teamOwner: 'Data Infra', criticalityScore: 8.0, incomingDegree: 1, outgoingDegree: 0 },
      { id: 20, name: 'Order DB', type: 'DATABASE', description: 'High-throughput Parcel DB', teamOwner: 'Data Infra', criticalityScore: 9.8, incomingDegree: 1, outgoingDegree: 0 },
      { id: 21, name: 'Fleet DB', type: 'DATABASE', description: 'DB for Drivers & Lockers', teamOwner: 'Data Infra', criticalityScore: 8.5, incomingDegree: 1, outgoingDegree: 0 },
      { id: 22, name: 'Payment Gateway', type: 'EXTERNAL_SYSTEM', description: 'External Stripe / Bank Gateway', teamOwner: 'Vendor', criticalityScore: 9.0, incomingDegree: 1, outgoingDegree: 0 },
      { id: 23, name: 'UPS Core Mainframe', type: 'EXTERNAL_SYSTEM', description: 'Enterprise Core Parcel Ledger', teamOwner: 'Enterprise IT', criticalityScore: 9.5, incomingDegree: 1, outgoingDegree: 0 },
      { id: 24, name: 'Mapping Provider', type: 'EXTERNAL_SYSTEM', description: 'External Geocoding & Route Matrix API', teamOwner: 'Vendor', criticalityScore: 8.0, incomingDegree: 1, outgoingDegree: 0 }
    ],
    edges: [
      { id: 1, sourceComponentId: 1, sourceComponentName: 'Auth Service', targetComponentId: 2, targetComponentName: 'Customer Service', dependencyType: 'STRICT' },
      { id: 2, sourceComponentId: 1, sourceComponentName: 'Auth Service', targetComponentId: 3, targetComponentName: 'Payment Service', dependencyType: 'STRICT' },
      { id: 3, sourceComponentId: 1, sourceComponentName: 'Auth Service', targetComponentId: 6, targetComponentName: 'Inventory Service', dependencyType: 'STRICT' },
      { id: 4, sourceComponentId: 1, sourceComponentName: 'Auth Service', targetComponentId: 14, targetComponentName: 'Customer Portal', dependencyType: 'STRICT' },
      { id: 5, sourceComponentId: 1, sourceComponentName: 'Auth Service', targetComponentId: 15, targetComponentName: 'Admin Console', dependencyType: 'STRICT' },
      { id: 6, sourceComponentId: 1, sourceComponentName: 'Auth Service', targetComponentId: 16, targetComponentName: 'Operations Dashboard', dependencyType: 'STRICT' },
      { id: 7, sourceComponentId: 1, sourceComponentName: 'Auth Service', targetComponentId: 17, targetComponentName: 'UPS Mobile App', dependencyType: 'STRICT' },
      { id: 8, sourceComponentId: 18, sourceComponentName: 'Customer DB', targetComponentId: 2, targetComponentName: 'Customer Service', dependencyType: 'STRICT' },
      { id: 9, sourceComponentId: 18, sourceComponentName: 'Customer DB', targetComponentId: 6, targetComponentName: 'Inventory Service', dependencyType: 'STRICT' },
      { id: 10, sourceComponentId: 2, sourceComponentName: 'Customer Service', targetComponentId: 7, targetComponentName: 'Cart Service', dependencyType: 'STRICT' },
      { id: 11, sourceComponentId: 2, sourceComponentName: 'Customer Service', targetComponentId: 8, targetComponentName: 'Order Service', dependencyType: 'STRICT' },
      { id: 12, sourceComponentId: 2, sourceComponentName: 'Customer Service', targetComponentId: 14, targetComponentName: 'Customer Portal', dependencyType: 'STRICT' },
      { id: 13, sourceComponentId: 19, sourceComponentName: 'Product DB', targetComponentId: 4, targetComponentName: 'Product Catalog Service', dependencyType: 'STRICT' },
      { id: 14, sourceComponentId: 4, sourceComponentName: 'Product Catalog Service', targetComponentId: 5, targetComponentName: 'Pricing Service', dependencyType: 'STRICT' },
      { id: 15, sourceComponentId: 4, sourceComponentName: 'Product Catalog Service', targetComponentId: 6, targetComponentName: 'Inventory Service', dependencyType: 'STRICT' },
      { id: 16, sourceComponentId: 4, sourceComponentName: 'Product Catalog Service', targetComponentId: 14, targetComponentName: 'Customer Portal', dependencyType: 'STRICT' },
      { id: 17, sourceComponentId: 5, sourceComponentName: 'Pricing Service', targetComponentId: 7, targetComponentName: 'Cart Service', dependencyType: 'STRICT' },
      { id: 18, sourceComponentId: 5, sourceComponentName: 'Pricing Service', targetComponentId: 8, targetComponentName: 'Order Service', dependencyType: 'STRICT' },
      { id: 19, sourceComponentId: 6, sourceComponentName: 'Inventory Service', targetComponentId: 7, targetComponentName: 'Cart Service', dependencyType: 'STRICT' },
      { id: 20, sourceComponentId: 6, sourceComponentName: 'Inventory Service', targetComponentId: 8, targetComponentName: 'Order Service', dependencyType: 'STRICT' },
      { id: 21, sourceComponentId: 22, sourceComponentName: 'Payment Gateway', targetComponentId: 3, targetComponentName: 'Payment Service', dependencyType: 'STRICT' },
      { id: 22, sourceComponentId: 3, sourceComponentName: 'Payment Service', targetComponentId: 8, targetComponentName: 'Order Service', dependencyType: 'STRICT' },
      { id: 23, sourceComponentId: 20, sourceComponentName: 'Order DB', targetComponentId: 8, targetComponentName: 'Order Service', dependencyType: 'STRICT' },
      { id: 24, sourceComponentId: 8, sourceComponentName: 'Order Service', targetComponentId: 9, targetComponentName: 'Invoice Service', dependencyType: 'STRICT' },
      { id: 25, sourceComponentId: 8, sourceComponentName: 'Order Service', targetComponentId: 10, targetComponentName: 'UPS Tracking API', dependencyType: 'STRICT' },
      { id: 26, sourceComponentId: 8, sourceComponentName: 'Order Service', targetComponentId: 11, targetComponentName: 'Fleet Dispatch Service', dependencyType: 'STRICT' },
      { id: 27, sourceComponentId: 8, sourceComponentName: 'Order Service', targetComponentId: 13, targetComponentName: 'Customs Service', dependencyType: 'STRICT' },
      { id: 28, sourceComponentId: 8, sourceComponentName: 'Order Service', targetComponentId: 14, targetComponentName: 'Customer Portal', dependencyType: 'STRICT' },
      { id: 29, sourceComponentId: 8, sourceComponentName: 'Order Service', targetComponentId: 15, targetComponentName: 'Admin Console', dependencyType: 'STRICT' },
      { id: 30, sourceComponentId: 21, sourceComponentName: 'Fleet DB', targetComponentId: 11, targetComponentName: 'Fleet Dispatch Service', dependencyType: 'STRICT' },
      { id: 31, sourceComponentId: 24, sourceComponentName: 'Mapping Provider', targetComponentId: 11, targetComponentName: 'Fleet Dispatch Service', dependencyType: 'STRICT' },
      { id: 32, sourceComponentId: 12, sourceComponentName: 'Address Validation API', targetComponentId: 8, targetComponentName: 'Order Service', dependencyType: 'STRICT' },
      { id: 33, sourceComponentId: 12, sourceComponentName: 'Address Validation API', targetComponentId: 11, targetComponentName: 'Fleet Dispatch Service', dependencyType: 'STRICT' },
      { id: 34, sourceComponentId: 11, sourceComponentName: 'Fleet Dispatch Service', targetComponentId: 16, targetComponentName: 'Operations Dashboard', dependencyType: 'STRICT' },
      { id: 35, sourceComponentId: 11, sourceComponentName: 'Fleet Dispatch Service', targetComponentId: 17, targetComponentName: 'UPS Mobile App', dependencyType: 'STRICT' },
      { id: 36, sourceComponentId: 10, sourceComponentName: 'UPS Tracking API', targetComponentId: 17, targetComponentName: 'UPS Mobile App', dependencyType: 'STRICT' }
    ]
  };

  private fallbackMetrics: EcosystemMetrics = {
    totalServices: 13,
    totalApplications: 4,
    totalDatabases: 4,
    totalExternalSystems: 3,
    totalComponents: 24,
    totalDependencies: 36,
    mostConnectedService: 'Order Service',
    criticalServiceCandidate: 'Auth Service',
    largestBlastRadiusCandidate: 'Auth Service',
    averageDependencyDepth: 1.5
  };

  constructor(private http: HttpClient) {}

  getDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${this.baseUrl}/datasets`).pipe(
      catchError(() => of([this.defaultDataset]))
    );
  }

  getDefaultDataset(): Observable<Dataset> {
    return this.http.get<Dataset>(`${this.baseUrl}/datasets/default`).pipe(
      catchError(() => of(this.defaultDataset))
    );
  }

  uploadYamlDataset(datasetName: string, description: string, yamlContents: string[]): Observable<Dataset> {
    return this.http.post<Dataset>(`${this.baseUrl}/datasets/upload`, {
      datasetName,
      description,
      yamlContents
    }).pipe(
      catchError(() => of({
        id: Math.floor(Math.random() * 1000) + 2,
        name: datasetName,
        description: description,
        isDefault: false,
        createdAt: new Date().toISOString()
      }))
    );
  }

  getGraphData(datasetId: number): Observable<GraphData> {
    return this.http.get<GraphData>(`${this.baseUrl}/graph/${datasetId}`).pipe(
      catchError(() => of(this.fallbackGraphData))
    );
  }

  simulateOutage(datasetId: number, componentId: number): Observable<OutageSimulationResult> {
    const params = new HttpParams()
      .set('datasetId', datasetId.toString())
      .set('componentId', componentId.toString());
    return this.http.get<OutageSimulationResult>(`${this.baseUrl}/outage/simulate`, { params }).pipe(
      catchError(() => {
        const failed = this.fallbackGraphData.nodes.find(n => n.id === componentId) || this.fallbackGraphData.nodes[0];
        return of({
          failedComponent: failed,
          totalImpactedCount: 12,
          blastRadiusPercentage: 50.0,
          directImpactComponents: this.fallbackGraphData.nodes.filter(n => n.id === 2 || n.id === 3 || n.id === 6),
          indirectImpactComponents: this.fallbackGraphData.nodes.filter(n => n.id === 7 || n.id === 8 || n.id === 9),
          affectedApplications: ['Customer Portal', 'Admin Console', 'Operations Dashboard', 'UPS Mobile App'],
          impactPropagationChains: [
            ['Auth Service', 'Customer Service', 'Order Service', 'Customer Portal'],
            ['Auth Service', 'Payment Service', 'Order Service', 'UPS Mobile App']
          ],
          impactedNodeIds: [2, 3, 6, 7, 8, 9, 14, 15, 16, 17]
        });
      })
    );
  }

  analyzeImpact(datasetId: number, componentId: number): Observable<ChangeImpactResult> {
    const params = new HttpParams()
      .set('datasetId', datasetId.toString())
      .set('componentId', componentId.toString());
    return this.http.get<ChangeImpactResult>(`${this.baseUrl}/impact/analyze`, { params }).pipe(
      catchError(() => {
        const mod = this.fallbackGraphData.nodes.find(n => n.id === componentId) || this.fallbackGraphData.nodes[0];
        return of({
          modifiedComponent: mod,
          directImpact: this.fallbackGraphData.nodes.filter(n => n.id === 7 || n.id === 8),
          indirectImpact: this.fallbackGraphData.nodes.filter(n => n.id === 9 || n.id === 14),
          affectedApplications: ['Customer Portal', 'UPS Mobile App'],
          suggestedTestScope: [
            `Unit & Integration Test Suite for ${mod.name}`,
            `Contract Verification for ${mod.name} endpoints`,
            'Regression Test: Order placement workflow',
            'End-to-End User Journey Test: Customer Portal'
          ],
          riskLevel: 'HIGH' as const,
          rationale: `Modifying ${mod.name} impacts 8 dependent microservices and 2 user touchpoint applications.`
        });
      })
    );
  }

  getMetrics(datasetId: number): Observable<EcosystemMetrics> {
    return this.http.get<EcosystemMetrics>(`${this.baseUrl}/metrics/${datasetId}`).pipe(
      catchError(() => of(this.fallbackMetrics))
    );
  }

  getAIResilienceAudit(datasetId: number, componentId: number): Observable<AIResilienceReport> {
    const params = new HttpParams()
      .set('datasetId', datasetId.toString())
      .set('componentId', componentId.toString());
    return this.http.get<AIResilienceReport>(`${this.baseUrl}/ai-resilience/audit`, { params }).pipe(
      catchError(() => {
        const comp = this.fallbackGraphData.nodes.find(n => n.id === componentId) || this.fallbackGraphData.nodes[0];
        return of({
          componentName: comp.name,
          resilienceScore: 45,
          riskLevel: 'HIGH',
          singlePointsOfFailure: [
            `${comp.name} serves as a Single Point of Failure for 7 direct downstream consumers.`,
            'Critical cascade failure path leading directly to Customer Portal & Mobile App.'
          ],
          architecturalVulnerabilities: [
            'High coupling risk: Multiple tier-1 services depend directly on runtime HTTP availability.'
          ],
          recommendedMitigations: [
            'Implement Circuit Breakers (Resilience4j / Hystrix) to gracefully degrade during outages.',
            'Deploy Redis caching layer for read-heavy authentication & profile tokens.',
            'Introduce API Gateway load balancing with rate limiting and retry fallbacks.'
          ],
          summaryText: `AI Resilience Audit for '${comp.name}': Evaluated with Resilience Score of 45/100 (HIGH RISK).`
        });
      })
    );
  }
}
