package com.ups.dependencylens.service;

import com.ups.dependencylens.dto.*;
import com.ups.dependencylens.model.*;
import com.ups.dependencylens.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GraphTraversalService {

    private final ComponentNodeRepository componentRepository;
    private final ComponentDependencyRepository dependencyRepository;

    public GraphTraversalService(ComponentNodeRepository componentRepository, ComponentDependencyRepository dependencyRepository) {
        this.componentRepository = componentRepository;
        this.dependencyRepository = dependencyRepository;
    }

    public GraphDataDto getGraphData(Long datasetId) {
        List<ComponentNode> nodes = componentRepository.findByDatasetId(datasetId);
        List<ComponentDependency> edges = dependencyRepository.findByDatasetId(datasetId);

        Map<Long, Integer> incomingDegree = new HashMap<>();
        Map<Long, Integer> outgoingDegree = new HashMap<>();

        for (ComponentDependency edge : edges) {
            Long sourceId = edge.getSourceComponent().getId(); // dependency
            Long targetId = edge.getTargetComponent().getId(); // consumer

            incomingDegree.put(sourceId, incomingDegree.getOrDefault(sourceId, 0) + 1);
            outgoingDegree.put(targetId, outgoingDegree.getOrDefault(targetId, 0) + 1);
        }

        List<ComponentDto> nodeDtos = nodes.stream().map(node -> ComponentDto.builder()
                .id(node.getId())
                .name(node.getName())
                .type(node.getType())
                .description(node.getDescription())
                .teamOwner(node.getTeamOwner())
                .criticalityScore(node.getCriticalityScore())
                .incomingDegree(incomingDegree.getOrDefault(node.getId(), 0))
                .outgoingDegree(outgoingDegree.getOrDefault(node.getId(), 0))
                .build()
        ).collect(Collectors.toList());

        List<DependencyEdgeDto> edgeDtos = edges.stream().map(edge -> DependencyEdgeDto.builder()
                .id(edge.getId())
                .sourceComponentId(edge.getSourceComponent().getId())
                .sourceComponentName(edge.getSourceComponent().getName())
                .targetComponentId(edge.getTargetComponent().getId())
                .targetComponentName(edge.getTargetComponent().getName())
                .dependencyType(edge.getDependencyType())
                .build()
        ).collect(Collectors.toList());

        return GraphDataDto.builder()
                .datasetId(datasetId)
                .nodes(nodeDtos)
                .edges(edgeDtos)
                .build();
    }

    public OutageSimulationResultDto simulateOutage(Long datasetId, Long componentId) {
        ComponentNode failedNode = componentRepository.findById(componentId)
                .orElseThrow(() -> new IllegalArgumentException("Component not found: " + componentId));

        List<ComponentNode> allNodes = componentRepository.findByDatasetId(datasetId);
        List<ComponentDependency> allEdges = dependencyRepository.findByDatasetId(datasetId);

        Map<Long, List<ComponentNode>> consumerMap = new HashMap<>();
        for (ComponentDependency edge : allEdges) {
            consumerMap.computeIfAbsent(edge.getSourceComponent().getId(), k -> new ArrayList<>())
                    .add(edge.getTargetComponent());
        }

        Set<Long> visited = new HashSet<>();
        Queue<Long> queue = new LinkedList<>();
        
        visited.add(failedNode.getId());
        queue.add(failedNode.getId());

        List<ComponentNode> directImpact = consumerMap.getOrDefault(failedNode.getId(), Collections.emptyList());
        Set<Long> directImpactIds = directImpact.stream().map(ComponentNode::getId).collect(Collectors.toSet());

        Set<ComponentNode> indirectImpactSet = new HashSet<>();

        while (!queue.isEmpty()) {
            Long currentId = queue.poll();
            List<ComponentNode> consumers = consumerMap.getOrDefault(currentId, Collections.emptyList());
            for (ComponentNode consumer : consumers) {
                if (!visited.contains(consumer.getId())) {
                    visited.add(consumer.getId());
                    queue.add(consumer.getId());
                    if (!directImpactIds.contains(consumer.getId()) && !consumer.getId().equals(failedNode.getId())) {
                        indirectImpactSet.add(consumer);
                    }
                }
            }
        }

        visited.remove(failedNode.getId());

        double blastRadiusPct = allNodes.isEmpty() ? 0.0 : ((double) visited.size() / allNodes.size()) * 100.0;

        List<String> affectedApps = allNodes.stream()
                .filter(n -> visited.contains(n.getId()) && n.getType() == ComponentType.APPLICATION)
                .map(ComponentNode::getName)
                .collect(Collectors.toList());

        List<List<String>> chains = new ArrayList<>();
        List<String> currentChain = new ArrayList<>();
        currentChain.add(failedNode.getName());
        findChainsDFS(failedNode.getId(), consumerMap, currentChain, chains, new HashSet<>());

        return OutageSimulationResultDto.builder()
                .failedComponent(toDto(failedNode, 0, 0))
                .totalImpactedCount(visited.size())
                .blastRadiusPercentage(Math.round(blastRadiusPct * 100.0) / 100.0)
                .directImpactComponents(directImpact.stream().map(n -> toDto(n, 0, 0)).collect(Collectors.toList()))
                .indirectImpactComponents(indirectImpactSet.stream().map(n -> toDto(n, 0, 0)).collect(Collectors.toList()))
                .affectedApplications(affectedApps)
                .impactPropagationChains(chains.stream().limit(10).collect(Collectors.toList()))
                .impactedNodeIds(visited)
                .build();
    }

    private void findChainsDFS(Long currentId, Map<Long, List<ComponentNode>> consumerMap, List<String> currentChain, List<List<String>> chains, Set<Long> visitedPath) {
        visitedPath.add(currentId);
        List<ComponentNode> consumers = consumerMap.getOrDefault(currentId, Collections.emptyList());

        if (consumers.isEmpty() || currentChain.size() > 6) {
            chains.add(new ArrayList<>(currentChain));
        } else {
            for (ComponentNode consumer : consumers) {
                if (!visitedPath.contains(consumer.getId())) {
                    currentChain.add(consumer.getName());
                    findChainsDFS(consumer.getId(), consumerMap, currentChain, chains, visitedPath);
                    currentChain.remove(currentChain.size() - 1);
                }
            }
        }
        visitedPath.remove(currentId);
    }

    public ChangeImpactResultDto analyzeChangeImpact(Long datasetId, Long componentId) {
        ComponentNode modifiedNode = componentRepository.findById(componentId)
                .orElseThrow(() -> new IllegalArgumentException("Component not found: " + componentId));

        OutageSimulationResultDto outageResult = simulateOutage(datasetId, componentId);

        List<String> testScope = generateTestScope(modifiedNode, outageResult);
        String riskLevel = determineRiskLevel(outageResult.getTotalImpactedCount(), outageResult.getAffectedApplications().size(), modifiedNode.getType());

        String rationale = String.format("Modifying %s impacts %d total systems directly/indirectly, including %d end-user application touchpoints.",
                modifiedNode.getName(), outageResult.getTotalImpactedCount(), outageResult.getAffectedApplications().size());

        return ChangeImpactResultDto.builder()
                .modifiedComponent(toDto(modifiedNode, 0, 0))
                .directImpact(outageResult.getDirectImpactComponents())
                .indirectImpact(outageResult.getIndirectImpactComponents())
                .affectedApplications(outageResult.getAffectedApplications())
                .suggestedTestScope(testScope)
                .riskLevel(riskLevel)
                .rationale(rationale)
                .build();
    }

    private List<String> generateTestScope(ComponentNode node, OutageSimulationResultDto outage) {
        List<String> scope = new ArrayList<>();
        scope.add(String.format("Unit & Integration Test Suite for %s", node.getName()));
        scope.add(String.format("Backward Compatibility & Contract Verification for %s endpoints", node.getName()));

        for (ComponentDto direct : outage.getDirectImpactComponents()) {
            scope.add(String.format("Regression Test: %s integration workflow", direct.getName()));
        }

        for (String app : outage.getAffectedApplications()) {
            scope.add(String.format("End-to-End User Journey Test: %s", app));
        }

        if (node.getType() == ComponentType.DATABASE) {
            scope.add("Database Migration & Schema Compatibility Test");
            scope.add("Data Persistence & Transaction Integrity Test");
        } else if (node.getType() == ComponentType.EXTERNAL_SYSTEM) {
            scope.add("Circuit Breaker & Retry Fallback Mechanism Validation");
        }

        return scope;
    }

    private String determineRiskLevel(int totalImpacted, int appsImpacted, ComponentType type) {
        if (totalImpacted >= 8 || appsImpacted >= 3) {
            return "CRITICAL";
        } else if (totalImpacted >= 4 || appsImpacted >= 2) {
            return "HIGH";
        } else if (totalImpacted >= 2 || appsImpacted >= 1) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    private ComponentDto toDto(ComponentNode node, int incoming, int outgoing) {
        return ComponentDto.builder()
                .id(node.getId())
                .name(node.getName())
                .type(node.getType())
                .description(node.getDescription())
                .teamOwner(node.getTeamOwner())
                .criticalityScore(node.getCriticalityScore())
                .incomingDegree(incoming)
                .outgoingDegree(outgoing)
                .build();
    }
}
