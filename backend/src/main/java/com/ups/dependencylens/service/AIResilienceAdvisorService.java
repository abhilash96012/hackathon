package com.ups.dependencylens.service;

import com.ups.dependencylens.dto.AIResilienceReportDto;
import com.ups.dependencylens.dto.OutageSimulationResultDto;
import com.ups.dependencylens.model.ComponentNode;
import com.ups.dependencylens.model.ComponentType;
import com.ups.dependencylens.repository.ComponentDependencyRepository;
import com.ups.dependencylens.repository.ComponentNodeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AIResilienceAdvisorService {

    private final ComponentNodeRepository componentRepository;
    private final ComponentDependencyRepository dependencyRepository;
    private final GraphTraversalService graphTraversalService;

    @Value("${ai.openai.api-key:}")
    private String openAiApiKey;

    @Value("${ai.gemini.api-key:}")
    private String geminiApiKey;

    public AIResilienceAdvisorService(ComponentNodeRepository componentRepository, ComponentDependencyRepository dependencyRepository, GraphTraversalService graphTraversalService) {
        this.componentRepository = componentRepository;
        this.dependencyRepository = dependencyRepository;
        this.graphTraversalService = graphTraversalService;
    }

    public AIResilienceReportDto generateResilienceReport(Long datasetId, Long componentId) {
        ComponentNode node = componentRepository.findById(componentId)
                .orElseThrow(() -> new IllegalArgumentException("Component not found: " + componentId));

        OutageSimulationResultDto outage = graphTraversalService.simulateOutage(datasetId, componentId);
        long incomingConsumersCount = dependencyRepository.findByDatasetIdAndSourceComponentId(datasetId, componentId).size();
        long outgoingDependenciesCount = dependencyRepository.findByDatasetIdAndTargetComponentId(datasetId, componentId).size();

        int resilienceScore = calculateScore(node, outage.getTotalImpactedCount(), incomingConsumersCount, outgoingDependenciesCount);
        String riskLevel = determineRisk(resilienceScore);

        List<String> spofs = new ArrayList<>();
        List<String> vulnerabilities = new ArrayList<>();
        List<String> mitigations = new ArrayList<>();

        if (incomingConsumersCount >= 3) {
            spofs.add(String.format("%s serves as a Single Point of Failure for %d direct downstream consumers.", node.getName(), incomingConsumersCount));
        }

        if (outage.getAffectedApplications().size() >= 2) {
            spofs.add(String.format("Critical cascade failure path leading directly to user-facing apps: %s", String.join(", ", outage.getAffectedApplications())));
        }

        if (outgoingDependenciesCount == 0 && node.getType() == ComponentType.API) {
            vulnerabilities.add("Leaf API service with zero declared upstream dependencies (potential missing metadata).");
        } else if (outgoingDependenciesCount >= 4) {
            vulnerabilities.add(String.format("High coupling risk: %s depends on %d distinct upstream services.", node.getName(), outgoingDependenciesCount));
        }

        if (node.getType() == ComponentType.DATABASE && incomingConsumersCount >= 2) {
            vulnerabilities.add(String.format("Shared Database Anti-pattern: %s is accessed directly by multiple services.", node.getName()));
        }

        // Mitigations
        mitigations.add("Implement Circuit Breakers (Resilience4j / Hystrix) to gracefully degrade during upstream outages.");
        mitigations.add("Deploy Redis caching layer for read-heavy operations to reduce direct runtime dependencies.");
        if (incomingConsumersCount >= 2) {
            mitigations.add("Introduce an API Gateway / Load Balancer with dynamic rate limiting and retry fallbacks.");
        }
        if (node.getType() == ComponentType.DATABASE) {
            mitigations.add("Migrate to Database-per-Service pattern to isolate data stores and eliminate shared DB bottleneck.");
        }

        String summary = String.format("AI Resilience Audit for '%s': Evaluated with Resilience Score of %d/100 (%s RISK). " +
                        "A failure in %s triggers an ecosystem outage affecting %d components (Blast Radius: %.1f%%).",
                node.getName(), resilienceScore, riskLevel, node.getName(), outage.getTotalImpactedCount(), outage.getBlastRadiusPercentage());

        return AIResilienceReportDto.builder()
                .componentName(node.getName())
                .resilienceScore(resilienceScore)
                .riskLevel(riskLevel)
                .singlePointsOfFailure(spofs)
                .architecturalVulnerabilities(vulnerabilities)
                .recommendedMitigations(mitigations)
                .summaryText(summary)
                .build();
    }

    private int calculateScore(ComponentNode node, int blastRadius, long incoming, long outgoing) {
        int base = 100;
        base -= (blastRadius * 6);
        base -= (incoming * 8);
        base -= (outgoing * 4);
        if (node.getType() == ComponentType.DATABASE) base -= 10;
        return Math.max(10, Math.min(100, base));
    }

    private String determineRisk(int score) {
        if (score < 40) return "CRITICAL";
        if (score < 65) return "HIGH";
        if (score < 85) return "MEDIUM";
        return "LOW";
    }
}
