export type ComponentType = 'API' | 'APPLICATION' | 'DATABASE' | 'EXTERNAL_SYSTEM';

export interface ComponentNode {
  id: number;
  name: string;
  type: ComponentType;
  description: string;
  teamOwner: string;
  criticalityScore: number;
  incomingDegree: number;
  outgoingDegree: number;
}

export interface DependencyEdge {
  id: number;
  sourceComponentId: number;
  sourceComponentName: string;
  targetComponentId: number;
  targetComponentName: string;
  dependencyType: string;
}

export interface GraphData {
  datasetId: number;
  datasetName: string;
  nodes: ComponentNode[];
  edges: DependencyEdge[];
}

export interface Dataset {
  id: number;
  name: string;
  description: string;
  isDefault: boolean;
  createdAt: string;
}

export interface OutageSimulationResult {
  failedComponent: ComponentNode;
  totalImpactedCount: number;
  blastRadiusPercentage: number;
  directImpactComponents: ComponentNode[];
  indirectImpactComponents: ComponentNode[];
  affectedApplications: string[];
  impactPropagationChains: string[][];
  impactedNodeIds: number[];
}

export interface ChangeImpactResult {
  modifiedComponent: ComponentNode;
  directImpact: ComponentNode[];
  indirectImpact: ComponentNode[];
  affectedApplications: string[];
  suggestedTestScope: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rationale: string;
}

export interface EcosystemMetrics {
  totalServices: number;
  totalApplications: number;
  totalDatabases: number;
  totalExternalSystems: number;
  totalComponents: number;
  totalDependencies: number;
  mostConnectedService: string;
  criticalServiceCandidate: string;
  largestBlastRadiusCandidate: string;
  averageDependencyDepth: number;
}

export interface AIResilienceReport {
  componentName: string;
  resilienceScore: number;
  riskLevel: string;
  singlePointsOfFailure: string[];
  architecturalVulnerabilities: string[];
  recommendedMitigations: string[];
  summaryText: string;
}
