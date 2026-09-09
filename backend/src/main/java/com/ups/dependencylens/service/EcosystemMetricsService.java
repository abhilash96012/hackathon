package com.ups.dependencylens.service;

import com.ups.dependencylens.dto.EcosystemMetricsDto;
import com.ups.dependencylens.dto.OutageSimulationResultDto;
import com.ups.dependencylens.model.ComponentNode;
import com.ups.dependencylens.model.ComponentType;
import com.ups.dependencylens.repository.ComponentDependencyRepository;
import com.ups.dependencylens.repository.ComponentNodeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class EcosystemMetricsService {

    private final ComponentNodeRepository componentRepository;
    private final ComponentDependencyRepository dependencyRepository;
    private final GraphTraversalService graphTraversalService;

    public EcosystemMetricsService(ComponentNodeRepository componentRepository, ComponentDependencyRepository dependencyRepository, GraphTraversalService graphTraversalService) {
        this.componentRepository = componentRepository;
        this.dependencyRepository = dependencyRepository;
        this.graphTraversalService = graphTraversalService;
    }

    public EcosystemMetricsDto calculateMetrics(Long datasetId) {
        long totalServices = componentRepository.countByDatasetIdAndType(datasetId, ComponentType.API);
        long totalApplications = componentRepository.countByDatasetIdAndType(datasetId, ComponentType.APPLICATION);
        long totalDatabases = componentRepository.countByDatasetIdAndType(datasetId, ComponentType.DATABASE);
        long totalExternal = componentRepository.countByDatasetIdAndType(datasetId, ComponentType.EXTERNAL_SYSTEM);
        long totalComponents = componentRepository.countByDatasetId(datasetId);
        long totalEdges = dependencyRepository.countByDatasetId(datasetId);

        List<ComponentNode> nodes = componentRepository.findByDatasetId(datasetId);

        String mostConnected = "N/A";
        int maxDegree = -1;

        String criticalCandidate = "N/A";
        int maxConsumers = -1;

        String maxBlastRadiusCandidate = "N/A";
        int maxBlastRadius = -1;

        for (ComponentNode node : nodes) {
            var edgesIncoming = dependencyRepository.findByDatasetIdAndSourceComponentId(datasetId, node.getId());
            var edgesOutgoing = dependencyRepository.findByDatasetIdAndTargetComponentId(datasetId, node.getId());
            int totalDegree = edgesIncoming.size() + edgesOutgoing.size();

            if (totalDegree > maxDegree) {
                maxDegree = totalDegree;
                mostConnected = node.getName();
            }

            if (edgesIncoming.size() > maxConsumers) {
                maxConsumers = edgesIncoming.size();
                criticalCandidate = node.getName();
            }

            OutageSimulationResultDto outage = graphTraversalService.simulateOutage(datasetId, node.getId());
            if (outage.getTotalImpactedCount() > maxBlastRadius) {
                maxBlastRadius = outage.getTotalImpactedCount();
                maxBlastRadiusCandidate = node.getName();
            }
        }

        return EcosystemMetricsDto.builder()
                .totalServices(totalServices)
                .totalApplications(totalApplications)
                .totalDatabases(totalDatabases)
                .totalExternalSystems(totalExternal)
                .totalComponents(totalComponents)
                .totalDependencies(totalEdges)
                .mostConnectedService(mostConnected)
                .criticalServiceCandidate(criticalCandidate)
                .largestBlastRadiusCandidate(maxBlastRadiusCandidate)
                .averageDependencyDepth(totalComponents > 0 ? Math.round(((double) totalEdges / totalComponents) * 100.0) / 100.0 : 0.0)
                .build();
    }
}
