package com.ups.dependencylens.dto;

import java.util.List;
import java.util.Set;

public class OutageSimulationResultDto {
    private ComponentDto failedComponent;
    private int totalImpactedCount;
    private double blastRadiusPercentage;
    private List<ComponentDto> directImpactComponents;
    private List<ComponentDto> indirectImpactComponents;
    private List<String> affectedApplications;
    private List<List<String>> impactPropagationChains;
    private Set<Long> impactedNodeIds;

    public OutageSimulationResultDto() {}

    public OutageSimulationResultDto(ComponentDto failedComponent, int totalImpactedCount, double blastRadiusPercentage, List<ComponentDto> directImpactComponents, List<ComponentDto> indirectImpactComponents, List<String> affectedApplications, List<List<String>> impactPropagationChains, Set<Long> impactedNodeIds) {
        this.failedComponent = failedComponent;
        this.totalImpactedCount = totalImpactedCount;
        this.blastRadiusPercentage = blastRadiusPercentage;
        this.directImpactComponents = directImpactComponents;
        this.indirectImpactComponents = indirectImpactComponents;
        this.affectedApplications = affectedApplications;
        this.impactPropagationChains = impactPropagationChains;
        this.impactedNodeIds = impactedNodeIds;
    }

    public ComponentDto getFailedComponent() { return failedComponent; }
    public void setFailedComponent(ComponentDto failedComponent) { this.failedComponent = failedComponent; }

    public int getTotalImpactedCount() { return totalImpactedCount; }
    public void setTotalImpactedCount(int totalImpactedCount) { this.totalImpactedCount = totalImpactedCount; }

    public double getBlastRadiusPercentage() { return blastRadiusPercentage; }
    public void setBlastRadiusPercentage(double blastRadiusPercentage) { this.blastRadiusPercentage = blastRadiusPercentage; }

    public List<ComponentDto> getDirectImpactComponents() { return directImpactComponents; }
    public void setDirectImpactComponents(List<ComponentDto> directImpactComponents) { this.directImpactComponents = directImpactComponents; }

    public List<ComponentDto> getIndirectImpactComponents() { return indirectImpactComponents; }
    public void setIndirectImpactComponents(List<ComponentDto> indirectImpactComponents) { this.indirectImpactComponents = indirectImpactComponents; }

    public List<String> getAffectedApplications() { return affectedApplications; }
    public void setAffectedApplications(List<String> affectedApplications) { this.affectedApplications = affectedApplications; }

    public List<List<String>> getImpactPropagationChains() { return impactPropagationChains; }
    public void setImpactPropagationChains(List<List<String>> impactPropagationChains) { this.impactPropagationChains = impactPropagationChains; }

    public Set<Long> getImpactedNodeIds() { return impactedNodeIds; }
    public void setImpactedNodeIds(Set<Long> impactedNodeIds) { this.impactedNodeIds = impactedNodeIds; }

    public static OutageSimulationResultDtoBuilder builder() {
        return new OutageSimulationResultDtoBuilder();
    }

    public static class OutageSimulationResultDtoBuilder {
        private ComponentDto failedComponent;
        private int totalImpactedCount;
        private double blastRadiusPercentage;
        private List<ComponentDto> directImpactComponents;
        private List<ComponentDto> indirectImpactComponents;
        private List<String> affectedApplications;
        private List<List<String>> impactPropagationChains;
        private Set<Long> impactedNodeIds;

        public OutageSimulationResultDtoBuilder failedComponent(ComponentDto failedComponent) { this.failedComponent = failedComponent; return this; }
        public OutageSimulationResultDtoBuilder totalImpactedCount(int totalImpactedCount) { this.totalImpactedCount = totalImpactedCount; return this; }
        public OutageSimulationResultDtoBuilder blastRadiusPercentage(double blastRadiusPercentage) { this.blastRadiusPercentage = blastRadiusPercentage; return this; }
        public OutageSimulationResultDtoBuilder directImpactComponents(List<ComponentDto> directImpactComponents) { this.directImpactComponents = directImpactComponents; return this; }
        public OutageSimulationResultDtoBuilder indirectImpactComponents(List<ComponentDto> indirectImpactComponents) { this.indirectImpactComponents = indirectImpactComponents; return this; }
        public OutageSimulationResultDtoBuilder affectedApplications(List<String> affectedApplications) { this.affectedApplications = affectedApplications; return this; }
        public OutageSimulationResultDtoBuilder impactPropagationChains(List<List<String>> impactPropagationChains) { this.impactPropagationChains = impactPropagationChains; return this; }
        public OutageSimulationResultDtoBuilder impactedNodeIds(Set<Long> impactedNodeIds) { this.impactedNodeIds = impactedNodeIds; return this; }

        public OutageSimulationResultDto build() {
            return new OutageSimulationResultDto(failedComponent, totalImpactedCount, blastRadiusPercentage, directImpactComponents, indirectImpactComponents, affectedApplications, impactPropagationChains, impactedNodeIds);
        }
    }
}
